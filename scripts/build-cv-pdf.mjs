// Build cv.pdf per locale via Playwright (tagged: true → a11y PDF tags).
//
// 1. Start http-server serving dist/ on a free port.
// 2. Navigate Chromium to each /cv-print/ page.
// 3. Emit dist/cv.pdf + dist/{locale}/cv.pdf.

import { spawn } from 'node:child_process';
import { mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const PORT = 4322;

const LOCALES = ['en', 'es', 'pt'];

function waitForServer(url, attempts = 60) {
  return new Promise((resolve, reject) => {
    let tries = 0;
    const interval = setInterval(async () => {
      tries += 1;
      try {
        const res = await fetch(url);
        if (res.ok || res.status === 404) {
          clearInterval(interval);
          resolve();
          return;
        }
      } catch {
        // server not yet up
      }
      if (tries >= attempts) {
        clearInterval(interval);
        reject(new Error(`Server not reachable at ${url} after ${attempts} attempts`));
      }
    }, 250);
  });
}

if (!existsSync(DIST)) {
  throw new Error(`dist/ not found; run astro build first (looked at ${DIST})`);
}

const serverBin = join(
  ROOT,
  'node_modules',
  'http-server',
  'bin',
  'http-server',
);
const server = spawn(
  process.execPath,
  [serverBin, DIST, '-p', String(PORT), '-s', '--cors'],
  { stdio: 'ignore' },
);

process.on('exit', () => {
  if (!server.killed) server.kill();
});

try {
  await waitForServer(`http://127.0.0.1:${PORT}/`);

  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const locale of LOCALES) {
    const prefix = locale === 'en' ? '' : `${locale}/`;
    const url = `http://127.0.0.1:${PORT}/${prefix}cv-print/`;
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.emulateMedia({ media: 'print' });
    const outPath = locale === 'en' ? join(DIST, 'cv.pdf') : join(DIST, locale, 'cv.pdf');
    mkdirSync(dirname(outPath), { recursive: true });
    await page.pdf({
      path: outPath,
      format: 'A4',
      margin: { top: '16mm', bottom: '16mm', left: '14mm', right: '14mm' },
      printBackground: true,
      tagged: true,
    });
    process.stdout.write(`[cv-pdf] wrote ${outPath}\n`);
  }

  await browser.close();
} finally {
  server.kill();
}
