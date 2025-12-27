import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { generateOGImage } from '@/utils/ogImage';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resourceRoot = path.resolve(__dirname, '../../../../');

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
  const fullFilePath = path.join(resourceRoot, filePath);
  const dir = path.dirname(fullFilePath);

  if (imageSrc) {
    const candidate = imageSrc.startsWith('/')
      ? path.join(resourceRoot, imageSrc.replace(/^\//, ''))
      : path.resolve(dir, imageSrc);
    try {
      await fs.access(candidate);
      return candidate;
    } catch {}
  }

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
  const resources = await getCollection('resources');

  return resources.map((resource) => ({
    params: { id: resource.id },
    props: { resource },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { resource } = props;

  let imageBase64: string | undefined;

  // Use filePath from the content entry to find the image in the same directory
  const filePath = (resource as { filePath?: string }).filePath;
  if (filePath) {
    const imageSrc = (resource.data as { image?: { src?: string } }).image?.src;
    const imagePath = await resolveEntryImagePath(filePath, imageSrc);
    if (imagePath) {
      imageBase64 = await getImageAsBase64(imagePath);
    }
  }

  const png = await generateOGImage({
    title: resource.data.title,
    description: resource.data.description,
    type: 'resources',
    tags: resource.data.tags,
    author: resource.data.provider,
    imageBase64,
  });

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
