<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ArrowUpRight } from '@lucide/vue';
withDefaults(defineProps<{ actionHref?: string; actionLabel?: string; staff?: boolean }>(), { staff: false });
</script>
<template>
  <header class="site-header">
    <div class="header-inner">
      <RouterLink to="/" class="brand-lockup" aria-label="M Souq Rewards home"><span class="wordmark">M Souq<span>.</span></span><span class="brand-divider" /><span class="brand-caption">{{ staff ? 'FOR THE TEAM' : 'A LITTLE MORE EVERY DAY' }}</span></RouterLink>
      <RouterLink v-if="actionHref && actionLabel" :to="actionHref" class="header-action">{{ actionLabel }}<ArrowUpRight :size="16" /></RouterLink>
    </div>
  </header>
</template>
