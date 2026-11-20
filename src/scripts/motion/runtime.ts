// Tiny declarative motion runtime on top of GSAP.
// Plays the interaction specs in ./interactions.ts (ported from Webflow IX3).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

type Value = string | number | null;
export type Breakpoint = 'main' | 'medium' | 'small' | 'tiny';

export interface Action {
  t: string | string[];             // selector(s); '@trigger' = the element that fired
  at: number;                       // position in the timeline (s)
  d?: number;                       // duration (s), default 0.5
  e?: string;                       // ease
  s?: { amount?: number; each?: number; from?: string }; // stagger
  tt?: 'to' | 'from' | 'fromTo' | 'set';
  p: Record<string, [Value, Value]>; // property: [from, to]
  split?: { type: 'chars' | 'words' | 'lines'; mask?: 'chars' | 'words' | 'lines' };
}

export interface Interaction {
  name: string;
  on: 'load' | 'click' | 'mouseenter' | 'mouseleave' | 'scroll';
  target?: string;
  skip?: Breakpoint[];
  repeat?: number;
  scroll?: { start: string; end: string };
  actions: Action[];
}

const BREAKPOINTS: Record<Breakpoint, string> = {
  main: '(min-width: 992px)',
  medium: '(min-width: 768px) and (max-width: 991px)',
  small: '(min-width: 480px) and (max-width: 767px)',
  tiny: '(max-width: 479px)',
};

const DEFAULT_DURATION = 0.5;
const splits = new Map<Element, SplitText>();

function resolve(sel: string, trigger: Element | null): Element[] {
  if (sel === '@trigger') return trigger ? [trigger] : [];
  if (sel.startsWith('@trigger ')) return trigger ? [...trigger.querySelectorAll(sel.slice(9))] : [];
  try {
    return [...document.querySelectorAll(sel)];
  } catch {
    console.warn(`[motion] invalid selector: ${sel}`);
    return [];
  }
}

function splitTargets(els: Element[], cfg: NonNullable<Action['split']>): Element[] {
  return els.flatMap((el) => {
    let st = splits.get(el);
    if (!st) {
      st = SplitText.create(el as HTMLElement, { type: cfg.type, mask: cfg.mask });
      splits.set(el, st);
    }
    return (st as any)[cfg.type] as Element[];
  });
}

function build(ix: Interaction, trigger: Element | null) {
  const tl = gsap.timeline({ paused: true, repeat: ix.repeat ?? 0 });
  // GSAP renders "from" states immediately; only the first tween per target+prop
  // may do that, otherwise later tweens would clobber the initial state.
  const seen = new Set<string>();

  for (const a of ix.actions) {
    const sels = Array.isArray(a.t) ? a.t : [a.t];
    let els = sels.flatMap((s) => resolve(s, trigger));
    if (a.split) els = splitTargets(els, a.split);
    if (!els.length) continue;

    const from: gsap.TweenVars = {};
    const to: gsap.TweenVars = {};
    let first = false;
    for (const [prop, [f, t]] of Object.entries(a.p)) {
      if (f !== null) from[prop] = f;
      if (t !== null) to[prop] = t;
      const key = `${sels.join('|')}:${a.split?.type ?? ''}:${prop}`;
      if (!seen.has(key)) { seen.add(key); first = true; }
    }

    const vars: gsap.TweenVars = {
      duration: a.tt === 'set' ? 0 : a.d ?? DEFAULT_DURATION,
      ...(a.e && { ease: a.e }),
      ...(a.s && { stagger: a.s as gsap.StaggerVars }),
    };
    const tt = a.tt ?? 'to';
    if (tt === 'set') tl.set(els, to, a.at);
    else if (tt === 'from') tl.from(els, { ...from, ...vars, immediateRender: first }, a.at);
    else if (tt === 'fromTo') tl.fromTo(els, { ...from, immediateRender: first }, { ...to, ...vars, immediateRender: first }, a.at);
    else tl.to(els, { ...to, ...vars }, a.at);
  }
  return tl;
}

function bind(ix: Interaction): () => void {
  if (ix.on === 'load') {
    const tl = build(ix, null).play();
    return () => tl.revert();
  }

  const triggers = ix.target ? resolve(ix.target, null) : [];
  const cleanups: (() => void)[] = [];
  for (const el of triggers) {
    if (ix.on === 'scroll') {
      const tl = build(ix, el);
      const st = ScrollTrigger.create({ trigger: el, ...ix.scroll, onEnter: () => tl.play() });
      cleanups.push(() => { st.kill(); tl.revert(); });
      continue;
    }
    let tl: gsap.core.Timeline | null = null;
    const handler = (ev: Event) => {
      if (ix.on === 'click' && (el as HTMLAnchorElement).getAttribute?.('href') === '#') ev.preventDefault();
      tl ??= build(ix, el);
      tl.restart();
    };
    el.addEventListener(ix.on, handler);
    cleanups.push(() => { el.removeEventListener(ix.on, handler); tl?.revert(); });
  }
  return () => cleanups.forEach((c) => c());
}

/** Wire every interaction, respecting the breakpoints each one should skip. */
export function initMotion(list: Interaction[]) {
  const mm = gsap.matchMedia();
  for (const ix of list) {
    const active = (Object.keys(BREAKPOINTS) as Breakpoint[]).filter((b) => !ix.skip?.includes(b));
    if (!active.length) continue;
    mm.add(active.map((b) => BREAKPOINTS[b]).join(', '), () => {
      const cleanup = bind(ix);
      return () => { cleanup(); splits.clear(); };
    });
  }
  return mm;
}
