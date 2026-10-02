"""Quarterdeck assets with original fittings and clothes, and a CC0 anatomical head. Metres; browser X/right, Y/up, Z/aft.

The documented ship dimensions are constraints. Surface wear, faces and garment
folds are artistic reconstruction, not claims about particular historical people.
Blender authors the geometry, UVs, bevels and packed PBR images. The web renderer
loads the exported meshes; it does not substitute a picture of a Blender render.
"""
from pathlib import Path
import json, math, sys
sys.path.insert(0,str(Path(__file__).resolve().parent))
import bpy, bmesh
import numpy as np
from mathutils import Vector
from authored_occlusion import bake_contact_shadows, connect_vertex_colours

ROOT = Path(__file__).resolve().parents[1]
S = json.loads((ROOT / 'build/hero-dimensions.json').read_text())
OUT = ROOT / 'src/assets'
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.unit_settings.system = 'METRIC'

def V(p):
    return Vector((p[0], -p[2], p[1]))

def empty(name, parent=None, at=(0, 0, 0)):
    o = bpy.data.objects.new(name, None)
    scene.collection.objects.link(o)
    o.parent = parent
    o.location = V(at)
    return o

def image(name, rgb, data=False):
    h, w = rgb.shape[:2]
    rgba = np.ones((h, w, 4), dtype=np.float32)
    rgba[:, :, :3] = np.clip(rgb, 0, 1)
    im = bpy.data.images.new(name, width=w, height=h, alpha=False)
    if data: im.colorspace_settings.name = 'Non-Color'
    im.pixels.foreach_set(rgba.reshape(-1))
    im.filepath_raw = str(ROOT / 'build' / (name + '.png'))
    im.file_format = 'PNG'
    im.save()
    im.pack()
    return im

def material(name, base, kind='cloth', metal=0, rough=.78):
    # UV image maps, not procedural shader nodes that disappear on glTF export.
    n = 512 if kind in ('wood', 'cloth', 'hair') else 256
    y, x = np.mgrid[0:n, 0:n].astype(np.float32) / n
    r = np.random.default_rng(441 + len(bpy.data.materials))
    grit = r.random((n, n)) - .5
    if kind == 'wood':
        grain = np.sin(y * 460 + np.sin(x * 9) * 2.1 + np.sin(x * 39) * .24)
        growth = np.sin(y * 113 + np.sin(x * 7) * 3)
        # Fine fibres and restrained growth bands. Strong periodic contrast on
        # a turned part reads as plywood rings at normal viewing distance.
        h = grain * .025 + growth * .020 + grit * .025
        tone = .94 + .035 * growth + .020 * grain + .025 * grit
    elif kind == 'cloth':
        warp = np.sin(x*n*math.pi*.5 + np.sin(y*17)*.10)
        weft = np.sin(y*n*math.pi*.5 + np.sin(x*23)*.13)
        weave = warp*weft
        h = weave * .045 + grit * .025
        tone = .95 + .023*np.sin(x*19+y*11)*np.sin(y*31-x*7) + grit*.065
    elif kind == 'hair':
        strand = np.sin(x*math.tau*113 + np.sin(y*8)*.14)
        fine = np.sin(x*math.tau*239 + np.sin(y*13)*.28)
        h = strand*.045 + fine*.012 + grit*.01
        tone = .9 + strand*.10 + fine*.025 + grit*.025
    elif kind == 'skin':
        h = grit * .018
        tone = .96 + .03 * np.sin(x * 16) * np.cos(y * 21) + grit * .035
    else:
        h = grit * .055 + np.sin(y * 373) * .015
        tone = .90 + .065 * np.sin(x * 21) * np.cos(y * 27) + grit * .05
    col = np.asarray(base)[None, None, :] * tone[:, :, None]
    rgb = image(name + ' colour', col)
    rm = np.zeros((n, n, 3), dtype=np.float32)
    rm[:, :, 1] = np.clip(rough + h * .19, .1, 1)
    rm[:, :, 2] = metal
    roughmap = image(name + ' roughness-metal', rm, True)
    dx = np.roll(h, -1, axis=1) - np.roll(h, 1, axis=1)
    dy = np.roll(h, -1, axis=0) - np.roll(h, 1, axis=0)
    norm = np.dstack((-dx * .8, -dy * .8, np.ones_like(h)))
    norm /= np.linalg.norm(norm, axis=2)[:, :, None]
    normalmap = image(name + ' normal', norm * .5 + .5, True)
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nodes, links = m.node_tree.nodes, m.node_tree.links
    bs = nodes.get('Principled BSDF')
    tex = nodes.new('ShaderNodeTexImage'); tex.image = rgb
    links.new(tex.outputs['Color'], bs.inputs['Base Color'])
    texr = nodes.new('ShaderNodeTexImage'); texr.image = roughmap
    sep = nodes.new('ShaderNodeSeparateColor')
    links.new(texr.outputs['Color'], sep.inputs['Color'])
    links.new(sep.outputs['Green'], bs.inputs['Roughness'])
    links.new(sep.outputs['Blue'], bs.inputs['Metallic'])
    texn = nodes.new('ShaderNodeTexImage'); texn.image = normalmap
    normal = nodes.new('ShaderNodeNormalMap')
    links.new(texn.outputs['Color'], normal.inputs['Color'])
    links.new(normal.outputs['Normal'], bs.inputs['Normal'])
    if kind == 'cloth':
        bs.inputs['Sheen Weight'].default_value = .14
        bs.inputs['Sheen Tint'].default_value = (*[v*.65 for v in base],1)
        bs.inputs['Sheen Roughness'].default_value = .75
    if kind == 'skin': bs.inputs['Subsurface Weight'].default_value = .035
    return m

oak = material('Hand-worn oak', (.34, .205, .092), 'wood', rough=.46)
lightwood = material('Cut oak end grain', (.48, .34, .19), 'wood', rough=.65)
iron = material('Forged iron', (.057, .066, .065), 'metal', metal=.72, rough=.53)
brass = material('Aged brass', (.56, .385, .135), 'metal', metal=.88, rough=.36)
rope = material('Laid hemp', (.41, .32, .19), 'cloth')
navy = material('Indigo wool', (.048, .077, .11), 'cloth', rough=.91)
duck = material('Unbleached duck', (.55, .53, .44), 'cloth', rough=.94)
oilskin = material('Tarred cloth', (.055, .068, .065), 'cloth', rough=.48)
skin = material('Weathered skin', (.64, .40, .29), 'skin', rough=.64)
hair = material('Hair and leather', (.047, .032, .023), 'cloth', rough=.85)
scalp_hair = material('Combed brown hair', (.14, .091, .055), 'hair', rough=.74)
white = material('Warm ivory', (.76, .74, .63), 'cloth', rough=.72)
black = material('Compass ink', (.012, .013, .011), 'metal', rough=.83)
sclera = material('Eye moisture', (.72,.70,.64), 'skin', rough=.19)
sclera.node_tree.nodes.get('Principled BSDF').inputs['Coat Weight'].default_value=.5
sclera.node_tree.nodes.get('Principled BSDF').inputs['Coat Roughness'].default_value=.12
iris = material('Iris', (.18,.15,.092), 'skin', rough=.23)
# Radial fibres and a dark pupil on a planar iris, rather than a black bead.
iy,ix=np.mgrid[0:128,0:128].astype(np.float32)/127-.5
ir=np.hypot(ix,iy);ia=np.arctan2(iy,ix)
fibres=.7+.18*np.sin(ia*67+ir*74)+.1*np.sin(ia*117-ir*39)
icol=np.asarray((.22,.18,.105))[None,None,:]*fibres[:,:,None]
pupil=np.clip((ir-.18)/.045,0,1);icol=icol*pupil[:,:,None]+.009*(1-pupil[:,:,None])
icol*=np.clip((.52-ir)/.06,.32,1)[:,:,None]
inode=iris.node_tree.nodes.new('ShaderNodeTexImage');inode.image=image('Iris colour',icol)
iris.node_tree.links.new(inode.outputs['Color'],iris.node_tree.nodes.get('Principled BSDF').inputs['Base Color'])

def finish(o, name, mat, parent, bevel=0, smooth=True):
    o.name = name
    if mat: o.data.materials.append(mat)
    if smooth:
        for p in o.data.polygons: p.use_smooth = True
    if bevel:
        b = o.modifiers.new('Worn edge', 'BEVEL'); b.width = bevel; b.segments = 3
        b.limit_method = 'ANGLE'
        bpy.context.view_layer.objects.active = o
        bpy.ops.object.modifier_apply(modifier=b.name)
        w = o.modifiers.new('Face-weighted normals', 'WEIGHTED_NORMAL')
        w.keep_sharp = True
        bpy.ops.object.modifier_apply(modifier=w.name)
    # Primitives have UVs; generated profile meshes supply their own.
    o.parent = parent
    return o

def box(name, at, dims, mat, parent, bevel=.008):
    bpy.ops.mesh.primitive_cube_add(size=1, location=V(at))
    o = bpy.context.object
    o.scale = (dims[0], dims[2], dims[1])
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return finish(o, name, mat, parent, bevel)

def cloth_panel(name, points, mat, parent):
    if (Vector(points[1])-Vector(points[0])).cross(Vector(points[2])-Vector(points[0])).z<0:
        points=list(reversed(points))
    vertices=[V(p) for p in points]+[V((x,y,z-.003)) for x,y,z in points]
    n=len(points);faces=[tuple(range(n)),tuple(range(2*n-1,n-1,-1))]
    faces.extend((i,(i+1)%n,(i+1)%n+n,i+n) for i in range(n))
    x0=min(p[0] for p in points);x1=max(p[0] for p in points)
    y0=min(p[1] for p in points);y1=max(p[1] for p in points)
    uv=[((p[0]-x0)/max(.001,x1-x0),(p[1]-y0)/max(.001,y1-y0)) for p in points]*2
    return mesh(name,vertices,faces,uv,mat,parent)

def ellipsoid(name, at, dims, mat, parent, segments=20, rings=12):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=rings, radius=1, location=V(at))
    o = bpy.context.object
    o.scale = (dims[0], dims[2], dims[1])
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return finish(o, name, mat, parent)

def tube(name, pts, radius, mat, parent, sides=8):
    # Polyline tube using parallel-ish frames, original rope and seam geometry.
    pts = [Vector(p) for p in pts]
    vertices, faces, uvs = [], [], []
    length = 0
    for j, p in enumerate(pts):
        tangent = (pts[min(j+1, len(pts)-1)] - pts[max(0,j-1)]).normalized()
        axis = Vector((0, 1, 0)) if abs(tangent.y) < .95 else Vector((1, 0, 0))
        a = tangent.cross(axis).normalized(); b = tangent.cross(a).normalized()
        if j: length += (p-pts[j-1]).length
        for i in range(sides):
            ang = i * math.tau / sides
            vertices.append(V(p + radius * (a*math.cos(ang)+b*math.sin(ang))))
            uvs.append((i/sides, length * 4))
            if j and i < sides:
                i1=(i+1)%sides
                faces.append(((j-1)*sides+i, (j-1)*sides+i1, j*sides+i1,j*sides+i))
    return mesh(name, vertices, faces, uvs, mat, parent)

def mesh(name, vertices, faces, uv, mat, parent):
    data = bpy.data.meshes.new(name)
    data.from_pydata(vertices, [], faces); data.update()
    layer = data.uv_layers.new(name='UVMap')
    for p in data.polygons:
        for li in p.loop_indices: layer.data[li].uv = uv[data.loops[li].vertex_index]
    o = bpy.data.objects.new(name, data); scene.collection.objects.link(o)
    return finish(o, name, mat, parent)

def profile(name, rings, mat, parent, sides=32, folds=0, phase=0, soften=False):
    # Elliptical cross sections [y, rx, rz, centreX, centreZ].
    if soften:
        source=[np.array(r,dtype=float) for r in rings]
        rings=[]
        for i in range(len(source)-1):
            a,b,c,d=source[max(0,i-1)],source[i],source[i+1],source[min(len(source)-1,i+2)]
            rings.append(b)
            t=.5
            middle=.5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t*t+(-a+3*b-3*c+d)*t*t*t)
            middle[1:3]=np.maximum(middle[1:3],.004)
            rings.append(middle)
        rings.append(source[-1])
    vertices, faces, uv = [], [], []
    for j, (y, rx, rz, cx, cz) in enumerate(rings):
        for i in range(sides+1):
            a = i/sides*math.tau
            ripple = 1 + folds * (math.sin(a*7+y*24+phase)*.55 + math.sin(a*11-y*31)*.25)
            vertices.append(V((cx+rx*math.cos(a)*ripple, y, cz+rz*math.sin(a)*ripple)))
            uv.append((i/sides, j/(len(rings)-1)))
            if j and i:
                k=j*(sides+1)+i
                faces.append((k-sides-2,k-sides-1,k,k-1))
    faces.extend([tuple(range(sides,-1,-1)),tuple((len(rings)-1)*(sides+1)+i for i in range(sides+1))])
    if rings[-1][0] > rings[0][0]: faces = [tuple(reversed(f)) for f in faces]
    return mesh(name, vertices, faces, uv, mat, parent)

def cylinder(name, a, b, radius, mat, parent, r2=None, sides=32):
    pa, pb = V(a), V(b)
    bpy.ops.mesh.primitive_cone_add(vertices=sides, radius1=radius, radius2=radius if r2 is None else r2,
        depth=(pb-pa).length, location=(pa+pb)/2)
    o=bpy.context.object
    o.rotation_mode='QUATERNION'; o.rotation_quaternion=(pb-pa).to_track_quat('Z','Y')
    bpy.ops.object.transform_apply(location=False,rotation=True,scale=False)
    return finish(o,name,mat,parent,bevel=.0015)

def ring(name, at, radius, minor, axis, mat, parent, segments=64):
    pts=[]
    for i in range(segments+1):
        a=i/segments*math.tau
        p=list(at)
        aa,bb={'x':(1,2),'y':(0,2),'z':(0,1)}[axis]
        p[aa]+=math.cos(a)*radius; p[bb]+=math.sin(a)*radius
        pts.append(p)
    return tube(name,pts,minor,mat,parent,8)

def hat_brim(parent, cocked=False):
    vertices,uv,faces=[],[],[]
    n=64
    for row in range(4):
        outside=row in (1,2)
        rx,rz=(.19,.102) if cocked and outside else ((.122,.115) if outside else (.082,.078))
        for i in range(n+1):
            a=i/n*math.tau
            y=.218+(.061*abs(math.cos(a))**2 if cocked and outside else 0)
            y+=.004 if row<2 else -.004
            vertices.append(V((rx*math.cos(a),y,rz*math.sin(a))))
            uv.append((i/n,row/3))
    for row in range(4):
        nr=(row+1)%4
        for i in range(n):
            faces.append((row*(n+1)+i,row*(n+1)+i+1,nr*(n+1)+i+1,nr*(n+1)+i))
    return mesh('Shaped hat brim',vertices,faces,uv,hair,parent)

def human_head(parent):
    # Extract only the head from the CC0 MakeHuman base mesh. No application code
    # is imported. Keep its continuous anatomical surface, ears and eyelids.
    vertices=[]; tex=[]; selected=[]; group=''
    for line in (ROOT/'tools/vendor/makehuman/base.obj').read_text().splitlines():
        row=line.split()
        if not row: continue
        if row[0]=='v': vertices.append(tuple(map(float,row[1:4])))
        elif row[0]=='vt': tex.append(tuple(map(float,row[1:3])))
        elif row[0]=='g': group=row[1]
        elif row[0]=='f' and group=='body':
            corners=[tuple(int(q)-1 for q in item.split('/')[:2]) for item in row[1:]]
            if all(vertices[v][1]>5.9 for v,t in corners): selected.append(corners)
    mapped={}; out=[]; uv=[]; faces=[]
    for face in selected:
        corners=[]
        for key in face:
            if key not in mapped:
                x,y,z=vertices[key[0]]
                mapped[key]=len(out)
                out.append(V((x*.1,(y-6.2)*.1,(z-.45)*.1)))
                uv.append(tex[key[1]])
            corners.append(mapped[key])
        faces.append(tuple(corners))
    # A head-only UV texture gives pores and weathering actual texels at this
    # distance, rather than spending a body atlas on a head. Paint is original;
    # the underlying UVs and topology retain the source's anatomy.
    uv_array=np.asarray(uv,dtype=np.float32)
    lo=uv_array.min(axis=0); span=np.maximum(.001,uv_array.max(axis=0)-lo)
    uv_array=(uv_array-lo)/span*.96+.02
    # Continue the actual anatomical boundary into the collar. A separate neck
    # cylinder leaves the sloped cut edge exposed when the head turns.
    edge_uses={}
    for face in selected:
        for a,b in zip(face,face[1:]+face[:1]):
            edge_uses.setdefault(tuple(sorted((a[0],b[0]))),[]).append((a,b))
    boundary=[uses[0] for uses in edge_uses.values() if len(uses)==1
        and max(vertices[k[0]][1] for k in uses[0])<6.16]
    assert len(boundary)==46, 'Expected the complete anatomical neck boundary'
    uv_array[:,1]=.23+uv_array[:,1]*.75
    uv=uv_array.tolist()
    for a,b in boundary:
        points=[out[mapped[k]] for k in (a,b)]
        angles=[math.atan2(-p.y+.020,p.x) for p in points]
        # Put the UV seam at the existing centre-back vertex, duplicating its
        # texture coordinate on either side instead of interpolating across it.
        uv_angles=[math.atan2(p.x,-p.y+.020) for p in points]
        if abs(uv_angles[1]-uv_angles[0])>math.pi:
            uv_angles=[v-math.tau if v>0 else v for v in uv_angles]
        start=len(out)
        for j in range(5):
            t=j/4
            for p,angle,uv_angle in zip(points,angles,uv_angles):
                target=V((.053*math.cos(angle),-.095,-.012+.048*math.sin(angle)))
                out.append(p.lerp(target,t))
                uv.append((.02+.96*(uv_angle/math.tau+.5),.02+.18*(1-t)))
            if j:
                k=start+j*2
                faces.append((k-1,k-2,k,k+1))
    uv_array=np.asarray(uv,dtype=np.float32)
    mat=bpy.data.materials.get('Weathered face')
    if mat is None:
        size=1024
        field=np.zeros((size,size,3),dtype=np.float32)
        covered=np.zeros((size,size),dtype=bool)
        points=np.asarray([(p.x,p.z,-p.y) for p in out])
        for face in faces:
            for k in range(1,len(face)-1):
                ids=[face[0],face[k],face[k+1]]
                t=uv_array[ids]*(size-1)
                x0,y0=np.floor(t.min(axis=0)).astype(int);x1,y1=np.ceil(t.max(axis=0)).astype(int)
                if x1==x0 or y1==y0: continue
                yy,xx=np.mgrid[y0:y1+1,x0:x1+1]
                denom=(t[1,1]-t[2,1])*(t[0,0]-t[2,0])+(t[2,0]-t[1,0])*(t[0,1]-t[2,1])
                if abs(denom)<1e-7: continue
                a=((t[1,1]-t[2,1])*(xx-t[2,0])+(t[2,0]-t[1,0])*(yy-t[2,1]))/denom
                b=((t[2,1]-t[0,1])*(xx-t[2,0])+(t[0,0]-t[2,0])*(yy-t[2,1]))/denom
                c=1-a-b; mask=(a>=-.02)&(b>=-.02)&(c>=-.02)
                xyz=a[:,:,None]*points[ids[0]]+b[:,:,None]*points[ids[1]]+c[:,:,None]*points[ids[2]]
                field[y0:y1+1,x0:x1+1][mask]=xyz[mask]
                covered[y0:y1+1,x0:x1+1]|=mask
        x,y,z=field[:,:,0],field[:,:,1],field[:,:,2]
        rand=np.random.default_rng(1850).random((size,size))
        front=np.clip((z-.015)/.06,0,1)
        jaw=(1-np.clip((y-.047)/.045,0,1))*front
        cheeks=np.exp(-((np.abs(x)-.045)/.021)**2-((y-.075)/.025)**2)*front
        lips=np.exp(-(x/.026)**6-((y-.041)/.006)**2)*front
        tone=1-.16*jaw*(.45+.55*rand)-.05*np.clip((y-.14)/.08,0,1)
        col=np.asarray((.64,.40,.29))[None,None,:]*tone[:,:,None]
        col+=((rand-.5)*.018)[:,:,None]
        col[:,:,0]+=cheeks*.019+lips*.013
        col[:,:,1]-=cheeks*.008+lips*.020
        col[:,:,2]-=lips*.009
        portrait_path=OUT/'sailor-face-projection-v1.png'
        if portrait_path.exists():
            portrait=bpy.data.images.load(str(portrait_path),check_existing=True)
            portrait.colorspace_settings.name='Non-Color'
            pw,ph=portrait.size
            pixels=np.empty(pw*ph*4,dtype=np.float32);portrait.pixels.foreach_get(pixels)
            pixels=pixels.reshape(ph,pw,4)[:,:,:3]
            # Camera projection from portrait-reference.py: square 0.32 m field,
            # centred 0.105 m above the head joint, looking along browser -Z.
            px=np.clip((x/.32+.5)*(pw-1),0,pw-1.001)
            py=np.clip(((y-.105)/.32+.5)*(ph-1),0,ph-1.001)
            ix=px.astype(int);iy=py.astype(int);fx=(px-ix)[:,:,None];fy=(py-iy)[:,:,None]
            sample=(pixels[iy,ix]*(1-fx)+pixels[iy,ix+1]*fx)*(1-fy)+(pixels[iy+1,ix]*(1-fx)+pixels[iy+1,ix+1]*fx)*fy
            amount=np.clip((z-.008)/.05,0,1);amount=amount*amount*(3-2*amount)
            col=col*(1-amount[:,:,None])+sample*amount[:,:,None]
            # Pad UV islands using their own colours so mipmaps do not pull a
            # different part of the face into the ear or the edge of the scalp.
            for _ in range(8):
                count=np.zeros((size,size));total=np.zeros_like(col)
                for axis,shift in [(0,1),(0,-1),(1,1),(1,-1)]:
                    neighbour=np.roll(covered,shift,axis)
                    count+=neighbour;total+=np.roll(col,shift,axis)*neighbour[:,:,None]
                fill=(~covered)&(count>0)
                col[fill]=total[fill]/count[fill,None];covered[fill]=True
        mat=skin.copy();mat.name='Weathered face'
        texture=mat.node_tree.nodes.new('ShaderNodeTexImage')
        texture.image=image('Weathered face colour',col)
        bs=mat.node_tree.nodes.get('Principled BSDF')
        mat.node_tree.links.new(texture.outputs['Color'],bs.inputs['Base Color'])
    obj=mesh('Anatomical head - MakeHuman CC0',out,faces,uv_array.tolist(),mat,parent)
    # Weld geometric seams while retaining per-corner UV islands. The head and
    # its neck then share normals as well as the same surface and material.
    bm=bmesh.new();bm.from_mesh(obj.data)
    bmesh.ops.remove_doubles(bm,verts=list(bm.verts),dist=.000001)
    bm.to_mesh(obj.data);bm.free();obj.data.update()
    fitted_hair(obj,parent)
    # The base has eyelids but its eyeballs are separate helpers. Add only the
    # visible sclera/iris inside the sockets, at the source's eye joint centres.
    for side in (-1,1):
        x=side*.030775; y=.108415; z=.079535
        suffix='port' if side<0 else 'starboard'
        eye=empty('eye_'+suffix,parent,(x,y,z))
        ellipsoid('Eyeball',(0,0,0),(.0125,.0125,.0125),sclera,eye,20,12)
        verts=[V((0,0,.0128))];uvs=[(.5,.5)];polys=[]
        for k in range(33):
            a=k/32*math.tau
            verts.append(V((math.cos(a)*.0055,math.sin(a)*.0055,.0128)))
            uvs.append((.5+.5*math.cos(a),.5+.5*math.sin(a)))
            if k:polys.append((0,k,k+1))
        mesh('Iris and pupil',verts,polys,uvs,iris,eye)
        lid=empty('lid_'+suffix,parent,(x,y,z+.014))
        ellipsoid('Upper eyelid',(0,0,0),(.0137,.008,.0023),skin,lid,20,10)
        lid['restY']=y
        lid.scale.z=.001 # Blender Z is browser Y; opening/closing happens at runtime.
        # Eyebrow hairs are in the registered photographic albedo; a separate
        # thick triangular tube would make the face read as a drawn expression.

def fitted_hair(head,parent):
    """A close scalp shell fitted to the anatomical surface, clear of the ears."""
    def margin(p):
        x,y,z=p.x,p.z,-p.y
        front=max(0,min(1,(z+.025)/.085))
        hairline=.045+.128*front+.0025*math.sin(x*126+z*39)
        # Ears project sideways from the cranium; leave them uncovered.
        ear_clearance=.069-abs(x) if y<.158 else 1
        return min(y-hairline,ear_clearance)
    verts=[];faces=[];uv=[]
    for polygon in head.data.polygons:
        corners=[(head.data.vertices[i].co.copy(),head.data.vertices[i].normal.copy())
            for i in polygon.vertices]
        clipped=[]
        for a,b in zip(corners,corners[1:]+corners[:1]):
            da,db=margin(a[0]),margin(b[0])
            if da>=0: clipped.append(a)
            if (da>=0)!=(db>=0):
                t=da/(da-db)
                clipped.append((a[0].lerp(b[0],t),a[1].lerp(b[1],t).normalized()))
        if len(clipped)<3: continue
        start=len(verts)
        us=[.5+math.atan2(p.x,-p.y+.015)/math.tau for p,n in clipped]
        if max(us)-min(us)>.5: us=[u+1 if u<.5 else u for u in us]
        for (p,n),u in zip(clipped,us):
            verts.append(p+n*.0013)
            uv.append((u,(.24-p.z)/.19))
        faces.append(tuple(range(start,len(verts))))
    obj=mesh('Fitted scalp hair',verts,faces,uv,scalp_hair,parent)
    bm=bmesh.new();bm.from_mesh(obj.data)
    bmesh.ops.remove_doubles(bm,verts=list(bm.verts),dist=.000001)
    bm.to_mesh(obj.data);bm.free();obj.data.update()

# ------------------------------------------------------------ helm furniture
wheel=empty('authored_wheel')
r=S['wheel_diameter']/2; rim=S['wheel_rim_thickness']; handle=S['wheel_spoke_handle']
ring('Segmented oak felloe',(0,0,0),r-rim/2,rim/2,'x',oak,wheel,120)
for x in (-rim*.37,rim*.37):
    ring('Felloe moulding',(x,0,0),r-rim*.15,.004,'x',lightwood,wheel,96)
cylinder('Turned hub',(-.105,0,0),(.105,0,0),.119,oak,wheel)
for x in (-.108,.108):
    cylinder('Hub ferrule',(x-.007,0,0),(x+.007,0,0),.09,brass,wheel)
    cylinder('Axle end',(x-.014,0,0),(x+.014,0,0),.031,iron,wheel)
for k in range(int(S['wheel_spoke_count'])):
    a=k/int(S['wheel_spoke_count'])*math.tau
    p=empty('Turned spoke',wheel)
    # Radial profile, including the grip swell and the small end button.
    ys=[(.06,.023),(.12,.035),(.17,.03),(.23,.022),(.5,.019),(.67,.026),
        (r-.045,.025),(r+.01,.019),(r+.045,.026),(r+handle-.025,.024),(r+handle,.013)]
    profile('Spoke and hand grip',[(y,rr,rr,0,0) for y,rr in ys],oak,p,sides=24)
    p.rotation_euler.x=a
    for xx in (-rim*.52,rim*.52):
        at=(xx,math.cos(a)*(r-rim/2),math.sin(a)*(r-rim/2))
        cylinder('Felloe fastening',(at[0]-.002,at[1],at[2]),(at[0]+.002,at[1],at[2]),.006,brass,wheel,sides=12)
wheel['count']=S['wheel_count']

stand=empty('authored_wheel_stand')
ax=S['wheel_axle_above_deck']; half=S['wheel_barrel_length']/2
for side in (-1,1):
    x=side*(half+S['wheel_stanchion_thick']/2)
    box('Wheel standard',(x,ax*.5,0),(S['wheel_stanchion_thick'],ax+.10,S['wheel_stanchion_broad']),oak,stand,.018)
    box('Standard foot',(x,.055,0),(.23,.11,.43),oak,stand,.018)
    for z in (-.12,.12):
        cylinder('Standard deck bolt',(x,.105,z),(x,.12,z),.015,iron,stand,sides=12)
    ring('Bearing strap',(x,ax,0),.11,.022,'x',iron,stand,40)
cylinder('Wheel barrel',(-half,ax,0),(half,ax,0),S['wheel_barrel_diameter_mid']/2,oak,stand)
for x in (-half,half):
    cylinder('Barrel cheek',(x-.025,ax,0),(x+.025,ax,0),S['wheel_barrel_diameter_end']/2,oak,stand)
pts=[]
for i in range(601):
    t=i/600; a=t*math.tau*8
    pts.append((-half*.65+t*half*1.3,ax+.218*math.cos(a),.218*math.sin(a)))
tube('Tiller rope eight turns',pts,.013,rope,stand,8)
for side in (-1,1):
    tube('Tiller rope lead',[(side*half*.65,ax,.218),(side*.45,.40,.28),(side*.55,.04,.3)],.013,rope,stand)

bin=empty('authored_binnacle')
w=S['binnacle_length']; d=S['binnacle_depth']; h=S['binnacle_height']
box('Binnacle lower cabinet',(0,h*.39,0),(w*.94,h*.78,d*.94),oak,bin,.012)
for x in (-w*.40,w*.40):
    for z in (-d*.31,d*.31): box('Binnacle foot',(x,.07,z),(.08,.14,.095),oak,bin,.008)
box('Cabinet cornice',(0,h-.022,0),(w*1.08,.044,d*1.2),oak,bin,.012)
box('Compass shelf',(0,h*.79,0),(w,.038,d),oak,bin,.006)
for x in (-w*.46,-w*.16,w*.16,w*.46):
    box('Compass cabinet stile',(x,h*.88,-d*.41),(.025,h*.20,.038),oak,bin,.004)
for side in (-1,1):
    x=side*w*.315
    box('Raised panel',(x,h*.4,d*.475),(w*.27,h*.51,.015),lightwood,bin,.012)
    for yy in (h*.18,h*.58):
        box('Panel hinge',(x-side*w*.12,yy,d*.505),(.065,.024,.006),brass,bin,.003)
    ring('Drawer pull',(x,h*.52,d*.5),.019,.004,'z',brass,bin,24)
    cylinder('Compass bowl',(x,h*.82,0),(x,h*.85,0),w*.112,brass,bin)
    cylinder('Compass card',(x,h*.853,0),(x,h*.855,0),w*.097,white,bin)
    ring('Compass gimbal',(x,h*.852,0),w*.119,.005,'y',brass,bin,48)
    for k in range(32):
        a=k/32*math.tau
        rr=w*.089
        aa=(x+math.cos(a)*rr,h*.857,math.sin(a)*rr)
        bb=(x+math.cos(a)*rr*(.72 if k%4==0 else .86),h*.857,math.sin(a)*rr*(.72 if k%4==0 else .86))
        tube('Compass point', [aa,bb],.0012,black,bin,4)
    # A clear directional needle, readable from the helm.
    tube('Compass needle',[(x,h*.859,-w*.07),(x,h*.859,w*.07)],.003,black,bin,6)
box('Central lamp locker',(0,h*.88,0),(w*.20,h*.16,d*.85),iron,bin,.007)
ring('Locker handle',(0,h*.87,d*.45),.018,.0035,'z',brass,bin,24)
lampglass=bpy.data.materials.new('Binnacle lamp glass');lampglass.use_nodes=True
lampbs=lampglass.node_tree.nodes.get('Principled BSDF')
lampbs.inputs['Base Color'].default_value=(.075,.028,.008,1)
lampbs.inputs['Roughness'].default_value=.32
lampbs.inputs['Emission Color'].default_value=(1,.24,.032,1)
lampbs.inputs['Emission Strength'].default_value=.2
box('Aft lamp window',(0,h*.885,d*.431),(w*.145,h*.09,.008),lampglass,bin,.002)
for side in (-1,1):
    box('Compass lamp window',(side*w*.103,h*.885,0),(.008,h*.09,d*.54),lampglass,bin,.002)
for x in (-w*.049,0,w*.049):
    box('Lamp window mullion',(x,h*.885,d*.439),(.004,h*.105,.006),brass,bin,.001)
bin['lampHeight']=h*.885
bin['lampAft']=d*.47

# --------------------------------------------------------- articulated people
def sailor(name, officer=False, heavy=False):
    root=empty(name)
    cloth=navy if not heavy else oilskin
    # Fit and cut of clothes are explicit surfaces rather than stacked primitives.
    profile('Jacket',[(.78,.155,.105,0,0),(.84,.173,.111,0,0),(.96,.164,.108,0,0),
        (1.10,.169,.110,0,0),(1.23,.192,.119,0,.005),(1.34,.212,.112,0,0),
        (1.39,.18,.098,0,0),(1.425,.07,.065,0,0)],cloth,root,40,.045,soften=True)
    profile('Trouser seat',[(.77,.139,.096,0,0),(.88,.157,.104,0,0),(.97,.148,.094,0,0)],duck,root,32,.035)
    for side in (-1,1):
        x=side*.115
        profile('Loose trouser leg',[(.09,.061,.063,x,.01),(.15,.072,.072,x,0),
            (.3,.081,.078,x,-.014),(.43,.092,.084,x,.038),(.50,.097,.085,x,.043),
            (.58,.090,.087,x,.018),(.70,.10,.093,x,0),(.84,.098,.086,x,0)],duck,root,28,.07,side,soften=True)
        ellipsoid('Leather shoe',(x,.068,.059),(.07,.065,.145),hair,root)
        box('Shoe sole',(x,.019,.06),(.14,.025,.26),hair,root,.016)
        tube('Trouser side seam',[(x+side*.078,.17,.01),(x+side*.086,.42,.025),(x+side*.087,.64,0),(x+side*.088,.82,0)],.0025,duck,root,6)
    # Open jacket lapels, centre waistcoat and buttons.
    cloth_panel('Waistcoat',[(-.083,1.37,.098),(-.058,.945,.117),
        (.058,.945,.117),(.083,1.37,.098)],duck if officer else cloth,root)
    for side in (-1,1):
        cloth_panel('Folded jacket lapel',[(side*.05,1.405,.073),
            (side*.132,1.32,.108),(side*.053,1.123,.122),(side*.075,1.295,.124)],
            duck if officer else cloth,root)
        tube('Jacket hem',[(side*.015,.798,.110),(side*.11,.795,.083),(side*.166,.81,0)],.003,cloth,root,6)
        box('Pocket flap',(side*.105,1.025,.11),(.076,.036,.018),cloth,root,.006)
        for y in (1.04,1.12,1.20,1.28):
            ellipsoid('Coat button',(side*.049,y,.132),(.006,.006,.004),brass if officer else hair,root,12,8)
    if officer:
        for side in (-1,1):
            profile('Coat tail',[(.50,.068,.022,side*.073,-.09),(.68,.08,.029,side*.078,-.095),(.88,.077,.032,side*.078,-.085)],navy,root,24,.04)
    # Neckerchief and its loose ends.
    ring('Neckerchief collar',(0,1.407,0),.065,.011,'y',hair,root,36)
    for side in (-1,1): tube('Neckerchief end',[(0,1.385,.077),(side*.026,1.31,.13),(side*.023,1.26,.12)],.009,hair,root)
    head=empty('head',root,(0,1.485,0))
    human_head(head)
    # The fitted scalp continues behind the ears into a tied queue.
    tube('Queue',[(0,.16,-.080),(0,.11,-.093),(.006,.056,-.091),(.004,.010,-.082)],.011,scalp_hair,head,12)
    ring('Queue ribbon',(.004,.03,-.083),.012,.0025,'y',navy,head,20)
    ellipsoid('Queue tip',(.004,.005,-.081),(.011,.016,.010),scalp_hair,head,12,8)
    if officer:
        hat_brim(head,True)
        # Cocked hat with a shaped brim, crown and bound edge.
        pts=[]
        for i in range(65):
            a=i/64*math.tau
            pts.append((.19*math.cos(a),.218+.063*abs(math.cos(a))**2,.102*math.sin(a)))
        tube('Bound cocked brim',pts,.018,hair,head,10)
        profile('Cocked crown',[(.204,.099,.067,0,0),(.26,.105,.039,0,0),(.294,.07,.017,0,0)],hair,head,36)
        tube('Hat binding',[(x,y+.009,z) for x,y,z in pts],.003,brass,head,6)
    else:
        hat_brim(head)
        ring('Round hat brim',(0,.218,0),.115,.014,'y',hair,head,64)
        profile('Tarred hat crown',[(.211,.087,.081,0,0),(.266,.079,.073,0,0),(.273,.07,.065,0,0)],hair,head,36)
        ring('Hat band',(0,.23,0),.083,.004,'y',oilskin,head,48)
    for side, namearm in [(-1,'arm_port'),(1,'arm_starboard')]:
        arm=empty(namearm,root,(side*.205,1.35,0))
        profile('Jacket sleeve',[(0,.072,.075,0,0),(-.065,.069,.072,side*.004,0),(-.16,.061,.061,0,0),(-.26,.052,.055,0,0),(-.295,.049,.051,0,0)],cloth,arm,28,.065,side,soften=True)
        elbow=empty('elbow',arm,(0,-.295,0))
        profile('Fore sleeve',[(0,.052,.051,0,0),(-.075,.054,.057,0,0),(-.16,.045,.048,0,0),(-.235,.035,.035,0,0)],cloth,elbow,28,.07,side,soften=True)
        ring('Cuff seam',(0,-.223,0),.035,.003,'y',duck if officer else cloth,elbow,28)
        palm=empty('hand',elbow,(0,-.272,.007))
        ellipsoid('Palm',(0,0,0),(.035,.05,.017),skin,palm)
        # Four curled fingers with knuckles, rather than a solid mitten.
        for k in range(4):
            x=(k-1.5)*.016
            tube('Curled finger',[(x,-.024,.004),(x,-.047,.010),(x,-.05,.031),(x,-.029,.040)],.0075,skin,palm,8)
            ellipsoid('Knuckle',(x,-.035,.012),(.008,.01,.009),skin,palm,12,8)
        tube('Thumb',[(side*.028,.008,.006),(side*.04,-.011,.020),(side*.024,-.024,.034)],.01,skin,palm,10)
        empty('grip',elbow,(0,-.300,.026))
    root['authoredFigure']=True
    return root

seaman=sailor('authored_seaman')
officer=sailor('authored_officer',officer=True)
foul=sailor('authored_oilskin',heavy=True)

# Merge only within one joint/material; independent arms and heads stay movable.
roots=[wheel,stand,bin,seaman,officer,foul]
for root in roots:
    bake_contact_shadows(root,distance=.045 if root in (seaman,officer,foul) else .14)
connect_vertex_colours()
parents=[o for o in list(bpy.data.objects) if o.type=='EMPTY']
for parent in parents:
    batches={}
    for o in list(parent.children):
        if o.type=='MESH': batches.setdefault(o.data.materials[0].name,[]).append(o)
    for name, objects in batches.items():
        if len(objects)<2: continue
        bpy.ops.object.select_all(action='DESELECT')
        for o in objects: o.select_set(True)
        bpy.context.view_layer.objects.active=objects[0]
        bpy.ops.object.join()
        objects[0].name=parent.name+' · '+name

bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=str(OUT/'quarterdeck-detail.glb'),export_format='GLB',
    export_yup=True,export_apply=True,export_extras=True,export_animations=False,
    export_vertex_color='NAME',export_vertex_color_name='Contact occlusion',export_all_vertex_colors=False,
    export_materials='EXPORT',export_texcoords=True,export_normals=True)

# A useful editable workbench layout in the .blend, with all original components.
wheel.location=V((-4,ax,0)); stand.location=V((-4,0,0)); bin.location=V((-2,0,0))
seaman.location=V((0,0,0)); officer.location=V((2,0,0)); foul.location=V((4,0,0))
for root in (seaman,officer,foul):
    for arm in root.children:
        if arm.name.startswith('arm_'): arm.rotation_euler.x=math.radians(-22)
note=bpy.data.texts.new('READ ME — original authored details')
note.write('Blender-built helm fittings and articulated crew.\n'
    'Crew heads adapted from the MakeHuman CC0 base mesh; see tools/vendor/makehuman.\n'
    'Dimensions of fittings come from the existing sourced ship specification.\n'
    'Garment patterns, faces and wear are artistic reconstruction.\n'
    'The GLB is loaded into the live ship and its joints are animated in the browser.\n'
    'Rebuild with node tools/build-authored.mjs.\n')
scene.render.engine='CYCLES'; scene.cycles.samples=32
scene.view_settings.view_transform='AgX'
bpy.ops.file.pack_all()
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'build/HMS Surprise - Authored Detail.blend'))
triangles=sum(len(p.vertices)-2 for o in bpy.data.objects if o.type=='MESH' for p in o.data.polygons)
print('Authored detail triangles:',triangles)
print('Browser asset bytes:',(OUT/'quarterdeck-detail.glb').stat().st_size)
