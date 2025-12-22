import type { APIRoute } from 'astro';

const getRobotsTxt = (sitemapURL: URL) => `
# Facebook / Meta
User-agent: facebookexternalhit
Allow: /

User-agent: Facebot
Allow: /

# Twitter / X
User-agent: Twitterbot
Allow: /

# LinkedIn
User-agent: LinkedInBot
Allow: /

# Discord
User-agent: Discordbot
Allow: /

# Slack
User-agent: Slackbot
Allow: /

# WhatsApp
User-agent: WhatsApp
Allow: /

# Telegram
User-agent: TelegramBot
Allow: /

# Pinterest
User-agent: Pinterestbot
Allow: /

User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL('sitemap-index.xml', site);
  return new Response(getRobotsTxt(sitemapURL));
};
