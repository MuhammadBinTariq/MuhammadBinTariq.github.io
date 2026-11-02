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

// Keep one stable accessible heading while the visual title cycles.
const titleText=document.querySelector<HTMLElement>('#typewriter-text')!;
const titles=['Muhammad Bin Tariq','ML Researcher','Aspiring AI Scientist'];
let titleIndex=0,letterIndex=0,erasing=false,titleTimer=0;
function scheduleTitle(delay:number){titleTimer=window.setTimeout(typeTitle,delay);}
function typeTitle(){
 const phrase=titles[titleIndex];
 letterIndex+=erasing?-1:1;
 titleText.textContent=phrase.slice(0,letterIndex);
 if(!erasing&&letterIndex===phrase.length){erasing=true;scheduleTitle(2000);}
 else if(erasing&&letterIndex===0){titleIndex=(titleIndex+1)%titles.length;erasing=false;scheduleTitle(220);}
 else scheduleTitle(erasing?45:85);
}
function resetTitle(){
 clearTimeout(titleTimer);titleIndex=0;letterIndex=0;erasing=false;
 titleText.textContent=reduceMotion.matches?titles[0]:'';
 if(!reduceMotion.matches&&!document.hidden)scheduleTitle(180);
}
document.addEventListener('visibilitychange',()=>{
 clearTimeout(titleTimer);
 if(!document.hidden&&!reduceMotion.matches)scheduleTitle(erasing&&letterIndex===titles[titleIndex].length?2000:85);
});
reduceMotion.addEventListener('change',resetTitle);
window.addEventListener('pagehide',()=>clearTimeout(titleTimer));
window.addEventListener('pageshow',event=>{if(event.persisted)resetTitle();});
resetTitle();
