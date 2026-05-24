// Build OG images (1200×630 PNG) per locale via satori-html + satori + resvg-js.
//
// Outputs:
//   dist/og/en.png
//   dist/es/og/es.png
//   dist/pt/og/pt.png

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');

const LOCALES = ['en', 'es', 'pt'];

const HEADLINE = {
  en: 'Building AI-first engineering teams',
  es: 'Construyendo equipos de ingeniería AI-first',
  pt: 'Construindo times de engenharia AI-first',
};

const NAME = 'Gabriel Vargas';
const ROLE = 'Head of Engineering';
const LOCATION = 'Buenos Aires · Open to Remote & Relocation';

const PALETTE = {
  cream: '#f7f2e8',
  ink: '#2a211b',
  ink2: '#4d4036',
  accent: '#c97a4b',
  accentDark: '#9c5e36',
};

function findFontBuffer() {
  const expected = join(
    ROOT,
    'node_modules',
    '@fontsource',
    'newsreader',
    'files',
    'newsreader-latin-500-normal.woff',
  );
  if (existsSync(expected)) return readFileSync(expected);

  // Fallback: walk @fontsource/newsreader and return the first woff/woff2 we find.
  const base = join(ROOT, 'node_modules', '@fontsource', 'newsreader');
  function walk(dir) {
    if (!existsSync(dir)) return null;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        const hit = walk(full);
        if (hit) return hit;
      } else if (/\.woff2?$/.test(entry.name)) {
        return full;
      }
    }
    return null;
  }
  const found = walk(base);
  if (found) return readFileSync(found);
  throw new Error('No Newsreader font file found under node_modules/@fontsource/newsreader');
}

function template(locale) {
  const headline = HEADLINE[locale];
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        width: '1200px',
        height: '630px',
        background: PALETTE.cream,
        color: PALETTE.ink,
        padding: '64px 80px',
        fontFamily: 'Newsreader',
        position: 'relative',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              height: '12px',
              background: PALETTE.accent,
            },
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              marginTop: '24px',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '36px',
                    color: PALETTE.accentDark,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  },
                  children: NAME,
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '90px',
                    lineHeight: '1.05',
                    color: PALETTE.ink,
                    fontWeight: 500,
                  },
                  children: headline,
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginTop: 'auto',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '34px',
                    color: PALETTE.ink2,
                    fontStyle: 'italic',
                  },
                  children: ROLE,
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '26px',
                    color: PALETTE.ink2,
                  },
                  children: LOCATION,
                },
              },
            ],
          },
        },
      ],
    },
  };
}

async function renderPng(locale, fontBuffer) {
  const svg = await satori(template(locale), {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Newsreader',
        data: fontBuffer,
        weight: 500,
        style: 'normal',
      },
    ],
  });
  const resvg = new Resvg(svg, { background: PALETTE.cream });
  return resvg.render().asPng();
}

function outPath(locale) {
  if (locale === 'en') return join(DIST, 'og', 'en.png');
  return join(DIST, locale, 'og', `${locale}.png`);
}

const fontBuffer = findFontBuffer();
for (const locale of LOCALES) {
  const png = await renderPng(locale, fontBuffer);
  const target = outPath(locale);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, png);
  process.stdout.write(`[og] wrote ${target}\n`);
}
