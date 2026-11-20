import { initMotion } from './motion/runtime';
import { interactions } from './motion/interactions';
import { initScrollEffects } from './motion/scroll';

initMotion(interactions);
initScrollEffects();
// Start states are applied synchronously above; reveal the page.
requestAnimationFrame(() => document.documentElement.classList.remove('motion-pending'));
