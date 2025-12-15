export interface Faction {
  // Metadata from YAML frontmatter
  order_id?: string;
  faction_id?: string;
  name: string;
  dorm?: string;
  fraternity?: string;
  motto?: string;
  focus?: string;
  specialization?: string;
  status?: string;
  signature_beasts?: string[];
  rivalries?: string | string[];
  tags?: string[];
  type?: string; // For resistance factions
  founding?: string;
  founders?: string[];
  aligned_with?: string;
  opposes?: string;
  
  // Parsed content
  content?: string;
  filePath?: string;
  
  // Derived fields
  category: 'house' | 'order' | 'society' | 'resistance';
  hidden?: boolean;
  image?: string; // deprecated, use images
  images?: string[]; // carousel images
}
