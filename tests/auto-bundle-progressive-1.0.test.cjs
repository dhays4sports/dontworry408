const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('/auto-bundle uses housing, review reason, then minimum identity', () => {
  const html = read('auto-bundle/index.html');
  const flow = read('shared/appointment-first-intake.js');
  const bundle = flow.slice(flow.indexOf('bundle:{'), flow.indexOf('buyer:', flow.indexOf('bundle:{')));
  assert.match(html, /data-appointment-flow="bundle"/);
  assert.ok(bundle.indexOf("key:'housing_context'") < bundle.indexOf("key:'review_reason'"));
  for (const key of ['homeowner', 'renter']) assert.match(bundle, new RegExp(`'${key}'`));
  assert.match(flow, /Choose my callback time/);
});

test('/auto-bundle checkpoint asks only for first name, mobile, and consent', () => {
  const flow = read('shared/appointment-first-intake.js');
  assert.match(flow, /name="first_name"/);
  assert.match(flow, /name="phone"/);
  assert.match(flow, /name="consent"/);
  for (const forbidden of ['last_name', 'email', 'property_address', 'current_carrier', 'renewal_date', 'date_of_birth']) {
    assert.doesNotMatch(flow, new RegExp(`name="${forbidden}"`));
  }
});

test('/auto-bundle keeps attribution and uses the secure appointment handoff', () => {
  const html = read('auto-bundle/index.html');
  const flow = read('shared/appointment-first-intake.js');
  const profile = read('shared/prospect-profile.js');
  for (const field of ['source_key', 'campaign_id', 'campaign_variant', 'creative', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
    assert.match(html, new RegExp(`name="${field}"`));
  }
  assert.match(html, /data-handoff-contract="coveragefit-secure-appointment-handoff-v1"/);
  assert.match(html, /appointment-first-intake\.js\?v=408-APPOINTMENT-FIRST-1\.1/);
  assert.match(flow, /journey_goal:'appointment'/);
  assert.match(flow, /cfNext:'\/pvx\/appointment\/'/);
  assert.match(profile, /bundleStatus: field\(form, 'bundle_status'\)/);
});
