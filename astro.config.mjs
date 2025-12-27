// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

import mdx from '@astrojs/mdx';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.kphr.com/',
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      // Prevent esbuild from trying to prebundle native addon
      exclude: ['@resvg/resvg-js'],
    },
    ssr: {
      // Treat native module as external so it's required at runtime by Node
      external: ['@resvg/resvg-js'],
    },
  },

  integrations: [sitemap(), mdx(), react()],

  compressHTML: true,
});
