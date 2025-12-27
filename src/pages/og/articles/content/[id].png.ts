import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';

async function resolveOriginalImagePath(entry: any, data: any) {
  const baseDir = path.resolve(
    '.',
    'src',
    'data',
    entry.collection,
    entry.id.replace(/\/index$/, ''),
  );
  let srcVal: string = (data?.image?.src ?? data?.image) as string;
  if (srcVal && srcVal.startsWith('/_astro/')) {
    // Read from MDX frontmatter to get the original path
    const mdxPath = path.resolve(baseDir, 'index.mdx');
    const mdx = await readFile(mdxPath, 'utf-8');
    const fmMatch = mdx.match(/^---[\r\n]+([\s\S]*?)[\r\n]+---/);
    if (fmMatch) {
      const fm = fmMatch[1];
      const imgLine = fm.match(/^image:\s*(.+)$/m);
      if (imgLine) {
        let val = imgLine[1].trim();
        val = val.replace(/^['"]|['"]$/g, '');
        srcVal = val;
      }
    }
  }
  let imgPath: string;
  if (srcVal.startsWith('./') || srcVal.startsWith('../')) {
    imgPath = path.resolve(baseDir, srcVal);
  } else if (srcVal.startsWith('/')) {
    imgPath = path.resolve('.', srcVal.slice(1));
  } else {
    imgPath = path.resolve(baseDir, srcVal);
  }
  return imgPath;
}

export async function GET(ctx: APIContext) {
  const id = ctx.params.id;
  if (!id) return new Response('Missing id', { status: 400 });

  const entry = (await getCollection('articles')).find((e) => e.id === id);
  if (!entry) return new Response('Not found', { status: 404 });
  const data: any = entry.data;
  const imgPath = await resolveOriginalImagePath(entry, data);

  const ext = path.extname(imgPath).toLowerCase();
  const buf = await readFile(imgPath);

  if (ext === '.svg') {
    const svgStr = buf.toString('utf-8');
    const resvg = new Resvg(svgStr, {
      fitTo: { mode: 'width', value: 1200 },
      background: 'transparent',
    });
    const png = new Uint8Array(resvg.render().asPng());
    return new Response(png, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  }

  // For raster formats, return original file (OG scrapers support png/jpg/webp)
  const mime =
    ext === '.png'
      ? 'image/png'
      : ext === '.jpg' || ext === '.jpeg'
        ? 'image/jpeg'
        : ext === '.webp'
          ? 'image/webp'
          : 'application/octet-stream';
  return new Response(new Uint8Array(buf), {
    headers: {
      'Content-Type': mime,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}

export async function getStaticPaths() {
  const articles = await getCollection('articles');
  return articles.map((entry) => ({ params: { id: entry.id } }));
}
