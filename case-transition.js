(function(){
  'use strict';

  const ENTRY_KEY='caseFromSign';
  const EASE='cubic-bezier(.65,0,.35,1)';
  const MORPH_DURATION=360;
  const ENTRY_DURATION=720;
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  let navigating=false;

  function makeFrame(rect,radius){
    const frame=document.createElement('div');
    frame.className='case-transition-frame';
    frame.setAttribute('aria-hidden','true');
    Object.assign(frame.style,{
      left:rect.left+'px',
      top:rect.top+'px',
      width:rect.width+'px',
      height:rect.height+'px',
      borderRadius:radius
    });
    document.body.appendChild(frame);
    return frame;
  }

  function navigate(url){
    if(!url||navigating) return;
    navigating=true;
    if(reducedMotion.matches){
      window.location.assign(url);
      return;
    }

    const shell=document.querySelector('.shell');
    const content=document.getElementById('contentWrap');
    if(!shell||!content){
      window.location.assign(url);
      return;
    }

    const shellRect=shell.getBoundingClientRect();
    const contentRect=content.getBoundingClientRect();
    // Case pages reserve 280px + the 8px inter-frame gap for their directory.
    // The 3D frame expands only to the remaining right-hand content area.
    const directoryWidth=280;
    const interFrameGap=8;
    const targetRect={
      left:shellRect.left+directoryWidth+interFrameGap,
      top:shellRect.top,
      width:shellRect.width-directoryWidth-interFrameGap,
      height:shellRect.height
    };
    const frame=makeFrame(targetRect,getComputedStyle(content).borderRadius);
    const sx=contentRect.width/targetRect.width;
    const sy=contentRect.height/targetRect.height;
    const tx=contentRect.left-targetRect.left;
    const ty=contentRect.top-targetRect.top;

    frame.style.transform=`translate(${tx}px,${ty}px) scale(${sx},${sy})`;
    document.body.classList.add('case-transitioning');
    sessionStorage.setItem(ENTRY_KEY,'1');

    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        frame.style.transition=`transform ${MORPH_DURATION}ms ${EASE},border-radius ${MORPH_DURATION}ms ${EASE}`;
        frame.style.transform='translate(0,0) scale(1,1)';
      });
    });

    window.setTimeout(function(){ window.location.assign(url); },MORPH_DURATION+30);
  }

  function enterCasePage(){
    const root=document.documentElement;
    if(!root.classList.contains('case-from-sign')) return;

    sessionStorage.removeItem(ENTRY_KEY);
    if(reducedMotion.matches){
      root.classList.remove('case-from-sign');
      return;
    }

    const content=document.querySelector('.content-frame');
    if(!content){
      root.classList.remove('case-from-sign');
      return;
    }

    requestAnimationFrame(function(){
      root.classList.add('case-entry-ready');
    });

    window.setTimeout(function(){
      root.classList.remove('case-from-sign','case-entry-ready');
    },ENTRY_DURATION+80);
  }

  window.addEventListener('pageshow',function(){
    navigating=false;
    document.body.classList.remove('case-transitioning');
    document.querySelectorAll('.case-transition-frame').forEach(function(frame){frame.remove();});
  });

  window.CaseTransitions={navigate:navigate};
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',enterCasePage,{once:true});
  }else{
    enterCasePage();
  }
})();
