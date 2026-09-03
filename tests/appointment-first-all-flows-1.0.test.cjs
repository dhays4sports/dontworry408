const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');

test('all public acquisition entries install the shared appointment-first intake',()=>{
  const pages={
    'home/index.html':'home','auto-bundle/index.html':'bundle','buyer/index.html':'buyer',
    'healthcare/index.html':'healthcare','teachers/index.html':'teachers','engineers/index.html':'engineers','life/index.html':'life'
  };
  for(const [file,flow] of Object.entries(pages)){
    const html=read(file);
    assert.match(html,/appointment-first-intake\.css/,file);
    assert.match(html,/appointment-first-intake\.js/,file);
    assert.match(html,new RegExp(`appointmentFlow=['"]${flow}|data-appointment-flow=['"]${flow}`),file);
    assert.match(html,/coveragefit-launch\.js/,file);
    assert.match(html,/prospect-profile\.js/,file);
    assert.match(html,/shared\/script\.js|\.\.\/shared\/script\.js/,file);
    assert.match(html,/sms:\+14083276377/,`${file} keeps Text Dylan`);
    assert.match(html,/tel:\+14083276377/,`${file} keeps Call Dylan`);
  }
});

test('shared intake collects only bounded context then first name mobile and permission',()=>{
  const script=read('shared/appointment-first-intake.js');
  assert.match(script,/first_name/);
  assert.match(script,/name="phone"/);
  assert.match(script,/name="consent"/);
  assert.match(script,/\/pvx\/appointment\//);
  assert.match(script,/formspree\.io\/f\/mojgnegn/);
  assert.doesNotMatch(script,/date_of_birth|driver.?license|vehicle_identification|social_security/i);
  assert.doesNotMatch(script,/property_address/);
});

test('homebuyer asks for ZIP and timing but not a street address',()=>{
  const script=read('shared/appointment-first-intake.js');
  assert.match(script,/property_zip/);
  assert.match(script,/When are you expecting to close/);
  assert.match(script,/no street address yet/i);
});

test('homepage primary conversion routes into the short appointment intake',()=>{
  const html=read('index.html');
  assert.match(html,/href="\/home\/#form">Schedule My Coverage Review/);
});

test('lead relay preserves appointment context and consent evidence',()=>{
  const worker=read('_worker.js');
  for(const field of ['contact_consent_version','contact_consent_timestamp','professional_program','professional_role','housing_context','review_track','review_reason','closing_date','property_zip'])assert.match(worker,new RegExp(field));
  assert.match(worker,/FORM_SPREE|Formspree|formspree/i);
});
