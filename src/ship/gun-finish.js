import * as T from 'three';
import {asTexture,normalFrom,woodGrain} from './textures.js';
import {rng} from '../util/math.js';
import {getHullScan} from './hull-scan.js';
const cache=new Map();

// Gun wood uses metres, not the unrelated UV conventions of boxes and extrusions.
// Side grain follows the cheek; horizontal timber follows the same fore-aft axis.
export function metreGrain(g){
 const p=g.attributes.position,n=g.attributes.normal,uv=new Float32Array(p.count*2);
 for(let i=0;i<p.count;i++){
  const side=Math.abs(n.getZ(i))>Math.abs(n.getY(i));
  uv[i*2]=p.getX(i)/.72;uv[i*2+1]=(side?p.getY(i):p.getZ(i))/.72;
 }
 g.setAttribute('uv',new T.BufferAttribute(uv,2));return g;
}
export function gunMaterials(cfg){
 const size=cfg.textureSize>=1024?512:128;
 // The photographed scans (src/ship/hull-scan.js) where the level is close enough to see
 // them: the blotched brightness of weathered metal for the iron, a real grain for the wood.
 const scan=size>=512?getHullScan():null,key=`${size}:${scan?'scan':'drawn'}`;
 if(cache.has(key))return cache.get(key);
 const canvas=()=>{const c=document.createElement('canvas');c.width=c.height=size;return c;};
 const iron=canvas(),rough=canvas(),height=canvas(),r=rng(1796);
 const ig=iron.getContext('2d'),rg=rough.getContext('2d'),hg=height.getContext('2d');
 const a=ig.createImageData(size,size),b=rg.createImageData(size,size),h=hg.createImageData(size,size);
 // The scan's mottle, read as the same 0-1 spread the drawn noise had, so the iron keeps its
 // shade of black: where it is lighter the blacking is worn and rougher.
 let mottle=null;
 if(scan){const c=canvas(),g=c.getContext('2d',{willReadFrequently:true});g.drawImage(scan.copper,0,0,size,size);mottle=g.getImageData(0,0,size,size).data;}
 for(let i=0;i<a.data.length;i+=4){
  const p=mottle?Math.max(0,Math.min(1,.5+(mottle[i]-128)/80)):r(),v=48+p*13,rr=181+p*34,hh=127+(p-.5)*9;
  a.data.set([v*.96,v,v*1.03,255],i);b.data.set([rr,rr,rr,255],i);h.data.set([hh,hh,hh,255],i);
 }
 ig.putImageData(a,0,0);rg.putImageData(b,0,0);hg.putImageData(h,0,0);
 const fine=cfg.surfaceDetail;
 const gunIron=new T.MeshStandardMaterial({name:'blackened cast iron',map:asTexture(iron),color:0xffffff,
  roughness:1,roughnessMap:asTexture(rough,{srgb:false}),metalness:.36,envMapIntensity:.55,
  normalMap:fine?asTexture(normalFrom(height,.65),{srgb:false}):null,normalScale:new T.Vector2(.10,.10),vertexColors:true});
 const drawnWood=woodGrain({base:'#704438',dark:'#432e26',light:'#956552',size,streaks:220,seed:1805});
 const wood=scan?grained(drawnWood,scan.spar):drawnWood;
 const gunPaint=new T.MeshStandardMaterial({name:'worn red ochre carriage timber',map:asTexture(wood),roughness:.83,
  normalMap:fine?asTexture(normalFrom(wood,.7),{srgb:false}):null,normalScale:new T.Vector2(.14,.14),vertexColors:true});
 const gunBlock=new T.MeshStandardMaterial({name:'oiled tackle block elm',map:asTexture(woodGrain({base:'#715638',dark:'#483b2a',light:'#9e7d50',size,seed:81})),roughness:.76,vertexColors:true});
 const mats={gunIron,gunPaint,gunBlock};cache.set(key,mats);return mats;
}

// The drawn wood's mean colour, lightened and darkened by the photographed grain turned to
// run along x, as src/ship/materials.js does for the oak.
function grained(drawn,grain){
 const size=drawn.width,c=document.createElement('canvas');c.width=c.height=size;
 const g=c.getContext('2d',{willReadFrequently:true});
 g.translate(size,0);g.rotate(Math.PI/2);g.drawImage(grain,0,0,size,size);g.setTransform(1,0,0,1,0,0);
 const dd=drawn.getContext('2d',{willReadFrequently:true}).getImageData(0,0,size,size).data,mean=[0,0,0];
 for(let i=0;i<dd.length;i+=4)for(let k=0;k<3;k++)mean[k]+=dd[i+k];
 for(let k=0;k<3;k++)mean[k]/=dd.length/4;
 const img=g.getImageData(0,0,size,size),d=img.data;
 for(let i=0;i<d.length;i+=4){const k=1+(d[i]-128)/128*.55;for(let j=0;j<3;j++)d[i+j]=Math.max(0,Math.min(255,mean[j]*k));}
 g.putImageData(img,0,0);return c;
}
