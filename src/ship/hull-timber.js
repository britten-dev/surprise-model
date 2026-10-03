// Painted, caulked timber: colour and actual relief are deliberately separate.
// Dimensions are a restrained reconstruction, not measured Surprise scantlings.
import {FEATURES,hullModel} from './hull.js';
import {PAINT} from '../spec/spec.js';
const cache=new Map();
const hash=n=>{const x=Math.sin(n*127.13+31.71)*43758.5453;return x-Math.floor(x);};
const grey=v=>`rgb(${v},${v},${v})`;

export function hullTimber(size,kind='colour'){
 const key=`${size}:${kind}`;if(cache.has(key))return cache.get(key);
 const canvas=document.createElement('canvas');canvas.width=canvas.height=size;
 const g=canvas.getContext('2d'),features=hullModel().featureYAt(0);
 const stops=FEATURES.map(([name,v])=>[features[name],v]);
 const yPixel=y=>{let i=0;while(i<stops.length-2&&stops[i+1][0]<y)i++;
  const [a,v]=stops[i],[b,w]=stops[i+1];return (1-(v+(w-v)*Math.max(0,Math.min(1,(y-a)/(b-a)))))*size;};
 const metre=size/PAINT.hull_map_metres.value,height=kind==='height',rough=kind==='roughness';
 g.fillStyle=grey(128);g.fillRect(0,0,size,size);
 // V compresses several parts of the hull differently; derive course locations
 // from the midship feature heights, retaining the sheer on the lofted surface.
 let bottom=features.keel_bottom,row=0;
 while(bottom<features.rail){
  const breadth=.235+hash(row+10)*.075,top=Math.min(features.rail,bottom+breadth);
  const y0=yPixel(top),y1=yPixel(bottom),h=y1-y0;
  const offset=(row*2.41+hash(row+2)*.45)%6.096;
  for(let segment=-2;segment<3;segment++){
   const x=(offset+segment*6.096)*metre,w=6.096*metre;
   const tone=hash(row*19+((segment%2+2)%2)*97);
   g.fillStyle=grey(Math.round(height?128+(tone-.5)*4:rough?125+(tone-.5)*50:133+(tone-.5)*42));
   g.fillRect(x,y0,w,h);
   // Broad, shallow cupping of the plank, with no baked light direction.
   if(height){const cup=g.createLinearGradient(0,y0,0,y1);
    cup.addColorStop(0,'rgba(80,80,80,.16)');cup.addColorStop(.3,'rgba(145,145,145,.12)');
    cup.addColorStop(.7,'rgba(145,145,145,.12)');cup.addColorStop(1,'rgba(80,80,80,.16)');
    g.fillStyle=cup;g.fillRect(x,y0,w,h);}
   g.save();g.beginPath();g.rect(x,y0,w,h);g.clip();
   // Fine grain follows the timber, underneath intact paint. Sparse irregular
   // streaks are colour/finish variation; they cannot become pits in the normal.
   for(let k=0;k<(height?12:42);k++){
    const seed=row*137+k*7+((segment%2+2)%2)*101,t=hash(seed),yy=y0+(k+.5)/(height?12:42)*h;
    g.strokeStyle=height?`rgba(95,95,95,${.025+t*.055})`:rough?'rgba(165,165,165,.15)':`rgba(${t>.5?'71,71,71':'185,185,185'},${.06+t*.12})`;
    g.lineWidth=Math.max(.4,metre*(height?.002:.003));g.beginPath();
    const start=x+w*hash(seed+1)*.18,end=x+w*(.55+hash(seed+3)*.45),bend=(hash(seed+5)-.5)*h*.10;
    g.moveTo(start,yy);g.bezierCurveTo(start+w*.25,yy+bend,end-w*.2,yy-bend,end,yy);g.stroke();
   }
   g.restore();
   // Caulking, rather than open black slots. Bevel slopes live in the height
   // field; the colour seam is thinner and remains subdued under paint.
   g.fillStyle=grey(height?115:rough?185:85);
   g.fillRect(x,y0,Math.max(.65,metre*.006),h);
   if(!height&&!rough){
    // Occasional paint abrasion beside a butt, never regularly spaced dots.
    for(let k=0;k<5;k++){const yy=y0+hash(row*29+k)*h;
     g.fillStyle='rgba(177,164,136,.12)';g.fillRect(x+metre*.01,yy,metre*(.012+hash(k+row)*.055),Math.max(.5,metre*.002));}
   }
  }
  g.fillStyle=grey(height?115:rough?185:80);
  g.fillRect(0,y0,size,Math.max(.7,metre*.005));
  bottom=top;row++;
 }
 cache.set(key,canvas);return canvas;
}
