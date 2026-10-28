// Visual parity: screenshots every page of the approved design and of the built site at a phone
// and a laptop width, and reports the share of pixels that differ on each.
//
//   node tests/parity.mjs            design vs the build in dist/ (served by `astro preview`)
//   node tests/parity.mjs --self     design vs itself: must be 0% on every page, or the harness lies
//   node tests/parity.mjs --preview  design vs dist-preview/, served from a made-up sub-path with
//                                    .html URLs, the way the preview folder is hosted
//
// The design draws the Stellar line on Home and Trust, so build with PUBLIC_SHOW_ANCHOR=true before
// comparing (`npm run test:parity` does), or those two pages differ by exactly that line.
//   DESIGN=<folder>                  where the design's .html files are (default: the scratchpad copy)
//   PAGES=index,trust                a subset of pages
//
// Diff images land in tests/shots/. Motion is reduced on both sides so every part is at rest, and
// each page is shot after its fonts have loaded. Exit code 1 when a page is over the 1% line.
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile, stat } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { join, extname, resolve } from 'node:path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { chromium } from 'playwright';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const DESIGN = process.env.DESIGN || '/tmp/claude-0/-home-claude/4caf5b10-cc06-5574-801d-50e831463bcf/scratchpad/site';
const SELF = process.argv.includes('--self');
const PREVIEW = process.argv.includes('--preview');
const SUBPATH = '/some/sub/path'; // where the preview folder is pretended to be hosted
const ALL = ['index', 'how-it-works', 'trust', 'groups', 'businesses', 'help', 'about', 'privacy', 'terms', 'claim', 'invite'];
const PAGES = process.env.PAGES ? process.env.PAGES.split(',') : ALL;
const VIEWPORTS = [{ name: 'phone', width: 390, height: 844 }, { name: 'laptop', width: 1340, height: 800 }];
const LIMIT = 1; // percent
const SHOTS = join(ROOT, 'tests', 'shots');

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2', '.woff': 'font/woff' };

/* Serves a folder of plain files, optionally under a sub-path; the design has no routing of its own. */
function serveFolder(dir, prefix = '') {
  return new Promise((ok) => {
    const srv = createServer(async (req, res) => {
      let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (prefix) { if (!path.startsWith(prefix + '/')) { res.writeHead(404); return res.end('outside the sub-path'); } path = path.slice(prefix.length); }
      const file = resolve(dir, '.' + (path === '/' ? '/index.html' : path));
      try {
        if (!file.startsWith(resolve(dir) + '/')) throw new Error('outside the folder');
        await stat(file);
        res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' });
        res.end(await readFile(file));
      } catch { res.writeHead(404); res.end('not found'); }
    });
    srv.listen(0, '127.0.0.1', () => ok({ srv, url: `http://127.0.0.1:${srv.address().port}` }));
  });
}

/* `astro preview` serves dist/ the way the host will: clean URLs onto the flat .html files. */
function servePreview(port) {
  return new Promise((ok, fail) => {
    const p = spawn('npx', ['astro', 'preview', '--port', String(port), '--host', '127.0.0.1'], { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'], detached: true });
    let out = '';
    const onData = (d) => { out += d; if (/127\.0\.0\.1:\d+/.test(out)) ok({ srv: { close: () => { try { process.kill(-p.pid); } catch { p.kill(); } } }, url: `http://127.0.0.1:${port}` }); };
    p.stdout.on('data', onData); p.stderr.on('data', onData);
    p.on('exit', (c) => fail(new Error(`astro preview exited ${c}\n${out}`)));
    setTimeout(() => fail(new Error(`astro preview did not start\n${out}`)), 20000);
  });
}

async function shoot(browser, url, vp, errors) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1, reducedMotion: 'reduce',
    ignoreHTTPSErrors: true,
  });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`${url}: ${m.text()}`); });
  page.on('pageerror', (e) => errors.push(`${url}: ${e.message}`));
  page.on('response', (r) => { if (r.status() >= 400) errors.push(`${url}: ${r.status()} ${r.url()}`); });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const fonts = await page.evaluate(() => ['700 16px Outfit', '400 16px "Plus Jakarta Sans"'].map((f) => document.fonts.check(f)));
  await page.waitForTimeout(500);
  const png = await page.screenshot({ fullPage: true, animations: 'disabled', caret: 'hide' });
  await ctx.close();
  return { png: PNG.sync.read(png), fonts };
}

/* Pads the shorter image so both have the same height; the extra rows count as differing. */
function pad(img, h) {
  if (img.height === h) return img;
  const out = new PNG({ width: img.width, height: h });
  out.data.fill(0);
  img.data.copy(out.data, 0);
  return out;
}

async function main() {
  await mkdir(SHOTS, { recursive: true });
  const design = await serveFolder(DESIGN);
  const build = SELF ? design : PREVIEW ? await serveFolder(join(ROOT, 'dist-preview'), SUBPATH) : await servePreview(4321);
  const browser = await chromium.launch();
  const errors = [];
  const rows = [];
  let worst = 0;
  try {
    for (const name of PAGES) {
      for (const vp of VIEWPORTS) {
        const a = await shoot(browser, `${design.url}/${name}.html`, vp, errors);
        const buildUrl = SELF ? `${design.url}/${name}.html` : PREVIEW ? `${build.url}${SUBPATH}/${name}.html` : `${build.url}/${name === 'index' ? '' : name}`;
        const b = await shoot(browser, buildUrl, vp, errors);
        const h = Math.max(a.png.height, b.png.height);
        const A = pad(a.png, h), B = pad(b.png, h);
        const diff = new PNG({ width: vp.width, height: h });
        const n = pixelmatch(A.data, B.data, diff.data, vp.width, h, { threshold: 0.1 });
        const pct = (100 * n) / (vp.width * h);
        worst = Math.max(worst, pct);
        await writeFile(join(SHOTS, `${name}-${vp.name}-diff.png`), PNG.sync.write(diff));
        await writeFile(join(SHOTS, `${name}-${vp.name}-design.png`), PNG.sync.write(a.png));
        await writeFile(join(SHOTS, `${name}-${vp.name}-build.png`), PNG.sync.write(b.png));
        rows.push({ page: name, viewport: vp.name, design_h: a.png.height, build_h: b.png.height, diff_pct: +pct.toFixed(2), fonts_design: a.fonts.join('/'), fonts_build: b.fonts.join('/') });
        console.log(`${name.padEnd(13)} ${vp.name.padEnd(7)} ${pct.toFixed(2).padStart(6)}%  heights ${a.png.height}/${b.png.height}  fonts ${a.fonts.join('/')} vs ${b.fonts.join('/')}`);
      }
    }
  } finally {
    await browser.close();
    design.srv.close();
    if (!SELF) build.srv.close();
  }
  await writeFile(join(SHOTS, 'parity.json'), JSON.stringify(rows, null, 2));
  if (errors.length) { console.log('\nconsole errors:'); errors.forEach((e) => console.log('  ' + e)); }
  console.log(`\nworst page: ${worst.toFixed(2)}% (limit ${LIMIT}%)`);
  process.exit(worst > LIMIT ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(2); });
