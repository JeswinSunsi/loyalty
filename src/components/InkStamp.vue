<script setup lang="ts">
import { useId } from 'vue';
// A rubber-stamp impression: ring lettering, the M monogram, and a grain filter so it reads as ink rather than a flat icon.
withDefaults(defineProps<{ ring?: string; texture?: boolean }>(), { ring: 'M SOUQ · REWARDS · M SOUQ · REWARDS · ', texture: true });
const id = useId();
</script>
<template>
  <svg class="ink-stamp" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <defs>
      <path :id="`${id}-ring`" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
      <filter v-if="texture" :id="`${id}-ink`" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="7" result="grain" />
        <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.2 0 0 0 2.1" result="speckle" />
        <feComposite in="SourceGraphic" in2="speckle" operator="in" result="inked" />
        <feTurbulence type="fractalNoise" baseFrequency=".06" numOctaves="2" seed="2" result="warp" />
        <feDisplacementMap in="inked" in2="warp" scale="1.2" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
    <g :filter="texture ? `url(#${id}-ink)` : undefined" fill="none" stroke="currentColor">
      <circle cx="50" cy="50" r="47" stroke-width="4" />
      <circle cx="50" cy="50" r="29" stroke-width="2.2" />
      <text fill="currentColor" stroke="none" font-size="9" font-weight="600" letter-spacing="1.2"><textPath :href="`#${id}-ring`" textLength="236" lengthAdjust="spacing">{{ ring }}</textPath></text>
      <path d="M38 59V41l12 13 12-13v18" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
    </g>
  </svg>
</template>
