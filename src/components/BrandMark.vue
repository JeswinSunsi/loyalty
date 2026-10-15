<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 32 });
</script>
<template>
  <svg class="brand-mark" :width="size" :height="size" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
    <rect width="32" height="32" rx="8" fill="var(--mark-bg, var(--brand))" />
    <path d="M9.5 22V10.5l6.5 7 6.5-7V22" fill="none" stroke="var(--mark-fg, #fff)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>
