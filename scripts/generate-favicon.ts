import fs from 'fs';
import path from 'path';
import pngToIco from 'png-to-ico';

async function main() {
  const preferred = path.join(process.cwd(), 'public', 'flavacon.png');
  const fallback = path.join(process.cwd(), 'app', 'icon.png');
  const src = fs.existsSync(preferred) ? preferred : fallback;
  const dst = path.join(process.cwd(), 'public', 'favicon.ico');

  if (!fs.existsSync(src)) {
    throw new Error(`Missing source icon at ${src}`);
  }

  const buf = await pngToIco(src);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.writeFileSync(dst, buf);
  // eslint-disable-next-line no-console
  console.log(`Wrote ${dst}`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
