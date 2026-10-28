import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

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

// The claim and invite landings are left out of the sitemap: a link to one
// carries a code, and the bare page is nothing to find on its own.
const unlisted = ['https://sawaza.app/claim', 'https://sawaza.app/invite'];

export default defineConfig({
  site: 'https://sawaza.app',
  output: 'static',
  trailingSlash: 'never',
  compressHTML: false,
  build: { format: 'file', assets: preview ? 'assets' : '_astro' },
  integrations: [sitemap({ filter: (page) => !unlisted.includes(page) })],
});
