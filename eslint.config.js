// Flat ESLint config — Astro + TypeScript. Pairs with stylelint (CSS) and
// `astro check` (templates). Keeps rules light: no over-engineering for a
// personal static site.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.astro/**',
      'archive/**',
      'playwright-report/**',
      'test-results/**',
      '.lighthouseci/**',
      'public/**',
    ],
  },

  // Base JS rules.
  js.configs.recommended,

  // TypeScript (no type-aware rules — keeps lint fast and CI cheap).
  ...tseslint.configs.recommended,

  // Astro template + frontmatter.
  ...astro.configs.recommended,

  // Astro auto-generated env file uses triple-slash reference.
  {
    files: ['src/env.d.ts'],
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },

  // Project-level overrides.
  {
    rules: {
      // We intentionally use `as const` and module-scope mutable state.
      'prefer-const': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // Astro components don't always have a "default export" linter expects.
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': 'warn',
      'no-undef': 'off', // TS handles this; lint complains about Astro globals otherwise.
    },
  },

  // Build scripts run in Node — allow process, fs, etc.
  {
    files: ['scripts/**/*.mjs', '*.config.{mjs,js}'],
    languageOptions: {
      globals: {
        process: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
    },
  },

  // Test files — allow long describe/test blocks.
  {
    files: ['tests/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
