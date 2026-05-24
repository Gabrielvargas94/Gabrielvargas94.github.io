// Build cv.json (JSON Resume schema) per locale.
//
// Reads Content Collections frontmatter directly from src/content/{profile,
// experience,certifications,projects}/{en,es,pt}. NO email/phone fields per D9.
// LinkedIn is the only contact channel.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CONTENT = join(ROOT, 'src/content');
const DIST = join(ROOT, 'dist');

const LOCALES = ['en', 'es', 'pt'];

const EDUCATION = {
  en: {
    institution: 'Universidad Tecnológica Nacional',
    studyType: 'B.Sc.',
    area: 'Information Systems Engineering',
    note: 'coursework complete',
  },
  es: {
    institution: 'Universidad Tecnológica Nacional',
    studyType: 'Ing.',
    area: 'Sistemas de Información',
    note: 'cursada completa',
  },
  pt: {
    institution: 'Universidad Tecnológica Nacional',
    studyType: 'Bacharel',
    area: 'Engenharia de Sistemas de Informação',
    note: 'cursos concluídos',
  },
};

const SKILLS = {
  en: [
    {
      name: 'Leadership & Strategy',
      keywords: [
        'Engineering Leadership',
        'Team Scaling (8–60+ people)',
        'Roadmap Ownership',
        'OKRs',
        'Strategic Thinking',
        'Matrix Organization Navigation',
        'Architectural Strategy',
      ],
    },
    {
      name: 'Architecture & Cloud',
      keywords: [
        'Architectural Refactoring',
        'Microservices & APIs',
        'Microfrontends',
        'High-Concurrency Systems',
        'Distributed Systems',
        'AWS',
        'GCP',
        'High Availability',
        'Fault Tolerance',
        'Scalability',
      ],
    },
    {
      name: 'Cross-Functional Influence',
      keywords: [
        'C-Level Communication',
        'Stakeholder Negotiation',
        'Cross-functional Alignment',
        'Technical Strategy Presentation',
      ],
    },
    {
      name: 'Technologies',
      keywords: ['React Native', 'React', 'Vue', 'Angular', 'Golang', 'Java', 'Node.js'],
    },
    {
      name: 'Methodology & Culture',
      keywords: [
        'Agile / Scrum',
        'Results-Driven Execution',
        'AI-Assisted Development (Claude Code, GitHub Copilot, Cursor)',
        'Talent Development & Team Growth',
      ],
    },
  ],
  es: [
    {
      name: 'Liderazgo y Estrategia',
      keywords: [
        'Liderazgo de Ingeniería',
        'Escalado de Equipos (8–60+ personas)',
        'Ownership de Roadmap',
        'OKRs',
        'Pensamiento Estratégico',
        'Navegación de Organizaciones Matriciales',
        'Estrategia Arquitectónica',
      ],
    },
    {
      name: 'Arquitectura y Cloud',
      keywords: [
        'Refactorización Arquitectónica',
        'Microservicios y APIs',
        'Microfrontends',
        'Sistemas de Alta Concurrencia',
        'Sistemas Distribuidos',
        'AWS',
        'GCP',
        'Alta Disponibilidad',
        'Tolerancia a Fallos',
        'Escalabilidad',
      ],
    },
    {
      name: 'Influencia Transversal',
      keywords: [
        'Comunicación con C-Level',
        'Negociación con Stakeholders',
        'Alineación Interfuncional',
        'Presentación de Estrategia Técnica',
      ],
    },
    {
      name: 'Tecnologías',
      keywords: ['React Native', 'React', 'Vue', 'Angular', 'Golang', 'Java', 'Node.js'],
    },
    {
      name: 'Metodología y Cultura',
      keywords: [
        'Agile / Scrum',
        'Ejecución Orientada a Resultados',
        'Desarrollo Asistido por IA (Claude Code, GitHub Copilot, Cursor)',
        'Desarrollo de Talento y Crecimiento de Equipos',
      ],
    },
  ],
  pt: [
    {
      name: 'Liderança e Estratégia',
      keywords: [
        'Liderança de Engenharia',
        'Escala de Equipes (8–60+ pessoas)',
        'Ownership de Roadmap',
        'OKRs',
        'Pensamento Estratégico',
        'Navegação em Organizações Matriciais',
        'Estratégia Arquitetural',
      ],
    },
    {
      name: 'Arquitetura e Cloud',
      keywords: [
        'Refatoração Arquitetural',
        'Microsserviços e APIs',
        'Microfrontends',
        'Sistemas de Alta Concorrência',
        'Sistemas Distribuídos',
        'AWS',
        'GCP',
        'Alta Disponibilidade',
        'Tolerância a Falhas',
        'Escalabilidade',
      ],
    },
    {
      name: 'Influência Multifuncional',
      keywords: [
        'Comunicação com C-Level',
        'Negociação com Stakeholders',
        'Alinhamento Multifuncional',
        'Apresentação de Estratégia Técnica',
      ],
    },
    {
      name: 'Tecnologias',
      keywords: ['React Native', 'React', 'Vue', 'Angular', 'Golang', 'Java', 'Node.js'],
    },
    {
      name: 'Metodologia e Cultura',
      keywords: [
        'Agile / Scrum',
        'Execução Orientada a Resultados',
        'Desenvolvimento Assistido por IA (Claude Code, GitHub Copilot, Cursor)',
        'Desenvolvimento de Talentos e Crescimento de Equipes',
      ],
    },
  ],
};

const LANGUAGES = {
  en: [
    { language: 'Spanish', fluency: 'Native' },
    { language: 'English', fluency: 'Advanced (FCE B2)' },
    { language: 'Portuguese', fluency: 'Basic' },
  ],
  es: [
    { language: 'Español', fluency: 'Nativo' },
    { language: 'Inglés', fluency: 'Avanzado (FCE B2)' },
    { language: 'Portugués', fluency: 'Básico' },
  ],
  pt: [
    { language: 'Espanhol', fluency: 'Nativo' },
    { language: 'Inglês', fluency: 'Avançado (FCE B2)' },
    { language: 'Português', fluency: 'Básico' },
  ],
};

const COUNTRY_FROM_LOCATION = (loc) => {
  if (!loc) return undefined;
  if (/argentina/i.test(loc)) return 'AR';
  return undefined;
};

const CITY_FROM_LOCATION = (loc) => {
  if (!loc) return undefined;
  // "Buenos Aires, Argentina" → "Buenos Aires"
  const [first] = loc.split(',');
  return first?.trim();
};

/**
 * Parses a markdown file with YAML frontmatter into { data, body }.
 */
function parseFrontmatter(text) {
  const match = text.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/);
  if (!match) throw new Error('No frontmatter found');
  const data = yaml.load(match[1]);
  const body = match[2] ?? '';
  return { data, body };
}

function readCollection(baseDir) {
  if (!existsSync(baseDir)) return [];
  return readdirSync(baseDir)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((f) => {
      const text = readFileSync(join(baseDir, f), 'utf8');
      const { data, body } = parseFrontmatter(text);
      return { file: f, data, body };
    });
}

function readProfile(locale) {
  const path = join(CONTENT, 'profile', `${locale}.md`);
  const text = readFileSync(path, 'utf8');
  const { data, body } = parseFrontmatter(text);
  return { data, body };
}

function buildResume(locale) {
  const profile = readProfile(locale).data;
  const experiences = readCollection(join(CONTENT, 'experience', locale)).sort(
    (a, b) => a.data.order - b.data.order,
  );
  const certs = readCollection(join(CONTENT, 'certifications', locale)).sort((a, b) =>
    b.data.date.localeCompare(a.data.date),
  );
  const projects = readCollection(join(CONTENT, 'projects', locale)).filter(
    (p) => p.data.visibility === 'public',
  );

  const resume = {
    basics: {
      name: profile.name,
      label: profile.displayTitle,
      url: profile.linkedin,
      summary: profile.summary.trim(),
      location: {
        city: CITY_FROM_LOCATION(profile.location),
        countryCode: COUNTRY_FROM_LOCATION(profile.location),
      },
      profiles: [
        { network: 'LinkedIn', url: profile.linkedin },
        { network: 'GitHub', url: profile.github },
      ],
    },
    work: experiences.map((e) => {
      const entry = {
        name: e.data.company,
        position: e.data.title,
        startDate: e.data.startDate,
        highlights: e.data.bullets,
      };
      if (e.data.endDate) entry.endDate = e.data.endDate;
      if (e.data.location) entry.location = e.data.location;
      if (e.data.skills && e.data.skills.length > 0) entry.keywords = e.data.skills;
      return entry;
    }),
    education: [EDUCATION[locale]],
    skills: SKILLS[locale],
    languages: LANGUAGES[locale],
    certificates: certs.map((c) => {
      const entry = {
        name: c.data.name,
        date: c.data.date,
        issuer: c.data.issuer,
      };
      if (c.data.url) entry.url = c.data.url;
      if (c.data.status === 'in-progress') entry.status = 'in-progress';
      return entry;
    }),
    projects: projects.map((p) => ({
      name: p.data.name,
      description: p.data.summary.trim(),
      keywords: p.data.tech,
      highlights: p.data.highlights,
    })),
    meta: {
      canonical:
        locale === 'en'
          ? 'https://gabrielvargas94.github.io/cv.json'
          : `https://gabrielvargas94.github.io/${locale}/cv.json`,
      version: 'v1.0.0',
      lastModified: new Date().toISOString(),
      language: locale,
    },
  };

  return resume;
}

function writeJson(locale, data) {
  const outPath =
    locale === 'en' ? join(DIST, 'cv.json') : join(DIST, locale, 'cv.json');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf8');
  return outPath;
}

for (const locale of LOCALES) {
  const resume = buildResume(locale);
  const out = writeJson(locale, resume);
  process.stdout.write(`[cv-json] wrote ${out}\n`);
}
