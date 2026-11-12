import fs from 'fs';
import path from 'path';

// The prototype supplies six objects; the prepared photographed earbuds remain separate.
const prototypeItems = {
  cap: { w: 447, h: 531 }, notebook: { w: 503, h: 391 }, ring: { w: 105, h: 105 }, earphones: { w: 503, h: 498 },
  glasses: { w: 509, h: 268 }, 'blue-pen': { w: 240, h: 397 }, 'black-pen': { w: 229, h: 425 },
};

// The user selected the photographed earphones cutout; all other items use the prototype.
const PHOTO_ITEMS = new Set(['earphones']);
const heroManifestPath = path.join(process.cwd(), 'public', 'rv', 'hero', 'manifest.json');

let heroManifest = {};
try {
  heroManifest = JSON.parse(fs.readFileSync(heroManifestPath, 'utf8'));
} catch { /* nothing published yet */ }

export function getHeroAssets() {
  return Object.fromEntries(Object.entries(prototypeItems).map(([id, size]) => [
    id,
    PHOTO_ITEMS.has(id) && heroManifest[id]
      ? { src: `${heroManifest[id].src}?v=${heroManifest[id].v}`, w: heroManifest[id].w, h: heroManifest[id].h }
      : { src: `/rv/hero/prototype/${id}.webp`, ...size },
  ]));
}
