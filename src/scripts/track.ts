// GA4 events for the questions that matter: who clicks to book, chat, open a case
// study or start the subscription, and how far people scroll.
// One delegated listener; links are recognised by where they point, so new buttons
// are tracked without extra markup.

type Params = Record<string, string | number | undefined>;
const gtag = (...args: unknown[]) => (window as any).gtag?.(...args);
const send = (name: string, params: Params = {}) => gtag('event', name, params);

// Where on the page a click happened: hero, nav, menu, book_section, final_cta, footer…
function locationOf(el: Element): string {
  if (el.closest('.nav_items, .nav_menu, [data-ix="nav-items"], [data-ix="nav-items-2"]')) return 'menu';
  if (el.closest('.n_nav')) return 'nav';
  if (el.closest('.n_footer')) return 'footer';
  if (el.closest('[data-calp]')) return 'calendar';
  const section = el.closest('section');
  const cls = section?.className ?? '';
  if (cls.includes('section_hero')) return 'hero';
  if (cls.includes('section_book_final_cta')) return 'final_cta';
  if (cls.includes('section_book')) return 'book_section';
  if (cls.includes('section_price')) return 'pricing';
  if (cls.includes('section_work')) return 'case_studies';
  if (cls.includes('section_toolkit')) return 'toolkit';
  return 'other';
}

const CASES: Record<string, string> = { getyourdailygreens: 'genki_greens', puremelt: 'pure_melt' };

function onClick(e: MouseEvent) {
  const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
  if (!a) return;
  const href = a.href;
  const location = locationOf(a);
  if (href.includes('cal.com/')) {
    const date = new URL(href).searchParams.get('date') ?? undefined;
    send('book_click', { location, date });
  } else if (href.includes('wa.me/')) send('whatsapp_click', { location });
  else if (href.startsWith('mailto:')) send('email_click', { location });
  else if (href.includes('linkedin.com/')) send('linkedin_click', { location });
  else if (href.includes('buy.stripe.com/')) send('pricing_start_click', { location });
  else if (a.closest('.section_work-wrap') && a.classList.contains('is-work')) {
    const key = Object.keys(CASES).find((k) => href.includes(k));
    send('case_study_open', { case: key ? CASES[key] : new URL(href).hostname });
  }
}

// Scroll signal: once per page view, when a section's top passes the middle of the screen.
const SECTIONS: [string, string][] = [
  ['.section_work-wrap', 'case_studies'],
  ['.section_price', 'pricing'],
  ['.section_toolkit', 'toolkit'],
  ['.section_book', 'book_section'],
  ['.section_book_final_cta', 'final_cta'],
];

function watchSections() {
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      send('section_view', { section: (en.target as HTMLElement).dataset.trackSection });
      io.unobserve(en.target);
    }
  }, { rootMargin: '0px 0px -50% 0px' });
  for (const [sel, name] of SECTIONS) {
    const el = document.querySelector<HTMLElement>(sel);
    if (el) { el.dataset.trackSection = name; io.observe(el); }
  }
}

export function initTracking() {
  // Capture phase so the event is queued before the browser leaves for a new tab or app.
  document.addEventListener('click', onClick, { capture: true });
  // Middle-click / open in new tab
  document.addEventListener('auxclick', (e) => { if (e.button === 1) onClick(e); }, { capture: true });
  watchSections();
}
