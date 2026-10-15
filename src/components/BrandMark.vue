<script setup lang="ts">
// A small seal: the M inside a fine gold ring.
withDefaults(defineProps<{ size?: number }>(), { size: 32 });
</script>
<template>
  <svg class="brand-mark" :width="size" :height="size" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
    <circle cx="16" cy="16" r="16" fill="var(--mark-bg, var(--brand))" />
    <circle cx="16" cy="16" r="13" fill="none" stroke="var(--mark-ring, var(--gold))" stroke-width="1" />
    <path d="M10.5 21V11.5l5.5 6 5.5-6V21" fill="none" stroke="var(--mark-fg, #fff)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>
