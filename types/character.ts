export interface Character {
  // Metadata from YAML frontmatter
  character_id: string;
  name: string;
  
  // Protagonist fields
  order_house?: string;
  dorm?: string;
  archetype?: string;
  gift?: string;
  divine_link?: string;
  
  // Shared/extended fields (used by multiple character types)
  title?: string;
  alias?: string;
  aliases?: string[];
  rank?: string;
  affiliation?: string;
  role?: string;
  weapon?: string;
  specialization?: string;
  reports_to?: string;
  house_affiliation?: string[];
  relics?: string[];
  themes?: string[];
  arc_roles?: string[];
  
  // Common fields
  status?: string;
  age?: string | number;
  tags?: string[];
  arc_appearances?: string[];
  
  // Parsed content
  overview?: string;
  backstory?: string;
  relationships?: string;
  content?: string; // Full markdown content
  filePath?: string;
  
  // Derived fields
  quartet?: 'nexus' | 'aetherforge';
  isAntagonist?: boolean;
  image?: string; // Path to character image (deprecated, use images)
  images?: string[]; // Array of image paths for carousel
}
