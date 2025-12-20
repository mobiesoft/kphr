export function countWords(content: string): number {
  // Remove HTML tags and extra whitespace, then split by whitespace
  const text = content.replace(/(<([^>]+)>)/gi, "").trim(); // Remove HTML tags
  const words = text.split(/\s+/); // Split by whitespace
  return words.filter(Boolean).length; // Filter out any empty strings
}
