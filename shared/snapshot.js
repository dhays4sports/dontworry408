(function(){
  const overlay=document.getElementById('reviewTransition');
  const fallbackDestination='/home/#form';
  const pageStartedAt=new Date().toISOString();
  let navigating=false;

  function launchCoverageFit(){
    window.dataLayer=window.dataLayer||[];
    window.dataLayer.push({
      event:'appointment_first_route_selected',
      entry:'snapshot',
      assessment:'home',
      destination:fallbackDestination,
      submitted_at:pageStartedAt
    });
    window.location.assign(fallbackDestination);
    return fallbackDestination;
  }

  document.querySelectorAll('.js-start-review').forEach((button)=>{
    button.addEventListener('click',()=>{
      if(navigating) return;
      navigating=true;
      button.setAttribute('aria-busy','true');

      if(overlay){
        overlay.classList.add('is-active');
        overlay.setAttribute('aria-hidden','false');
        document.body.style.overflow='hidden';
      }

      window.setTimeout(launchCoverageFit,700);
    });
  });

  const dylanChoice=document.getElementById('snapshotDylanChoice');
  const dylanClose=document.getElementById('snapshotDylanClose');
  const callbackOptions=document.getElementById('snapshotCallbackOptions');
  function showDylanChoice(){
    if(!dylanChoice)return;
    dylanChoice.hidden=false;
    if(callbackOptions&&window.CallbackSchedulingContinuity&&typeof window.CallbackSchedulingContinuity.mount==='function'){
      window.CallbackSchedulingContinuity.mount(callbackOptions,{
        productType:'home',
        sourceRoute:'/snapshot/'
      });
    }
    try{dylanChoice.focus({preventScroll:true});}catch(_){dylanChoice.focus();}
    try{dylanChoice.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});}catch(_){}
    window.dataLayer=window.dataLayer||[];
    window.dataLayer.push({event:'snapshot_talk_with_dylan_selected',source_route:'/snapshot/'});
  }
  document.querySelectorAll('.js-talk-dylan').forEach((button)=>button.addEventListener('click',showDylanChoice));
  dylanClose?.addEventListener('click',()=>{
    dylanChoice.hidden=true;
    document.querySelector('.js-talk-dylan')?.focus();
  });

  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals=[...document.querySelectorAll('.reveal')];
  if(!reduced && 'IntersectionObserver' in window){
    const observer=new IntersectionObserver((entries)=>{
      entries.forEach((entry)=>{
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },{threshold:.14,rootMargin:'0px 0px -40px'});
    reveals.forEach((el)=>observer.observe(el));
  }else{
    reveals.forEach((el)=>el.classList.add('is-visible'));
  }

  const mobileCta=document.querySelector('.mobile-cta');
  const heroButton=document.querySelector('.score-copy .score-primary');
  const mobileButton=mobileCta?.querySelector('button');
  function setMobileCtaShown(shown){
    if(!mobileCta) return;
    const hidden=!shown;
    mobileCta.classList.toggle('is-visible',shown);
    mobileCta.setAttribute('aria-hidden',hidden?'true':'false');
    if(mobileButton){
      mobileButton.disabled=hidden;
      if(hidden) mobileButton.setAttribute('tabindex','-1');
      else mobileButton.removeAttribute('tabindex');
    }
  }
  setMobileCtaShown(false);
  if(mobileCta && heroButton && 'IntersectionObserver' in window){
    const ctaObserver=new IntersectionObserver((entries)=>{
      const visible=entries[0] && entries[0].isIntersecting;
      setMobileCtaShown(!visible);
    },{threshold:.1});
    ctaObserver.observe(heroButton);
  }
})();
