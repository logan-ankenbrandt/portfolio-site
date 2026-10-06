// Tests for the sync: run with `npm test`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { HUB_DIR, inspectProject, parseArgs, runSync } from './sync-projects.mjs';

const FIXTURES = path.join(HUB_DIR, 'fixtures');
const SLUG = 'slide-rebuild-log';
const quiet = () => {};

function tempRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'hub-sync-test-'));
}

/** Copies one fixture project into a temp folder and returns that folder. */
function copyFixture(root = tempRoot(), slug = SLUG) {
  const dir = path.join(root, slug);
  fs.cpSync(path.join(FIXTURES, slug), dir, { recursive: true });
  return dir;
}

function editJson(dir, fn) {
  const file = path.join(dir, 'portfolio.json');
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  fn(json);
  fs.writeFileSync(file, JSON.stringify(json, null, 2));
}

const errorsFor = (dir) => inspectProject({ dir, slug: SLUG }).errors.join('\n');

/** A hub folder with only a projects.config.json, inside a temp root. */
function tempHub(root, slugs = [SLUG]) {
  const hub = path.join(root, 'hub');
  fs.mkdirSync(hub);
  fs.writeFileSync(path.join(hub, 'projects.config.json'), JSON.stringify({ projects: slugs }));
  return hub;
}

test('every fixture passes the contract', () => {
  for (const slug of fs.readdirSync(FIXTURES)) {
    const r = inspectProject({ dir: path.join(FIXTURES, slug), slug });
    assert.deepEqual(r.errors, [], slug);
    assert.ok(r.portfolio, slug);
  }
});

test('rejects a key the contract does not define', () => {
  const dir = copyFixture();
  editJson(dir, (j) => { j.items[0].alt = 'extra field'; });
  assert.match(errorsFor(dir), /items\.0: Unrecognized key/);
});

test('rejects a missing required field', () => {
  const dir = copyFixture();
  editJson(dir, (j) => { delete j.items[0].log.flagged; });
  assert.match(errorsFor(dir), /items\.0\.log\.flagged/);
});

test('rejects a kind outside the contract', () => {
  const dir = copyFixture();
  editJson(dir, (j) => { j.items[0].kind = 'mockup'; });
  assert.match(errorsFor(dir), /items\.0\.kind/);
});

test('rejects a referenced file that does not exist', () => {
  const dir = copyFixture();
  editJson(dir, (j) => { j.items[0].after.image = 'slides/nowhere.png'; });
  assert.match(errorsFor(dir), /after\.image "slides\/nowhere\.png" file is missing/);
});

test('rejects a .png that is not a PNG', () => {
  const dir = copyFixture();
  fs.writeFileSync(path.join(dir, 'renders/cover.png'), 'not an image');
  assert.match(errorsFor(dir), /cover "renders\/cover\.png" is not a PNG/);
});

test('rejects downloads whose byte count does not match the file', () => {
  const dir = copyFixture();
  editJson(dir, (j) => { j.downloads[0].bytes += 1; });
  assert.match(errorsFor(dir), /downloads\[0\] .* says bytes/);
});

test('rejects a repo URL that does not match the slug', () => {
  const dir = copyFixture();
  editJson(dir, (j) => { j.repo = 'https://github.com/logan-ankenbrandt/other-repo'; });
  assert.match(errorsFor(dir), /repo: must be exactly https:\/\/github\.com\/logan-ankenbrandt\/slide-rebuild-log/);
});

test('rejects paths that leave the repo', () => {
  const dir = copyFixture();
  editJson(dir, (j) => { j.cover = '../outside.png'; });
  assert.match(errorsFor(dir), /cover: must be a relative path/);
});

test('rejects skills that are not the listing words', () => {
  const dir = copyFixture();
  editJson(dir, (j) => { j.skills.push('PowerPoint'); });
  assert.match(errorsFor(dir), /skills\.\d+: must be one of the listing's skills/);
});

test('rejects a howMade note that does not name the agents', () => {
  const dir = copyFixture();
  editJson(dir, (j) => { j.howMade = 'I made these slides.'; });
  assert.match(errorsFor(dir), /howMade/);
});

test('rejects a private never term and warns on a private warn term', () => {
  const dir = copyFixture();
  editJson(dir, (j) => { j.oneLiner = 'Slides rebuilt while at Example Corp for Acme.'; });
  const r = inspectProject({ dir, slug: SLUG, terms: { never: ['example corp'], warn: ['Acme'] } });
  assert.match(r.errors.join('\n'), /oneLiner: mentions "example corp"/);
  assert.match(r.warnings.join('\n'), /oneLiner: contains "Acme"/);
});

test('a repo sync reads ../<slug> and never falls back to fixtures', () => {
  const root = tempRoot();
  const hub = tempHub(root);
  fs.cpSync(FIXTURES, path.join(hub, 'fixtures'), { recursive: true });
  assert.throws(() => runSync({ hubDir: hub, log: quiet }), /slide-rebuild-log: missing .*slide-rebuild-log[/\\]portfolio\.json/);
  assert.equal(fs.existsSync(path.join(hub, 'content', 'projects.json')), false);
});

test('a repo sync copies every referenced file and replaces stale ones', () => {
  const root = tempRoot();
  const hub = tempHub(root);
  copyFixture(root);
  const stale = path.join(hub, 'public', 'projects', 'old-project', 'cover.png');
  fs.mkdirSync(path.dirname(stale), { recursive: true });
  fs.writeFileSync(stale, 'stale');

  const content = runSync({ hubDir: hub, log: quiet });

  assert.equal(content.mode, 'repos');
  const written = JSON.parse(fs.readFileSync(path.join(hub, 'content', 'projects.json'), 'utf8'));
  assert.deepEqual(written, content);
  const project = written.projects[0];
  for (const rel of Object.keys(project.files)) {
    assert.ok(fs.existsSync(path.join(hub, 'public', 'projects', SLUG, rel)), rel);
  }
  assert.equal(project.files['renders/cover.png'].width, 1280);
  assert.equal(fs.existsSync(stale), false);
});

test('a first sync into a hub with no public folder works', () => {
  const root = tempRoot();
  const hub = tempHub(root);
  copyFixture(root);
  runSync({ hubDir: hub, log: quiet });
  assert.ok(fs.existsSync(path.join(hub, 'public', 'projects', SLUG, 'portfolio.json')) === false);
  assert.ok(fs.existsSync(path.join(hub, 'public', 'projects', SLUG, 'renders', 'cover.png')));
  assert.ok(fs.existsSync(path.join(hub, 'content', 'projects.json')));
});

test('--check validates without writing', () => {
  const root = tempRoot();
  const hub = tempHub(root);
  copyFixture(root);
  runSync({ hubDir: hub, check: true, log: quiet });
  assert.equal(fs.existsSync(path.join(hub, 'content')), false);
  assert.equal(fs.existsSync(path.join(hub, 'public')), false);
});

test('two projects may not share an order value', () => {
  const root = tempRoot();
  const hub = tempHub(root, [SLUG, 'chart-rebuilds']);
  copyFixture(root);
  const other = copyFixture(root, 'chart-rebuilds');
  editJson(other, (j) => { j.order = 1; });
  assert.throws(() => runSync({ hubDir: hub, log: quiet }), /order 1 is already used/);
});

test('unknown flags are refused', () => {
  assert.throws(() => parseArgs(['--fixture']), /unknown argument/);
  assert.deepEqual(parseArgs(['--fixtures', '--check']), { fixtures: true, check: true });
});
