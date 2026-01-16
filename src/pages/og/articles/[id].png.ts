import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { generateOGImage } from '@/utils/ogImage';
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const articleRoot = path.resolve(__dirname, '../../../../');

async function getImageAsBase64(
  imagePath: string,
): Promise<string | undefined> {
  try {
    if (!imagePath) return undefined;

    const imageBuffer = await fs.readFile(imagePath);

    const originalSize = imageBuffer.length;
    console.log(`Original image size: ${(originalSize / 1024).toFixed(2)}KB`);

    // Compress image using sharp to reduce file size
    // Resize to max 600px width (OG images are 1200x630, but we can scale down)
    // and apply aggressive compression
    const compressedBuffer = await Promise.race([
      sharp(imageBuffer)
        .resize(600, 400, { fit: 'cover', withoutEnlargement: true })
        .png({ quality: 70, progressive: true })
        .toBuffer(),
      new Promise<Buffer>((_, reject) =>
        setTimeout(() => reject(new Error('Image compression timeout')), 3000),
      ),
    ]);

    const compressedSize = compressedBuffer.length;
    const compressionRatio = (
      (1 - compressedSize / originalSize) *
      100
    ).toFixed(2);
    console.log(
      `Compressed image size: ${(compressedSize / 1024).toFixed(2)}KB (${compressionRatio}% reduction)`,
    );

    // Limit compressed image size to prevent memory issues (max 200KB)
    if (compressedBuffer.length > 200 * 1024) {
      console.warn(
        `Compressed image still too large (${(compressedSize / 1024).toFixed(2)}KB > 200KB), skipping:`,
        imagePath,
      );
      return undefined;
    }

    const mimeType = 'png';
    return `data:image/${mimeType};base64,${compressedBuffer.toString('base64')}`;
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
  const fullFilePath = path.join(articleRoot, filePath);
  const dir = path.dirname(fullFilePath);

  // Try using the frontmatter image src when available
  if (imageSrc) {
    const candidate = imageSrc.startsWith('/')
      ? path.join(articleRoot, imageSrc.replace(/^\//, ''))
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
    path.join(dir, 'images', 'placeholder.svg'),
    path.join(dir, 'placeholder.svg'),
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
      'X-Content-Type-Options': 'nosniff',
    },
  });
};

// Some crawlers use HEAD to check content type. Provide explicit handler.
export const HEAD: APIRoute = async () => {
  return new Response(null, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  });
};
