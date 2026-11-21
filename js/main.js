(function(){
"use strict";
var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* nav stuck + scroll progress + active section */
var nav=$("#nav"),bar=$("#progress");
function onScroll(){
  var y=window.scrollY,h=document.documentElement.scrollHeight-window.innerHeight;
  nav.classList.toggle("is-stuck",y>12);
  bar.style.transform="scaleX("+(h>0?Math.min(1,y/h):0)+")";
  var s=$("#steps");
  if(s){$$(".step",s).forEach(function(el){
    var r=el.getBoundingClientRect(),p=(window.innerHeight*.85-r.top)/(r.height*.9);
    el.style.setProperty("--p",Math.max(0,Math.min(1,p)).toFixed(3));
  });}
}
var tick=false;
window.addEventListener("scroll",function(){if(!tick){tick=true;requestAnimationFrame(function(){onScroll();tick=false})}},{passive:true});
onScroll();

var links=$$(".nav__links a"),secs=links.map(function(a){return $(a.getAttribute("href"))});
function setActive(){
  var y=window.innerHeight*.4,cur=null;
  secs.forEach(function(s,i){if(!s)return;var r=s.getBoundingClientRect();if(r.top<=y&&r.bottom>y)cur=i});
  links.forEach(function(a,i){a.classList.toggle("is-active",i===cur)});
}
window.addEventListener("scroll",function(){requestAnimationFrame(setActive)},{passive:true});setActive();
if("IntersectionObserver" in window){
  /* reveal */
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("is-in");io.unobserve(e.target)}})},{threshold:.12,rootMargin:"0px 0px -6% 0px"});
  $$(".reveal").forEach(function(el,i){
    var sib=el.parentElement&&el.parentElement.children,idx=sib?Array.prototype.indexOf.call(sib,el):0;
    if(el.matches(".gallery li,.step"))el.style.setProperty("--d",(idx%4)*0.09+"s");
    io.observe(el);
  });
}else{$$(".reveal").forEach(function(e){e.classList.add("is-in")})}

/* mobile menu */
(function(){
  var b=$("#burger"),m=$("#menu");if(!b||!m)return;
  function close(){m.classList.remove("is-open");b.setAttribute("aria-expanded","false")}
  b.addEventListener("click",function(){var o=m.classList.toggle("is-open");b.setAttribute("aria-expanded",o)});
  m.addEventListener("click",function(e){if(e.target.tagName==="A")close()});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&m.classList.contains("is-open")){close();b.focus()}});
  window.addEventListener("resize",function(){if(window.innerWidth>760)close()});
})();

/* spotlight on cards */
$$(".step,.install").forEach(function(c){
  c.addEventListener("pointermove",function(e){var r=c.getBoundingClientRect();c.style.setProperty("--mx",(e.clientX-r.left)+"px");c.style.setProperty("--my",(e.clientY-r.top)+"px")});
});

/* ---------- before / after + style chips ---------- */
(function(){
  var cmp=$("#cmp"),handle=$("#handle"),A=$("#topA"),B=$("#topB"),tag=$("#tagR"),chips=$$(".chip");
  if(!cmp)return;
  var pos=50,dragging=false,raf=0;
  var alts={atlas:"The same photo as a gold Celestial Atlas chart with constellations and objects labelled",neon:"The same photo with glowing neon constellation lines",minimal:"The same photo with ultra-thin Minimal Ink constellation lines",blueprint:"The same photo as a blue Blueprint technical drawing with a coordinate grid",watercolor:"The same photo with soft watercolor constellation washes",educational:"The same photo with colour-coded educational labels"};
  var names={atlas:"Celestial Atlas",neon:"Neon Constellations",minimal:"Minimal Ink",blueprint:"Blueprint",watercolor:"Watercolor Sky",educational:"Clean Educational"};
  function set(p){
    pos=Math.max(0,Math.min(100,p));
    cmp.style.setProperty("--pos",pos+"%");
    handle.setAttribute("aria-valuenow",Math.round(pos));
    handle.setAttribute("aria-valuetext",Math.round(pos)+"% your photo, "+Math.round(100-pos)+"% "+names[cur]);
  }
  var cur="atlas";
  var glows={atlas:"232,203,146",neon:"80,220,255",minimal:"210,220,240",blueprint:"60,110,255",watercolor:"240,150,190",educational:"130,170,255"};
  function fromEvent(e){var r=cmp.getBoundingClientRect();set((e.clientX-r.left)/r.width*100)}
  cmp.addEventListener("pointerdown",function(e){
    if(e.button>0)return;dragging=true;cmp.classList.add("is-drag");stopAuto();
    try{cmp.setPointerCapture(e.pointerId)}catch(_){}
    fromEvent(e);
  });
  cmp.addEventListener("pointermove",function(e){if(dragging)fromEvent(e)});
  function end(){dragging=false;cmp.classList.remove("is-drag")}
  cmp.addEventListener("pointerup",end);cmp.addEventListener("pointercancel",end);
  handle.addEventListener("keydown",function(e){
    var step=e.shiftKey?10:2,k=e.key,v=null;
    if(k==="ArrowLeft"||k==="ArrowDown")v=pos-step;else if(k==="ArrowRight"||k==="ArrowUp")v=pos+step;
    else if(k==="Home")v=0;else if(k==="End")v=100;
    if(v!==null){e.preventDefault();stopAuto();set(v)}
  });
  /* gentle 3D tilt (mouse only) */
  var stage=$("#stage");
  if(!reduce&&stage&&window.matchMedia("(hover:hover) and (pointer:fine)").matches){
    stage.addEventListener("pointermove",function(e){
      if(dragging)return;var r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      cmp.style.transform="perspective(1100px) rotateY("+(x*5).toFixed(2)+"deg) rotateX("+(-y*4).toFixed(2)+"deg)";
    });
    stage.addEventListener("pointerleave",function(){cmp.style.transform=""});
  }
  /* style switching with crossfade */
  var front=A,back=B,loaded={atlas:1};
  function show(id){
    if(id===cur)return;cur=id;
    chips.forEach(function(c){var on=c.dataset.style===id;c.classList.toggle("is-on",on);c.setAttribute("aria-pressed",on)});
    tag.textContent=names[id];
    var st=$("#stage");if(st)st.style.setProperty("--glow",glows[id]);
    var src="img/"+id+".webp";
    back.onload=function(){back.classList.add("is-on");front.classList.remove("is-on");back.alt=alts[id];back.removeAttribute("aria-hidden");front.alt="";front.setAttribute("aria-hidden","true");var t=front;front=back;back=t;back.onload=null};
    back.src=src;
    if(back.complete&&back.naturalWidth)back.onload();
    set(pos);
  }
  chips.forEach(function(c){c.addEventListener("click",function(){stopAuto();show(c.dataset.style)})});
  /* warm the cache when the browser is idle */
  var idle=window.requestIdleCallback||function(f){setTimeout(f,1800)};
  var sd=navigator.connection&&navigator.connection.saveData;
  if(!sd&&window.innerWidth>760)idle(function(){Object.keys(names).forEach(function(k){if(k!=="atlas"){var i=new Image();i.src="img/"+k+".webp"}})});
  /* gentle intro sweep, cancelled by any interaction */
  var auto=null;
  function stopAuto(){cmp.classList.add("is-touched");if(auto){cancelAnimationFrame(auto);auto=null}}
  if(!reduce){
    set(100);var t0=null;
    var from=100,to=50,dur=1900;
    setTimeout(function(){
      auto=requestAnimationFrame(function f(t){
        if(t0===null)t0=t;var k=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-k,3);
        set(from+(to-from)*e);if(k<1)auto=requestAnimationFrame(f);else auto=null;
      });
    },500);
  }else set(50);
  set(pos);
})();

/* ---------- feature tabs ---------- */
(function(){
  var tabs=$$("#showcase .tab");if(!tabs.length)return;
  function pick(t,focus){
    tabs.forEach(function(x){
      var on=x===t;x.setAttribute("aria-selected",on);x.tabIndex=on?0:-1;
      var p=document.getElementById(x.getAttribute("aria-controls"));if(p)p.hidden=!on;
    });
    var box=t.parentElement;
    if(box.scrollWidth>box.clientWidth+4){box.scrollTo({left:t.offsetLeft-(box.clientWidth-t.offsetWidth)/2,behavior:reduce?"auto":"smooth"})}
    if(focus)t.focus({preventScroll:true});
  }
  tabs.forEach(function(t,i){
    t.addEventListener("click",function(){pick(t)});
    t.addEventListener("keydown",function(e){
      var n=null,k=e.key;
      if(k==="ArrowDown"||k==="ArrowRight")n=tabs[(i+1)%tabs.length];
      else if(k==="ArrowUp"||k==="ArrowLeft")n=tabs[(i-1+tabs.length)%tabs.length];
      else if(k==="Home")n=tabs[0];else if(k==="End")n=tabs[tabs.length-1];
      if(n){e.preventDefault();pick(n,true)}
    });
  });
})();

/* ---------- FAQ smooth accordion ---------- */
$$(".faq details").forEach(function(d){
  var s=$("summary",d),a=$(".ans",d),anim=null;
  s.addEventListener("click",function(e){
    if(reduce||!a.animate)return;
    e.preventDefault();
    if(anim)anim.cancel();
    if(!d.open){
      d.open=true;
      var h=a.offsetHeight;
      anim=a.animate({height:["0px",h+"px"],opacity:[0,1]},{duration:320,easing:"cubic-bezier(.2,.7,.2,1)"});
      anim.onfinish=anim.oncancel=function(){anim=null};
    }else{
      var h2=a.offsetHeight;
      anim=a.animate({height:[h2+"px","0px"],opacity:[1,0]},{duration:260,easing:"cubic-bezier(.2,.7,.2,1)"});
      anim.onfinish=function(){d.open=false;anim=null};
      anim.oncancel=function(){anim=null};
    }
  });
});

/* ---------- lightbox ---------- */
(function(){
  var dlg=$("#lb");if(!dlg||!dlg.showModal)return;
  var items=$$(".gallery a"),img=$("#lbImg"),cap=$("#lbCap"),i=0,opener=null;
  function load(n){
    i=(n+items.length)%items.length;var a=items[i];
    img.src=a.getAttribute("href");img.alt=$("img",a).alt+" style, full size";cap.textContent=a.dataset.cap||"";
  }
  items.forEach(function(a,n){a.addEventListener("click",function(e){e.preventDefault();opener=a;load(n);dlg.showModal();$(".lb__x",dlg).focus()})});
  $(".lb__x",dlg).addEventListener("click",function(){dlg.close()});
  $(".lb__prev",dlg).addEventListener("click",function(){load(i-1)});
  $(".lb__next",dlg).addEventListener("click",function(){load(i+1)});
  dlg.addEventListener("click",function(e){if(e.target===dlg)dlg.close()});
  dlg.addEventListener("keydown",function(e){if(e.key==="ArrowLeft")load(i-1);else if(e.key==="ArrowRight")load(i+1)});
  dlg.addEventListener("close",function(){if(opener)opener.focus()});
})();

/* ---------- OS-aware download ---------- */
(function(){
  var ua=navigator.userAgent||"",note=$("#osnote");
  var os=/Windows/i.test(ua)?"win":/Android|iPhone|iPad|iPod/i.test(ua)?"mobile":/Mac/i.test(ua)?"mac":/Linux|X11|CrOS/i.test(ua)?"lin":"";
  if(os==="mac"||os==="lin"||os==="mobile"){
    var name={mac:"macOS",lin:"Linux",mobile:"a phone or tablet"}[os];
    if(note)note.textContent="You look to be on "+name+". StarGuide is Windows-only today; "+(os==="mobile"?"open this page on a Windows PC to download.":"a "+name+" version is planned.");
    var el=$("#os-"+os);if(el&&os!=="mobile"){el.classList.add("os--you");var p=$("p",el);if(p)p.textContent="Planned · this is your system"}
  }
})();

/* ---------- starfield ---------- */
(function(){
  var cv=$("#sky");if(!cv||!cv.getContext)return;
  var ctx=cv.getContext("2d"),W=0,H=0,dpr=1,stars=[],mx=-1e4,my=-1e4,tx=0,ty=0,px=0,py=0,run=false,vis=true,last=0;
  function size(){
    var r=cv.getBoundingClientRect();dpr=Math.min(2,window.devicePixelRatio||1);
    W=r.width;H=r.height;cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
    var n=Math.round(Math.min(220,Math.max(70,W*H/9000)));stars=[];
    for(var i=0;i<n;i++){var z=Math.random();stars.push({x:Math.random()*W,y:Math.random()*H,z:z,r:.4+z*1.3,a:.25+z*.6,p:Math.random()*6.28,s:.4+Math.random()*1.2,c:Math.random()<.16?"232,203,146":Math.random()<.2?"138,223,255":"255,255,255"})}
  }
  function frame(t){
    if(!run)return;
    var dt=Math.min(50,t-last);last=t;
    px+=(tx-px)*.05;py+=(ty-py)*.05;
    ctx.clearRect(0,0,W,H);
    var near=[],R=130;
    for(var i=0;i<stars.length;i++){
      var s=stars[i];s.y-=.004*dt*s.z;if(s.y<-4)s.y=H+4;
      var x=s.x+px*s.z*26,y=s.y+py*s.z*26;
      var tw=.65+.35*Math.sin(t*.001*s.s+s.p);
      ctx.fillStyle="rgba("+s.c+","+(s.a*tw).toFixed(3)+")";
      ctx.beginPath();ctx.arc(x,y,s.r,0,6.283);ctx.fill();
      var dx=x-mx,dy=y-my;
      if(dx*dx+dy*dy<R*R*1.8&&s.z>.35)near.push([x,y]);
    }
    ctx.lineWidth=.8;
    for(var a=0;a<near.length;a++){
      var d0=Math.hypot(near[a][0]-mx,near[a][1]-my);
      ctx.strokeStyle="rgba(232,203,146,"+(Math.max(0,1-d0/(R*1.3))*.5).toFixed(3)+")";
      ctx.beginPath();ctx.moveTo(mx,my);ctx.lineTo(near[a][0],near[a][1]);ctx.stroke();
      for(var b=a+1;b<near.length;b++){
        var d=Math.hypot(near[a][0]-near[b][0],near[a][1]-near[b][1]);
        if(d<100){ctx.strokeStyle="rgba(138,223,255,"+((1-d/100)*.45).toFixed(3)+")";ctx.beginPath();ctx.moveTo(near[a][0],near[a][1]);ctx.lineTo(near[b][0],near[b][1]);ctx.stroke()}
      }
    }
    requestAnimationFrame(frame);
  }
  function start(){if(!run&&vis&&!document.hidden&&!reduce){run=true;last=performance.now();requestAnimationFrame(frame)}}
  function stop(){run=false}
  size();
  if(reduce){frameStatic();}
  function frameStatic(){ctx.clearRect(0,0,W,H);stars.forEach(function(s){ctx.fillStyle="rgba("+s.c+","+s.a.toFixed(2)+")";ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,6.283);ctx.fill()})}
  var rt;window.addEventListener("resize",function(){clearTimeout(rt);rt=setTimeout(function(){size();if(reduce)frameStatic()},150)});
  var hero=cv.parentElement;
  hero.addEventListener("pointermove",function(e){var r=cv.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top;tx=(mx/W-.5)*-1;ty=(my/H-.5)*-1});
  hero.addEventListener("pointerleave",function(){mx=my=-1e4;tx=ty=0});
  if("IntersectionObserver" in window)new IntersectionObserver(function(es){vis=es[0].isIntersecting;vis?start():stop()}).observe(hero);
  document.addEventListener("visibilitychange",function(){document.hidden?stop():start()});
  start();
})();
})();
