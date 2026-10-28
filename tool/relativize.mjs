// After a preview build: rewrites every root-relative URL in the output to a relative one, so the
// folder works when it is served from a sub-path nobody knows in advance. Page links become
// `<name>.html` because the preview host has no clean-URL routing; assets keep their paths with
// the leading slash dropped, or `../` prefixed from inside a sub-folder such as _astro/.
//
//   node tool/relativize.mjs dist-preview
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, extname, dirname, sep } from 'node:path';

const OUT = process.argv[2];
if (!OUT) { console.error('usage: node tool/relativize.mjs <folder>'); process.exit(2); }

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

/* A root-relative path, as seen from a file `depth` folders below the root. */
function rel(path, depth) {
  const up = depth ? '../'.repeat(depth) : '';
  const h = path.indexOf('#'), hash = h < 0 ? '' : path.slice(h), bare = h < 0 ? path : path.slice(0, h);
  const q = bare.indexOf('?'), query = q < 0 ? '' : bare.slice(q), route = q < 0 ? bare : bare.slice(0, q);
  if (route === '' || route === '/') return `${up}index.html${query}${hash}`;
  const noSlash = route.replace(/^\//, '');
  // a page route has no extension; an asset keeps its own
  const isPage = !extname(noSlash) && !noSlash.startsWith('_astro/') && !noSlash.startsWith('img/');
  return `${up}${noSlash}${isPage ? '.html' : ''}${query}${hash}`;
}

/* Paths that start with a slash and are not a scheme-relative `//host` or an inline `data:` URL. */
const ATTR = /\b(href|src|poster|srcset|content)="(\/(?!\/)[^"]*)"/g;
const URLFN = /url\((['"]?)(\/(?!\/)[^'")]*)\1\)/g;

function rewriteCss(css, depth) {
  return css.replace(URLFN, (_, q, p) => `url(${q}${rel(p, depth)}${q})`);
}

function rewriteHtml(html, depth) {
  return html
    .replace(ATTR, (m, attr, val) => {
      if (attr === 'srcset') return `${attr}="${val.split(',').map((c) => c.trim().replace(/^\/(?!\/)\S*/, (p) => rel(p, depth))).join(', ')}"`;
      if (attr === 'content' && !/^\/(_astro|img)\//.test(val)) return m; // meta content that is not an asset path
      return `${attr}="${rel(val, depth)}"`;
    })
    .replace(URLFN, (_, q, p) => `url(${q}${rel(p, depth)}${q})`);
}

let count = 0;
for (const file of await walk(OUT)) {
  const ext = extname(file);
  if (!['.html', '.css'].includes(ext)) continue;
  const depth = relative(OUT, dirname(file)).split(sep).filter(Boolean).length;
  const before = await readFile(file, 'utf8');
  const after = ext === '.css' ? rewriteCss(before, depth) : rewriteHtml(before, depth);
  if (after !== before) { await writeFile(file, after); count++; }
}
console.log(`relativized ${count} files under ${OUT}`);
