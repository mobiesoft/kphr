import fs from 'node:fs';
import path from 'node:path';
import PDFDocument from 'pdfkit';

// Output path
const outDir = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  '..',
  'docs',
);
const outPath = path.join(outDir, 'pagecms-blog-post-guide.pdf');

function createGuide() {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 56, bottom: 56, left: 56, right: 56 },
    info: {
      Title: 'Creating a Blog Post via PageCMS',
      Author: 'KPHR Docs',
      Subject: 'Step-by-step guide for PageCMS blog posts',
    },
  });

  const stream = fs.createWriteStream(outPath);
  doc.pipe(stream);

  const H1 = 20;
  const H2 = 14;
  const BODY = 11;

  const lineGap = 6;

  function heading(text) {
    doc.moveDown(0.5);
    doc.font('Helvetica-Bold').fontSize(H1).text(text, { align: 'left' });
    doc.moveDown(0.4);
  }

  function subheading(text) {
    doc.moveDown(0.3);
    doc.font('Helvetica-Bold').fontSize(H2).text(text, { align: 'left' });
    doc.moveDown(0.2);
  }

  function paragraph(text) {
    doc.font('Helvetica').fontSize(BODY).text(text, { align: 'left' });
    doc.moveDown(0.4);
  }

  function list(items, opts = {}) {
    const bullet = opts.bullet || '•';
    doc.font('Helvetica').fontSize(BODY);
    items.forEach((t) => {
      doc.text(`${bullet} ${t}`, { align: 'left' });
    });
    doc.moveDown(0.4);
  }

  function numberedList(items) {
    doc.font('Helvetica').fontSize(BODY);
    items.forEach((t, i) => {
      doc.text(`${i + 1}. ${t}`, { align: 'left' });
      doc.moveDown(0.2);
    });
    doc.moveDown(0.4);
  }

  // Title
  heading('Creating a Blog Post via PageCMS – Step-by-Step Guide');
  paragraph(
    'This guide walks you through creating a blog post using the PageCMS interface and how it maps to your Astro project configuration. It includes media preparation, entry creation, required fields, and tips to ensure posts render correctly.',
  );

  // Overview
  subheading('Overview');
  paragraph(
    'Posts are stored under src/data/blogs/<slug>/index.mdx with images placed in a sibling images folder. The system uses MDX for rich content, and a dynamic Astro page renders each post. The sitemap integration uses your site URL to publish discoverable pages.',
  );

  list([
    'Content root: src/data/blogs',
    'Each post in its own folder named with the post slug (kebab-case)',
    'Primary file: index.mdx (with YAML frontmatter + MDX body)',
    'Images: ./images relative to index.mdx',
  ]);

  // Config references
  subheading('Key Config References');
  paragraph('From .pages.yml:');
  list([
    'Collection name: blogs',
    'Path: src/data/blogs',
    'Format: yaml-frontmatter (frontmatter + MDX body)',
    'Filename: index.mdx (saved inside the post folder)',
    'Required fields: title, author, date, excerpt, image',
    'Optional fields: tags (list), body (rich-text), embedHtml (trusted)',
    'Images default path hint: ./images/{replace-with-the-real-image-filename.ext}',
  ]);

  paragraph('From astro.config.mjs:');
  list([
    'MDX integration enabled: @astrojs/mdx – MDX content will render',
    'Sitemap integration: @astrojs/sitemap – site URL is https://www.kphr.com/',
    'Tailwind via Vite plugin – styling covered by your project setup',
    'HTML compression enabled for production',
  ]);

  // Step-by-step
  subheading('Step-by-Step in PageCMS');
  numberedList([
    'Upload blog media: In PageCMS, go to “Blog Media”. Create a new folder named with your post title in kebab-case (e.g., my-new-blog-post-sample). Inside it, create an images folder.',
    'Add images: Upload descriptive, well-named image files into the images folder (e.g., hero.jpg, team-photo.png). Avoid spaces; use kebab-case.',
    'Create blog entry: Navigate to “Blogs” and open the folder you created. Click “Add an entry” and fill in all required fields.',
    'Fill fields accurately: Provide Title, Author, Date, Excerpt, and Image Filepath (e.g., ./images/hero.jpg). Add Tags if needed, write the Body in rich-text/MDX, and include Embed HTML only if it is trusted.',
    'Save/publish: The entry saves as src/data/blogs/<slug>/index.mdx with your images under src/data/blogs/<slug>/images.',
    'Preview: Visit /blogs/<slug> on your site. With MDX enabled, headings, lists, images, and embeds should render properly.',
  ]);

  // Field-by-field
  subheading('Field-by-Field Guidance');
  list([
    'Title: Plain string used for display and SEO.',
    'Author: Attribution string (e.g., Jane Doe).',
    'Date: Use the date picker; PageCMS stores it in frontmatter.',
    'Excerpt: 1–3 sentence summary used on listings.',
    'Image Filepath: Relative to the post (e.g., ./images/hero.jpg). Must match an uploaded file.',
    'Tags: Optional list for categorization and filtering.',
    'Body: Rich-text with MDX allowed. You can use Markdown syntax and MDX components.',
    'Embed HTML (trusted): Optional raw HTML for embeds (e.g., YouTube, forms). Only insert content you trust.',
  ]);

  // MDX examples
  subheading('MDX Examples in the Body');
  paragraph('Images (with alt text):');
  list(['![Team at work](./images/team-photo.png)']);
  paragraph('Links and lists:');
  list([
    '[Read more](https://www.kphr.com/)',
    '- Bullet item one',
    '- Bullet item two',
  ]);

  // Conventions and tips
  subheading('Conventions & Tips');
  list([
    'Slug naming: Use kebab-case for folder names (e.g., my-new-blog-post-sample).',
    'Image filenames: Descriptive, kebab-case, no spaces (e.g., hero-banner.jpg).',
    'Relative paths: Always reference images with ./images/<file> from index.mdx.',
    'Alt text: Provide meaningful alt text for accessibility and SEO.',
    'Tags: Keep a consistent tagging vocabulary for better filtering.',
    'Content quality: Keep paragraphs short and scannable.',
  ]);

  // Troubleshooting
  subheading('Troubleshooting');
  list([
    '404 page: Ensure the folder slug matches the intended URL segment and that index.mdx exists.',
    'Image not rendering: Verify the relative path (./images/<file>) and the file actually exists in the images folder.',
    'MDX issues: Confirm the file is index.mdx, frontmatter is valid YAML, and content uses standard Markdown/MDX.',
    'Build/preview mismatch: Rebuild/restart the dev server if changes don’t appear.',
  ]);

  // Footer note
  doc.moveDown(0.6);
  doc
    .font('Helvetica-Oblique')
    .fontSize(BODY)
    .text(
      'Generated for the KPHR workspace. Config references: .pages.yml and astro.config.mjs.',
    );

  doc.end();

  return outPath;
}

const result = createGuide();
console.log(`Guide generated: ${result}`);
