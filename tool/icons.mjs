// Renders the favicon set from public/favicon.svg, which is the app's own launcher icon
// (the app's assets/branding/sawaza_app_icon.svg, copied unchanged) so a browser tab and a
// phone's home screen show the same square. The rounded tile serves the tab and the
// manifest; iOS and a maskable launcher round the corners themselves, so they get the same
// picture with square corners. The disc already sits inside the circle every mask keeps.
//
//   node tool/icons.mjs
import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const svg = await readFile('public/favicon.svg');

async function png(size, { maskable = false } = {}) {
  if (!maskable) return sharp(svg).resize(size, size).png().toBuffer();
  const square = svg.toString().replace(/rx="\d+"/, 'rx="0"');
  return sharp(Buffer.from(square)).resize(size, size).flatten({ background: '#0F2557' }).png().toBuffer();
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
await writeFile('public/apple-touch-icon.png', await png(180, { maskable: true }));
await writeFile('public/favicon.ico', ico(await png(32), 32));
console.log('icons written under public/');
