import fs from 'fs';
import path from 'path';

// Force vault mode for export (we want to re-parse from the Obsidian vault)
process.env.BE_DATA_SOURCE = 'vault';

async function main() {
  const { getAllCharacters } = await import('../lib/parseCharacters');
  const { getAllFactions } = await import('../lib/parseFactions');

  const [characters, factions] = await Promise.all([getAllCharacters(), getAllFactions()]);

  // Strip machine-specific paths before publishing
  const safeCharacters = characters.map((c) => ({ ...c, filePath: undefined }));
  const safeFactions = factions.map((f) => ({ ...f, filePath: undefined }));

  const outDir = path.join(process.cwd(), 'public', 'data');
  fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(path.join(outDir, 'characters.json'), JSON.stringify(safeCharacters, null, 2), 'utf-8');
  fs.writeFileSync(path.join(outDir, 'factions.json'), JSON.stringify(safeFactions, null, 2), 'utf-8');

  fs.writeFileSync(
    path.join(outDir, 'meta.json'),
    JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        characterCount: safeCharacters.length,
        factionCount: safeFactions.length,
      },
      null,
      2
    ),
    'utf-8'
  );

  // eslint-disable-next-line no-console
  console.log(`Exported ${safeCharacters.length} characters and ${safeFactions.length} factions to public/data/`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
