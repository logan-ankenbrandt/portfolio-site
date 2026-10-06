#!/usr/bin/env node
// Browser checks for the built site, through headless Chrome's DevTools protocol on a pipe (no extra packages).
// macOS. Serve the export first in another terminal: npm run build && npm run preview
//   node scripts/check-browser.mjs [base-url]
// Checks: no horizontal scroll at 390 px on every page, the before/after tabs by mouse and keyboard,
// the overlay toggle by mouse and keyboard, both panels side by side at 1280 px, and alt text on every image.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import { HUB_DIR } from './sync-projects.mjs';

const BASE = process.argv[2] ?? 'http://127.0.0.1:4173';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PROFILE = '/tmp/claude-501/chrome-profile-hub-cdp';

const chrome = spawn(
  CHROME,
  ['--headless=new', '--remote-debugging-pipe', '--use-mock-keychain', '--password-store=basic',
    `--user-data-dir=${PROFILE}`, '--no-first-run', '--disable-background-networking', '--disable-component-update',
    '--disable-sync', '--disable-extensions', '--hide-scrollbars', 'about:blank'],
  { stdio: ['ignore', 'ignore', 'ignore', 'pipe', 'pipe'] },
);

let nextId = 0;
const pending = new Map();
let buffer = '';
chrome.stdio[4].on('data', (chunk) => {
  buffer += chunk.toString('utf8');
  let end;
  while ((end = buffer.indexOf('\0')) >= 0) {
    const msg = JSON.parse(buffer.slice(0, end));
    buffer = buffer.slice(end + 1);
    const waiter = msg.id !== undefined && pending.get(msg.id);
    if (!waiter) continue;
    pending.delete(msg.id);
    if (msg.error) waiter.reject(new Error(`${waiter.method}: ${msg.error.message}`));
    else waiter.resolve(msg.result);
  }
});

function send(method, params = {}, sessionId) {
  const id = ++nextId;
  chrome.stdio[3].write(`${JSON.stringify({ id, method, params, sessionId })}\0`);
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject, method }));
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
function check(name, ok, detail = '') {
  results.push(ok);
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`);
}

async function main() {
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  const cdp = (method, params) => send(method, params, sessionId);
  const evaluate = async (expression) => {
    const r = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error(`${r.exceptionDetails.text}: ${expression.slice(0, 80)}`);
    return r.result.value;
  };
  const viewport = (width, height = 900) =>
    cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 768 });
  const open = async (path) => {
    await cdp('Page.navigate', { url: `${BASE}${path}` });
    for (let i = 0; i < 100; i++) {
      await wait(100);
      // Ready when the document has loaded and React has hydrated (a fiber key appears on the body's elements).
      const ready = await evaluate(
        "document.readyState === 'complete' && [...document.querySelectorAll('button')].every((b) => Object.keys(b).some((k) => k.startsWith('__react')))",
      );
      if (ready) return;
    }
    throw new Error(`timed out loading ${path}`);
  };
  const key = async (k, code, vk) => {
    await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: k, code, windowsVirtualKeyCode: vk });
    await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code, windowsVirtualKeyCode: vk });
    await wait(50);
  };
  await cdp('Page.enable');
  await cdp('Runtime.enable');

  const { projects } = JSON.parse(fs.readFileSync(path.join(HUB_DIR, 'content', 'projects.json'), 'utf8'));
  const pages = ['/', '/one-pager/', ...projects.map((p) => `/projects/${p.portfolio.slug}/`)];

  for (const path of pages) {
    await viewport(390);
    await open(path);
    const width = await evaluate('document.documentElement.scrollWidth');
    check(`${path} has no horizontal scroll at 390 px`, width <= 390, `scrollWidth ${width}`);
    const missing = await evaluate("[...document.images].filter((i) => !i.getAttribute('alt')).map((i) => i.src)");
    check(`${path} gives every image alt text`, missing.length === 0, missing.join(', '));
    // Every image and download link must resolve on the server, including lazy images not yet loaded.
    const broken = await evaluate(`Promise.all(
      [...[...document.images].map((i) => i.src), ...[...document.querySelectorAll('a[download]')].map((a) => a.href)]
        .map((u) => fetch(u, { method: 'HEAD' }).then((r) => (r.ok ? null : u + ' ' + r.status)))
    ).then((all) => all.filter(Boolean))`);
    const count = await evaluate("document.images.length + document.querySelectorAll('a[download]').length");
    check(`${path} serves all ${count} images and downloads`, broken.length === 0, broken.join(', '));
  }

  // Tabs at phone width, on the home page hero.
  await viewport(390);
  await open('/');
  const tabState = () =>
    evaluate(`(() => {
      const tabs = [...document.querySelectorAll('[role=tab]')].slice(0, 2);
      const panels = tabs.map((t) => document.getElementById(t.getAttribute('aria-controls')));
      return {
        selected: tabs.map((t) => t.getAttribute('aria-selected')),
        visible: panels.map((p) => p.offsetParent !== null),
        focused: tabs.indexOf(document.activeElement),
      };
    })()`);
  let s = await tabState();
  check('hero opens on the After tab', s.selected.join() === 'false,true' && s.visible.join() === 'false,true', JSON.stringify(s));
  await evaluate("document.querySelector('[role=tab]').click()");
  await wait(50);
  s = await tabState();
  check('clicking Before shows the source image', s.selected.join() === 'true,false' && s.visible.join() === 'true,false', JSON.stringify(s));
  await evaluate("document.querySelector('[role=tab]').focus()");
  await key('ArrowRight', 'ArrowRight', 39);
  s = await tabState();
  check('ArrowRight moves to After and focuses it', s.selected.join() === 'false,true' && s.focused === 1, JSON.stringify(s));
  await key('Home', 'Home', 36);
  s = await tabState();
  check('Home moves back to Before', s.selected.join() === 'true,false' && s.focused === 0, JSON.stringify(s));

  // Overlay toggle, on the first project page that has one.
  const withOverlay = projects.find((p) => p.portfolio.items.some((i) => i.overlay && i.source));
  if (withOverlay) {
    const item = withOverlay.portfolio.items.find((i) => i.overlay && i.source);
    await viewport(1280);
    await open(`/projects/${withOverlay.portfolio.slug}/`);
    const overlayState = () =>
      evaluate(`(() => {
        const article = document.getElementById(${JSON.stringify(item.id)});
        const button = article.querySelector('button[aria-pressed]');
        const panel = article.querySelector('[id$="-panel-after"]');
        return { pressed: button.getAttribute('aria-pressed'), src: panel.querySelector('img').getAttribute('src') };
      })()`);
    let o = await overlayState();
    check('overlay starts off and shows the rebuild', o.pressed === 'false' && o.src.endsWith(item.after.image), JSON.stringify(o));
    await evaluate(`document.getElementById(${JSON.stringify(item.id)}).querySelector('button[aria-pressed]').click()`);
    await wait(50);
    o = await overlayState();
    check('clicking the toggle shows the overlay', o.pressed === 'true' && o.src.endsWith(item.overlay), JSON.stringify(o));
    await evaluate(`document.getElementById(${JSON.stringify(item.id)}).querySelector('button[aria-pressed]').focus()`);
    await key(' ', 'Space', 32);
    o = await overlayState();
    check('Space on the focused toggle turns the overlay off', o.pressed === 'false' && o.src.endsWith(item.after.image), JSON.stringify(o));

    const desk = await evaluate(`(() => {
      const article = document.getElementById(${JSON.stringify(item.id)});
      const tablist = article.querySelector('[role=tablist]');
      const panels = [...article.querySelectorAll('[role=tabpanel]')];
      const boxes = panels.map((p) => p.getBoundingClientRect());
      return { tablistHidden: tablist.offsetParent === null, bothVisible: panels.every((p) => p.offsetParent !== null), sideBySide: boxes[1].left > boxes[0].right - 1 };
    })()`);
    check('at 1280 px both images sit side by side with no tabs', desk.tablistHidden && desk.bothVisible && desk.sideBySide, JSON.stringify(desk));
  } else {
    check('a project item with an overlay exists to test the toggle', false);
  }

  const failed = results.filter((ok) => !ok).length;
  console.log(`\n${results.length - failed} passed, ${failed} failed`);
  return failed;
}

main()
  .then(async (failed) => {
    await send('Browser.close').catch(() => {});
    chrome.kill();
    process.exit(failed ? 1 : 0);
  })
  .catch((err) => {
    console.error(err.message);
    chrome.kill();
    process.exit(1);
  });
