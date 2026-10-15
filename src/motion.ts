// Keep in step with --flip-time in style.css.
export const FLIP_MS = 640;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/*
  Layout has just moved `el`; slide it from where it was last drawn (`from`, a viewport top taken before the change)
  to its new place. Only `translate` animates, so the compositor does the work and nothing is laid out or painted per
  frame. Reading `from` while a previous slide is mid-way makes a reversal pick up exactly where the eye left it.
  `lift` adds a small hop in the middle.
*/
export function settle(el: HTMLElement, from: number, lift = 0) {
  el.getAnimations().forEach(animation => animation.cancel());
  const offset = from - el.getBoundingClientRect().top;
  if (reducedMotion.matches || (!offset && !lift)) return;
  const keyframes = lift
    ? [{ translate: `0 ${offset}px` }, { translate: `0 ${offset * .5 - lift}px`, offset: .45 }, { translate: '0 0' }]
    : [{ translate: `0 ${offset}px` }, { translate: '0 0' }];
  el.animate(keyframes, { duration: FLIP_MS, easing: 'cubic-bezier(.3, .75, .25, 1)' });
}
