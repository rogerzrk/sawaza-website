import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// Static site. Pages build to flat `<name>.html` files so Firebase Hosting's
// cleanUrls serves `/how-it-works` from `how-it-works.html`, and the preview
// build can turn the same files into a folder that works from any sub-path.
// Whitespace in the markup is kept as written: the design relies on the spaces
// between inline elements, and compressing them would change what is drawn.
//
// The preview build (SAWAZA_PREVIEW=true) puts bundled assets under `assets/`
// rather than `_astro/`: the host the preview is published to refuses any path
// that starts with an underscore.
const preview = process.env.SAWAZA_PREVIEW === 'true';

// Before launch nothing is listed for search engines, so there is no sitemap to offer them.
const launched = process.env.PUBLIC_LAUNCHED === 'true';

// The claim and invite landings are left out of the sitemap: a link to one
// carries a code, and the bare page is nothing to find on its own.
const unlisted = ['https://sawaza.app/claim', 'https://sawaza.app/invite'];

// Before launch the product pages are not published at all. Each page sends a visitor Home
// if it is built, but a redirect page still names the page it came from, so the built files
// are removed and their addresses answer with the site's own not-found page.
const unpublished = ['how-it-works', 'groups', 'businesses', 'trust', 'help'];
const prelaunchCut = {
  name: 'prelaunch-cut',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      for (const page of unpublished) await rm(fileURLToPath(new URL(`${page}.html`, dir)), { force: true });
    },
  },
};

export default defineConfig({
  site: 'https://sawaza.app',
  output: 'static',
  trailingSlash: 'never',
  compressHTML: false,
  build: { format: 'file', assets: preview ? 'assets' : '_astro' },
  integrations: launched ? [sitemap({ filter: (page) => !unlisted.includes(page) })] : [prelaunchCut],
});
