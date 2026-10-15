import { ref } from 'vue';

/*
  Opening the card page from any other page plays a short curtain first: a violet panel covers the screen and the
  M Souq stamp presses down. The router holds the navigation until the cover is in place, then the panel sweeps away
  to reveal the card page. Keep the timings in step with the .ct rules in style.css.
*/
export type CurtainPhase = 'idle' | 'cover' | 'reveal';
export const curtain = ref<CurtainPhase>('idle');
const COVER_MS = 740;
const REVEAL_MS = 600;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let timer = 0;

export function coverForCard() {
  if (reducedMotion.matches) return Promise.resolve();
  window.clearTimeout(timer);
  curtain.value = 'cover';
  return new Promise<void>(resolve => { timer = window.setTimeout(resolve, COVER_MS); });
}

// Wait until the card page has been drawn under the cover, so the reveal never shows a half-built page.
export function revealCard() {
  if (curtain.value !== 'cover') return;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (curtain.value !== 'cover') return;
    curtain.value = 'reveal';
    timer = window.setTimeout(() => { curtain.value = 'idle'; }, REVEAL_MS);
  }));
}
