import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { generateOGImage } from '@/utils/ogImage';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../../../../');

async function getImageAsBase64(
  imagePath: string,
): Promise<string | undefined> {
  try {
    if (!imagePath) return undefined;

    const imageBuffer = await fs.readFile(imagePath);
    const ext = path.extname(imagePath).toLowerCase().slice(1);
    const mimeType = ext === 'jpg' ? 'jpeg' : ext;
    return `data:image/${mimeType};base64,${imageBuffer.toString('base64')}`;
  } catch (error) {
    console.error('Error reading image:', error);
    return undefined;
  }
}

// Resolve image path from content entry's image() field or common fallbacks
async function resolveEntryImagePath(
  filePath: string,
  imageSrc?: string,
): Promise<string | undefined> {
  const fullFilePath = path.join(projectRoot, filePath);
  const dir = path.dirname(fullFilePath);

  // Try using the frontmatter image src when available
  if (imageSrc) {
    const candidate = imageSrc.startsWith('/')
      ? path.join(projectRoot, imageSrc.replace(/^\//, ''))
      : path.resolve(dir, imageSrc);
    try {
      await fs.access(candidate);
      return candidate;
    } catch {}
  }

  // Fallbacks commonly used in content folders
  const fallbacks = [
    path.join(dir, 'images', 'main.png'),
    path.join(dir, 'main.png'),
  ];
  for (const p of fallbacks) {
    try {
      await fs.access(p);
      return p;
    } catch {}
  }
  return undefined;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await getCollection('articles');

  return articles.map((article) => ({
    params: { id: article.id },
    props: { article },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { article } = props;

  let imageBase64: string | undefined;

  // Use filePath from the content entry to find the image in the same directory
  const filePath = (article as { filePath?: string }).filePath;
  if (filePath) {
    const imageSrc = (article.data as { image?: { src?: string } }).image?.src;
    const imagePath = await resolveEntryImagePath(filePath, imageSrc);
    if (imagePath) {
      imageBase64 = await getImageAsBase64(imagePath);
    }
  }

  const png = await generateOGImage({
    title: article.data.title,
    description: article.data.excerpt,
    type: 'articles',
    tags: article.data.tags,
    author: article.data.author,
    pubDate: article.data.date,
    imageBase64,
  });

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
