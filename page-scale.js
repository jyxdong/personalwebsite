/* Large screens: scale the whole page up uniformly so it keeps the
   composition designed at laptop size (about a 1440×810 viewport) instead of
   leaving fixed-size UI next to an oversized 3D frame. Uses CSS zoom on
   <body>. Loaded synchronously in <head> so the first paint is already scaled.

   Under zoom, pointer coordinates (clientX/Y) are always viewport pixels, but
   browsers disagree on getBoundingClientRect(): newer engines report it in
   viewport pixels, older ones unzoomed. The helpers below normalise that:
     visualRect(el) → viewport pixels, comparable with clientX/Y
     cssRect(el)    → CSS pixels, usable for style.left/top/width/transform
     toCss(v)       → viewport pixels → CSS pixels */
(function(){
  'use strict';

  // FOLLOW < 1: the page grows only part of the way with the screen, so a big
  // monitor still feels a little roomier than a laptop instead of identical.
  var BASE_W=1440, BASE_H=810, MAX_ZOOM=2, FOLLOW=.7;
  var root=document.documentElement;
  var zoom=1;

  function compute(){
    var w=root.clientWidth||window.innerWidth, h=window.innerHeight;
    var full=Math.max(1,Math.min(w/BASE_W,h/BASE_H,MAX_ZOOM));
    return 1+(full-1)*FOLLOW;
  }

  function apply(){
    var z=Math.round(compute()*1000)/1000;
    if(z===zoom&&root.style.getPropertyValue('--page-zoom')) return;
    zoom=z;
    root.style.setProperty('--page-zoom',String(z));
    window.dispatchEvent(new CustomEvent('pagezoomchange',{detail:{zoom:z}}));
  }

  var style=document.createElement('style');
  style.textContent='body{zoom:var(--page-zoom,1)}';
  document.head.appendChild(style);
  apply();
  window.addEventListener('resize',apply);

  // 1 when rects already come back in viewport pixels, otherwise the zoom.
  function rectFactor(){
    var body=document.body;
    if(zoom===1||!body) return 1;
    var w=body.getBoundingClientRect().width;
    if(!w) return 1;
    var ratio=root.clientWidth/w;
    return Math.abs(ratio-1)<Math.abs(ratio-zoom) ? 1 : zoom;
  }

  function scaled(r,k){
    return {left:r.left*k,top:r.top*k,right:r.right*k,bottom:r.bottom*k,
      width:r.width*k,height:r.height*k,x:r.left*k,y:r.top*k};
  }

  window.PageScale={
    zoom:function(){return zoom;},
    toCss:function(v){return v/zoom;},
    visualRect:function(el){return scaled(el.getBoundingClientRect(),rectFactor());},
    cssRect:function(el){return scaled(el.getBoundingClientRect(),rectFactor()/zoom);}
  };
})();
