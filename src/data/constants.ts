import ogImageSrc from '@/images/main-logo.png';

export const SITE = {
  title: 'Aileen HR — Practical, Bilingual HR for SMBs',
  tagline: 'Empowering small businesses with practical, bilingual HR support.',
  description:
    'Helping small business owners build compliant, people-first teams with bilingual, practical HR guidance across California labor law, hiring, termination, and ongoing compliance.',
  description_short: 'Bilingual, people-centered HR for small businesses.',
  url: 'https://example.com',
  author: 'Aileen',
};

export const ISPARTOF = {
  '@type': 'WebSite',
  url: SITE.url,
  name: SITE.title,
  description: SITE.description,
};

export const SEO = {
  title: SITE.title,
  description: SITE.description,
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    inLanguage: 'en-US',
    '@id': SITE.url,
    url: SITE.url,
    name: SITE.title,
    description: SITE.description,
    isPartOf: ISPARTOF,
  },
};

export const OG = {
  locale: 'en_US',
  type: 'website',
  url: SITE.url,
  title: SITE.title,
  description:
    'Practical, bilingual HR support for small businesses—California labor law, hiring, termination, compliance, and people-first practices.',
  image: ogImageSrc,
};
