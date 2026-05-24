import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const SCHEMA_URL = 'https://raw.githubusercontent.com/jsonresume/resume-schema/master/schema.json';

async function main() {
  const schema = await fetch(SCHEMA_URL).then((r) => r.json());
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);

  const locales = ['', 'es/', 'pt/'];
  for (const l of locales) {
    const path = join(ROOT, 'dist', l, 'cv.json');
    const cv = JSON.parse(readFileSync(path, 'utf8'));
    const ok = validate(cv);
    const label = l || 'en';
    if (ok) {
      console.log(`✓ ${label}/cv.json valid (work=${cv.work.length}, certs=${cv.certificates.length}, has_email=${'email' in cv.basics})`);
    } else {
      console.log(`✗ ${label}/cv.json INVALID`);
      console.log(JSON.stringify(validate.errors, null, 2));
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
