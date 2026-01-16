import satori from 'satori';
import type { ReactNode } from 'react';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

export interface OGImageOptions {
  title: string;
  description?: string;
  type?: 'articles' | 'resources';
  tags?: string[];
  author?: string;
  pubDate?: Date;
  imageBase64?: string; // Base64 encoded image data URL
}

interface OGTemplateProps {
  title: string;
  description?: string;
  typeLabel: string;
  tags: string[];
  author: string;
  formattedDate: string;
  accentColor: string;
  imageBase64?: string;
}

function OGTemplate({
  title,
  description,
  typeLabel,
  tags,
  author,
  formattedDate,
  accentColor,
  imageBase64,
}: OGTemplateProps): ReactNode {
  const displayTags = tags.slice(0, 4);
  const truncatedDescription =
    description && description.length > 120
      ? description.substring(0, 120) + '...'
      : description;

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#0a0a0a',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background image */}
      {imageBase64 && (
        <img
          src={imageBase64}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}

      {/* Dark overlay for better text readability */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: imageBase64
            ? 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.85) 100%)'
            : 'transparent',
        }}
      />

      {/* Brand gradient background + orbs (only if no image) */}
      {!imageBase64 && (
        <>
          {/* Full gradient background (brand hero) */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage:
                'linear-gradient(135deg, hsl(260, 85%, 55%), hsl(240, 85%, 65%))',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '-100px',
              left: '-100px',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, hsla(260, 85%, 60%, 0.15) 0%, transparent 70%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-150px',
              right: '-100px',
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, hsla(240, 85%, 65%, 0.12) 0%, transparent 70%)',
            }}
          />
        </>
      )}

      {/* Grid pattern overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content wrapper with padding */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* Header with type badge and site name */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          {/* Type badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'hsla(260, 85%, 60%, 0.15)',
              border: '1px solid hsla(260, 85%, 60%, 0.35)',
              borderRadius: '9999px',
              padding: '8px 20px',
            }}
          >
            <span
              style={{
                color: accentColor,
                fontSize: '20px',
                fontWeight: 700,
                fontFamily: 'DM Sans',
              }}
            >
              {typeLabel}
            </span>
          </div>

          {/* Site name */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span
              style={{
                color: '#ffffff',
                fontSize: '24px',
                fontWeight: 700,
                fontFamily: 'Playfair Display',
              }}
            >
              KPHR
            </span>
          </div>
        </div>

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          {/* Title */}
          <h1
            style={{
              color: '#ffffff',
              fontSize: title.length > 50 ? '48px' : '56px',
              fontWeight: 700,
              fontFamily: 'Playfair Display',
              lineHeight: 1.2,
              marginBottom: '24px',
              maxWidth: '900px',
              textShadow: imageBase64 ? '0 2px 10px rgba(0,0,0,0.5)' : 'none',
            }}
          >
            {title}
          </h1>

          {/* Description */}
          {truncatedDescription && (
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: '24px',
                fontFamily: 'DM Sans',
                lineHeight: 1.5,
                maxWidth: '800px',
                marginBottom: '32px',
                textShadow: imageBase64 ? '0 1px 5px rgba(0,0,0,0.5)' : 'none',
              }}
            >
              {truncatedDescription}
            </p>
          )}
        </div>

        {/* Footer with tags and meta info */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          {/* Tags */}
          {displayTags.length > 0 && (
            <div
              style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              {displayTags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '16px',
                    fontFamily: 'DM Sans',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Author and date */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '4px',
            }}
          >
            <span
              style={{
                color: accentColor,
                fontSize: '18px',
                fontWeight: 600,
                fontFamily: 'DM Sans',
                textShadow: imageBase64 ? '0 1px 3px rgba(0,0,0,0.5)' : 'none',
              }}
            >
              {author}
            </span>
            {formattedDate && (
              <span
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '16px',
                  fontFamily: 'DM Sans',
                  textShadow: imageBase64
                    ? '0 1px 3px rgba(0,0,0,0.5)'
                    : 'none',
                }}
              >
                {formattedDate}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateOGImage(
  options: OGImageOptions,
): Promise<Buffer> {
  const {
    title,
    description,
    type = 'articles',
    tags = [],
    author = 'Melnard De Jesus',
    pubDate,
    imageBase64,
  } = options;

  // Import Resvg dynamically to avoid bundling native .node in build
  const { Resvg } = await import('@resvg/resvg-js');

  // Load fonts from static files
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const fontsDir = join(__dirname, '../../public/fonts');

  const dmSansRegular = readFileSync(join(fontsDir, 'DMSans-Regular.ttf'));
  const dmSansBold = readFileSync(join(fontsDir, 'DMSans-Bold.ttf'));
  const playfairBold = readFileSync(join(fontsDir, 'PlayfairDisplay-Bold.ttf'));

  const formattedDate = pubDate
    ? new Date(pubDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const typeLabel = type === 'articles' ? 'Article' : 'Resource';
  const accentColor = 'hsl(260, 85%, 60%)'; // Brand purple

  const element = OGTemplate({
    title,
    description,
    typeLabel,
    tags,
    author,
    formattedDate,
    accentColor,
    imageBase64,
  });

  const svg = await satori(element as React.ReactNode, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'DM Sans',
        data: dmSansRegular,
        weight: 400,
        style: 'normal',
      },
      {
        name: 'DM Sans',
        data: dmSansBold,
        weight: 700,
        style: 'normal',
      },
      {
        name: 'Playfair Display',
        data: playfairBold,
        weight: 700,
        style: 'normal',
      },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: 1200,
    },
  });

  const pngData = resvg.render();
  return pngData.asPng();
}
