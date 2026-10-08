#!/usr/bin/env node
// Full-page screenshots of long pages, cut into segments, through headless Chrome's DevTools protocol on a pipe.
// screenshots.sh takes each page in one shot, which Chrome cannot do past about 16,000 px. The project pages
// with real logs are longer than that at 390 px. macOS. Serve the export first: npm run build && npm run preview
//   node scripts/screenshots-long.mjs [outdir] [path ...]
// Writes <outdir>/<name>-<width>-<n>.png, each at most 2000 px tall, for widths 390 and 1280.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE ?? 'http://127.0.0.1:4173';
const OUT = process.argv[2] ?? 'scratch/screenshots';
const PATHS = process.argv.length > 3 ? process.argv.slice(3) : ['/'];
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PROFILE = '/tmp/claude-501/chrome-profile-hub-long';
const SEGMENT = 2000;

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

async function main() {
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  const cdp = (method, params) => send(method, params, sessionId);
  const evaluate = async (expression) => {
    const r = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error(`${r.exceptionDetails.text}: ${expression.slice(0, 80)}`);
    return r.result.value;
  };
  await cdp('Page.enable');
  await cdp('Runtime.enable');
  fs.mkdirSync(OUT, { recursive: true });

  for (const page of PATHS) {
    const name = page.replace(/^\/|\/$/g, '').replace(/\//g, '-') || 'home';
    for (const width of [390, 1280]) {
      await cdp('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 });
      await cdp('Page.navigate', { url: `${BASE}${page}` });
      await wait(400);
      // Load lazy images before measuring, so the page height is final.
      await evaluate("Promise.all([...document.images].map((i) => { i.loading = 'eager'; return i.decode().catch(() => null); }))");
      await evaluate('document.fonts.ready.then(() => true)');
      const height = await evaluate('document.documentElement.scrollHeight');
      let n = 0;
      for (let y = 0; y < height; y += SEGMENT) {
        const clip = { x: 0, y, width, height: Math.min(SEGMENT, height - y), scale: 1 };
        const { data } = await cdp('Page.captureScreenshot', { format: 'png', clip, captureBeyondViewport: true });
        const file = path.join(OUT, `${name}-${width}-${n++}.png`);
        fs.writeFileSync(file, Buffer.from(data, 'base64'));
      }
      console.log(`${page} at ${width} px: ${height} px tall, ${n} segments`);
    }
  }
}

main()
  .catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  })
  .finally(() => chrome.kill());
