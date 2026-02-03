import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/index.mdx', base: './src/data/articles' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      author: z.string(),
      isFeatured: z.boolean().optional().default(false),
      date: z.date(),
      excerpt: z.string(),
      image: image(),
      tags: z.array(z.string()).optional(),
      articleSection: z.string().optional(),
      keywords: z.array(z.string()).optional(),
      // YouTube Video fields (optional)
      youtubeUrl: z.string().url().optional(),
      hasVideoSchema: z.boolean().optional().default(false),
      videoTitle: z.string().optional(),
      videoUploadDate: z.date().optional(),
      videoDescription: z.string().optional(),
      videoDuration: z.string().optional(),
      videoViewCount: z.number().optional(),
      videoRegionsAllowed: z.array(z.string()).optional(),
      // Q&A fields (optional)
      faqs: z
        .array(
          z.object({
            question: z.string(),
            answer: z.string(),
          }),
        )
        .optional(),
    }),
});

const resourcesCollection = defineCollection({
  loader: glob({ pattern: '**/index.mdx', base: './src/data/resources' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      provider: z.string(),
      description: z.string(),
      category: z.string(),
      priceRange: z.string(),
      rating: z.number().min(0).max(5).optional(),
      isFeatured: z.boolean().optional().default(false),
      image: image(),
      tags: z.array(z.string()).optional(),
    }),
});

const privacyPolicyCollection = defineCollection({
  loader: glob({ pattern: 'privacy.mdx', base: './src/data/privacy' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lastUpdated: z.string(),
  }),
});

const accessibleCollections = defineCollection({
  loader: glob({
    pattern: 'accessibility.mdx',
    base: './src/data/accessibility',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lastUpdated: z.string().optional(),
  }),
});

const aboutCollection = defineCollection({
  loader: glob({ pattern: 'about.mdx', base: './src/data/about' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      pageTitle: z.string(),
      description: z.string(),
      heading: z.string(),
      intro: z.string(),
      tagline: z.string(),
      image: image(),
      imageAlt: z.string(),
      ctaHeading: z.string(),
      ctaButtonText: z.string(),
      ctaButtonLink: z.string().optional(),
    }),
});

export const collections = {
  articles: blogCollection,
  resources: resourcesCollection,
  policies: privacyPolicyCollection,
  accessible: accessibleCollections,
  about: aboutCollection,
};
