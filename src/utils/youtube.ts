/**
 * YouTube utility functions for extracting video IDs and generating URLs
 */

/**
 * Extracts YouTube video ID from various URL formats
 * Supports: youtube.com/watch?v=, youtu.be/, youtube.com/embed/, youtube.com/v/
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;

  const patterns = [
    // youtube.com/watch?v=VIDEO_ID
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    // youtu.be/VIDEO_ID
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    // youtube.com/embed/VIDEO_ID
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    // youtube.com/v/VIDEO_ID
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    // youtube.com/shorts/VIDEO_ID
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Returns the highest quality thumbnail URL for a YouTube video
 * Falls back to lower quality if maxresdefault isn't available
 */
export function getYouTubeThumbnail(
  videoId: string,
  quality: 'maxres' | 'sd' | 'hq' | 'mq' | 'default' = 'maxres',
): string {
  const qualityMap = {
    maxres: 'maxresdefault',
    sd: 'sddefault',
    hq: 'hqdefault',
    mq: 'mqdefault',
    default: 'default',
  };

  return `https://i.ytimg.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}

/**
 * Returns the embed URL for a YouTube video
 */
export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Returns the canonical watch URL for a YouTube video
 */
export function getYouTubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

/**
 * Validates if a string is a valid YouTube URL
 */
export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeId(url) !== null;
}
