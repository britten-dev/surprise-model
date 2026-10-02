"""Editable lighting/model workshop; run with Blender --background --python.

This renders an offline reference. The browser's moving sea is maintained in
surprise-sea and is deliberately not replaced by this Blender ocean modifier.
"""
from pathlib import Path
import bpy
import math
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'build'
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(OUT / 'surprise-blender-source.glb'))
scene = bpy.context.scene
scene.unit_settings.system = 'METRIC'
scene.unit_settings.scale_length = 1

# Preserve dimensions, names, hierarchy and editable materials. Only hard edges
# on furniture acquire a small chamfer; rigging, sails and lofted hull are spared.
refined = []
for obj in list(scene.objects):
    if obj.type != 'MESH':
        continue
    if any(key in obj.name.lower() for key in ('furniture_timber', 'binnacle', 'bitt', 'hatch', 'companion', 'coaming')):
        mod = obj.modifiers.new('Timber edge · 8 mm', 'BEVEL')
        mod.width = 0.008
        mod.segments = 3
        mod.limit_method = 'ANGLE'
        mod.angle_limit = math.radians(35)
        refined.append(obj.name)

ship_objects = list(scene.objects)
ship_collection = bpy.data.collections.new('HMS Surprise · editable source')
scene.collection.children.link(ship_collection)
for obj in ship_objects:
    for collection in list(obj.users_collection):
        collection.objects.unlink(obj)
    ship_collection.objects.link(obj)

def point_at(obj, target):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat('-Z', 'Y').to_euler()

def camera(name, location, target, lens):
    data = bpy.data.cameras.new(name)
    obj = bpy.data.objects.new(name, data)
    scene.collection.objects.link(obj)
    obj.location = location
    point_at(obj, target)
    data.lens = lens
    data.clip_end = 12000
    return obj

hero = camera('01 · Alongside', (67, 90, 28), (0, 0, 17), 44)
wheel = next((o for o in ship_objects if o.name == 'ships_wheel'), None)
if wheel:
    p = wheel.matrix_world.translation
    camera('02 · At the helm', (p.x + 1.25, p.y - 2.2, p.z + 1.65),
           (p.x + 1.25, p.y + 15, p.z + 1.4), 26)
scene.camera = hero

# Ocean for offline look development: editable geometry and a physically lit
# water material. This is not a baked backdrop passed off as the web experience.
bpy.ops.mesh.primitive_plane_add(size=2)
ocean = bpy.context.object
ocean.name = 'Ocean · offline lighting reference'
mod = ocean.modifiers.new('Long swell', 'OCEAN')
mod.geometry_mode = 'GENERATE'
mod.resolution = 8
mod.viewport_resolution = 7
mod.spatial_size = 300
mod.size = 3
mod.repeat_x = 4
mod.repeat_y = 4
mod.wave_scale = 0.8
mod.choppiness = 0.9
mod.wind_velocity = 12
mod.wave_scale_min = 0.3
mod.time = 1.8
water = bpy.data.materials.new('Sea · deep blue green')
water.use_nodes = True
n = water.node_tree.nodes
l = water.node_tree.links
bsdf = n.get('Principled BSDF')
bsdf.inputs['Base Color'].default_value = (0.014, 0.052, 0.065, 1)
bsdf.inputs['Roughness'].default_value = 0.19
bsdf.inputs['IOR'].default_value = 1.333
bsdf.inputs['Metallic'].default_value = 0.18
noise = n.new('ShaderNodeTexNoise')
noise.inputs['Scale'].default_value = 2.7
noise.inputs['Detail'].default_value = 3
noise.inputs['Roughness'].default_value = 0.6
coordinates = n.new('ShaderNodeNewGeometry')
l.new(coordinates.outputs['Position'], noise.inputs['Vector'])
bump = n.new('ShaderNodeBump')
bump.inputs['Strength'].default_value = 0.22
bump.inputs['Distance'].default_value = 0.16
l.new(noise.outputs['Fac'], bump.inputs['Height'])
l.new(bump.outputs['Normal'], bsdf.inputs['Normal'])
ocean.data.materials.append(water)
for p in ocean.data.polygons:
    p.use_smooth = True

bpy.ops.mesh.primitive_plane_add(size=40000, location=(0, 0, -4))
horizon = bpy.context.object
horizon.name = 'Distant ocean to horizon'
horizon.data.materials.append(water)

world = bpy.data.worlds.new('Cool morning sky')
world.use_nodes = True
scene.world = world
sky = world.node_tree.nodes.new('ShaderNodeTexSky')
sky.sky_type = 'MULTIPLE_SCATTERING'
sky.sun_elevation = math.radians(16)
sky.sun_rotation = math.radians(130)
sky.air_density = 1.1
sky.aerosol_density = 1.7
sky.ozone_density = 1.3
world.node_tree.links.new(sky.outputs['Color'], world.node_tree.nodes['Background'].inputs['Color'])
world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.16

sun_data = bpy.data.lights.new('Warm morning key', 'SUN')
sun_data.energy = 1.7
sun_data.angle = math.radians(3)
sun_data.color = (1.0, 0.83, 0.62)
sun = bpy.data.objects.new('Warm morning key', sun_data)
scene.collection.objects.link(sun)
sun.location = (-50, 40, 38)
point_at(sun, (0, 0, 0))

scene.render.engine = 'CYCLES'
scene.cycles.samples = 32
scene.cycles.use_denoising = True
scene.cycles.max_bounces = 6
scene.render.resolution_x = 1280
scene.render.resolution_y = 800
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.render.filepath = str(OUT / 'blender-morning-reference.png')
scene.view_settings.view_transform = 'AgX'
scene.view_settings.exposure = -0.1
scene.render.fps = 30
scene.frame_end = 900

note = bpy.data.texts.new('START HERE')
note.write('HMS Surprise — cinematic workshop\n\n'
           '01 Alongside and 02 At the helm are saved cameras.\n'
           'The ship is the sourced procedural model, imported in metres with its named hierarchy.\n'
           'Timber bevels are non-destructive modifiers. All texture images are packed.\n'
           'The Ocean object is for offline look development; it is not the browser sea.\n'
           'This file is a starting workshop, not a claim of a finished film-quality asset.\n')
bpy.ops.file.pack_all()
bpy.ops.wm.save_as_mainfile(filepath=str(OUT / 'HMS Surprise - Cinematic Workshop.blend'))
print('Refined furniture:', refined)
bpy.ops.render.render(write_still=True)
