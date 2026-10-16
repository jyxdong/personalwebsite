/* Pairs with page-transition.css: tells the incoming page which way along
   Work → About → Play the tabs moved, so the frame contents slide that way.
   Loaded without defer so pagereveal is hooked before the first render. */
(function(){
  'use strict';

  var KEY='tabFrom';
  var ORDER={work:0,about:1,play:2};
  var script=document.currentScript;
  var here=script&&script.dataset.tab;
  if(!(here in ORDER)) return;

  window.addEventListener('pageswap',function(){
    try{sessionStorage.setItem(KEY,here);}catch(e){}
  });

  window.addEventListener('pagereveal',function(e){
    var from=null;
    try{
      from=sessionStorage.getItem(KEY);
      sessionStorage.removeItem(KEY);
    }catch(err){}
    if(!e.viewTransition||!(from in ORDER)) return;
    document.documentElement.style.setProperty('--pt-dir',Math.sign(ORDER[here]-ORDER[from]));
  });
})();
