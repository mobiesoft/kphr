import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { html as satoriHtml } from 'satori-html';

const WIDTH = 1200;
const HEIGHT = 630;

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function loadFonts() {
  try {
    const css = await fetch(
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap',
    ).then((r) => r.text());
    const urls = Array.from(css.matchAll(/url\((https:[^)]*)\)/g)).map(
      (m) => m[1],
    );
    const [regularUrl, boldUrl] = urls.length >= 2 ? urls : [urls[0], urls[0]];
    const [regularData, boldData] = await Promise.all([
      fetch(regularUrl).then((r) => r.arrayBuffer()),
      fetch(boldUrl).then((r) => r.arrayBuffer()),
    ]);
    return [
      {
        name: 'Inter',
        data: Buffer.from(regularData),
        weight: 400,
        style: 'normal',
      },
      {
        name: 'Inter',
        data: Buffer.from(boldData),
        weight: 700,
        style: 'normal',
      },
    ];
  } catch {
    return [] as any;
  }
}

export async function GET(ctx: APIContext) {
  const id = ctx.params.id;
  if (!id) return new Response('Missing id', { status: 400 });

  const entry = (await getCollection('articles')).find((e) => e.id === id);
  if (!entry) return new Response('Not found', { status: 404 });

  const data: any = entry.data;
  const title = escapeHtml(String(data.title || 'Article'));
  const author = escapeHtml(String(data.author || ''));
  const dateStr = data.date
    ? new Date(data.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';
  const excerpt = escapeHtml(String(data.excerpt || ''));

  const fonts = await loadFonts();

  // Try to resolve and inline the content image as data URL
  let imageDataUrl: string | undefined;
  try {
    const baseDir = path.resolve(
      '.',
      'src',
      'data',
      entry.collection,
      entry.id.replace(/\/index$/, ''),
    );
    const srcVal: string = (data?.image?.src ?? data?.image) as string;
    if (typeof srcVal === 'string') {
      let imgPath: string;
      if (srcVal.startsWith('./') || srcVal.startsWith('../')) {
        imgPath = path.resolve(baseDir, srcVal);
      } else if (srcVal.startsWith('/')) {
        imgPath = path.resolve('.', srcVal.slice(1));
      } else {
        imgPath = path.resolve(baseDir, srcVal);
      }
      const buf = await readFile(imgPath);
      const ext = path.extname(imgPath).toLowerCase();
      const mime =
        ext === '.png'
          ? 'image/png'
          : ext === '.jpg' || ext === '.jpeg'
            ? 'image/jpeg'
            : ext === '.webp'
              ? 'image/webp'
              : ext === '.svg'
                ? 'image/svg+xml'
                : 'application/octet-stream';
      imageDataUrl = `data:${mime};base64,${buf.toString('base64')}`;
    }
  } catch {}

  const markup = `
    <div style="width:${WIDTH}px;height:${HEIGHT}px;display:flex;flex-direction:column;padding:0;background:#0f172a;color:#e2e8f0;font-family:Inter,system-ui,sans-serif;">
      ${imageDataUrl ? `<img src=\"${imageDataUrl}\" style=\"width:${WIDTH}px;height:360px;object-fit:cover;display:block\" />` : ''}
      <div style="padding:56px;display:flex;flex-direction:column;gap:0;">
      <div style="display:flex;align-items:center;gap:12px;color:#93c5fd;font-size:22px;margin-bottom:12px;">
        <span style="display:block;width:10px;height:10px;border-radius:50%;background:#93c5fd;"></span>
				<span>Article</span>
			</div>
			<div style="font-size:56px;line-height:1.2;font-weight:700;color:#f8fafc;">${title}</div>
			<div style="margin-top:16px;font-size:24px;color:#cbd5e1;">${excerpt}</div>
			<div style="margin-top:auto;display:flex;justify-content:space-between;align-items:center;border-top:1px solid #1f2937;padding-top:20px;">
				<div style="font-size:22px;color:#93c5fd;">${author}${dateStr ? ' • ' + dateStr : ''}</div>
				<div style="font-size:22px;color:#cbd5e1;">kphr</div>
			</div>
      </div>
		</div>
	`;

  const svg = await satori(satoriHtml(markup), {
    width: WIDTH,
    height: HEIGHT,
    fonts,
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: WIDTH },
    background: 'transparent',
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  const png = new Uint8Array(pngBuffer);

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}

export async function getStaticPaths() {
  const articles = await getCollection('articles');
  return articles.map((entry) => ({
    params: { id: entry.id },
  }));
}
