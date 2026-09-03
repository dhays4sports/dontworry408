const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');
const workerUrl = pathToFileURL(path.join(root, '_worker.js')).href;
const validPayload = () => ({
  schema_version:'408-callback-browser-booking-v1',
  request_id:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  correlation_id:'408d_callback_test',
  first_name:'Maya',
  phone:'+14085551234',
  product_type:'life',
  source_route:'/life/',
  date:'2026-08-31',
  time:'14:00',
  call_request:true,
  call_request_version:'408-callback-browser-booking-v1',
  call_request_timestamp:'2026-08-29T12:00:00.000Z'
});

function callbackRequest(payload = validPayload(), origin = 'https://408farmers.com') {
  return new Request('https://408farmers.com/api/callback/schedule', {
    method:'POST',
    headers:{ Origin:origin, 'Sec-Fetch-Site':'same-origin', 'Content-Type':'application/json', 'X-408-Callback-Version':'1' },
    body:JSON.stringify(payload)
  });
}

test('same-origin browser booking is allowlisted, signed, and returns the opaque calendar page', async () => {
  const originalFetch = global.fetch;
  const calls = [];
  global.fetch = async (url, init) => {
    calls.push({ url:String(url), init });
    return Response.json({
      ok:true, booked:true, available:true, idempotent:false,
      appointment:{ display:'Monday, August 31 at 2:00 PM PDT', calendarUrl:'https://coveragefit.com/appointment/?token=abcdefghijklmnopqrstuvwxyz123456' }
    }, { status:201 });
  };
  try {
    const worker = (await import(`${workerUrl}?browserBook=${Date.now()}`)).default;
    const response = await worker.fetch(callbackRequest(), {
      COVERAGEFIT_LEAD_SYNC_SECRET:'test-secret-that-is-longer-than-thirty-two-characters',
      ASSETS:{ fetch:originalFetch }
    }, {});
    assert.equal(response.status, 201);
    const result = await response.json();
    assert.equal(result.booked, true);
    assert.equal(result.appointment.calendarUrl, 'https://coveragefit.com/appointment/?token=abcdefghijklmnopqrstuvwxyz123456');
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, 'https://coveragefit.com/api/callback/web-book');
    assert.equal(new URL(calls[0].url).search, '', 'PII must never appear in the server bridge URL');
    assert.equal(calls[0].init.headers['X-CoverageFit-Contract'], 'coveragefit-callback-web-booking-v1');
    assert.match(calls[0].init.headers['X-CoverageFit-Signature'], /^[a-f0-9]{64}$/);
    const signed = JSON.parse(calls[0].init.body);
    assert.equal(signed.phone, '+14085551234');
    assert.equal(signed.date, '2026-08-31');
    assert.equal(signed.time, '14:00');
    assert.equal(signed.call_request, true);
    assert.equal(Object.hasOwn(signed, 'automated_marketing_sms_consent'), false);
  } finally {
    global.fetch = originalFetch;
  }
});

test('cross-origin, malformed, and non-call requests are rejected before CoverageFit', async () => {
  const originalFetch = global.fetch;
  let calls = 0;
  global.fetch = async () => { calls += 1; return Response.json({ ok:true }); };
  try {
    const worker = (await import(`${workerUrl}?browserReject=${Date.now()}`)).default;
    const env = { COVERAGEFIT_LEAD_SYNC_SECRET:'test-secret-that-is-longer-than-thirty-two-characters', ASSETS:{ fetch:originalFetch } };
    assert.equal((await worker.fetch(callbackRequest(validPayload(), 'https://attacker.example'), env, {})).status, 403);
    const noCall = validPayload();
    noCall.call_request = false;
    assert.equal((await worker.fetch(callbackRequest(noCall), env, {})).status, 422);
    const malformedDate = validPayload();
    malformedDate.date = 'Friday';
    assert.equal((await worker.fetch(callbackRequest(malformedDate), env, {})).status, 422);
    assert.equal(calls, 0);
  } finally {
    global.fetch = originalFetch;
  }
});

test('CoverageFit endpoint injection is rejected and cannot receive the booking', async () => {
  const originalFetch = global.fetch;
  let calls = 0;
  global.fetch = async () => { calls += 1; return Response.json({ ok:true }); };
  try {
    const worker = (await import(`${workerUrl}?endpointReject=${Date.now()}`)).default;
    const response = await worker.fetch(callbackRequest(), {
      COVERAGEFIT_LEAD_SYNC_SECRET:'test-secret-that-is-longer-than-thirty-two-characters',
      COVERAGEFIT_CALLBACK_BOOKING_URL:'https://attacker.example/api/callback/web-book',
      ASSETS:{ fetch:originalFetch }
    }, {});
    assert.equal(response.status, 503);
    assert.equal(calls, 0);
  } finally {
    global.fetch = originalFetch;
  }
});

test('an unavailable slot returns alternatives without claiming an appointment was booked', async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => Response.json({
    ok:true, booked:false, available:false,
    alternatives:[{ date:'2026-08-31', time:'14:30', display:'Monday, August 31 at 2:30 PM PDT' }]
  });
  try {
    const worker = (await import(`${workerUrl}?unavailable=${Date.now()}`)).default;
    const response = await worker.fetch(callbackRequest(), {
      COVERAGEFIT_LEAD_SYNC_SECRET:'test-secret-that-is-longer-than-thirty-two-characters',
      ASSETS:{ fetch:originalFetch }
    }, {});
    const result = await response.json();
    assert.equal(response.status, 200);
    assert.equal(result.booked, false);
    assert.equal(result.available, false);
    assert.equal(result.alternatives[0].time, '14:30');
  } finally {
    global.fetch = originalFetch;
  }
});

test('every cold acquisition surface loads the short intake before CoverageFit booking', () => {
  for (const route of ['auto-bundle','buyer','engineers','healthcare','home','teachers','life']) {
    const html = fs.readFileSync(path.join(root, route, 'index.html'), 'utf8');
    assert.match(html, /appointment-first-intake\.js\?v=408-APPOINTMENT-FIRST-1\.1/, route);
  }
  const browser = fs.readFileSync(path.join(root, 'shared/appointment-first-intake.js'), 'utf8');
  assert.match(browser, /Choose my callback time/);
  assert.match(browser, /cfNext:'\/pvx\/appointment\/'/);
  assert.match(browser, /name="first_name"/);
  assert.match(browser, /name="phone"/);
  assert.doesNotMatch(browser, /date_of_birth|property_address|driver.?license/i);
});

test('every CoverageFit defer path keeps callback appointment, text, and call together', () => {
  const invitation = fs.readFileSync(path.join(root, 'shared/coveragefit-invitation.js'), 'utf8');
  assert.match(invitation, /Continue my CoverageFit Snapshot/);
  assert.match(invitation, /Talk with Dylan instead/);
  assert.match(invitation, /Show Contact Options/);
  assert.match(invitation, /data-coveragefit-invitation-callback/);
  assert.match(invitation, /CallbackSchedulingContinuity\.mount\(callbackSlot/);
  assert.match(invitation, /href="sms:\+14083276377">Text Dylan/);
  assert.match(invitation, /href="tel:\+14083276377">Call Dylan/);

  const postLead = fs.readFileSync(path.join(root, 'shared/post-lead-engagement.js'), 'utf8');
  assert.match(postLead, /data-post-lead-callback-slot/);
  assert.match(postLead, /CallbackSchedulingContinuity\.mount\(callbackSlot/);
  assert.match(postLead, /href="sms:\+14083276377">Text Dylan/);
  assert.match(postLead, /href="tel:\+14083276377">Call Dylan/);

  const home = fs.readFileSync(path.join(root, 'home/index.html'), 'utf8');
  const homeRuntime = fs.readFileSync(path.join(root, 'shared/home-engagement.js'), 'utf8');
  assert.match(home, /data-home-payoff-contact>Ask Dylan instead/);
  assert.match(home, /data-home-payoff-callback/);
  assert.match(home, /href="sms:\+14083276377">Text Dylan/);
  assert.match(home, /href="tel:\+14083276377">Call Dylan/);
  assert.match(homeRuntime, /CallbackSchedulingContinuity\.mount\(callbackSlot/);
});

test('tech lead submission opens the appointment-only CoverageFit journey', () => {
  const tech = fs.readFileSync(path.join(root, 'tech/index.html'), 'utf8');
  assert.match(tech, /data-cf-next="\/pvx\/appointment\/"/);
  assert.match(tech, /name="journey_goal"[^>]*value="appointment"/);
  assert.match(tech, /coveragefit-secure-appointment-handoff-v1/);
  assert.doesNotMatch(tech, /data-coveragefit-invitation|callback-scheduling-continuity\.js/);
});

test('life finish-later exposes callback identity but excludes protected application values', () => {
  const source = fs.readFileSync(path.join(root, 'shared/life-secure-submit.js'), 'utf8');
  const start = source.indexOf("var callbackContext = mode === 'finish_with_dylan_later'");
  const end = source.indexOf('var body = JSON.stringify(payload)', start);
  const section = source.slice(start, end);
  for (const allowed of ['firstName','phone','correlationId','productType','sourceRoute']) assert.match(section, new RegExp(allowed));
  for (const forbidden of ['date_of_birth','ssn_last4','residential_address','email']) assert.doesNotMatch(section, new RegExp(forbidden));
});
