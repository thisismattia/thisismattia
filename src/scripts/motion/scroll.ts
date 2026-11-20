// Scroll-driven and ambient effects (ported from the old Webflow IX2 + inline scripts).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const $ = (s: string) => document.querySelector<HTMLElement>(s);
const $$ = (s: string) => [...document.querySelectorAll<HTMLElement>(s)];
const ix = (name: string) => $(`[data-ix="${name}"]`);

export function initScrollEffects() {
  const mm = gsap.matchMedia();

  // Testimonial cards drop in when they scroll into view.
  mm.add({ desktop: '(min-width: 992px)', mobile: '(max-width: 991px)' }, (ctx) => {
    const { desktop } = ctx.conditions!;
    const from = desktop ? { x: 100, y: 100, rotation: -10 } : { x: 20, y: 100, rotation: -3 };
    for (const card of $$('.testimonial_card')) {
      gsap.set(card, { ...from, opacity: 0 });
      ScrollTrigger.create({
        trigger: card,
        start: 'top bottom',
        once: true,
        onEnter: () => gsap.to(card, { x: 0, y: 0, rotation: 0, opacity: 1, duration: 0.1, delay: 0.5, ease: 'power3.inOut' }),
      });
    }
  });

  // Case-study cards scale up while in view, shrink when they leave.
  for (const card of $$('.grid_item.is-central.is-work')) {
    gsap.set(card, { scale: 0.8 });
    const enter = () => gsap.timeline()
      .to(card, { scale: 0.9, duration: 0.5, overwrite: true })
      .to(card, { scale: 1, duration: 0.3, ease: 'power3.out' });
    const leave = () => gsap.to(card, { scale: 0.8, duration: 0.3, ease: 'expo.out', overwrite: true });
    ScrollTrigger.create({
      trigger: card, start: 'top 75%', end: 'bottom 25%',
      onEnter: enter, onEnterBack: enter, onLeave: leave, onLeaveBack: leave,
    });
  }

  // Work slides under the hero.
  const slides = {
    center: ix('work-slide'), l1: ix('work-slide-left-1'), r1: ix('work-slide-right-1'),
    l2: ix('work-slide-left-2'), r2: ix('work-slide-right-2'),
  };
  mm.add('(min-width: 768px)', () => {
    // Pop in once…
    ScrollTrigger.create({
      trigger: ix('work-slide-wrap'), start: 'top bottom', once: true,
      onEnter: () => {
        const ease = 'back.out';
        gsap.to(slides.center, { y: -7, duration: 0.3, ease });
        gsap.to(slides.r1, { y: -6, rotation: 3, duration: 0.3, delay: 0.1, ease });
        gsap.to(slides.l1, { y: -6, rotation: -3, duration: 0.3, delay: 0.1, ease });
        gsap.to(slides.r2, { y: -5, rotation: 6, duration: 0.3, delay: 0.2, ease });
        gsap.to(slides.l2, { y: -5, rotation: -6, duration: 0.3, delay: 0.2, ease });
      },
    });
  });
  mm.add('(min-width: 992px)', () => {
    // …then drift left as the next section scrolls by.
    gsap.fromTo(ix('work-slide-wrap'), { x: 0 }, {
      x: '-5vw', ease: 'none',
      scrollTrigger: { trigger: ix('book-wrap-first'), start: 'top bottom', end: 'bottom top', scrub: 0.5 },
    });
  });
  mm.add('(max-width: 767px)', () => {
    // Mobile: slides fan out and fade in with scroll.
    const tl = gsap.timeline({
      scrollTrigger: { trigger: ix('section-work-slide'), start: 'top bottom', end: 'bottom top', scrub: 0.5 },
    });
    tl.fromTo(slides.center, { y: 0, opacity: 0 }, { y: '-5vw', duration: 90, ease: 'none' }, 10)
      .to(slides.center, { opacity: 1, duration: 10 }, 10)
      .fromTo(slides.l1, { x: 0, y: 0, rotation: -5, opacity: 0 }, { x: '-2rem', y: '-2rem', rotation: -8, duration: 90, ease: 'none' }, 10)
      .to(slides.l1, { opacity: 1, duration: 14 }, 10)
      .fromTo(slides.r1, { x: 0, y: 0, rotation: 5, opacity: 0 }, { x: '2rem', y: '-4rem', rotation: 8, duration: 90, ease: 'none' }, 10)
      .to(slides.r1, { opacity: 1, duration: 12 }, 10);
  });

  // Final CTA: video panel slides up into its mask.
  const mask = ix('mask');
  if (mask) {
    ScrollTrigger.create({
      trigger: mask, start: 'top 75%', once: true,
      onEnter: () => {
        const vars = { y: 0, duration: 1.25, ease: 'power4.inOut' };
        gsap.to(mask.querySelectorAll('.movement, .movement-inverse-2'), vars);
        gsap.to(mask.querySelectorAll('.overlay'), { ...vars, yPercent: 100 });
      },
    });
  }

  // Client logo strip: step one logo (20vw) every 3s, then loop.
  const track = $('.grid_global.is-clients');
  if (track) {
    const items = 8, step = 20;
    let i = 0;
    const next = () => {
      if (++i > items) { i = 1; gsap.set(track, { x: 0 }); }
      gsap.to(track, { x: `-${i * step}vw`, duration: 0.8, ease: 'expo.out' });
      gsap.delayedCall(3, next);
    };
    gsap.delayedCall(3, next);
  }

  return mm;
}
