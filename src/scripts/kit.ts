/* Sawaza site kit: behaviour every page shares. Bundled once by the layout, it runs after the
   page has parsed, so every element it looks for is already there. */
document.documentElement.classList.add('js');

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

/* A page's name without its folder or extension, so `/how-it-works`, `/how-it-works.html` and
   `./how-it-works.html` all name the same page, and `/`, `/index.html` and `index.html` the home. */
function pageName(path: string): string {
  const clean = path.split('#')[0].split('?')[0];
  const last = clean.split('/').pop() || '';
  const name = last.replace(/\.html$/, '');
  return name === '' || name === 'index' ? '/' : name;
}
const here = () => pageName(location.pathname);

/* keeps Tab inside an open dialog */
function trap(e: KeyboardEvent, box: HTMLElement) {
  const f = $$<HTMLElement>('a[href],button:not([disabled])', box).filter(
    (n) => n.offsetParent !== null || n === document.activeElement,
  );
  if (!f.length) return;
  const a = f[0], z = f[f.length - 1];
  if (!box.contains(document.activeElement)) { e.preventDefault(); a.focus(); }
  else if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
  else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
}

/* phone menu sheet */
(function () {
  const sh = document.getElementById('msheet');
  if (!sh) return;
  const b = $<HTMLButtonElement>('.site-nav .menu-btn');
  if (!b) return;
  const bg = () => $$('.skip,.site-nav,.rail,main,footer');
  function set(o: boolean) {
    sh!.hidden = !o;
    bg().forEach((n) => { if (o) n.setAttribute('inert', ''); else n.removeAttribute('inert'); });
    b!.setAttribute('aria-expanded', o ? 'true' : 'false');
    document.documentElement.classList.toggle('menu-open', o);
    if (o) { const f = $<HTMLElement>('.mclose', sh!); f && f.focus(); }
    else b!.focus({ preventScroll: true });
  }
  b.addEventListener('click', () => set(sh.hidden));
  $('.mclose', sh)?.addEventListener('click', () => set(false));
  sh.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    if (t === sh || t.closest('a')) set(false);
  });
  document.addEventListener('keydown', (e) => {
    if (sh.hidden) return;
    if (e.key === 'Escape') set(false);
    else if (e.key === 'Tab') trap(e, sh);
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 980 && !sh.hidden) set(false); });
})();

/* store sheet: every "Get the app" in the bar and the menu opens it, so no page needs its own */
(function () {
  const play = '<svg class="b-ic" viewBox="0 0 24 26" aria-hidden="true"><path d="M1.1.5C.8.8.6 1.3.6 1.9v22.2c0 .6.2 1.1.5 1.4l.1.1L13.2 13.1v-.3L1.2.4z" fill="#4285F4"/><path d="M17.1 17l-3.9-3.9v-.3l3.9-3.9.1.1 4.6 2.6c1.3.7 1.3 2 0 2.7l-4.6 2.6z" fill="#FBBC04"/><path d="M17.2 16.9L13.2 13 1.1 25.5c.5.5 1.2.5 2.1.1l14-8.7" fill="#EA4335"/><path d="M17.2 9.1L3.2.4C2.4-.1 1.6 0 1.1.5L13.2 13z" fill="#34A853"/></svg>';
  const apple = '<svg class="b-ic" viewBox="0 0 26 26" aria-hidden="true"><path d="M17.5 13.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.8-3.5.8s-1.8-.8-3-.8c-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2.1-1.1 2.8-2.3.9-1.3 1.3-2.6 1.3-2.6s-2.5-1-2.5-3.7zM15.3 6.8c.6-.8 1.1-1.8 1-2.9-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.8-1 2.8 1 .1 2-.5 2.7-1.3z" fill="#fff"/></svg>';
  const box = document.createElement('div');
  box.className = 'ssheet'; box.id = 'ssheet'; box.hidden = true;
  box.innerHTML = '<div class="sp" role="dialog" aria-modal="true" aria-labelledby="ss-t"><button class="sclose" type="button" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button><h2 id="ss-t">Get Sawaza</h2><p>Sawaza is free to use.</p><div class="badges"><a class="badge b-apple" href="#get">' + apple + '<span><small>Download on the</small><b>App Store</b></span></a><a class="badge b-play" href="#get">' + play + '<span><small>GET IT ON</small><b>Google Play</b></span></a></div></div>';
  document.body.appendChild(box);
  let from: HTMLElement | null = null;
  const x = $<HTMLButtonElement>('.sclose', box)!;
  function open(o: boolean, t?: HTMLElement | null) {
    box.hidden = !o;
    $$('.skip,.site-nav,.rail,main,footer,.msheet').forEach((n) => {
      if (o) n.setAttribute('inert', ''); else n.removeAttribute('inert');
    });
    document.documentElement.classList.toggle('menu-open', o);
    if (o) { from = t || (document.activeElement as HTMLElement); x.focus(); }
    else if (from && from.focus) from.focus({ preventScroll: true });
  }
  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const a = t.closest && t.closest<HTMLAnchorElement>('.site-nav .btn,.msheet .btn');
    if (a && /get the app/i.test(a.textContent || '')) {
      e.preventDefault(); e.stopImmediatePropagation();
      const m = document.getElementById('msheet');
      if (m && !m.hidden) {
        m.hidden = true;
        const mb = $<HTMLButtonElement>('.site-nav .menu-btn');
        mb && mb.setAttribute('aria-expanded', 'false');
        from = mb;
      }
      open(true, from || a);
      return;
    }
    if (!box.hidden && (t === box || t.closest('.sclose'))) open(false);
  }, true);
  document.addEventListener('keydown', (e) => {
    if (box.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); open(false); }
    else if (e.key === 'Tab') trap(e, box);
  });
})();

/* mark the page you are on in the nav and the menu sheet */
(function () {
  const page = here();
  $$<HTMLAnchorElement>('.site-nav .links a,.msheet .mbig a').forEach((a) => {
    if (pageName(a.getAttribute('href') || '') === page) a.setAttribute('aria-current', 'page');
  });
})();

/* swipe rows on phones: "i of n" under each row. A .kt-band (.kt-grid of .kt, .kt-count) or any [data-swipe] row with a [data-swipe-count] beside it */
(function () {
  const mq = window.matchMedia('(max-width:640px)');
  function wire(row: HTMLElement, out: HTMLElement, cards: ArrayLike<Element>) {
    const n = cards.length;
    if (!n) return;
    function upd() {
      if (!mq.matches) { out.textContent = ''; return; }
      const w = cards[0].getBoundingClientRect().width + 10;
      let i = Math.min(n, Math.max(1, Math.round(row.scrollLeft / w) + 1));
      if (row.scrollLeft + row.clientWidth >= row.scrollWidth - 4) i = n;
      out.textContent = i + ' of ' + n;
    }
    row.addEventListener('scroll', () => { requestAnimationFrame(upd); }, { passive: true });
    if (mq.addEventListener) mq.addEventListener('change', upd);
    window.addEventListener('resize', upd);
    upd();
  }
  $$('.kt-band').forEach((band) => {
    const row = $('.kt-grid', band), out = $('.kt-count', band);
    if (row && out) wire(row, out, row.querySelectorAll('.kt'));
  });
  $$('[data-swipe]').forEach((row) => {
    const out = row.parentNode && (row.parentNode as ParentNode).querySelector<HTMLElement>('[data-swipe-count]');
    if (out) wire(row, out, row.children);
  });
})();

/* .reveal: rises in once as it enters; nothing moves under reduced motion */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => { if (e.isIntersecting) { e.target.classList.remove('pre'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.top > innerHeight) { el.classList.add('pre'); io.observe(el); }
  });
})();

/* question rail: lights the question whose section is mid-screen; each a[data-sec] names a section id */
(function () {
  const rail = $$<HTMLAnchorElement>('.rail a[data-sec]');
  if (!rail.length || !('IntersectionObserver' in window)) return;
  const ro = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (e.isIntersecting) rail.forEach((a) => { a.classList.toggle('on', a.dataset.sec === e.target.id); });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  rail.forEach((a) => { const el = document.getElementById(a.dataset.sec || ''); if (el) ro.observe(el); });
})();

/* links: a new page opens at its top, a link to a section lands on that section below the sticky nav.
   The frame a page is shown in may drop a link's #section or keep the last scroll, so the target is
   carried across in sessionStorage and every landing is done here, not left to the browser. */
(function () {
  try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) { /* no history api */ }
  const KEY = 'sawaza-go';
  function navH() { const n = $('.site-nav'); return n ? n.getBoundingClientRect().height : 0; }
  function jump(id: string, smooth: boolean) {
    const el = id ? document.getElementById(id) : null;
    const y = el ? Math.max(0, el.getBoundingClientRect().top + window.pageYOffset - navH() - 8) : 0;
    window.scrollTo({ top: y, left: 0, behavior: smooth ? 'smooth' : 'instant' });
    return !!el;
  }
  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const a = t.closest && t.closest<HTMLAnchorElement>('a[href]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
    const h = a.getAttribute('href') || '';
    if (/^[a-z]+:/i.test(h)) return;
    const i = h.indexOf('#'), page = i < 0 ? h : h.slice(0, i), id = i < 0 ? '' : h.slice(i + 1);
    if (id.indexOf('i-') === 0) return;
    if (page === '' || pageName(page) === here()) {
      if (!id) return;
      e.preventDefault();
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (jump(id, !reduce)) { try { history.replaceState(null, '', '#' + id); } catch (err) { /* sandboxed frame */ } }
      return;
    }
    try { sessionStorage.setItem(KEY, id || ''); } catch (err) { /* storage blocked */ }
  }, true);
  function land() {
    let id = '';
    try { id = sessionStorage.getItem(KEY) || ''; sessionStorage.removeItem(KEY); } catch (e) { /* storage blocked */ }
    if (!id && location.hash) id = location.hash.slice(1);
    jump(id, false);
    /* fonts and drawings settle the layout late: land again once they have */
    if (id) {
      setTimeout(() => { jump(id, false); }, 350);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { jump(id, false); });
    }
  }
  if (document.readyState === 'complete') land(); else window.addEventListener('load', land);
  window.addEventListener('pageshow', (e) => { if (e.persisted) land(); });
})();
