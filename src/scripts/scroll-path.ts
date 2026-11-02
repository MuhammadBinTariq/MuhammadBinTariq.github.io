// Section anchors sit in their valleys; the page itself spans both outer ridges.
export function landscapePosition(y:number,anchors:readonly number[],valleys:readonly number[],maxScroll:number){
 if(maxScroll<=0||y<=0)return 0;
 if(y>=maxScroll)return 1;
 const pageStops=[0,...anchors,maxScroll];
 const pathStops=[0,...valleys,1];
 for(let i=0;i<pageStops.length-1;i++){
  const span=pageStops[i+1]-pageStops[i];
  if(span>0&&y<=pageStops[i+1]){
   const t=Math.max(0,Math.min(1,(y-pageStops[i])/span));
   return pathStops[i]+t*(pathStops[i+1]-pathStops[i]);
  }
 }
 return 1;
}
