// Close joinery and crown-glass variation, at physical rather than per-piece scale.
import * as T from 'three';
import {PAINT} from '../spec/spec.js';
import {asTexture,normalFrom} from './textures.js';
const cache=new Map();
const hash=n=>{const v=Math.sin(n*127.1+21.7)*43758.54;return v-Math.floor(v);};
export function joineryFinish(cfg) {
 const size=Math.min(1024,cfg.textureSize),key=`joinery:${size}`;
 if(cache.has(key))return cache.get(key);
 const canvases=[];
 for(const kind of ['colour','height','rough']) {
  const c=document.createElement('canvas');c.width=c.height=size;const g=c.getContext('2d');
  g.fillStyle=kind==='colour'?'#eeeeea':kind==='height'?'#808080':'#bababa';g.fillRect(0,0,size,size);
  // Long irregular fibres under intact paint; no large repeated plank seams on a sash.
  for(let j=0;j<180;j++) {
   const y=j/180*size,t=hash(j),drift=(hash(j+9)-.5)*size*.011;
   g.strokeStyle=kind==='height'?`rgba(85,85,85,${.035+t*.10})`:kind==='rough'?`rgba(100,100,100,${.10+t*.16})`:`rgba(92,78,51,${.035+t*.065})`;
   g.lineWidth=Math.max(.5,size*(.00035+t*.0006));g.beginPath();g.moveTo(0,y);
   g.bezierCurveTo(size*.24,y+drift,size*.66,y-drift,size,y);g.stroke();
  }
  // Fine, short brush marks vary the reflected highlight independently of colour.
  if(kind==='rough')for(let j=0;j<75;j++){
   g.strokeStyle=`rgba(235,235,235,${.06+hash(j)*.09})`;g.lineWidth=size*.001;
   const y=hash(j+101)*size,x=hash(j+120)*size;g.beginPath();g.moveTo(x,y);g.lineTo(x+size*.13,y+size*.002);g.stroke();
  }
  canvases.push(c);
 }
 const tex=(c,srgb)=>{const t=asTexture(c,{srgb});t.channel=1;return t;};
 const material=new T.MeshStandardMaterial({color:PAINT.ochre_trim.hex,map:tex(canvases[0],true),
  normalMap:tex(normalFrom(canvases[1],2),false),normalScale:new T.Vector2(.35,.35),
  roughnessMap:tex(canvases[2],false),roughness:.9,metalness:0,vertexColors:true});
 material.name='stern_painted_joinery';material.userData.bakedOcclusion=true;
 cache.set(key,material);return material;
}
export function crownGlassNormal(cfg) {
 const size=Math.min(256,cfg.textureSize),key=`glass:${size}`;if(cache.has(key))return cache.get(key);
 const c=document.createElement('canvas');c.width=c.height=size;const g=c.getContext('2d'),data=g.createImageData(size,size);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++) {
  // Six individually uneven panes in each light. Very low amplitude: glass
  // should bend a reflection gently, never resemble rippled water or frosted plastic.
  const u=x/size*2,v=y/size*3,seed=Math.floor(u)+Math.floor(v)*2;
  const a=(u%1)*Math.PI*2,b=(v%1)*Math.PI*2;
  const dx=.018*Math.sin(a+hash(seed)*6)+.006*Math.sin(b*2+a);
  const dy=.014*Math.cos(b+hash(seed+19)*6)+.006*Math.sin(a*2-b);
  const i=(y*size+x)*4;data.data[i]=128+dx*127;data.data[i+1]=128+dy*127;data.data[i+2]=255;data.data[i+3]=255;
 }
 g.putImageData(data,0,0);const texture=asTexture(c,{srgb:false});cache.set(key,texture);return texture;
}
