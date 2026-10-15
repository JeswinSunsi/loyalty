<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 32 });
</script>
<template>
  <svg class="brand-mark" :width="size" :height="size" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
    <circle cx="16" cy="16" r="16" fill="var(--mark-bg, var(--brand))" />
    <circle cx="16" cy="16" r="12.6" fill="none" stroke="var(--mark-fg, #fff)" stroke-width="1" stroke-dasharray="1.6 1.6" opacity=".7" />
    <path d="M10 20.5V11.5l6 6.5 6-6.5v9" fill="none" stroke="var(--mark-fg, #fff)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>
