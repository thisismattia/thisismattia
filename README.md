# thisismattia.com

Personal site of Mattia Bernini. Static site built with [Astro](https://astro.build), animated with [GSAP](https://gsap.com), hosted on **Cloudflare Pages**.

## Branches

| Branch | Purpose | Deploys to |
| --- | --- | --- |
| `main` | Production: the Astro rebuild of the original Webflow site | thisismattia.com |
| `develop` | Ongoing work (Maggese case study etc.) | `develop.<project>.pages.dev` preview |

Every push to any branch gets its own Cloudflare preview URL; merging into `main` ships to production.

## Run it locally

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static output in dist/
npm run preview   # serve dist/
```

Node 22 (see `.nvmrc`).

## Structure

```
src/
  pages/index.astro           page composition (sections in order)
  layouts/Base.astro          <head>, SEO, analytics, global styles, scripts
  components/sections/        one file per page section (Hero, Pricing, …)
  components/ui/              Icon, Testimonial
  data/                       site config, testimonials, JSON-LD schema
  icons/                      inline SVG icons → <Icon name="star" />
  styles/
    webflow-base.css          normalize + base component styles
    site.css                  all site styles (original Webflow class names kept)
    fonts.css                 self-hosted Inter / Geist / Oswald
    motion.css                hides animated elements until GSAP sets their start state
  scripts/
    main.ts                   entry
    motion/interactions.ts    declarative animation spec (ported from Webflow interactions)
    motion/runtime.ts         plays that spec with GSAP (load / click / hover / scroll, per breakpoint)
    motion/scroll.ts          scroll-driven effects, logo marquee
public/                       images, videos, fonts, _headers (Cloudflare cache rules)
```

### Editing content

- **Text / layout**: edit the section component in `src/components/sections/`.
- **Testimonials**: `src/data/testimonials.ts`.
- **Links, SEO, analytics**: `src/data/site.ts`.
- **Animations**: each entry in `motion/interactions.ts` is one interaction; elements are targeted with `data-ix="…"` attributes or class selectors. Breakpoints: `main` ≥992px, `medium` 768–991, `small` 480–767, `tiny` ≤479.

## Deploy

Cloudflare Pages, connected to this repo:

- Build command: `npm run build`
- Output directory: `dist`
- Production branch: `main`
- Env: `NODE_VERSION=22`

## Notes

- The Tiempos font files in `public/fonts` are **Klim trial ("Test") files**. They're not licensed for production use — buy the web licence from Klim and drop the real files in with the same family names.
- The Open Graph image is still referenced from the Webflow CDN (`src/data/site.ts`); move it into `public/` before the Webflow project is deleted.
