const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('CoverageFit bootstrap identity is submission-scoped instead of browser-durable', () => {
  const source = read('shared/coveragefit-launch.js');
  assert.match(source, /bootstrapStorageKey: '408farmers_pvx_bootstrap_id_v2'/);
  assert.match(source, /getBootstrapId\(extra\.submitted_at\|\|profile\.createdAt\|\|''\)/);
  assert.match(source, /stored\.scope===submissionScope/);
  assert.doesNotMatch(source, /bootstrapStorageKey: '408farmers_pvx_bootstrap_id_v1'/);
});

test('same submitted handoff can retry idempotently while a new submission receives a new scope', () => {
  const source = read('shared/coveragefit-launch.js');
  assert.match(source, /if\(!submissionScope\)return randomId\('pvxb_'\)/);
  assert.match(source, /session\?\.setItem\(DEFAULTS\.bootstrapStorageKey,JSON\.stringify\(\{scope:submissionScope,id:id/);
  assert.match(source, /submitted_at/);
});
