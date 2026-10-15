<script setup lang="ts">
// The M under a market arch.
withDefaults(defineProps<{ size?: number }>(), { size: 32 });
</script>
<template>
  <svg class="brand-mark" :width="size" :height="size" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
    <path d="M3 31V15.5C3 8 8.8 2 16 2s13 6 13 13.5V31z" fill="var(--mark-bg, var(--teal))" />
    <path d="M10 25V14.5l6 6.5 6-6.5V25" fill="none" stroke="var(--mark-fg, var(--marigold))" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>
