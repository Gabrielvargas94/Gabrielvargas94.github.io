import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const locale = z.enum(['en', 'es', 'pt']);

const profile = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/profile' }),
  schema: z.object({
    locale,
    name: z.string(),
    displayTitle: z.string(),
    realTitle: z.string(),
    company: z.string(),
    location: z.string(),
    openTo: z.array(z.string()),
    linkedin: z.url(),
    github: z.url(),
    yearsExperience: z.number().int().nonnegative(),
    summary: z.string().min(1),
    achievements: z.array(z.string()).min(1),
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/experience' }),
  schema: z.object({
    locale,
    slug: z.string(),
    company: z.string(),
    title: z.string(),
    startDate: z.string().regex(/^\d{4}-\d{2}$/, 'startDate must be YYYY-MM'),
    endDate: z.string().regex(/^\d{4}-\d{2}$/, 'endDate must be YYYY-MM').optional(),
    location: z.string().optional(),
    employment: z.enum(['Full-time', 'Contract', 'Consultant', 'Freelance']),
    bullets: z.array(z.string()).min(1),
    skills: z.array(z.string()),
    order: z.number().int().positive(),
  }),
});

const certification = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/certifications' }),
  schema: z.object({
    locale,
    name: z.string(),
    issuer: z.string(),
    date: z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/, 'date must be YYYY-MM or YYYY-MM-DD'),
    url: z.url().optional(),
    status: z.enum(['completed', 'in-progress']),
  }),
});

const project = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    locale,
    slug: z.string(),
    name: z.string(),
    summary: z.string().min(1),
    tech: z.array(z.string()),
    highlights: z.array(z.string()),
    visibility: z.enum(['public', 'private']),
  }),
});

export const collections = { profile, experience, certification, project };
