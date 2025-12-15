export function sanitizeObsidianMarkdown(input: string): string {
  if (!input) return input;

  let out = input;

  // Remove Obsidian embedded resources like ![[image.png]] or ![[Note]]
  // The app already shows character images via the carousel.
  out = out.replace(/^!\[\[[^\]]+\]\]\s*$/gm, '');

  // Remove Obsidian callout headers like:
  // > [!note] Title
  // Keep the rest of the quote content.
  out = out.replace(/^>\s*\[![^\]]+\].*$/gmi, '>');

  // NOTE: We intentionally do NOT strip/flatten wiki links here.
  // We convert Obsidian wiki links to real app links at render time,
  // when we have access to character/faction indexes.

  // Strip placeholder editorial lines like: [rest of ...]
  out = out.replace(/^\[\s*rest of[^\]]*\]\s*$/gmi, '');

  // Collapse 3+ blank lines to max 2
  out = out.replace(/\n{3,}/g, '\n\n');

  return out.trim();
}
