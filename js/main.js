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
  var cmp=$("#cmp"),handle=$("#handle"),A=$("#topA"),B=$("#topB"),tag=$("#tagR"),chips=$$(".chip",$("#chips"));
  if(!cmp)return;
  var pos=50,dragging=false,raf=0;
  var alts={atlas:"The same photo as a gold Celestial Atlas chart with constellations and objects labelled",neon:"The same photo with glowing neon constellation lines",minimal:"The same photo with ultra-thin Minimal Ink constellation lines",blueprint:"The same photo as a blue Blueprint technical drawing with a coordinate grid",watercolor:"The same photo with soft watercolor constellation washes",educational:"The same photo with colour-coded educational labels",cinematic:"The same photo as a Cinematic title card with thin fading annotations",poster:"The same photo as a framed Stardust Poster with title, legend and a mini sky chart"};
  var names={atlas:"Celestial Atlas",neon:"Neon Constellations",minimal:"Minimal Ink",blueprint:"Blueprint",watercolor:"Watercolor Sky",educational:"Clean Educational",cinematic:"Cinematic",poster:"Stardust Poster"};
  function set(p){
    pos=Math.max(0,Math.min(100,p));
    cmp.style.setProperty("--pos",pos+"%");
    handle.setAttribute("aria-valuenow",Math.round(pos));
    handle.setAttribute("aria-valuetext",Math.round(pos)+"% your photo, "+Math.round(100-pos)+"% "+names[cur]);
  }
  var cur="atlas";
  var glows={atlas:"232,203,146",neon:"80,220,255",minimal:"210,220,240",blueprint:"60,110,255",watercolor:"240,150,190",educational:"130,170,255",cinematic:"255,170,110",poster:"110,130,220"};
  var cards={cinematic:"#000",poster:"#141a2f"},topEl=$(".cmp__top");
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
    var st=$("#stage"),g=glows[id].split(",");if(st){st.style.setProperty("--gr",g[0]);st.style.setProperty("--gg",g[1]);st.style.setProperty("--gb",g[2])}
    topEl.style.setProperty("--card-bg",cards[id]||"transparent");
    var src="img/"+id+".webp";
    back.onload=function(){back.classList.toggle("contain",!!cards[id]);back.classList.add("is-on");front.classList.remove("is-on");back.alt=alts[id];back.removeAttribute("aria-hidden");front.alt="";front.setAttribute("aria-hidden","true");var t=front;front=back;back=t;back.onload=null};
    back.src=src;
    if(back.complete&&back.naturalWidth)back.onload();
    set(pos);
  }
  chips.forEach(function(c){c.addEventListener("click",function(){stopAuto();show(c.dataset.style)})});
  /* honest preview toggle: brightened vs as shot */
  var pv=$("#tagL"),base=$("#base"),tagL=pv;if(pv)pv.addEventListener("pointerdown",function(e){e.stopPropagation()});
  if(pv)pv.addEventListener("click",function(){
    var on=pv.getAttribute("aria-pressed")!=="true";pv.setAttribute("aria-pressed",on);
    base.src=on?"img/original-bright.webp":"img/original.webp";
    base.alt=on?"Your night-sky photo of the Milky Way core, taken on a phone, with the brightness lifted for this preview":"Your night-sky photo as shot: very dark, with only a few stars visible";
    tagL.firstChild.nodeValue="Your photo ";tagL.querySelector("i").textContent=on?"brightened":"as shot";pv.setAttribute("aria-label",on?"Brightened for preview. Press to show the photo as shot.":"Shown as shot. Press to brighten for preview.");
  });
  /* warm the cache when the browser is idle */
  var idle=window.requestIdleCallback||function(f){setTimeout(f,1800)};
  var sd=navigator.connection&&navigator.connection.saveData;
  if(!sd&&window.innerWidth>760)idle(function(){Object.keys(names).forEach(function(k){if(k!=="atlas"){var i=new Image();i.src="img/"+k+".webp"}})});
  /* gentle intro sweep, cancelled by any interaction */
  var auto=null;
  function cancelAuto(){if(auto){cancelAnimationFrame(auto);auto=null}}
  function stopAuto(){cmp.classList.add("is-touched");cancelAuto()}
  function animateTo(to,dur){
    cancelAuto();var from=pos,t0=null;
    auto=requestAnimationFrame(function f(t){
      if(t0===null)t0=t;var k=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-k,3);
      set(from+(to-from)*e);if(k<1)auto=requestAnimationFrame(f);else auto=null;
    });
  }
  chips.forEach(function(c){c.addEventListener("click",function(){if(pos>72||pos<8)animateTo(50,reduce?1:700)})});
  if(!reduce){
    set(100);
    setTimeout(function(){if(!cmp.classList.contains("is-touched"))animateTo(50,1900)},500);
  }else set(50);
  set(pos);
})();

/* ---------- app screenshots ---------- */
(function(){
  var box=$("#appshot");if(!box)return;
  var btns=$$(".chip",box),imgs=$$(".appshot__img",box),alts=[imgs[0].alt,"The StarGuide window with the photo in the vintage gold Celestial Atlas style"];
  btns.forEach(function(b,i){b.addEventListener("click",function(){
    btns.forEach(function(x,j){x.classList.toggle("is-on",i===j);x.setAttribute("aria-pressed",i===j)});
    imgs.forEach(function(m,j){m.classList.toggle("is-on",i===j);m.setAttribute("aria-hidden",i!==j);m.alt=i===j?(j?alts[1]:alts[0]):""});
  })});
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

/* ---------- constellation sky ---------- */
(function(){
  var cv=$("#sky");if(!cv||!cv.getContext)return;
  var ctx=cv.getContext("2d"),W=0,H=0,dpr=1,mx=-1e4,my=-1e4,tx=0,ty=0,px=0,py=0,run=false,vis=true,last=0,bg=[],T=0;
  /* approximate shapes (normalised, y down) of the two constellations in the hero photo */
  var shapes=[
    {name:"Scorpius",lx:.74,ly:.06,n:[[.76,.14],[.70,.22],[.80,.27],[.62,.35],[.60,.46],[.55,.56],[.52,.66],[.50,.76],[.46,.84],[.50,.92],[.58,.95],[.66,.89],[.68,.80]],e:[[0,1],[1,2],[1,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,12]]},
    {name:"Sagittarius",lx:.17,ly:.3,n:[[.38,.46],[.30,.36],[.20,.34],[.15,.45],[.22,.57],[.31,.61],[.30,.48]],e:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[1,6],[6,5],[6,4],[6,0]]},
    {name:"Ophiuchus",lx:.3,ly:.02,n:[[.40,.10],[.46,.16],[.52,.12],[.47,.26],[.44,.36]],e:[[0,1],[1,2],[1,3],[3,4]]}
  ];
  var cons=[],i;
  function build(){
    var wide=W>H*1.3,s=wide?Math.min(W*.6,H*.9):Math.min(W*1.1,H*.8),ox=wide?W*.03-.12*s:(W-s)/2,oy=wide?H*.09:(H-s)/2;
    cons=shapes.map(function(sh,ci){
      var nodes=sh.n.map(function(q,k){return{x:ox+q[0]*s,y:oy+q[1]*s,z:.5+((k*37+ci*11)%10)/20,r:1.6+((k*13)%7)/4}});
      return{name:sh.name,lx:ox+sh.lx*s,ly:oy+sh.ly*s,nodes:nodes,edges:sh.e.map(function(q){return{a:q[0],b:q[1],t:0,dir:0}}),pulse:-1,glow:0}
    });
  }
  function size(){
    var r=cv.getBoundingClientRect();dpr=Math.min(2,window.devicePixelRatio||1);
    W=r.width;H=r.height;cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
    var n=Math.round(Math.min(150,Math.max(50,W*H/12000)));bg=[];
    for(i=0;i<n;i++){var z=Math.random();bg.push({x:Math.random()*W,y:Math.random()*H,z:z,r:.35+z*1.1,a:.2+z*.5,p:Math.random()*6.28,s:.4+Math.random()*1.2,c:Math.random()<.14?"232,203,146":Math.random()<.18?"138,223,255":"255,255,255"})}
    build();
  }
  function dseg(x,y,ax,ay,bx,by){var dx=bx-ax,dy=by-ay,l=dx*dx+dy*dy,t=l?Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/l)):0;var cx=ax+t*dx-x,cy=ay+t*dy-y;return Math.sqrt(cx*cx+cy*cy)}
  function frame(t){
    if(!run)return;
    var dt=Math.min(50,t-last)/1000;last=t;T+=dt;
    px+=(tx-px)*.05;py+=(ty-py)*.05;
    ctx.clearRect(0,0,W,H);
    for(i=0;i<bg.length;i++){
      var s=bg[i],tw=.65+.35*Math.sin(t*.001*s.s+s.p),x=s.x+px*s.z*22,y=s.y+py*s.z*22;
      ctx.fillStyle="rgba("+s.c+","+(s.a*tw).toFixed(3)+")";ctx.beginPath();ctx.arc(x,y,s.r,0,6.283);ctx.fill();
    }
    var R=150;
    cons.forEach(function(c,ci){
      /* idle pulse: every few seconds one constellation draws itself, so touch screens see it too */
      if(c.next===undefined)c.next=2.5+ci*3.5;
      if(c.pulse<0&&T>=c.next){c.pulse=0;c.next=T+12}
      if(c.pulse>=0){c.pulse+=dt;if(c.pulse>c.edges.length*.28+3.2)c.pulse=-1}
      var ox=px*14,oy=py*14,lit=0;
      c.edges.forEach(function(e,k){
        var A=c.nodes[e.a],B=c.nodes[e.b],ax=A.x+ox,ay=A.y+oy,bx=B.x+ox,by=B.y+oy;
        var d=dseg(mx,my,ax,ay,bx,by),near=d<R;
        var auto=c.pulse>=0&&c.pulse>k*.28&&c.pulse<c.edges.length*.28+2.2;
        var target=(near||auto)?1:0;
        e.t+=(target-e.t)*(target?Math.min(1,dt*5):Math.min(1,dt*.9));
        if(e.t>.01){
          var ex=ax+(bx-ax)*Math.min(1,e.t*1.15),ey=ay+(by-ay)*Math.min(1,e.t*1.15);
          var g=ctx.createLinearGradient(ax,ay,bx,by);
          g.addColorStop(0,"rgba(232,203,146,"+(.75*e.t).toFixed(3)+")");g.addColorStop(1,"rgba(138,223,255,"+(.75*e.t).toFixed(3)+")");
          ctx.strokeStyle=g;ctx.lineWidth=1.2;ctx.shadowColor="rgba(138,223,255,.8)";ctx.shadowBlur=8*e.t;
          ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(ex,ey);ctx.stroke();ctx.shadowBlur=0;
        }
        if(e.t>lit)lit=e.t;
      });
      c.glow+=(lit-c.glow)*Math.min(1,dt*4);
      c.nodes.forEach(function(n,k){
        var x=n.x+ox,y=n.y+oy,tw=.7+.3*Math.sin(t*.0012+k*1.7),dd=Math.hypot(x-mx,y-my),b=Math.max(c.glow*.6,dd<R?1-dd/R:0);
        if(b>.05){var gr=ctx.createRadialGradient(x,y,0,x,y,16*b+4);gr.addColorStop(0,"rgba(255,244,214,"+(.9*b).toFixed(3)+")");gr.addColorStop(1,"rgba(232,203,146,0)");ctx.fillStyle=gr;ctx.beginPath();ctx.arc(x,y,16*b+4,0,6.283);ctx.fill()}
        ctx.fillStyle="rgba(255,255,255,"+((.55+.4*b)*tw).toFixed(3)+")";ctx.beginPath();ctx.arc(x,y,n.r*(1+.5*b),0,6.283);ctx.fill();
      });
      if(c.glow>.03){ctx.font="italic 500 "+Math.round(Math.min(26,Math.max(15,W/60)))+"px 'Cormorant Garamond',serif";ctx.fillStyle="rgba(232,203,146,"+(c.glow*.75).toFixed(3)+")";ctx.fillText(c.name,c.lx+ox,c.ly+oy)}
    });
    if(mx>-1000){var hg=ctx.createRadialGradient(mx,my,0,mx,my,70);hg.addColorStop(0,"rgba(138,223,255,.10)");hg.addColorStop(1,"rgba(138,223,255,0)");ctx.fillStyle=hg;ctx.beginPath();ctx.arc(mx,my,70,0,6.283);ctx.fill()}
    requestAnimationFrame(frame);
  }
  function start(){if(!run&&vis&&!document.hidden&&!reduce){run=true;last=performance.now();requestAnimationFrame(frame)}}
  function stop(){run=false}
  function frameStatic(){
    ctx.clearRect(0,0,W,H);
    bg.forEach(function(s){ctx.fillStyle="rgba("+s.c+","+s.a.toFixed(2)+")";ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,6.283);ctx.fill()});
    cons.forEach(function(c){
      ctx.strokeStyle="rgba(232,203,146,.28)";ctx.lineWidth=1;
      c.edges.forEach(function(e){var A=c.nodes[e.a],B=c.nodes[e.b];ctx.beginPath();ctx.moveTo(A.x,A.y);ctx.lineTo(B.x,B.y);ctx.stroke()});
      c.nodes.forEach(function(n){ctx.fillStyle="rgba(255,255,255,.85)";ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,6.283);ctx.fill()});
    });
  }
  size();
  if(reduce)frameStatic();
  var rt;window.addEventListener("resize",function(){clearTimeout(rt);rt=setTimeout(function(){size();if(reduce)frameStatic()},150)});
  var hero=cv.parentElement;
  hero.addEventListener("pointermove",function(e){var r=cv.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top;tx=(mx/W-.5)*-1;ty=(my/H-.5)*-1});
  hero.addEventListener("pointerleave",function(){mx=my=-1e4;tx=ty=0});
  if("IntersectionObserver" in window)new IntersectionObserver(function(es){vis=es[0].isIntersecting;vis?start():stop()}).observe(hero);
  document.addEventListener("visibilitychange",function(){document.hidden?stop():start()});
  start();
})();
})();
