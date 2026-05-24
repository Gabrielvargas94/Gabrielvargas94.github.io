import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = join(process.cwd(), 'dist');

function walk(dir: string, acc: string[] = []): string[] {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

test('no email leak in any public artifact', () => {
  const files = walk(DIST).filter((p) => /\.(html|md|json|txt|xml)$/i.test(p));
  const emailRe = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
  const leaks: string[] = [];
  for (const f of files) {
    const content = readFileSync(f, 'utf8');
    const m = content.match(emailRe);
    if (m) leaks.push(`${f}: ${m[0]}`);
  }
  expect(leaks).toEqual([]);
});

interface JsonResume {
  basics: { name: string; label: string; url: string; email?: string; phone?: string };
  work: unknown[];
  certificates: unknown[];
}

test('cv.json is valid JSON Resume (basics, work, certificates)', () => {
  const data = JSON.parse(readFileSync(join(DIST, 'cv.json'), 'utf8')) as JsonResume;
  expect(data.basics.name).toBe('Gabriel Vargas');
  expect(data.basics.label).toBe('Head of Engineering');
  expect(data.basics.url).toContain('linkedin.com');
  expect('email' in data.basics).toBe(false);
  expect('phone' in data.basics).toBe(false);
  expect(Array.isArray(data.work)).toBe(true);
  expect(data.work.length).toBeGreaterThanOrEqual(8);
  expect(Array.isArray(data.certificates)).toBe(true);
  expect(data.certificates.length).toBeGreaterThanOrEqual(9);
});

test('llms.txt exists and references CV endpoints', () => {
  const text = readFileSync(join(DIST, 'llms.txt'), 'utf8');
  expect(text).toContain('Gabriel Vargas');
  expect(text).toContain('Head of Engineering');
  expect(text).toContain('/cv.md');
  expect(text).toContain('/cv.json');
  expect(text).toContain('/cv.pdf');
});

test('cv.pdf exists for all locales (>10KB each)', () => {
  expect(statSync(join(DIST, 'cv.pdf')).size).toBeGreaterThan(10_000);
  expect(statSync(join(DIST, 'es', 'cv.pdf')).size).toBeGreaterThan(10_000);
  expect(statSync(join(DIST, 'pt', 'cv.pdf')).size).toBeGreaterThan(10_000);
});

test('OG images exist for all locales (>5KB each)', () => {
  expect(statSync(join(DIST, 'og', 'en.png')).size).toBeGreaterThan(5_000);
  expect(statSync(join(DIST, 'es', 'og', 'es.png')).size).toBeGreaterThan(5_000);
  expect(statSync(join(DIST, 'pt', 'og', 'pt.png')).size).toBeGreaterThan(5_000);
});
