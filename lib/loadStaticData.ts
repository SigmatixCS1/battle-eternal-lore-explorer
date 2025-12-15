import fs from 'fs';
import path from 'path';

export function loadStaticJson<T>(relativePublicPath: string): T | null {
  try {
    const p = path.join(process.cwd(), 'public', relativePublicPath);
    if (!fs.existsSync(p)) return null;
    const raw = fs.readFileSync(p, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function shouldUseStaticData(): boolean {
  // Default behavior:
  // - In production builds, prefer static JSON exports if present.
  // - In development, prefer vault parsing unless explicitly forced.
  const mode = process.env.BE_DATA_SOURCE;
  if (mode === 'static') return true;
  if (mode === 'vault') return false;

  return process.env.NODE_ENV === 'production';
}
