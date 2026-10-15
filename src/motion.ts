// Keep in step with --flip-time in style.css.
export const FLIP_MS = 640;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// The move and scale that make an element laid out at `base` look as if it sat at `rect`.
function offset(rect: DOMRect, base: DOMRect) {
  const dx = rect.left + rect.width / 2 - (base.left + base.width / 2);
  const dy = rect.top + rect.height / 2 - (base.top + base.height / 2);
  return `translate(${dx}px, ${dy}px) scale(${rect.width / base.width})`;
}

/*
  Layout has just moved `el`; glide it from where it was last drawn (`from`) to its new place, or on to `to`.
  Only `transform` animates, so the compositor does the work and nothing is laid out or painted per frame.
  Taking `from` while an earlier glide is mid-way makes a reversal pick up exactly where the eye left it.
*/
export function glide(el: HTMLElement, from: DOMRect, to: DOMRect | null = null) {
  el.getAnimations().forEach(animation => animation.cancel());
  if (reducedMotion.matches) return null;
  const base = el.getBoundingClientRect();
  return el.animate(
    [{ transform: offset(from, base) }, { transform: to ? offset(to, base) : 'none' }],
    { duration: FLIP_MS, easing: 'cubic-bezier(.3, .8, .25, 1)', fill: 'forwards' },
  );
}
