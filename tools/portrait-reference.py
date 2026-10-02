"""Render an orthographic alignment guide for an original facial albedo image."""
from pathlib import Path
import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
bpy.ops.wm.open_mainfile(filepath=str(ROOT/'build/HMS Surprise - Authored Detail.blend'))
root=bpy.data.objects['authored_seaman']
head=next(o for o in root.children if o.name.startswith('head'))
visible=set()
def visit(o):
    visible.add(o)
    for c in o.children: visit(c)
visit(head)
for obj in bpy.context.scene.objects:
    obj.hide_render = obj not in visible
    if obj in visible and obj.type=='MESH' and not any(k in obj.name for k in ('MakeHuman','Eyeball','Iris')):
        obj.hide_render=True
# This helper makes future alignment guides. The exact guide used for v1 is
# archived separately in tools/assets/portrait-alignment-v1.png.
clay=bpy.data.materials.new('Neutral alignment skin');clay.use_nodes=True
clay.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=(.45,.27,.17,1)
clay.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value=.8
for obj in visible:
    if obj.type=='MESH' and 'MakeHuman' in obj.name:
        obj.data.materials.clear();obj.data.materials.append(clay)
scene=bpy.context.scene
point=head.matrix_world.translation+Vector((0,0,.105))
data=bpy.data.cameras.new('Portrait guide camera');data.type='ORTHO';data.ortho_scale=.32
camera=bpy.data.objects.new('Portrait guide camera',data);scene.collection.objects.link(camera)
camera.location=point+Vector((0,-2,0));camera.rotation_euler=(point-camera.location).to_track_quat('-Z','Y').to_euler()
scene.camera=camera
world=bpy.data.worlds.new('Portrait guide');world.use_nodes=True;scene.world=world
world.node_tree.nodes['Background'].inputs[0].default_value=(.72,.72,.72,1)
world.node_tree.nodes['Background'].inputs[1].default_value=.8
for x,power in [(-.8,45),(.8,28)]:
    data=bpy.data.lights.new('Soft portrait light','AREA');data.energy=power;data.shape='DISK';data.size=1.8
    lamp=bpy.data.objects.new('Soft portrait light',data);scene.collection.objects.link(lamp)
    lamp.location=point+Vector((x,-1.5,.5));lamp.rotation_euler=(point-lamp.location).to_track_quat('-Z','Y').to_euler()
scene.render.engine='CYCLES';scene.cycles.samples=32
scene.render.resolution_x=scene.render.resolution_y=1024;scene.render.resolution_percentage=100
scene.render.film_transparent=True
scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGBA'
scene.render.filepath=str(ROOT/'build/portrait-alignment-reference.png')
bpy.ops.render.render(write_still=True)
