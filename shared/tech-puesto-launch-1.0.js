/* 408-TECH-APPOINTMENT-1.1 — minimal tap-first intake before secure booking. */
(function(window,document){
  'use strict';
  var form=document.querySelector('form[data-tech-progressive="true"]');
  if(!form)return;
  var ROLE_KEYS=new Set(['software_engineering','it_cybersecurity','data_analytics','product_program','design_ux','tech_operations_support','other_tech']);
  var HOUSING_KEYS=new Set(['homeowner','renter']);
  var REVIEW_KEYS=new Set(['home','auto','bundle']);
  var REASON_KEYS=new Set(['price','upcoming_renewal','new_home_or_vehicle','coverage_concern','comparison']);
  var order=['role','housing','review','reason','capture'];
  var steps=Object.fromEntries(order.map(function(name){return[name,form.querySelector('[data-tech-step="'+name+'"]')];}));
  var progressLabel=form.querySelector('[data-tech-progress-label]');
  var progressBar=form.querySelector('[data-tech-progress-bar]');
  var progressTitle=form.querySelector('[data-tech-progress-title]');
  var progressTrack=form.querySelector('[role="progressbar"]');
  var progressTitles={role:'Technology role',housing:'Home',review:'Coverage to review',reason:'Reason for looking',capture:'Your contact information'};
  var status=document.getElementById('formStatus');
  var current='role';

  function safeEvent(name,detail){
    var payload=Object.assign({event:name,funnel:'tech_appointment',route:'/tech/'},detail||{});
    window.dataLayer=window.dataLayer||[];window.dataLayer.push(payload);
    try{document.dispatchEvent(new CustomEvent('408farmers:'+name,{detail:payload}));}catch(_){}
  }
  function show(name,focus){
    current=name;
    Object.keys(steps).forEach(function(key){steps[key].hidden=key!==name;});
    var index=order.indexOf(name);
    if(progressLabel)progressLabel.textContent='Step '+(index+1)+' of '+order.length;
    if(progressBar)progressBar.style.width=(((index+1)/order.length)*100)+'%';
    if(progressTitle)progressTitle.textContent=progressTitles[name]||'';
    if(progressTrack)progressTrack.setAttribute('aria-valuenow',String(index+1));
    if(focus){var target=steps[name].querySelector('legend,button,input');if(target){target.setAttribute('tabindex','-1');target.focus({preventScroll:true});}}
  }
  function press(selector,button){form.querySelectorAll(selector).forEach(function(node){node.setAttribute('aria-pressed',String(node===button));});}
  function chooseRole(button){
    var value=button.dataset.techRole,label=String(button.dataset.techRoleLabel||'').slice(0,120);
    if(!ROLE_KEYS.has(value)||!label)return;
    press('[data-tech-role]',button);form.elements.professional_role.value=value;form.elements.professional_role_label.value=label;form.elements.occupation_segment.value=label;
    safeEvent('role_selected',{professional_role:value});show('housing',true);
  }
  function chooseHousing(button){
    var value=button.dataset.techHousing;if(!HOUSING_KEYS.has(value))return;
    press('[data-tech-housing]',button);form.elements.housing_context.value=value;
    safeEvent('housing_selected',{housing_context:value});show('review',true);
  }
  function chooseReview(button){
    var value=button.dataset.techReview;if(!REVIEW_KEYS.has(value))return;
    press('[data-tech-review]',button);form.elements.review_track.value=value;
    safeEvent('review_selected',{review_track:value});show('reason',true);
  }
  function chooseReason(button){
    var value=button.dataset.techReason;if(!REASON_KEYS.has(value))return;
    press('[data-tech-reason]',button);form.elements.review_reason.value=value;
    var labels={price:'Price',upcoming_renewal:'Upcoming renewal',new_home_or_vehicle:'New home or vehicle',coverage_concern:'Coverage concern',comparison:'Just comparing'};
    form.elements.review_context.value=labels[value]||value;
    safeEvent('reason_selected',{review_reason:value});safeEvent('early_capture_presented',{checkpoint:'minimum_identity'});show('capture',true);
  }

  form.querySelectorAll('[data-tech-role]').forEach(function(button){button.setAttribute('aria-pressed','false');button.addEventListener('click',function(){chooseRole(button);});});
  form.querySelectorAll('[data-tech-housing]').forEach(function(button){button.setAttribute('aria-pressed','false');button.addEventListener('click',function(){chooseHousing(button);});});
  form.querySelectorAll('[data-tech-review]').forEach(function(button){button.setAttribute('aria-pressed','false');button.addEventListener('click',function(){chooseReview(button);});});
  form.querySelectorAll('[data-tech-reason]').forEach(function(button){button.setAttribute('aria-pressed','false');button.addEventListener('click',function(){chooseReason(button);});});
  form.querySelectorAll('[data-tech-back]').forEach(function(button){button.addEventListener('click',function(){var target=button.dataset.techBack;if(order.includes(target))show(target,true);});});
  window.addEventListener('pageshow',function(event){if(event.persisted){status.textContent='';show(current,false);}});
  safeEvent('landing_viewed',{campaign_id:new URLSearchParams(location.search).get('campaign_id')||''});
})(window,document);
