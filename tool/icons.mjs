// Renders the favicon set from public/favicon.svg, the Sawaza mark on its navy tile:
// the PNG sizes the manifest and iOS want, a maskable variant with the mark drawn
// smaller so a round mask keeps it whole, and a favicon.ico that wraps the 32px PNG.
//
//   node tool/icons.mjs
import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const svg = await readFile('public/favicon.svg');

async function png(size, { maskable = false } = {}) {
  if (!maskable) return sharp(svg).resize(size, size).png().toBuffer();
  // A maskable icon fills the whole square with the tile and keeps the mark inside
  // the safe zone, so the tile's own corners are dropped and the mark scaled to 80%.
  const flat = svg.toString().replace(/rx="\d+"/, 'rx="0"').replace('scale(.72)', 'scale(.56)');
  return sharp(Buffer.from(flat)).resize(size, size).png().toBuffer();
}

// An .ico file is a small directory header followed by its images; a PNG is an
// allowed image, which keeps the file tiny and crisp.
function ico(pngBuf, size) {
  const header = Buffer.alloc(6 + 16);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
  header.writeUInt8(size === 256 ? 0 : size, 6); header.writeUInt8(size === 256 ? 0 : size, 7);
  header.writeUInt8(0, 8); header.writeUInt8(0, 9);
  header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12);
  header.writeUInt32LE(pngBuf.length, 14); header.writeUInt32LE(22, 18);
  return Buffer.concat([header, pngBuf]);
}

await writeFile('public/icons/icon-192.png', await png(192));
await writeFile('public/icons/icon-512.png', await png(512));
await writeFile('public/icons/icon-maskable-512.png', await png(512, { maskable: true }));
await writeFile('public/apple-touch-icon.png', await png(180));
await writeFile('public/favicon.ico', ico(await png(32), 32));
console.log('icons written under public/');
