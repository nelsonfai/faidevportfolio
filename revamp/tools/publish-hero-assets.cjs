// Publishes the photographed earphones cutout used by the site. The remaining
// hero objects use the cutouts from revamp/hero.png. Run from the repo root.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SRC = path.join(__dirname, '..', 'assets', 'hero');
const OUT = path.join(__dirname, '..', '..', 'public', 'rv', 'hero');
const IDS = ['earphones'];
const MAX = 1600;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const manifest = {};
  for (const id of IDS) {
    const file = path.join(SRC, `${id}.png`);
    if (!fs.existsSync(file)) { console.log(`- ${id}: not delivered yet`); continue; }
    const image = sharp(file, { limitInputPixels: false });
    const meta = await image.metadata();
    if (!meta.hasAlpha) { console.log(`! ${id}: no alpha channel, skipped`); continue; }
    const info = await image.resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true }).webp({ quality: 90, alphaQuality: 95 }).toFile(path.join(OUT, `${id}.webp`));
    manifest[id] = { src: `/rv/hero/${id}.webp`, w: info.width, h: info.height, v: Math.round(fs.statSync(file).mtimeMs) };
    console.log(`✓ ${id}: ${meta.width}x${meta.height} -> ${info.width}x${info.height}, ${(info.size / 1024).toFixed(0)} KB`);
  }
  fs.writeFileSync(path.join(OUT, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`manifest: ${Object.keys(manifest).length}/${IDS.length} final assets`);
})();
