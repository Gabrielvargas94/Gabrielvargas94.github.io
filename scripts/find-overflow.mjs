// Spins up the static `dist/` via a tiny http server, drives Playwright at
// 430×932 (iPhone 14 Pro Max), and reports any element whose bounding box
// extends past the viewport — exposing the source of horizontal scroll.
import { chromium } from 'playwright';
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';

const ROOT = resolve('dist');
const PORT = 4321;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};

const server = http.createServer(async (req, res) => {
  let urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let filePath = join(ROOT, urlPath);
  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = join(filePath, 'index.html');
  } else if (!existsSync(filePath)) {
    filePath = join(filePath + '.html');
  }
  if (!existsSync(filePath)) {
    res.writeHead(404);
    res.end('not found');
    return;
  }
  const body = await readFile(filePath);
  res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] ?? 'application/octet-stream' });
  res.end(body);
});

await new Promise((r) => server.listen(PORT, r));

// Temporarily strip the document-level overflow guard so we can see the real
// offenders (the clip was masking horizontal scroll but still letting some
// elements escape, which the user perceives as drag-scrollable on mobile).
const stripClip = `*, html, body { overflow-x: visible !important; }`;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 430, height: 932 } });
const page = await ctx.newPage();
page.on('pageerror', (err) => console.error('[pageerror]', err.message));
const paths = ['/', '/es/', '/pt/', '/cv/', '/es/cv/', '/pt/cv/'];
for (const path of paths) {
  await page.goto(`http://127.0.0.1:${PORT}${path}`, { waitUntil: 'networkidle' });
  // Force scroll through page to trigger YT iframe injection via the
  // IntersectionObserver, then wait for them to settle.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 80));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(500);
  // Skip the strip — we want to see scrollable containers as-is.

const result = await page.evaluate(() => {
  const vw = window.innerWidth;
  const docW = document.documentElement.scrollWidth;
  const bodyW = document.body.scrollWidth;
  const out = [];
  // Look for any element whose scrollWidth > clientWidth — that means it
  // has internal overflow content, which on mobile can register as
  // touch-scroll horizontally even if document-level scrollWidth is fine.
  for (const el of document.querySelectorAll('*')) {
    if (el.tagName === 'IFRAME') continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    const cs = getComputedStyle(el);
    const internalOverflow = el.scrollWidth - el.clientWidth;
    const escapesViewport = r.right > vw + 1;
    if (internalOverflow > 1 || escapesViewport) {
      out.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.getAttribute('class') ?? '').slice(0, 100),
        id: el.id || '',
        right: Math.round(r.right),
        width: Math.round(r.width),
        scrollW: el.scrollWidth,
        clientW: el.clientWidth,
        overflowX: cs.overflowX,
        position: cs.position,
        escapesViewport,
      });
    }
  }
  return { vw, docW, bodyW, offenders: out };
});

console.log('=== ' + path + ' ===');
console.log('viewport:', result.vw, 'docScrollW:', result.docW, 'bodyScrollW:', result.bodyW);
// Now flag elements with overflow-x: auto / scroll — those create touch-scroll
// regions on iOS even if document scrollWidth = viewport.
const touchScrollers = result.offenders.filter((o) => (o.overflowX === 'auto' || o.overflowX === 'scroll') && o.scrollW > o.clientW);
console.log('TOUCH-SCROLLABLE regions (overflow-x: auto/scroll with content overflow):', touchScrollers.length);
for (const o of touchScrollers) {
  console.log(`  scrollW=${o.scrollW} clientW=${o.clientW}  ${o.tag}.${o.cls.split(' ').slice(0, 2).join('.')}  ${o.id ? '#' + o.id : ''}`);
}
const internalScrollers = result.offenders.filter((o) => o.scrollW - o.clientW > 1 && o.overflowX !== 'hidden' && o.overflowX !== 'clip');
console.log('internal scrollers (scrollW > clientW, NOT clipped):', internalScrollers.length);
for (const o of internalScrollers.slice(0, 20)) {
  console.log(`  scrollW=${o.scrollW} clientW=${o.clientW} overflow-x=${o.overflowX}  ${o.tag}.${o.cls.split(' ').slice(0, 2).join('.')}  ${o.id ? '#' + o.id : ''}`);
}
const escapers = result.offenders.filter((o) => o.escapesViewport && o.overflowX !== 'hidden' && o.overflowX !== 'clip').slice(0, 10);
if (escapers.length) {
  console.log('escapers (right > viewport):');
  for (const o of escapers) {
    console.log(`  right=${o.right}  ${o.tag}.${o.cls.split(' ').slice(0, 2).join('.')}  ${o.id ? '#' + o.id : ''}  pos=${o.position}`);
  }
}
}

await browser.close();
server.close();
