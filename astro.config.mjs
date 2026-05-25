// @ts-check
import { fileURLToPath } from 'node:url';
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import compress from 'astro-compress';

export default defineConfig({
  site: 'https://gabrielvargas94.github.io',
  output: 'static',
  // 'always' aligns with GitHub Pages directory-style serving (redirects
  // `/es` → `/es/`) — keeps canonical URLs and sitemap entries consistent.
  trailingSlash: 'always',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'pt'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },

  // Prefetch links to make navigation feel instant.
  // viewport strategy: links prefetch as they enter the viewport.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },

  // Self-host Google/Fontsource fonts; eliminates CDN dependency, better LCP.
  fonts: [
    {
      name: 'Newsreader',
      cssVariable: '--font-newsreader',
      provider: fontProviders.google(),
      weights: [400, 500],
      styles: ['normal', 'italic'],
    },
    {
      name: 'Geist',
      cssVariable: '--font-geist',
      provider: fontProviders.google(),
      weights: [400, 500, 600],
    },
    {
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains-mono',
      provider: fontProviders.google(),
      weights: [400, 500],
    },
  ],

  // `where` lowers scoped-style specificity to 0, so cascade layers
  // in global.scss (`a11y`, `print`) reliably win over component styles.
  scopedStyleStrategy: 'where',

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en-US', es: 'es-AR', pt: 'pt-BR' },
      },
      filter: (page) => !/\/cv-print(\/|$)/.test(page),
    }),
    mdx(),
    icon({
      // Pre-include Lucide icons we'll use across the site. Add more as needed.
      include: {
        lucide: [
          'linkedin', 'github', 'globe', 'chevron-down', 'arrow-down',
          'circle-dollar-sign', 'layout-dashboard', 'code', 'users',
          'sparkles', 'mic', 'terminal', 'award', 'dice-6', 'sun',
        ],
      },
    }),
    // Offload analytics scripts (Umami) to a web worker; cero main-thread cost.
    partytown({
      config: {
        forward: ['dataLayer.push', 'umami.track'],
      },
    }),
    // Build-time compression for HTML, CSS, JS, SVG, images.
    compress({
      CSS: true,
      HTML: true,
      Image: false, // We'll use astro:assets <Image> for hero photo; skip global pass.
      JavaScript: true,
      SVG: true,
    }),
  ],

  build: {
    // 'always' inlines all CSS into the HTML head — eliminates render-blocking
    // external CSS requests (e.g., Contact.css that was costing ~150ms even
    // though the section is below the fold). For a static portfolio with
    // ~30KB total CSS, eliminating the TCP round-trip beats the HTML weight.
    inlineStylesheets: 'always',
  },

  vite: {
    css: {
      devSourcemap: true,
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
});
