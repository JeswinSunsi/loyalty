import type { Directive } from 'vue';

/*
  v-reveal: the element rises into place the first time it scrolls into view.
  v-reveal="2" staggers it two steps behind its siblings. With reduced motion, or no IntersectionObserver,
  everything is simply shown.
*/
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const observer: IntersectionObserver | null = 'IntersectionObserver' in window
  ? new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-in');
      observer?.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 })
  : null;

export const reveal: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    el.classList.add('reveal');
    if (binding.value) el.style.setProperty('--stagger', String(binding.value));
    if (!observer || reducedMotion.matches) { el.classList.add('is-in'); return; }
    observer.observe(el);
  },
  unmounted(el) { observer?.unobserve(el); },
};

declare module 'vue' {
  interface GlobalDirectives { vReveal: typeof reveal }
}
