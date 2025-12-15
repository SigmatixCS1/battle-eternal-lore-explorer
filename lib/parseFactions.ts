import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { glob } from 'glob';
import { Faction } from '@/types/faction';
import { sanitizeObsidianMarkdown } from '@/lib/sanitizeObsidianMarkdown';
import { loadStaticJson, shouldUseStaticData } from '@/lib/loadStaticData';

const VAULT_BASE = 'C:\\Users\\Sigma\\Battle Eternal Obsidian Vault';
const FACTION_PATHS = [
  path.join(VAULT_BASE, 'Houses_Orders_Societies'),
  path.join(VAULT_BASE, 'Factions'),
];

export async function getAllFactions(): Promise<Faction[]> {
  // Prefer static exports in production (or when BE_DATA_SOURCE=static)
  if (shouldUseStaticData()) {
    const fromJson = loadStaticJson<Faction[]>('data/factions.json');
    if (fromJson) return fromJson;
  }

  const allFiles: string[] = [];
  
  // Find all .md files from faction directories
  for (const factionPath of FACTION_PATHS) {
    const files = await glob('*.md', {
      cwd: factionPath,
      absolute: true,
      windowsPathsNoEscape: true
    });
    allFiles.push(...files);
  }

  const factions: Faction[] = [];

  for (const filePath of allFiles) {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);
      const cleanedContent = sanitizeObsidianMarkdown(content);
      const fileName = path.basename(filePath, '.md').toLowerCase();

      // Skip summary files
      if (fileName.includes('saint radian houses')) {
        continue;
      }

      // Only process files with order_id or faction_id
      if (data.order_id || data.faction_id) {
        // Determine category from file path or frontmatter
        let category: 'house' | 'order' | 'society' | 'resistance' = 'order';
        if (data.category === 'house' || data.category === 'order' || data.category === 'society' || data.category === 'resistance') {
          category = data.category;
        } else if (fileName.includes('house_') || data.name?.toLowerCase().includes('house')) {
          category = 'house';
        } else if (fileName.includes('society') || data.name?.toLowerCase().includes('society')) {
          category = 'society';
        } else if (filePath.includes('Factions') || data.type === 'Resistance Network') {
          category = 'resistance';
        }

        const name = data.name || path.basename(filePath, '.md').replace(/_/g, ' ');
        const id = data.order_id || data.faction_id || name.toLowerCase().replace(/\s+/g, '-');

        // Check for faction images in public/images/factions/<id>/ or <name>/
        const factionsBaseDir = path.join(process.cwd(), 'public', 'images', 'factions');
        const candidateDirs = [
          path.join(factionsBaseDir, id),
          path.join(factionsBaseDir, name),
          path.join(factionsBaseDir, name.replace(/\s+/g, '_')),
          path.join(factionsBaseDir, name.toLowerCase().replace(/\s+/g, '-')),
        ];

        let images: string[] = [];
        let image: string | undefined;
        
        for (const dir of candidateDirs) {
          try {
            if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
              const folderName = path.basename(dir);
              const imageFiles = fs.readdirSync(dir)
                .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
                .sort((a, b) => {
                  const numA = parseInt(a.match(/^(\d+)/)?.[1] || '999');
                  const numB = parseInt(b.match(/^(\d+)/)?.[1] || '999');
                  return numA - numB;
                });

              images = imageFiles.map((file) => {
                const folder = encodeURIComponent(folderName);
                const fname = encodeURIComponent(file);
                return `/images/factions/${folder}/${fname}`;
              });
              image = images[0];
              break;
            }
          } catch {
            // ignore
          }
        }

        const faction: Faction = {
          order_id: data.order_id,
          faction_id: data.faction_id,
          name,
          hidden: Boolean(data.hidden),
          dorm: data.dorm,
          fraternity: data.fraternity,
          motto: data.motto,
          focus: data.focus,
          specialization: data.specialization,
          status: data.status,
          signature_beasts: Array.isArray(data.signature_beasts) 
            ? data.signature_beasts 
            : data.signature_beasts?.split(',').map((s: string) => s.trim()),
          rivalries: data.rivalries,
          tags: data.tags || [],
          type: data.type,
          founding: data.founding,
          founders: data.founders,
          aligned_with: data.aligned_with || data.affiliation || data.parent_organization,
          opposes: data.opposes,
          content: cleanedContent,
          filePath,
          category,
          image,
          images,
        };

        factions.push(faction);
      }
    } catch (error) {
      // Some vault notes may have invalid YAML frontmatter; don't surface as a hard error in the UI.
      // Avoid logging the raw Error object (stack/source maps can trigger dev overlay noise).
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`Warning: Could not parse faction markdown ${filePath}: ${message}`);
    }
  }

  return factions.sort((a, b) => a.name.localeCompare(b.name));
}
