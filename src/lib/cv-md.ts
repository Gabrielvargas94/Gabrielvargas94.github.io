import { getCollection, getEntry } from 'astro:content';
import type { Locale } from './i18n';

interface SectionLabels {
  summary: string;
  achievements: string;
  exp: string;
  edu: string;
  skills: string;
  certs: string;
  langs: string;
}

const HEADINGS: Record<Locale, SectionLabels> = {
  en: {
    summary: 'Summary',
    achievements: 'Selected Achievements',
    exp: 'Experience',
    edu: 'Education',
    skills: 'Core Skills',
    certs: 'Certifications',
    langs: 'Languages',
  },
  es: {
    summary: 'Resumen',
    achievements: 'Logros Seleccionados',
    exp: 'Experiencia',
    edu: 'Educación',
    skills: 'Habilidades Principales',
    certs: 'Certificaciones',
    langs: 'Idiomas',
  },
  pt: {
    summary: 'Resumo',
    achievements: 'Conquistas Selecionadas',
    exp: 'Experiência',
    edu: 'Educação',
    skills: 'Habilidades Principais',
    certs: 'Certificações',
    langs: 'Idiomas',
  },
};

const PRESENT: Record<Locale, string> = { en: 'Present', es: 'Presente', pt: 'Presente' };
const OPEN_TO_LABEL: Record<Locale, string> = { en: 'Open to', es: 'Abierto a', pt: 'Aberto a' };
const OPEN_TO_JOIN: Record<Locale, string> = { en: ' & ', es: ' y ', pt: ' e ' };

const EDUCATION: Record<Locale, string> = {
  en: 'Universidad Tecnológica Nacional — B.Sc. Information Systems Engineering (coursework complete)',
  es: 'Universidad Tecnológica Nacional — Ing. en Sistemas de Información (cursada completa)',
  pt: 'Universidad Tecnológica Nacional — Bacharel em Engenharia de Sistemas de Informação (cursos concluídos)',
};

const SKILL_GROUPS: Record<Locale, ReadonlyArray<{ label: string; value: string }>> = {
  en: [
    {
      label: 'Leadership & Strategy',
      value:
        'Engineering Leadership & Team Scaling (8–60+ people), Roadmap Ownership, OKRs, Strategic Thinking, Matrix Organization Navigation, Architectural Strategy.',
    },
    {
      label: 'Architecture & Cloud',
      value:
        'Architectural Refactoring & Design, Microservices & APIs, Microfrontends, High-Concurrency Systems, Distributed Systems, AWS, GCP, High Availability, Fault Tolerance, Scalability.',
    },
    {
      label: 'Cross-Functional Influence',
      value:
        'C-Level Communication, Stakeholder Negotiation, Cross-functional Alignment, Technical Strategy Presentation.',
    },
    {
      label: 'Technologies',
      value: 'React Native, React, Vue, Angular, Golang, Java, Node.js.',
    },
    {
      label: 'Methodology & Culture',
      value:
        'Agile / Scrum, Results-Driven Execution, AI-Assisted Development (Claude Code, GitHub Copilot, Cursor), Talent Development & Team Growth.',
    },
  ],
  es: [
    {
      label: 'Liderazgo y Estrategia',
      value:
        'Liderazgo de Ingeniería y Escalado de Equipos (8–60+ personas), Ownership de Roadmap, OKRs, Pensamiento Estratégico, Navegación de Organizaciones Matriciales, Estrategia Arquitectónica.',
    },
    {
      label: 'Arquitectura y Cloud',
      value:
        'Refactorización y Diseño Arquitectónico, Microservicios y APIs, Microfrontends, Sistemas de Alta Concurrencia, Sistemas Distribuidos, AWS, GCP, Alta Disponibilidad, Tolerancia a Fallos, Escalabilidad.',
    },
    {
      label: 'Influencia Transversal',
      value:
        'Comunicación con C-Level, Negociación con Stakeholders, Alineación Interfuncional, Presentación de Estrategia Técnica.',
    },
    {
      label: 'Tecnologías',
      value: 'React Native, React, Vue, Angular, Golang, Java, Node.js.',
    },
    {
      label: 'Metodología y Cultura',
      value:
        'Agile / Scrum, Ejecución Orientada a Resultados, Desarrollo Asistido por IA (Claude Code, GitHub Copilot, Cursor), Desarrollo de Talento y Crecimiento de Equipos.',
    },
  ],
  pt: [
    {
      label: 'Liderança e Estratégia',
      value:
        'Liderança de Engenharia e Escala de Equipes (8–60+ pessoas), Ownership de Roadmap, OKRs, Pensamento Estratégico, Navegação em Organizações Matriciais, Estratégia Arquitetural.',
    },
    {
      label: 'Arquitetura e Cloud',
      value:
        'Refatoração e Design Arquitetural, Microsserviços e APIs, Microfrontends, Sistemas de Alta Concorrência, Sistemas Distribuídos, AWS, GCP, Alta Disponibilidade, Tolerância a Falhas, Escalabilidade.',
    },
    {
      label: 'Influência Multifuncional',
      value:
        'Comunicação com C-Level, Negociação com Stakeholders, Alinhamento Multifuncional, Apresentação de Estratégia Técnica.',
    },
    {
      label: 'Tecnologias',
      value: 'React Native, React, Vue, Angular, Golang, Java, Node.js.',
    },
    {
      label: 'Metodologia e Cultura',
      value:
        'Agile / Scrum, Execução Orientada a Resultados, Desenvolvimento Assistido por IA (Claude Code, GitHub Copilot, Cursor), Desenvolvimento de Talentos e Crescimento de Equipes.',
    },
  ],
};

const LANGUAGES: Record<Locale, ReadonlyArray<string>> = {
  en: ['Spanish: Native', 'English: Advanced (FCE B2)', 'Portuguese: Basic'],
  es: ['Español: Nativo', 'Inglés: Avanzado (FCE B2)', 'Portugués: Básico'],
  pt: ['Espanhol: Nativo', 'Inglês: Avançado (FCE B2)', 'Português: Básico'],
};

export async function renderCvMd(locale: Locale): Promise<string> {
  const profile = await getEntry('profile', locale);
  if (!profile) throw new Error(`Profile not found for locale ${locale}`);

  const experiences = (await getCollection('experience', (e) => e.data.locale === locale)).sort(
    (a, b) => a.data.order - b.data.order,
  );
  const certs = (await getCollection('certification', (c) => c.data.locale === locale)).sort(
    (a, b) => b.data.date.localeCompare(a.data.date),
  );

  const h = HEADINGS[locale];
  const p = profile.data;
  const openTo = p.openTo.join(OPEN_TO_JOIN[locale]);
  const present = PRESENT[locale];

  const lines: string[] = [];
  lines.push(`# ${p.name} — ${p.displayTitle}`, '');
  lines.push(`${p.location} · ${OPEN_TO_LABEL[locale]} ${openTo}`);
  lines.push(`LinkedIn: ${p.linkedin}`, '');

  lines.push(`## ${h.summary}`, p.summary.trim(), '');

  lines.push(`## ${h.achievements}`);
  for (const a of p.achievements) lines.push(`- ${a}`);
  lines.push('');

  lines.push(`## ${h.exp}`, '');
  for (const e of experiences) {
    lines.push(`### ${e.data.company} — ${e.data.title} {#${e.data.slug}}`);
    const dateRange = `${e.data.startDate} – ${e.data.endDate ?? present}`;
    const meta = e.data.location ? `${dateRange} · ${e.data.location}` : dateRange;
    lines.push(meta, '');
    for (const b of e.data.bullets) lines.push(`- ${b}`);
    lines.push('');
  }

  lines.push(`## ${h.edu}`);
  lines.push(EDUCATION[locale], '');

  lines.push(`## ${h.skills}`);
  for (const group of SKILL_GROUPS[locale]) {
    lines.push(`**${group.label}:** ${group.value}`, '');
  }

  lines.push(`## ${h.certs}`);
  for (const c of certs) {
    const status = c.data.status === 'in-progress' ? ' [in progress]' : '';
    lines.push(`- ${c.data.name} — ${c.data.issuer} (${c.data.date})${status}`);
  }
  lines.push('');

  lines.push(`## ${h.langs}`);
  for (const l of LANGUAGES[locale]) lines.push(`- ${l}`);

  return lines.join('\n');
}
