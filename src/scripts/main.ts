import { initMotion } from './motion/runtime';
import { interactions } from './motion/interactions';
import { initScrollEffects } from './motion/scroll';
import { initTracking } from './track';

initMotion(interactions);
initScrollEffects();
initTracking();
// Start states are applied synchronously above; reveal the page.
requestAnimationFrame(() => document.documentElement.classList.remove('motion-pending'));
