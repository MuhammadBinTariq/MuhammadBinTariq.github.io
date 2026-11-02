import {landscapePosition} from './scroll-path';

const canvas = document.querySelector<HTMLCanvasElement>('#landscape')!;
const ctx = canvas.getContext('2d')!;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const sections = [...document.querySelectorAll<HTMLElement>('section[data-epoch]')];
const links = [...document.querySelectorAll<HTMLAnchorElement>('nav a, .landscape-stops a')];
const theta = document.querySelector('#theta')!;
const epoch = document.querySelector('#epoch-readout')!;
const step = document.querySelector('#step-value')!;
const loss = document.querySelector('#loss-value')!;
const lossDot = document.querySelector('#loss-dot')!;
const lossClip = document.querySelector('#loss-clip')!;
let stops = [.08, .36, .64, .92];
let edges=[0,.2,.45,.8,1];
const ridgeHeights=[.58,.36,.62,.43,.66];
const depths=[-.38,-.51,-.43,-.57];
const plateaus = [.78, .59, .39, .22];
const samples = 260;
let progress = 0, current = 0, frame = 0, width = 0, height = 0;
let anchors = stops.map((_,i)=>i), maxScroll = 1;
let colors = {paper:'', ink:'', plot:'', accent:'', muted:'', secondary:'', ball:'', highlight:''};
const clamp = (n:number, min=0, max=1) => Math.max(min, Math.min(max,n));
const smooth = (n:number) => n*n*(3-2*n);
const hash = (k:number) => {const s=Math.sin(k*12.9898)*43758.5453;return s-Math.floor(s);};

// A deterministic illustration, not measured training data.
function stage(y:number){
 let i=0;
 while(i<sections.length-1&&y>=anchors[i+1])i++;
 if(i===sections.length-1)return {i,g:0};
 const span=Math.max(1,anchors[i+1]-anchors[i]);
 const transition=Math.min(innerHeight*.8,span*.75);
 return {i,g:clamp((y-(anchors[i+1]-transition))/transition)};
}
function lossSample(p:number,k:number){
 const {i,g}=stage(p*maxScroll);
 const amplitude=.018+.11*Math.sin(Math.PI*g)**2;
 const spike=hash(k+999)>.95?amplitude*1.4:0;
 const mean=plateaus[i]+((plateaus[i+1]??plateaus[i])-plateaus[i])*smooth(g);
 return clamp(mean+(hash(k)-.5)*2*amplitude+spike,.07,.95);
}
function lossAt(p:number){
 const position=clamp(p)*samples, k=Math.floor(position), next=Math.min(samples,k+1);
 const start=lossSample(k/samples,k), end=lossSample(next/samples,next);
 return start+(end-start)*(position-k);
}
function drawLossTrace(){
 const path=Array.from({length:samples+1},(_,k)=>{
  const p=k/samples;return `${k?'L':'M'}${(12+lossAt(p)*40).toFixed(2)},${(p*500).toFixed(2)}`;
 }).join(' ');
 document.querySelector('#loss-trace')!.setAttribute('d',path);
 document.querySelector('#loss-progress')!.setAttribute('d',path);
}
function measureBasins(){
 // Allocate horizontal space in direct proportion to each epoch's reading length.
 const lengths=sections.map(section=>Math.max(1,section.getBoundingClientRect().height));
 const total=lengths.reduce((sum,n)=>sum+n,0);
 edges=[0];lengths.forEach(length=>edges.push(edges[edges.length-1]+length/total));
 edges[edges.length-1]=1;
 const asymmetry=[.46,.55,.48,.56];
 stops=lengths.map((_,i)=>edges[i]+(edges[i+1]-edges[i])*asymmetry[i]);
 canvas.dataset.basinWidths=lengths.map(n=>(n/total).toFixed(5)).join(',');
}
function terrain(x:number,z:number){
 let i=0;while(i<stops.length-1&&x>edges[i+1])i++;
 const left=x<stops[i], edge=left?edges[i]:edges[i+1];
 const t=clamp(Math.abs(x-stops[i])/Math.max(.001,Math.abs(edge-stops[i])));
 const ridge=ridgeHeights[left?i:i+1];
 const bowl=depths[i]+(ridge-depths[i])*smooth(t*t);
 const ripple=.022*Math.sin(x*39+z*3)*Math.sin(Math.PI*t)**2;
 return bowl+ripple+.12*Math.sin(z*4)+z*z*.7+z*.05*Math.sin(x*7);
}
function point(x:number,z:number){return [width*(.12+x*.74+z*.16),height*(.48+z*.22-terrain(x,z)*.21)] as const;}
function line(points:readonly (readonly number[])[],color:string,lineWidth:number,alpha=1){
 ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
 ctx.strokeStyle=color;ctx.lineWidth=lineWidth;ctx.globalAlpha=alpha;ctx.stroke();ctx.globalAlpha=1;
}
function draw(){
 ctx.clearRect(0,0,width,height);
 for(let zi=-12;zi<=12;zi++){
  const pts=[];for(let i=0;i<=85;i++)pts.push(point(i/85,zi/15));
  line(pts,colors.plot,.7,.14+(zi+12)/140);
 }
 for(let xi=0;xi<=32;xi++){
  const pts=[];for(let j=-24;j<=24;j++)pts.push(point(xi/32,j/30));
  line(pts,colors.plot,.65,.25);
 }
 const route=[];
 for(let i=0;i<=180;i++){const t=i/180;if(t>current)break;route.push(point(t,Math.sin(t*12)*.07));}
 route.push(point(current,Math.sin(current*12)*.07));
 if(route.length)line(route,colors.accent,1.9);
 stops.forEach((t,i)=>{
  const [x,y]=point(t,Math.sin(t*12)*.07);
  ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fillStyle=colors.paper;ctx.fill();
  ctx.strokeStyle=colors.secondary;ctx.stroke();ctx.font='9px "Space Mono",monospace';
  ctx.fillStyle=colors.muted;ctx.fillText(`${i+1}`,x-3,y+22);
 });
 const [x,y]=point(current,Math.sin(current*12)*.07);
 ctx.beginPath();ctx.ellipse(x+1,y+5,9,3,0,0,Math.PI*2);ctx.fillStyle='rgba(35,42,50,.13)';ctx.fill();
 const gradient=ctx.createRadialGradient(x-2,y-5,1,x,y-3,7);
 gradient.addColorStop(0,colors.highlight);gradient.addColorStop(.55,colors.ball);gradient.addColorStop(1,colors.ink);
 ctx.save();ctx.beginPath();ctx.arc(x,y-3,6,0,Math.PI*2);ctx.fillStyle=gradient;ctx.fill();ctx.clip();
 ctx.translate(x,y-3);ctx.rotate(current*26);ctx.beginPath();ctx.ellipse(0,0,2.5,6,0,0,Math.PI*2);ctx.strokeStyle='rgba(255,255,255,.38)';ctx.lineWidth=.7;ctx.stroke();ctx.restore();
 theta.textContent=current.toFixed(2);
}
function animate(){
 current+=(progress-current)*.09;
 if(Math.abs(current-progress)<.0002){current=progress;draw();frame=0;return;}
 draw();frame=requestAnimationFrame(animate);
}
function update(){
 let idx=0;
 sections.forEach((_,i)=>{if(scrollY>=anchors[i]-2)idx=i;});
 links.forEach(link=>{
  const active=link.hash===`#${sections[idx].id}`;
  link.classList.toggle('active',active);
  if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
 });
 epoch.textContent=`epoch ${idx+1} / ${sections.length}`;
 progress=landscapePosition(scrollY,anchors,stops,maxScroll);
 const p=clamp(scrollY/maxScroll);
 // The marker follows the actual noisy path, including its horizontal loss value.
 lossDot.setAttribute('cx',String(12+lossAt(p)*40));lossDot.setAttribute('cy',String(p*500));
 lossClip.setAttribute('height',String(p*500+.5));
 step.textContent=Math.round(p*3000).toLocaleString();loss.textContent=lossAt(p).toFixed(2);
 if(reduced.matches){if(frame)cancelAnimationFrame(frame);frame=0;current=progress;draw();}
 else if(!frame)frame=requestAnimationFrame(animate);
}
function resize(){
 const css=getComputedStyle(document.documentElement);
 colors={paper:css.getPropertyValue('--paper').trim(),ink:css.getPropertyValue('--ink').trim(),plot:css.getPropertyValue('--plot').trim(),accent:css.getPropertyValue('--accent').trim(),muted:css.getPropertyValue('--muted').trim(),secondary:css.getPropertyValue('--secondary').trim(),ball:css.getPropertyValue('--ball').trim(),highlight:css.getPropertyValue('--highlight').trim()};
 const rect=canvas.getBoundingClientRect();width=rect.width;height=rect.height;
 const ratio=Math.min(devicePixelRatio||1,2);canvas.width=width*ratio;canvas.height=height*ratio;ctx.setTransform(ratio,0,0,ratio,0,0);
 maxScroll=Math.max(1,document.documentElement.scrollHeight-innerHeight);
 measureBasins();
 anchors=sections.map(s=>clamp(s.getBoundingClientRect().top+scrollY-parseFloat(getComputedStyle(s).scrollMarginTop||'0'),0,maxScroll));
 drawLossTrace();update();draw();
}
addEventListener('scroll',update,{passive:true});addEventListener('resize',resize);
addEventListener('load',resize);reduced.addEventListener('change',update);
document.addEventListener('themechange',resize);
new ResizeObserver(resize).observe(canvas);document.fonts.ready.then(resize);resize();
