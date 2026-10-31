import type { APIRoute } from 'astro';
import { LAUNCHED } from '../config';

/* Crawlers may read every page either way. Before launch each page carries a noindex tag, which a
   crawler only sees if it is allowed in, and there is no sitemap; after launch the sitemap is
   offered. The claim and invite landings stay out of the sitemap because a link to one carries a
   code that is nobody's to index. */
export const GET: APIRoute = () =>
  new Response(
    ['User-agent: *', 'Allow: /', ...(LAUNCHED ? ['', 'Sitemap: https://sawaza.app/sitemap-index.xml'] : []), ''].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
