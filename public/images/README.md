# Battle Eternal Images

## Directory Structure

```
public/images/
├── characters/     # Character portraits
└── factions/       # Faction/house emblems and images
```

## Adding Character Images

To add an image for a character:

1. Name the image file using the character's `character_id` from their markdown frontmatter
2. Supported formats: `.jpg`, `.png`, `.webp`
3. Place in `public/images/characters/`

### Examples:

- `alexander-harukaza.jpg` → Will display for Alexander Holmes Harukaza
- `elara-vance.png` → Will display for Elara Vance
- `demarco-zavarus.webp` → Will display for DeMarco Zavarus

### Recommended Image Specs:

**Character Cards:**
- Minimum: 400x300px
- Aspect Ratio: 4:3 or 16:9
- Format: JPG or WebP for photos, PNG for illustrations

**Character Detail Pages:**
- Minimum: 1200x600px
- Aspect Ratio: 2:1 or 16:9
- Format: JPG or WebP (optimized for web)

## Adding Faction Images

Same process as characters, but use the faction's `order_id` or `faction_id`:

- `aetherion.jpg` → The Aetherion Society
- `astral-chorus.png` → The Astral Chorus
- `eternal-sol.webp` → Order of the Eternal Sol

## Notes

- Images are automatically detected by the parser
- If multiple formats exist (jpg, png, webp), jpg takes precedence
- Images are responsive and will scale based on screen size
- No need to restart the dev server after adding images
