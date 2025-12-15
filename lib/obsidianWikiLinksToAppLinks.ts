export type WikiLinkResolver = (target: string) => { href: string; label?: string } | null;

function normalizeTarget(raw: string): string {
  return raw
    .trim()
    .replace(/^"|"$/g, '')
    .replace(/^\[\[|\]\]$/g, '')
    .replace(/\s+/g, ' ');
}

export function obsidianWikiLinksToAppLinks(input: string, resolve: WikiLinkResolver): string {
  if (!input) return input;

  // Replace Obsidian-style wiki links with markdown links when resolvable.
  // [[Target|Label]]
  // [[Target]]
  return input.replace(/\[\[([^\]]+)\]\]/g, (full, inner: string) => {
    const parts = String(inner).split('|');
    const rawTarget = parts[0] ?? '';
    const rawLabel = parts[1];

    const target = normalizeTarget(rawTarget);
    const label = (rawLabel ?? target).trim();

    if (!target) return label;

    const resolved = resolve(target);
    if (!resolved) {
      // Not resolvable -> show label as plain text
      return label;
    }

    const finalLabel = (resolved.label ?? label).replace(/\[/g, '\\[').replace(/\]/g, '\\]');
    return `[${finalLabel}](${resolved.href})`;
  });
}

export function createDefaultWikiLinkResolver(opts: {
  characterIndex: Map<string, string>; // normalized key -> character_id
  factionIndex: Map<string, { kind: 'order' | 'faction'; id: string }>; // normalized key -> route id
}): WikiLinkResolver {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .trim()
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[_–—-]+/g, ' ')
      .replace(/[^a-z0-9\s']/g, '')
      .replace(/\s+/g, ' ');

  return (target: string) => {
    const key = norm(target);

    const charId = opts.characterIndex.get(key);
    if (charId) return { href: `/characters/${charId}` };

    const faction = opts.factionIndex.get(key);
    if (faction) {
      return { href: `/factions/${faction.id}` };
    }

    return null;
  };
}

export function buildCharacterIndex(characters: Array<{ character_id: string; name?: string; alias?: string; title?: string; aliases?: string[] }>): Map<string, string> {
  const idx = new Map<string, string>();

  const add = (key: string | undefined, id: string) => {
    if (!key) return;
    const normKey = key
      .toLowerCase()
      .trim()
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[_–—-]+/g, ' ')
      .replace(/[^a-z0-9\s']/g, '')
      .replace(/\s+/g, ' ');
    if (!normKey) return;
    if (!idx.has(normKey)) idx.set(normKey, id);
  };

  for (const c of characters) {
    add(c.character_id, c.character_id);
    add(c.name, c.character_id);
    add(c.title, c.character_id);
    add(c.alias, c.character_id);
    if (Array.isArray(c.aliases)) {
      for (const a of c.aliases) add(a, c.character_id);
    }
  }

  return idx;
}

export function buildFactionIndex(factions: Array<{ name?: string; order_id?: string; faction_id?: string }>): Map<string, { kind: 'order' | 'faction'; id: string }> {
  const idx = new Map<string, { kind: 'order' | 'faction'; id: string }>();

  const add = (key: string | undefined, value: { kind: 'order' | 'faction'; id: string }) => {
    if (!key) return;
    const normKey = key
      .toLowerCase()
      .trim()
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[_–—-]+/g, ' ')
      .replace(/[^a-z0-9\s']/g, '')
      .replace(/\s+/g, ' ');
    if (!normKey) return;
    if (!idx.has(normKey)) idx.set(normKey, value);
  };

  for (const f of factions) {
    if (f.order_id) {
      add(f.order_id, { kind: 'order', id: f.order_id });
    }
    if (f.faction_id) {
      add(f.faction_id, { kind: 'faction', id: f.faction_id });
    }
    add(f.name, { kind: f.order_id ? 'order' : 'faction', id: f.order_id ?? f.faction_id ?? '' });
  }

  // Remove any accidental empty-id entries
  for (const [k, v] of idx.entries()) {
    if (!v.id) idx.delete(k);
  }

  return idx;
}
