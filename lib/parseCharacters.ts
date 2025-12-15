import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Character } from '@/types/character';
import { sanitizeObsidianMarkdown } from '@/lib/sanitizeObsidianMarkdown';
import { loadStaticJson, shouldUseStaticData } from '@/lib/loadStaticData';

const VAULT_BASE = 'C:\\Users\\Sigma\\Battle Eternal Obsidian Vault';
const CHARACTER_PATHS = [
  path.join(VAULT_BASE, '1. Nexus Quartet'),
  path.join(VAULT_BASE, '2. Aetherforge Quartet'),
  path.join(VAULT_BASE, '3. Characters'),
  path.join(VAULT_BASE, 'Faculty & Leadership'),
];

function findMarkdownFiles(dir: string): string[] {
  const results: string[] = [];
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        results.push(...findMarkdownFiles(fullPath));
      } else if (item.isFile() && item.name.endsWith('.md')) {
        results.push(fullPath);
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`Warning: Error reading directory ${dir}: ${message}`);
  }
  return results;
}

export async function getAllCharacters(): Promise<Character[]> {
  // Prefer static exports in production (or when BE_DATA_SOURCE=static)
  if (shouldUseStaticData()) {
    const fromJson = loadStaticJson<Character[]>('data/characters.json');
    if (fromJson) return fromJson;
  }

  const allFiles: string[] = [];
  
  // Find all .md files from all character directories
  for (const charPath of CHARACTER_PATHS) {
    if (fs.existsSync(charPath)) {
      const files = findMarkdownFiles(charPath);
      console.log(`Found ${files.length} markdown files in ${path.basename(charPath)}`);
      allFiles.push(...files);
    }
  }
  
  console.log(`Total markdown files found: ${allFiles.length}`);

  const characters: Character[] = [];

  for (const filePath of allFiles) {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);
      const cleanedContent = sanitizeObsidianMarkdown(content);

      // Only process files with character_id in frontmatter
      if (data.character_id) {
        console.log(`✓ Found character: ${data.character_id} (${data.name})`);
        // Determine quartet membership from file path
        let quartet: 'nexus' | 'aetherforge' | undefined;
        if (filePath.includes('1. Nexus Quartet')) {
          quartet = 'nexus';
        } else if (filePath.includes('2. Aetherforge Quartet')) {
          quartet = 'aetherforge';
        }

        // Check for character images (optional)
        const characterImageDir = path.join(process.cwd(), 'public', 'images', 'characters', data.character_id);
        let image: string | undefined;
        let images: string[] = [];
        
        // Check if character has a dedicated folder with multiple images
        try {
        if (fs.existsSync(characterImageDir) && fs.statSync(characterImageDir).isDirectory()) {
          const imageFiles = fs.readdirSync(characterImageDir)
            .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
            .sort((a, b) => {
              // Sort numerically if files are named 1.png, 2.png, etc.
              const numA = parseInt(a.match(/^(\d+)/)?.[1] || '999');
              const numB = parseInt(b.match(/^(\d+)/)?.[1] || '999');
              return numA - numB;
            });
          
          images = imageFiles.map(file => `/images/characters/${data.character_id}/${file}`);
          image = images[0]; // First image as fallback
        } else {
          // Fallback to single image file
          const singleImagePath = path.join(process.cwd(), 'public', 'images', 'characters', `${data.character_id}.jpg`);
          const pngImagePath = path.join(process.cwd(), 'public', 'images', 'characters', `${data.character_id}.png`);
          const webpImagePath = path.join(process.cwd(), 'public', 'images', 'characters', `${data.character_id}.webp`);
          
          if (fs.existsSync(singleImagePath)) {
            image = `/images/characters/${data.character_id}.jpg`;
            images = [image];
          } else if (fs.existsSync(pngImagePath)) {
            image = `/images/characters/${data.character_id}.png`;
            images = [image];
          } else if (fs.existsSync(webpImagePath)) {
            image = `/images/characters/${data.character_id}.webp`;
            images = [image];
          }
        }
        } catch (error) {
          console.log(`Note: No images found for ${data.character_id}`);
        }

        // Determine if character is an antagonist based on tags or affiliation
        const isAntagonist = data.tags?.includes('antagonist') ||
          (typeof data.affiliation === 'string' && (
            data.affiliation.toLowerCase().includes('black sun') ||
            data.affiliation.toLowerCase().includes('black cross') ||
            data.affiliation.toLowerCase().includes('ncb')
          ));

        const aliases: string[] | undefined = Array.isArray(data.aliases)
          ? data.aliases.filter((x: unknown) => typeof x === 'string')
          : undefined;

        const houseAffiliation: string[] | undefined = Array.isArray(data.house_affiliation)
          ? data.house_affiliation.filter((x: unknown) => typeof x === 'string')
          : undefined;

        const themes: string[] | undefined = Array.isArray(data.themes)
          ? data.themes.filter((x: unknown) => typeof x === 'string')
          : undefined;

        const relics: string[] | undefined = Array.isArray(data.relics)
          ? data.relics.filter((x: unknown) => typeof x === 'string')
          : undefined;

        const arcRoles: string[] | undefined = Array.isArray(data.arc_roles)
          ? data.arc_roles.filter((x: unknown) => typeof x === 'string')
          : undefined;

        // Prefer legacy/protagonist fields, but fall back to newer/alternate frontmatter conventions.
        const derivedArchetype: string | undefined =
          data.archetype ||
          (Array.isArray(themes) ? themes[0] : undefined) ||
          (Array.isArray(aliases) ? aliases[0] : undefined);

        const derivedOrderHouse: string | undefined =
          data.order_house ||
          (Array.isArray(houseAffiliation)
            ? houseAffiliation.find((h) => typeof h === 'string' && h.trim() && !/^none\b/i.test(h.trim()))
            : undefined);

        const derivedAlias: string | undefined =
          data.alias ||
          (Array.isArray(aliases) ? aliases[0] : undefined);

        const character: Character = {
          character_id: data.character_id,
          name: data.name || path.basename(filePath, '.md'),

          // Protagonist fields
          order_house: derivedOrderHouse,
          dorm: data.dorm,
          archetype: derivedArchetype,
          gift: data.gift,
          divine_link: data.divine_link,

          // Extended fields
          title: data.title,
          alias: derivedAlias,
          aliases,
          rank: data.rank,
          affiliation: data.affiliation || data.faction,
          role: data.role,
          weapon: data.weapon,
          specialization: data.specialization,
          reports_to: data.reports_to,
          house_affiliation: houseAffiliation,
          relics,
          themes,
          arc_roles: arcRoles,

          // Common fields
          status: data.status,
          age: data.age,
          tags: data.tags || [],
          arc_appearances: data.arc_appearances,

          content: cleanedContent,
          filePath,
          quartet,
          isAntagonist,
          image,
          images,
        };

        // Extract sections from markdown
        // Try multiple section formats for overview
        character.overview = extractSection(cleanedContent, 'Overview') || 
                            extractSection(cleanedContent, 'OVERVIEW') ||
                            extractSection(cleanedContent, '👁️ Overview');
        character.backstory = extractSection(cleanedContent, 'Backstory');
        character.relationships = extractSection(cleanedContent, 'Relationships & Rivalries') ||
                                 extractSection(cleanedContent, 'RELATIONSHIPS');
        
        // If overview wasn't found, fall back to the first meaningful paragraph
        if (!character.overview) {
          const paragraphs = cleanedContent.split('\n\n').filter(p =>
            p.trim().length > 50 &&
            !p.trim().startsWith('#') &&
            !p.trim().startsWith('>')
          );
          if (paragraphs.length > 0) {
            character.overview = paragraphs[0].trim();
          }
        }

        characters.push(character);
      } else {
        const fileName = path.basename(filePath);
        console.log(`✗ Skipping ${fileName}: No character_id in frontmatter`);
      }
    } catch (error) {
      const fileName = path.basename(filePath);
      // Some vault notes may have invalid YAML frontmatter; don't surface as a hard error in the UI.
      // Avoid logging the raw Error object (stack/source maps can trigger dev overlay noise).
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`Warning: Could not parse character markdown ${fileName}: ${message}`);
    }
  }

  // Filter out characters that are being reworked
  const excludedCharacterIds = ['elias_rothwell', 'kaito_marenas', 'seraphine_dorn'];
  const filteredCharacters = characters.filter(c => !excludedCharacterIds.includes(c.character_id));
  
  return filteredCharacters.sort((a, b) => a.name.localeCompare(b.name));
}

function extractSection(content: string, sectionName: string): string | undefined {
  // Escape special regex characters in section name
  const escapedSection = sectionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Try matching ### headers first
  let regex = new RegExp(`###\\s+${escapedSection}\\s*\\n([\\s\\S]*?)(?=###|##|$)`, 'i');
  let match = content.match(regex);
  
  // If not found, try ## headers
  if (!match) {
    regex = new RegExp(`##\\s+\\*\\*${escapedSection}\\*\\*\\s*\\n([\\s\\S]*?)(?=##|$)`, 'i');
    match = content.match(regex);
  }
  
  // If still not found, try ## without bold
  if (!match) {
    regex = new RegExp(`##\\s+${escapedSection}\\s*\\n([\\s\\S]*?)(?=##|$)`, 'i');
    match = content.match(regex);
  }
  
  return match ? match[1].trim() : undefined;
}
