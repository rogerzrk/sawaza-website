import { defineConfig } from 'astro/config';

// Static site. Pages build to flat `<name>.html` files so Firebase Hosting's
// cleanUrls serves `/how-it-works` from `how-it-works.html`, and the preview
// build can turn the same files into a folder that works from any sub-path.
// Whitespace in the markup is kept as written: the design relies on the spaces
// between inline elements, and compressing them would change what is drawn.
export default defineConfig({
  site: 'https://sawaza.app',
  output: 'static',
  trailingSlash: 'never',
  compressHTML: false,
  build: { format: 'file' },
});
