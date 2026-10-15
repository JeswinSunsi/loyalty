<script setup lang="ts">
import { useId } from 'vue';
// A slowly turning gold seal: ring lettering between two fine rules. Purely decorative.
withDefaults(defineProps<{ text?: string }>(), { text: 'M SOUQ REWARDS · THREE STAMPS · ONE FREE GIFT · ' });
const id = useId();
</script>
<template>
  <svg class="seal-ring" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
    <defs><path :id="`${id}-ring`" d="M100,100 m-84,0 a84,84 0 1,1 168,0 a84,84 0 1,1 -168,0" /></defs>
    <circle cx="100" cy="100" r="97" fill="none" stroke="currentColor" stroke-width=".7" />
    <circle cx="100" cy="100" r="73" fill="none" stroke="currentColor" stroke-width=".7" stroke-dasharray="1.5 3.5" />
    <text fill="currentColor" font-size="10" font-weight="600" letter-spacing="2.4">
      <textPath :href="`#${id}-ring`" textLength="522" lengthAdjust="spacing">{{ text }}</textPath>
    </text>
  </svg>
</template>
