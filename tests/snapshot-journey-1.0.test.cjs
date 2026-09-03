const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('/snapshot is the canonical appointment-first current-coverage entry', () => {
  const html = read('snapshot/index.html');
  assert.match(html, /canonical" href="https:\/\/408farmers\.com\/snapshot\//);
  assert.match(html, /Schedule a Home Coverage Review/);
  assert.match(html, /Quote details wait for the conversation/);
  assert.doesNotMatch(html, /Review Readiness|See your Snapshot|What’s your Home Protection Score/i);
  assert.match(read('_worker.js'), /path === '\/score\/'[\s\S]*redirect: '\/snapshot\/'/);
});

test('snapshot entry now routes to the short appointment intake and offers Dylan alternatives', () => {
  const script = read('shared/snapshot.js');
  const html = read('snapshot/index.html');
  assert.match(script, /entry:'snapshot'/);
  assert.match(script, /fallbackDestination='\/home\/#form'/);
  assert.doesNotMatch(script, /CoverageFitLauncher\.launch/);
  assert.match(html, /Schedule My Coverage Review/);
  assert.match(html, /Talk with Dylan instead/);
  assert.match(html, /snapshotCallbackOptions/);
  assert.match(html, /Text Dylan/);
  assert.match(html, /Call Dylan/);
});
