// Renders public/og.png, the 1200x630 card every page shares when a link is unfurled: the
// site's navy ground with its ruled lines, the lockup, the home page's line and the money
// line from the footer, set in the site's own fonts.
//
//   PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node tool/og.mjs
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const font = (pkg, file) => pathToFileURL(resolve('node_modules/@fontsource', pkg, 'files', file)).href;
const mark = `<g fill="#E3A82B"><path d="M63.180,384.799 L132.329,384.799 A102.729,106.211 0 0 0 235.058,278.587 A189.788,186.305 0 0 1 424.846,92.282 L451.650,92.282 A13.929,13.929 0 0 0 460.756,67.815 A278.587,278.587 0 0 0 6.777,339.664 A57.807,57.807 0 0 0 63.180,384.799 Z"/><path d="M493.995,172.376 L424.846,172.376 A102.729,106.211 0 0 0 322.117,278.587 A189.788,186.305 0 0 1 132.329,464.893 L105.525,464.893 A13.929,13.929 0 0 0 96.419,489.360 A278.587,278.587 0 0 0 550.398,217.511 A57.807,57.807 0 0 0 493.995,172.376 Z"/></g>`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Outfit;font-weight:800;src:url(${font('outfit', 'outfit-latin-800-normal.woff2')}) format('woff2')}
@font-face{font-family:Outfit;font-weight:700;src:url(${font('outfit', 'outfit-latin-700-normal.woff2')}) format('woff2')}
@font-face{font-family:"Plus Jakarta Sans";font-weight:500;src:url(${font('plus-jakarta-sans', 'plus-jakarta-sans-latin-500-normal.woff2')}) format('woff2')}
html,body{margin:0}
body{width:1200px;height:630px;background:#0A1A3D;color:#EDE8DE;font-family:"Plus Jakarta Sans",sans-serif;
  background-image:repeating-linear-gradient(180deg,transparent 0 31px,rgba(237,232,222,.05) 31px 32px);position:relative;overflow:hidden}
.glow{position:absolute;right:-180px;top:-220px;width:760px;height:760px;border-radius:50%;background:radial-gradient(closest-side,rgba(227,168,43,.22),rgba(227,168,43,0))}
.in{position:absolute;inset:0;padding:72px 84px;display:flex;flex-direction:column;justify-content:space-between}
.lock{display:flex;align-items:center;gap:18px;font:700 44px/1 Outfit,sans-serif;letter-spacing:-.02em}
.lock svg{width:56px;height:56px}
h1{font:800 104px/.98 Outfit,sans-serif;letter-spacing:-.04em;margin:0;max-width:12em;text-wrap:balance}
h1 em{font-style:normal;color:#E3A82B}
.money{font-size:28px;color:#CBD0DA;margin:0}
.site{position:absolute;right:84px;bottom:72px;font-size:24px;color:#939CB1}
</style></head><body><div class="glow"></div><div class="in">
<div class="lock"><svg viewBox="0 0 557 557">${mark}</svg><span>Sawaza</span></div>
<h1>The record both sides <em>keep.</em></h1>
<p class="money">Sawaza holds no funds and moves no money.</p>
</div><div class="site">sawaza.app</div></body></html>`;

const browser = await chromium.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'public/og.png', type: 'png' });
await browser.close();
console.log('public/og.png written');
