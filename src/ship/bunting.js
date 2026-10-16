import * as T from 'three';
import {rng} from '../util/math.js';

// Working wool bunting, not a photograph of a damaged museum flag. The breadth
// count, seam scale and wear are a visual reconstruction; see flags research.
//
// A flag at sea for a commission is not the colour it was issued. The sun takes the dye
// out of the fly first, the end that streams in the open while the hoist lies in the lee
// of its own cloth; the galley funnel and the guns leave soot in it; and the fly end beats
// itself to threads, which is why ensigns were cut off and re-hemmed. Each of those is
// worked in here, by the same amounts on every flag, so the ensign, the pennant and the
// jack have all been at sea for the same time.

// A smooth value noise in [0, 1]: a lattice of random values, blended.
function noise(seed){
  const random=rng(seed),n=64,lattice=Float32Array.from({length:n*n},()=>random());
  const at=(i,j)=>lattice[((j%n+n)%n)*n+((i%n+n)%n)];
  return (x,y)=>{
    const i=Math.floor(x),j=Math.floor(y),fx=x-i,fy=y-j,sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy);
    const a=at(i,j)+(at(i+1,j)-at(i,j))*sx,b=at(i,j+1)+(at(i+1,j+1)-at(i,j+1))*sx;
    return a+(b-a)*sy;
  };
}
export function dressBunting(design,{fly,hoist,breadths=8}={}) {
  const w=design.width,h=design.height,ctx=design.getContext('2d',{willReadFrequently:true});
  const make=()=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
  const height=make(),roughness=make(),hg=height.getContext('2d'),rg=roughness.getContext('2d');
  const colour=ctx.getImageData(0,0,w,h),relief=hg.createImageData(w,h),rough=rg.createImageData(w,h);
  const random=rng(1805),warp=Float32Array.from({length:w},()=>random()-.5),weft=Float32Array.from({length:h},()=>random()-.5);
  const panels=Float32Array.from({length:breadths},()=>.965+random()*.055);
  const hem=.016/hoist*h,header=.04/fly*w;
  const soot=noise(1806),mottle=noise(1807),ravel=noise(1808);
  // Two darns: a patch of cloth set in a little brighter than the faded field round it.
  const darns=[[.71,.2,.05,.07],[.86,.8,.04,.06]];
  // The worn fly, in pixels of cloth lost at each height: a ragged edge a few
  // centimetres deep, with the odd longer tear.
  const lost=Float32Array.from({length:h},(_,y)=>{const v=y/(h-1);
    return w*(.005+.016*ravel(v*23,.5)**1.4+.009*ravel(v*97,8.5)+.06*Math.max(0,ravel(v*6,3.5)-.7)*3.3);});
  const alpha=make(),ag=alpha.getContext('2d'),cut=ag.createImageData(w,h);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++) {
    const u=x/(w-1),v=y/(h-1),i=(y*w+x)*4;
    const row=Math.min(breadths-1,Math.floor(v*breadths));
    const seam=Math.abs(v*breadths-Math.round(v*breadths))*h/breadths;
    const edge=Math.min(y,h-1-y,w-1-x);
    const joint=Math.min(seam,Math.abs(edge-hem),Math.abs(x-header));
    const stitch=joint<.9&&(Math.floor(x/3)+Math.floor(y/3))%3===0;
    // Low-contrast weave mips away in distant views instead of sparkling.
    const thread=warp[x]*.012+weft[y]*.012+(random()-.5)*.016;
    const creases=Math.sin(u*38+Math.sin(v*17)*.3)*Math.sin(v*41+u*7);
    const fade=.025*u*u+.008*Math.sin(u*11+v*19);
    const tone=panels[row]+thread*2.2+fade-(joint<1.1?.055:0);
    // The plain weave itself, warp over weft, a faint chequer at thread scale.
    const weave=((x+y)&1?.018:-.018);
    // How far the sun has taken the dye: most at the fly, patchy.
    const darn=darns.some(([du,dv,dw,dh])=>Math.abs(u-du)<dw&&Math.abs(v-dv)<dh);
    const sun=(.08+.46*u**1.5)*(.75+.5*mottle(u*5,v*4))*(darn?.35:1);
    // Soot in blotches, heaviest towards the lower fly, where the galley smoke streams.
    const smut=Math.max(0,soot(u*4.5,v*3.5)-.45)*(.45+.55*u*v)*.38;
    const lum=(colour.data[i]*.3+colour.data[i+1]*.59+colour.data[i+2]*.11);
    for(let c=0;c<3;c++){
      let value=colour.data[i+c];
      value=value+(lum*1.12+20-value)*sun;
      value*=tone+weave-smut;
      if(x<header)value=[202,196,174][c]*(.99+thread);
      if(stitch||(darn&&Math.min(...darns.map(([du,dv,dw,dh])=>Math.min(Math.abs(Math.abs(u-du)-dw)*w,Math.abs(Math.abs(v-dv)-dh)*h)))<1.2))value=value*.88+16;
      colour.data[i+c]=Math.max(0,Math.min(255,value));
    }
    // The ragged fly: cloth gone, with the odd loose thread of the weft left standing.
    const gone=x>w-1-lost[y]&&!(y%4===0&&random()<.35&&x<w-1-lost[y]*(.3+random()*.5));
    cut.data[i]=cut.data[i+1]=cut.data[i+2]=gone?0:255;cut.data[i+3]=255;
    const reliefValue=128+thread*150+creases*2+(joint<1.6?20:0)+(edge<hem?6:0)+(stitch?7:0);
    relief.data[i]=relief.data[i+1]=relief.data[i+2]=reliefValue;relief.data[i+3]=255;
    const roughValue=235+thread*95+(joint<1.6?9:0);
    rough.data[i]=rough.data[i+1]=rough.data[i+2]=roughValue;rough.data[i+3]=255;
  }
  ctx.putImageData(colour,0,0);hg.putImageData(relief,0,0);rg.putImageData(rough,0,0);ag.putImageData(cut,0,0);
  // Two modest rows of stitching at the fly and hems. They are baked into UVs,
  // so both sides and the whole animated sheet retain the same construction.
  ctx.strokeStyle='rgba(215,209,185,0.24)';ctx.lineWidth=Math.max(.6,h/1500);
  ctx.setLineDash([Math.max(1,h/480),Math.max(1,h/650)]);
  for(const inset of [hem*.7,hem*1.2])ctx.strokeRect(header+inset,inset,w-header-inset*2,h-inset*2);
  const texture=(canvas,srgb=false)=>{const t=new T.CanvasTexture(canvas);t.wrapS=t.wrapT=T.ClampToEdgeWrapping;t.anisotropy=8;if(srgb)t.colorSpace=T.SRGBColorSpace;return t;};
  return {map:texture(design,true),bumpMap:texture(height),roughnessMap:texture(roughness),alphaMap:texture(alpha)};
}

export function installBuntingLight(material) {
  material.onBeforeCompile=shader=>{
    shader.fragmentShader=shader.fragmentShader.replace('#include <lights_fragment_end>',`#include <lights_fragment_end>
      #if NUM_DIR_LIGHTS > 0
        float throughBunting=pow(max(0.0,dot(-normal,directionalLights[0].direction)),1.5);
        reflectedLight.indirectDiffuse+=diffuseColor.rgb*directionalLights[0].color*throughBunting*.2;
      #endif`);
  };
  material.customProgramCacheKey=()=> 'sewn-wool-bunting-v1';
}
