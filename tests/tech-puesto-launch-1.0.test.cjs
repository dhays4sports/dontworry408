const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('TECH uses the required tap-first role, housing, review, reason, minimum identity sequence', () => {
  const html = read('tech/index.html');
  const role = html.indexOf('data-tech-step="role"');
  const housing = html.indexOf('data-tech-step="housing"');
  const review = html.indexOf('data-tech-step="review"');
  const reason = html.indexOf('data-tech-step="reason"');
  const capture = html.indexOf('data-tech-step="capture"');
  assert.ok(role > 0 && role < housing && housing < review && review < reason && reason < capture);
  for (const key of ['software_engineering','it_cybersecurity','data_analytics','product_program','design_ux','tech_operations_support','other_tech']) assert.match(html, new RegExp(`data-tech-role="${key}"`));
  assert.match(html, /data-tech-housing="homeowner"/);
  assert.match(html, /data-tech-housing="renter"/);
  for (const key of ['home','auto','bundle']) assert.match(html, new RegExp(`data-tech-review="${key}"`));
  for (const key of ['price','upcoming_renewal','new_home_or_vehicle','coverage_concern','comparison']) assert.match(html, new RegExp(`data-tech-reason="${key}"`));
  assert.match(html, /How can Dylan reach you\?/);
  assert.match(html, /Choose my callback time/);
  assert.doesNotMatch(html, /Continue without saving|Continue to my Snapshot/);
});

test('TECH early checkpoint asks only for minimum fallback identity', () => {
  const html = read('tech/index.html');
  const section = html.slice(html.indexOf('data-tech-step="capture"'), html.indexOf('</fieldset>', html.indexOf('data-tech-step="capture"')));
  assert.match(section, /name="first_name"/);
  assert.match(section, /name="phone"/);
  assert.match(section, /name="consent"[^>]*required/);
  for (const forbidden of ['last_name','property_address','date_of_birth','dob','driver_license','vin','current_carrier','renewal_date','preferred_contact_time','email']) assert.doesNotMatch(section, new RegExp(`name="${forbidden}"`));
  assert.doesNotMatch(html, /data-post-lead-engagement/);
  assert.doesNotMatch(html, /data-coveragefit-invitation|data-continue-without-saving/);
  assert.match(html, /data-cf-next="\/pvx\/appointment\/"/);
});

test('TECH preserves professional boundaries, attribution, and secure handoff context', () => {
  const html = read('tech/index.html');
  const flow = read('shared/tech-puesto-launch-1.0.js');
  const handoff = read('shared/script.js');
  assert.match(html, /name="professional_program"[^>]*value="technology"/);
  for (const field of ['campaign_id','campaign_variant','creative','utm_source','utm_medium','utm_campaign','utm_content','utm_term']) assert.match(html, new RegExp(`name="${field}"`));
  for (const event of ['landing_viewed','role_selected','housing_selected','review_selected','reason_selected','early_capture_presented']) assert.match(flow, new RegExp(event));
  for (const event of ['early_lead_confirmed','coveragefit_started']) assert.match(handoff, new RegExp(event));
  for (const field of ['professional_program','professional_role','professional_role_label','review_track','review_reason','journey_goal']) assert.match(handoff, new RegExp(field));
  assert.match(html, /This does not permit automated marketing texts/);
  assert.doesNotMatch(flow, /eligible\s*=\s*true|qualified\s*=\s*true|approved\s*=\s*true/i);
});

test('TECH identifies Dylan clearly and retains direct text and call choices', () => {
  const html = read('tech/index.html');
  assert.match(html, /You’ll speak directly with/);
  assert.match(html, /Dylan Haysbert/);
  assert.match(html, /CA License #4528400/);
  assert.match(html, /Virginia Tam Insurance Agency, Inc\./);
  assert.match(html, /href="sms:\+14083276377[^\"]*"[^>]*><span><strong>Text Dylan/);
  assert.match(html, /href="tel:\+14083276377"[^>]*><span><strong>Call Dylan/);
  assert.match(html, /Choose my callback time/);
});
