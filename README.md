# KPHR — HR Consulting Website

Marketing site for KPHR, built with Astro and Tailwind CSS. It showcases services, credibility, and resources for small business owners.

- Live site: https://www.kphr.com/
- Framework: Astro
- Styling: Tailwind CSS v4 with custom CSS variables
- Icons: Lucide
- SEO: Sitemap generation

## Project Structure

Key files and directories:

```text
/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── public/
│   ├── robots.txt
│   └── site.webmanifest
└── src/
	├── components/
	│   ├── Welcome.astro
	│   ├── global/
	│   │   ├── Footer.astro
	│   │   ├── Meta.astro
	│   │   └── Navigation.astro
	│   ├── sections/
	│   │   ├── AboutSection.astro
	│   │   ├── BlogSection.astro
	│   │   ├── CategoriesSection.astro
	│   │   ├── HeroSection.astro
	│   │   ├── PartnerSection.astro
	│   │   ├── ServiceCards.astro
	│   │   └── ThirdPartySection.astro
	│   └── ui/
	│       ├── Badge.astro
	│       ├── Button.astro
	│       ├── Card.astro
	│       ├── CardContent.astro
	│       ├── CardDescription.astro
	│       ├── CardFooter.astro
	│       ├── CardHeader.astro
	│       └── CardTitle.astro
	├── data/
	│   └── constants.ts
	├── images/
	├── layouts/
	│   └── MainLayout.astro
	├── pages/
	│   ├── 404.astro
	│   └── index.astro
	└── styles/
		└── global.css
```

## Getting Started

Install dependencies:

```sh
npm install
```

Start the dev server:

```sh
npm run dev
```

Open your browser at the URL shown in the terminal (Astro defaults to `http://localhost:4321`).

## Build & Preview

Create a production build:

```sh
npm run build
```

Preview the built site locally:

```sh
npm run preview
```

The static output is written to `dist/`.

## Tech Stack

- Astro (^5)
- Tailwind CSS v4 (via `@tailwindcss/vite`) and `@tailwindcss/typography`
- Lucide icons (`@lucide/astro`)
- Sitemap generation (`@astrojs/sitemap`)
- Prettier + plugins for Astro and Tailwind

## Notable Implementation Details

- The design system tokens (colors, radius, gradients, shadows) are defined in `src/styles/global.css` using CSS variables and Tailwind theme mappings.
- Reusable UI primitives live under `src/components/ui` (`Button`, `Card`, etc.), and section blocks under `src/components/sections` compose the homepage.
- `astro.config.mjs` sets the canonical site URL and enables HTML compression and sitemap generation.

## Deployment

This project builds to static HTML/CSS/JS and can be deployed to any static host (e.g., Netlify, Vercel, GitHub Pages, Cloudflare Pages). Use the output in `dist/` after `npm run build`.

## Scripts

Common scripts available in `package.json`:

- `dev`: Run the development server
- `build`: Build for production
- `preview`: Preview the production build
- `astro`: Access Astro CLI

## Contributing

Open a PR with clear description of changes. Run formatting and ensure the site builds locally before submitting.
