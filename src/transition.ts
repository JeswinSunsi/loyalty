import { ref } from 'vue';

/*
  Opening the card page from any other page plays a short curtain: a forest-green panel opens as a circle from where
  the visitor tapped, the gold seal turns in it, and once the card page is drawn underneath the panel lifts away.
  The router holds the navigation until the cover is in place. Keep the timings in step with the .ct rules in style.css.
*/
export type CurtainPhase = 'idle' | 'cover' | 'reveal';
export const curtain = ref<CurtainPhase>('idle');
// Where the circle opens from, as a share of the viewport.
export const curtainOrigin = ref({ x: 50, y: 50 });
const COVER_MS = 700;
const REVEAL_MS = 700;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let timer = 0;

window.addEventListener('pointerdown', event => {
  curtainOrigin.value = { x: (event.clientX / window.innerWidth) * 100, y: (event.clientY / window.innerHeight) * 100 };
}, { capture: true, passive: true });

export function coverForCard() {
  if (reducedMotion.matches) return Promise.resolve();
  window.clearTimeout(timer);
  curtain.value = 'cover';
  return new Promise<void>(resolve => { timer = window.setTimeout(resolve, COVER_MS); });
}

// Wait until the card page has been drawn under the cover, so the reveal never shows a half-built page.
// A short timer backs up the frame callbacks, which a background tab may never run, so the curtain can't get stuck.
export function revealCard() {
  if (curtain.value !== 'cover') return;
  const lift = () => {
    if (curtain.value !== 'cover') return;
    curtain.value = 'reveal';
    timer = window.setTimeout(() => { curtain.value = 'idle'; }, REVEAL_MS);
  };
  requestAnimationFrame(() => requestAnimationFrame(lift));
  window.setTimeout(lift, 150);
}
