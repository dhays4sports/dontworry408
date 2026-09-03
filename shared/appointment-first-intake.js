/* 408-APPOINTMENT-FIRST-1.1 — campaign-specific context, identity checkpoint, secure booking. */
(function(window,document){
  'use strict';
  var form=document.querySelector('form[data-appointment-flow]');
  if(!form)return;
  var BUILD='408-APPOINTMENT-FIRST-1.1';
  var commonReasons=[
    ['price','Price'],['upcoming_renewal','Upcoming renewal'],['new_home_or_vehicle','New home or vehicle'],['coverage_concern','Coverage concern'],['comparison','Just comparing']
  ];
  var configs={
    home:{source:'408farmers.com/home',sourceKey:'web_408_home',campaign:'Home appointment',entry:'home_appointment_capture',surface:'home_appointment',assessment:'home',
      questions:[
        {key:'housing_context',title:'Do you own or rent your home?',help:'Choose one.',options:[['homeowner','I own my home'],['renter','I rent my home']]},
        {key:'review_track',title:'What should Dylan review?',help:'Choose one.',options:[['home','Home'],['bundle','Home + auto']]},
        {key:'review_reason',title:'What brought you here today?',help:'Choose the closest answer.',options:commonReasons}
      ]},
    bundle:{source:'408farmers.com/auto-bundle',sourceKey:'web_408_bundle',campaign:'Home and auto appointment',entry:'auto_bundle_appointment_capture',surface:'auto_bundle_appointment',assessment:'home',defaults:{review_track:'bundle'},
      questions:[
        {key:'housing_context',title:'Do you own or rent your home?',help:'Dylan can review home or renters coverage with auto.',options:[['homeowner','I own my home'],['renter','I rent my home']]},
        {key:'review_reason',title:'What brought you here today?',help:'Choose the closest answer.',options:commonReasons}
      ]},
    buyer:{source:'408farmers.com/buyer',sourceKey:'web_408_buyer',campaign:'Homebuyer appointment',entry:'buyer_appointment_capture',surface:'buyer_appointment',assessment:'home',defaults:{housing_context:'buyer',review_reason:'new_home_or_vehicle'},
      questions:[
        {key:'closing_date',title:'When are you expecting to close?',help:'An estimate is fine.',options:[['within_14_days','Within 2 weeks'],['within_30_days','Within 30 days'],['within_60_days','Within 60 days'],['more_than_60_days','More than 60 days'],['not_sure','Not sure yet']]},
        {key:'property_zip',title:'What is the property ZIP code?',help:'Just the five-digit ZIP—no street address yet.',input:{type:'text',inputmode:'numeric',autocomplete:'postal-code',maxlength:5,pattern:'[0-9]{5}',placeholder:'95112'}},
        {key:'review_track',title:'What should Dylan review?',help:'Choose one.',options:[['home','Home'],['bundle','Home + auto']]}
      ]},
    healthcare:{source:'408farmers.com/healthcare',sourceKey:'web_408_healthcare',campaign:'Healthcare professional appointment',entry:'healthcare_appointment_capture',surface:'healthcare_appointment',assessment:'home',defaults:{professional_program:'healthcare'},
      questions:professionalQuestions([['clinical','Clinical care'],['nursing','Nursing'],['medical_dental','Medical or dental'],['pharmacy','Pharmacy'],['healthcare_operations','Healthcare operations'],['other_healthcare','Other healthcare role']])},
    teachers:{source:'408farmers.com/teachers',sourceKey:'web_408_teachers',campaign:'Education professional appointment',entry:'teachers_appointment_capture',surface:'teachers_appointment',assessment:'home',defaults:{professional_program:'teachers'},
      questions:professionalQuestions([['teacher','Teacher'],['school_staff','School staff'],['administrator','Administrator'],['counselor_specialist','Counselor or specialist'],['higher_education','Higher education'],['other_education','Other education role']])},
    engineers:{source:'408farmers.com/engineers',sourceKey:'web_408_engineers',campaign:'Engineer appointment',entry:'engineers_appointment_capture',surface:'engineers_appointment',assessment:'home',defaults:{professional_program:'engineers'},
      questions:professionalQuestions([['software_engineering','Software engineering'],['civil_structural','Civil or structural'],['mechanical','Mechanical'],['electrical','Electrical'],['systems_industrial','Systems or industrial'],['other_engineering','Other engineering field']])},
    life:{source:'408farmers.com/life',sourceKey:'web_408_life',campaign:'Life insurance appointment',entry:'life_appointment_capture',surface:'life_appointment',assessment:'life',defaults:{review_track:'life',housing_context:'not_applicable'},
      questions:[
        {key:'review_reason',title:'What would you like life insurance to help protect?',help:'Choose the closest starting point.',options:[['family_income','Family income'],['mortgage_home','Mortgage or home'],['final_expenses','Final expenses'],['children_future','Children’s future'],['business_legacy','Business or legacy'],['not_sure','Not sure yet']]},
        {key:'review_context',title:'What prompted you to look now?',help:'A simple answer is enough for Dylan to prepare.',options:[['new_family_change','A family change'],['new_home_debt','A new home or debt'],['work_benefits_change','A work-benefits change'],['review_existing','Reviewing existing coverage'],['just_starting','Just getting started']]}
      ]}
  };
  function professionalQuestions(roles){return[
    {key:'professional_role',labelKey:'professional_role_label',title:'What kind of work do you do?',help:'Choose the closest match. Dylan can verify any available discount later.',options:roles},
    {key:'housing_context',title:'Do you own or rent your home?',help:'Choose one.',options:[['homeowner','I own my home'],['renter','I rent my home']]},
    {key:'review_track',title:'What should Dylan review?',help:'Choose one.',options:[['home','Home'],['auto','Auto'],['bundle','Home + auto']]},
    {key:'review_reason',title:'What brought you here today?',help:'Choose the closest answer.',options:commonReasons}
  ];}
  var config=configs[form.dataset.appointmentFlow];if(!config)return;
  var questions=config.questions.concat([{key:'capture',title:'How can Dylan reach you?',help:'Just your first name and mobile number. Then you’ll choose a callback time.'}]);
  function esc(value){return String(value).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function hidden(name,value,required){return'<input type="hidden" name="'+esc(name)+'" value="'+esc(value||'')+'"'+(required?' required':'')+'>';}
  function fieldMarkup(q,index){
    var back=index?'<button class="appointment-back" type="button" data-appointment-back>Back</button>':'';
    if(q.key==='capture')return'<fieldset class="appointment-step" data-appointment-step="'+index+'" hidden><legend>'+q.title+'</legend><p>'+q.help+'</p><div class="appointment-person"><img src="/shared/images/dylan-headshot-160.webp" width="44" height="44" alt=""><div><strong>Dylan Haysbert</strong><span>Your local Farmers Insurance producer</span></div></div><div class="appointment-field-grid"><label><span>First name</span><input autocomplete="given-name" name="first_name" required type="text" maxlength="80"></label><label><span>Mobile number</span><input autocomplete="tel" inputmode="tel" name="phone" placeholder="(408) 555-1234" required type="tel" maxlength="30"></label></div><label class="appointment-consent"><input name="consent" required type="checkbox"><span>I ask Dylan Haysbert at Virginia Tam Insurance Agency, Inc. to call or personally text me about this insurance review and appointment. This does not permit automated marketing texts. Consent is not required to buy.</span></label><div class="appointment-reassurance">This form takes about 1 minute · No obligation · Quote details wait for your call</div><button class="primary-button" type="submit"><span>Choose my callback time</span><span aria-hidden="true"> →</span></button>'+back+'</fieldset>';
    var control='';
    if(q.options)control='<div class="appointment-choice-grid" role="group" aria-label="'+esc(q.title)+'">'+q.options.map(function(option){return'<button type="button" data-appointment-value="'+esc(option[0])+'" data-appointment-label="'+esc(option[1])+'" aria-pressed="false">'+esc(option[1])+'</button>';}).join('')+'</div>';
    else control='<label><span>'+esc(q.title)+'</span><input name="'+esc(q.key)+'_visible" required type="'+esc(q.input.type)+'" inputmode="'+esc(q.input.inputmode)+'" autocomplete="'+esc(q.input.autocomplete)+'" maxlength="'+esc(q.input.maxlength)+'" pattern="'+esc(q.input.pattern)+'" placeholder="'+esc(q.input.placeholder)+'"></label><button class="primary-button" type="button" data-appointment-continue>Continue →</button>';
    return'<fieldset class="appointment-step" data-appointment-step="'+index+'"'+(index?' hidden':'')+'><legend>'+esc(q.title)+'</legend><p>'+esc(q.help)+'</p>'+control+back+'</fieldset>';
  }
  var defaults=Object.assign({},config.defaults||{});
  var hiddenFields={source:config.source,source_key:config.sourceKey,campaign:config.campaign,_subject:'New 408FARMERS appointment lead — '+config.campaign,review_context:'Scheduled insurance review',journey_goal:'appointment',landing_page:'',submitted_at:'',campaign_id:'',campaign_variant:'',creative:'',utm_source:'',utm_medium:'',utm_campaign:'',utm_content:'',utm_term:''};
  questions.forEach(function(q){if(q.key!=='capture'&&!Object.prototype.hasOwnProperty.call(hiddenFields,q.key))hiddenFields[q.key]=defaults[q.key]||'';if(q.labelKey)hiddenFields[q.labelKey]='';});
  Object.keys(defaults).forEach(function(key){hiddenFields[key]=defaults[key];});
  form.innerHTML=Object.keys(hiddenFields).map(function(key){return hidden(key,hiddenFields[key],questions.some(function(q){return q.key===key;}));}).join('')+
    '<div class="appointment-progress"><span class="appointment-progress__label" data-appointment-progress-label>Step 1 of '+questions.length+'</span><div class="appointment-progress__track" role="progressbar" aria-label="Intake progress" aria-valuemin="1" aria-valuemax="'+questions.length+'" aria-valuenow="1"><span class="appointment-progress__bar" data-appointment-progress-bar></span></div><span class="appointment-progress__title" data-appointment-progress-title>'+esc(questions[0].title)+'</span></div>'+
    questions.map(fieldMarkup).join('')+'<div aria-live="polite" class="form-status" id="formStatus" role="status"></div>';
  form.action='https://formspree.io/f/mojgnegn';form.method='POST';form.acceptCharset='UTF-8';form.noValidate=true;
  Object.assign(form.dataset,{journeyStage:'early_identity_checkpoint',promiseContract:'scheduled-insurance-review-v1',cfAssessment:config.assessment,cfEntry:config.entry,cfExtraLaunchSurface:config.surface,cfNext:'/pvx/appointment/',coveragefitAfterSubmit:'true',coveragefitInvitation:'false',postLeadEngagement:'false',handoffContract:'coveragefit-secure-appointment-handoff-v1',senderBuild:BUILD});
  form.dataset.appointmentEnhanced='true';
  var steps=Array.from(form.querySelectorAll('[data-appointment-step]')),progressLabel=form.querySelector('[data-appointment-progress-label]'),progressBar=form.querySelector('[data-appointment-progress-bar]'),progressTitle=form.querySelector('[data-appointment-progress-title]'),progressTrack=form.querySelector('[role="progressbar"]'),current=0;
  function track(name,detail){var payload=Object.assign({event:name,funnel:'appointment_first',flow:form.dataset.appointmentFlow,route:location.pathname,build:BUILD},detail||{});window.dataLayer=window.dataLayer||[];window.dataLayer.push(payload);}
  function show(index,focus){current=Math.max(0,Math.min(index,steps.length-1));steps.forEach(function(step,i){step.hidden=i!==current;});if(progressLabel)progressLabel.textContent='Step '+(current+1)+' of '+steps.length;if(progressBar)progressBar.style.width=(((current+1)/steps.length)*100)+'%';if(progressTitle)progressTitle.textContent=questions[current].title;if(progressTrack)progressTrack.setAttribute('aria-valuenow',String(current+1));if(focus){var target=steps[current].querySelector('legend,input,button');if(target){target.setAttribute('tabindex','-1');target.focus({preventScroll:true});}}}
  steps.forEach(function(step,index){
    var q=questions[index];
    step.querySelectorAll('[data-appointment-value]').forEach(function(button){button.addEventListener('click',function(){step.querySelectorAll('[data-appointment-value]').forEach(function(node){node.setAttribute('aria-pressed',String(node===button));});var field=form.elements[q.key];if(field)field.value=button.dataset.appointmentValue;if(q.labelKey&&form.elements[q.labelKey])form.elements[q.labelKey].value=button.dataset.appointmentLabel;track('appointment_intake_answered',{field:q.key});show(index+1,true);});});
    var next=step.querySelector('[data-appointment-continue]');if(next)next.addEventListener('click',function(){var input=step.querySelector('input[required]');if(!input.checkValidity()){input.reportValidity();input.focus();return;}form.elements[q.key].value=input.value.trim();track('appointment_intake_answered',{field:q.key});show(index+1,true);});
    var back=step.querySelector('[data-appointment-back]');if(back)back.addEventListener('click',function(){show(index-1,true);});
  });
  form.addEventListener('submit',function(){track('appointment_identity_submitted',{stage:'lead_checkpoint'});});
  show(0,false);track('appointment_intake_viewed');
})(window,document);
