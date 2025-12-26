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
      embedHtml: z.string().optional(),
      tags: z.array(z.string()).optional(),
    }),
});

export const collections = {
  articles: blogCollection,
};
