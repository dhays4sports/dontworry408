const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');

test('shared intake uses a calm progress bar and plain-language contact step',()=>{
  const js=read('shared/appointment-first-intake.js');
  const css=read('shared/appointment-first-intake.css');
  assert.match(js,/Step 1 of/);
  assert.match(js,/role="progressbar"/);
  assert.match(js,/data-appointment-progress-bar/);
  assert.match(js,/This form takes about 1 minute/);
  assert.match(js,/Your local Farmers Insurance producer/);
  assert.doesNotMatch(js,/About 10 minutes/);
  assert.match(css,/@media\(hover:hover\)/);
  assert.match(css,/min-height:56px/);
  assert.match(css,/font-size:1rem/);
});

test('appointment-first pages consistently load the polished intake',()=>{
  for(const route of ['home','auto-bundle','buyer','healthcare','teachers','engineers','life']){
    const html=read(`${route}/index.html`);
    assert.match(html,/appointment-first-intake\.css\?v=408-APPOINTMENT-FIRST-1\.1/,route);
    assert.match(html,/appointment-first-intake\.js\?v=408-APPOINTMENT-FIRST-1\.1/,route);
  }
});

test('snapshot and homepage explain appointment-first behavior without promising the paused Snapshot',()=>{
  const snapshot=read('snapshot/index.html');
  const homepage=read('index.html');
  assert.match(snapshot,/Three simple steps/);
  assert.match(snapshot,/Choose a callback time/);
  assert.doesNotMatch(snapshot,/Review Readiness|See your Snapshot/);
  assert.match(homepage,/Start with the basics\. Save quote details for the conversation/);
  assert.match(homepage,/Choose a callback time/);
});

test('fallback receipts tell prospects how to recover calendar failures',()=>{
  for(const route of ['home','auto-bundle','buyer','healthcare','teachers','engineers','tech']){
    const html=read(`${route}/thank-you.html`);
    assert.match(html,/calendar did not open/i,route);
    assert.match(html,/do not need to submit again/i,route);
  }
});
