// Build llms.txt + llms-full.txt per locale (llmstxt.org format).
//
// llms.txt — short manifest with links to deep content.
// llms-full.txt — single fetch concatenation: profile + experience + certs +
// projects + skills. Plain text, no markup overhead. ~4-6KB.
//
// EN at dist/, ES/PT under dist/{locale}/.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CONTENT = join(ROOT, 'src/content');
const DIST = join(ROOT, 'dist');

const LOCALES = ['en', 'es', 'pt'];

const HEADINGS = {
  en: {
    title: 'Gabriel Vargas — Head of Engineering',
    cv: 'CV',
    experience: 'Experience',
    aiWork: 'AI work',
    profile: 'Profile',
    summary: 'Summary',
    achievements: 'Selected Achievements',
    certifications: 'Certifications',
    projects: 'Projects',
    skills: 'Core Skills',
    languages: 'Languages',
    aiLectures: 'Lectures & talks',
    aiClaudeCode: 'Claude Code adoption at itti',
    aiSideProject: 'Side project: D&D AI companion',
    aiCertifications: 'Certifications (Anthropic)',
    full: 'Markdown',
    json: 'JSON Resume',
    pdf: 'PDF',
    present: 'Present',
  },
  es: {
    title: 'Gabriel Vargas — Head of Engineering',
    cv: 'CV',
    experience: 'Experiencia',
    aiWork: 'Trabajo en IA',
    profile: 'Perfil',
    summary: 'Resumen',
    achievements: 'Logros Seleccionados',
    certifications: 'Certificaciones',
    projects: 'Proyectos',
    skills: 'Habilidades Principales',
    languages: 'Idiomas',
    aiLectures: 'Charlas y conferencias',
    aiClaudeCode: 'Adopción de Claude Code en itti',
    aiSideProject: 'Proyecto personal: D&D AI companion',
    aiCertifications: 'Certificaciones (Anthropic)',
    full: 'Markdown',
    json: 'JSON Resume',
    pdf: 'PDF',
    present: 'Presente',
  },
  pt: {
    title: 'Gabriel Vargas — Head of Engineering',
    cv: 'CV',
    experience: 'Experiência',
    aiWork: 'Trabalho em IA',
    profile: 'Perfil',
    summary: 'Resumo',
    achievements: 'Conquistas Selecionadas',
    certifications: 'Certificações',
    projects: 'Projetos',
    skills: 'Habilidades Principais',
    languages: 'Idiomas',
    aiLectures: 'Palestras e talks',
    aiClaudeCode: 'Adoção de Claude Code na itti',
    aiSideProject: 'Projeto pessoal: D&D AI companion',
    aiCertifications: 'Certificações (Anthropic)',
    full: 'Markdown',
    json: 'JSON Resume',
    pdf: 'PDF',
    present: 'Presente',
  },
};

const TAGLINE = {
  en: 'Engineering leader (6+ yrs). itti, ex-Mercado Libre, ex-IADB. AI-first transformations, Claude Code rollouts, architectural redesigns. Based Buenos Aires, open to remote + relocation.',
  es: 'Líder de ingeniería (6+ años). itti, ex-Mercado Libre, ex-BID. Transformaciones AI-first, despliegues de Claude Code, rediseños arquitectónicos. Buenos Aires, abierto a remoto + relocalización.',
  pt: 'Líder de engenharia (6+ anos). itti, ex-Mercado Libre, ex-BID. Transformações AI-first, adoções de Claude Code, redesenhos arquiteturais. Buenos Aires, aberto a remoto + relocação.',
};

const SKILL_SECTIONS = {
  en: [
    'Leadership & Strategy: Engineering Leadership, Team Scaling (8–60+ people), Roadmap Ownership, OKRs, Strategic Thinking, Matrix Organization Navigation, Architectural Strategy.',
    'Architecture & Cloud: Architectural Refactoring, Microservices & APIs, Microfrontends, High-Concurrency Systems, Distributed Systems, AWS, GCP, High Availability, Fault Tolerance, Scalability.',
    'Cross-Functional Influence: C-Level Communication, Stakeholder Negotiation, Cross-functional Alignment, Technical Strategy Presentation.',
    'Technologies: React Native, React, Vue, Angular, Golang, Java, Node.js.',
    'Methodology & Culture: Agile / Scrum, Results-Driven Execution, AI-Assisted Development (Claude Code, GitHub Copilot, Cursor), Talent Development & Team Growth.',
  ],
  es: [
    'Liderazgo y Estrategia: Liderazgo de Ingeniería, Escalado de Equipos (8–60+ personas), Ownership de Roadmap, OKRs, Pensamiento Estratégico, Navegación de Organizaciones Matriciales, Estrategia Arquitectónica.',
    'Arquitectura y Cloud: Refactorización Arquitectónica, Microservicios y APIs, Microfrontends, Sistemas de Alta Concurrencia, Sistemas Distribuidos, AWS, GCP, Alta Disponibilidad, Tolerancia a Fallos, Escalabilidad.',
    'Influencia Transversal: Comunicación con C-Level, Negociación con Stakeholders, Alineación Interfuncional, Presentación de Estrategia Técnica.',
    'Tecnologías: React Native, React, Vue, Angular, Golang, Java, Node.js.',
    'Metodología y Cultura: Agile / Scrum, Ejecución Orientada a Resultados, Desarrollo Asistido por IA (Claude Code, GitHub Copilot, Cursor), Desarrollo de Talento y Crecimiento de Equipos.',
  ],
  pt: [
    'Liderança e Estratégia: Liderança de Engenharia, Escala de Equipes (8–60+ pessoas), Ownership de Roadmap, OKRs, Pensamento Estratégico, Navegação em Organizações Matriciais, Estratégia Arquitetural.',
    'Arquitetura e Cloud: Refatoração Arquitetural, Microsserviços e APIs, Microfrontends, Sistemas de Alta Concorrência, Sistemas Distribuídos, AWS, GCP, Alta Disponibilidade, Tolerância a Falhas, Escalabilidade.',
    'Influência Multifuncional: Comunicação com C-Level, Negociação com Stakeholders, Alinhamento Multifuncional, Apresentação de Estratégia Técnica.',
    'Tecnologias: React Native, React, Vue, Angular, Golang, Java, Node.js.',
    'Metodologia e Cultura: Agile / Scrum, Execução Orientada a Resultados, Desenvolvimento Assistido por IA (Claude Code, GitHub Copilot, Cursor), Desenvolvimento de Talentos e Crescimento de Equipes.',
  ],
};

const LANGS = {
  en: ['Spanish: Native', 'English: Advanced (FCE B2)', 'Portuguese: Basic'],
  es: ['Español: Nativo', 'Inglés: Avanzado (FCE B2)', 'Portugués: Básico'],
  pt: ['Espanhol: Nativo', 'Inglês: Avançado (FCE B2)', 'Português: Básico'],
};

const OPEN_TO_JOIN = { en: ' & ', es: ' y ', pt: ' e ' };

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
  return parseFrontmatter(text);
}

function localePrefix(locale) {
  return locale === 'en' ? '' : `/${locale}`;
}

function buildLlmsShort(locale) {
  const profile = readProfile(locale).data;
  const h = HEADINGS[locale];
  const prefix = localePrefix(locale);

  const lines = [];
  lines.push(`# ${h.title}`, '');
  lines.push(`> ${TAGLINE[locale]}`, '');

  lines.push(`## ${h.cv}`);
  lines.push(`- [Full CV (${h.full})](${prefix}/cv.md)`);
  lines.push(`- [${h.json}](${prefix}/cv.json)`);
  lines.push(`- [${h.pdf}](${prefix}/cv.pdf)`);
  lines.push('');

  lines.push(`## ${h.experience}`);
  const experiences = readCollection(join(CONTENT, 'experience', locale)).sort(
    (a, b) => a.data.order - b.data.order,
  );
  for (const e of experiences) {
    lines.push(`- [${e.data.company} — ${e.data.title}](${prefix}/cv.md#${e.data.slug})`);
  }
  lines.push('');

  lines.push(`## ${h.aiWork}`);
  lines.push(`- [${h.aiClaudeCode}](${prefix}/#itti-ai)`);
  lines.push(`- [${h.aiLectures}](${prefix}/#lectures)`);
  lines.push(`- [${h.aiSideProject}](${prefix}/#side-project)`);
  lines.push(`- [${h.aiCertifications}](${prefix}/#certs)`);
  lines.push('');

  lines.push(`## ${h.profile}`);
  lines.push(`- LinkedIn: ${profile.linkedin}`);
  lines.push(`- GitHub: ${profile.github}`);
  lines.push('');

  return lines.join('\n');
}

function buildLlmsFull(locale) {
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

  const h = HEADINGS[locale];
  const openTo = profile.openTo.join(OPEN_TO_JOIN[locale]);

  const lines = [];
  lines.push(`# ${profile.name} — ${profile.displayTitle}`, '');
  lines.push(`${profile.location} · Open to ${openTo}`);
  lines.push(`LinkedIn: ${profile.linkedin}`);
  lines.push(`GitHub: ${profile.github}`, '');

  lines.push(`## ${h.summary}`);
  lines.push(profile.summary.trim(), '');

  lines.push(`## ${h.achievements}`);
  for (const a of profile.achievements) lines.push(`- ${a}`);
  lines.push('');

  lines.push(`## ${h.experience}`, '');
  for (const e of experiences) {
    const endDate = e.data.endDate ?? h.present;
    const meta = e.data.location
      ? `${e.data.startDate} – ${endDate} · ${e.data.location}`
      : `${e.data.startDate} – ${endDate}`;
    lines.push(`### ${e.data.company} — ${e.data.title}`);
    lines.push(meta);
    for (const b of e.data.bullets) lines.push(`- ${b}`);
    if (e.data.skills && e.data.skills.length > 0) {
      lines.push(`Skills: ${e.data.skills.join(', ')}`);
    }
    lines.push('');
  }

  lines.push(`## ${h.certifications}`);
  for (const c of certs) {
    const status = c.data.status === 'in-progress' ? ' [in progress]' : '';
    lines.push(`- ${c.data.name} — ${c.data.issuer} (${c.data.date})${status}`);
  }
  lines.push('');

  if (projects.length > 0) {
    lines.push(`## ${h.projects}`, '');
    for (const p of projects) {
      lines.push(`### ${p.data.name}`);
      lines.push(p.data.summary.trim());
      if (p.data.tech && p.data.tech.length > 0) {
        lines.push(`Tech: ${p.data.tech.join(', ')}`);
      }
      for (const hl of p.data.highlights) lines.push(`- ${hl}`);
      lines.push('');
    }
  }

  lines.push(`## ${h.skills}`);
  for (const s of SKILL_SECTIONS[locale]) lines.push(`- ${s}`);
  lines.push('');

  lines.push(`## ${h.languages}`);
  for (const l of LANGS[locale]) lines.push(`- ${l}`);
  lines.push('');

  return lines.join('\n');
}

function writeFile(locale, name, content) {
  const outDir = locale === 'en' ? DIST : join(DIST, locale);
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, name);
  writeFileSync(outPath, content, 'utf8');
  return outPath;
}

for (const locale of LOCALES) {
  const shortOut = writeFile(locale, 'llms.txt', buildLlmsShort(locale));
  const fullOut = writeFile(locale, 'llms-full.txt', buildLlmsFull(locale));
  process.stdout.write(`[llms] wrote ${shortOut}\n[llms] wrote ${fullOut}\n`);
}
