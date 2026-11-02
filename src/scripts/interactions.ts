const root=document.documentElement;
const toggle=document.querySelector<HTMLButtonElement>('.theme-toggle')!;
const systemTheme=matchMedia('(prefers-color-scheme: dark)');
function applyTheme(theme:string){
 root.dataset.theme=theme;
 const dark=theme==='dark';
 toggle.setAttribute('aria-pressed',String(dark));
 toggle.setAttribute('aria-label',`Switch to ${dark?'light':'dark'} mode`);
 toggle.title=`Switch to ${dark?'light':'dark'} mode`;
 document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')!.content=dark?'#293241':'#ffffff';
 document.dispatchEvent(new Event('themechange'));
}
applyTheme(root.dataset.theme||'light');
toggle.addEventListener('click',()=>{
 const theme=root.dataset.theme==='dark'?'light':'dark';
 try{localStorage.setItem('portfolio-theme',theme);}catch{}
 applyTheme(theme);
});
systemTheme.addEventListener('change',()=>{
 let saved=null;try{saved=localStorage.getItem('portfolio-theme');}catch{}
 if(saved!=='light'&&saved!=='dark')applyTheme(systemTheme.matches?'dark':'light');
});

// Decorative follower only. The browser's native cursor stays in use.
const follower=document.querySelector<HTMLElement>('.pointer-accent')!;
const finePointer=matchMedia('(hover: hover) and (pointer: fine)');
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
let x=0,y=0,targetX=0,targetY=0,raf=0,lastTime=0,visible=false;
function hide(){
 visible=false;follower.classList.remove('is-visible','is-hover');
 if(raf)cancelAnimationFrame(raf);raf=0;lastTime=0;
}
function draw(time:number){
 const dt=lastTime?Math.min(time-lastTime,48):16.67;lastTime=time;
 const alpha=1-Math.exp(-dt/95);
 x+=(targetX-x)*alpha;y+=(targetY-y)*alpha;
 follower.style.transform=`translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;
 if(Math.abs(x-targetX)+Math.abs(y-targetY)>.1&&visible)raf=requestAnimationFrame(draw);
 else{raf=0;lastTime=0;}
}
document.addEventListener('pointermove',(event)=>{
 if(!finePointer.matches||reduceMotion.matches||event.pointerType==='touch')return;
 targetX=event.clientX;targetY=event.clientY;
 if(!visible){x=targetX;y=targetY;visible=true;follower.classList.add('is-visible');}
 const target=event.target instanceof Element?event.target:null;
 follower.classList.toggle('is-hover',Boolean(target?.closest('a,button,summary,[role="button"],input,textarea,select')));
 if(!raf)raf=requestAnimationFrame(draw);
},{passive:true});
document.documentElement.addEventListener('pointerleave',hide);
window.addEventListener('blur',hide);
document.addEventListener('visibilitychange',()=>{if(document.hidden)hide();});
finePointer.addEventListener('change',hide);reduceMotion.addEventListener('change',hide);
