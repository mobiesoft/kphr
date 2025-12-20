import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/index.mdx', base: './src/data/blogs' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      author: z.string(),
      date: z.date(),
      excerpt: z.string(),
      image: image(),
      tags: z.array(z.string()).optional(),
    }),
});

export const collections = {
  blogs: blogCollection,
};
