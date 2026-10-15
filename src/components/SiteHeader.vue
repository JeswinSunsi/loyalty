<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ArrowUpRight } from '@lucide/vue';
withDefaults(defineProps<{ actionHref?: string; actionLabel?: string; staff?: boolean }>(), { staff: false });
</script>
<template>
  <div class="demo-bar"><span class="demo-badge">Interactive demo</span><span>Try the rewards experience. No real stamps or gifts are issued.</span></div>
  <a class="skip-link" href="#main-content">Skip to content</a>
  <header class="site-header">
    <div class="header-inner">
      <RouterLink to="/" class="brand-lockup" aria-label="M Souq Rewards home"><span class="wordmark">M Souq<span>.</span></span><span class="brand-divider" /><span class="brand-caption">{{ staff ? 'STAFF CHECKOUT' : 'REWARDS' }}</span></RouterLink>
      <nav aria-label="Main navigation">
        <RouterLink v-if="!staff" class="header-how" :to="{ path: '/', hash: '#how-it-works' }">How it works</RouterLink>
        <RouterLink v-if="actionHref && actionLabel" :to="actionHref" class="header-action">{{ actionLabel }}<ArrowUpRight :size="16" aria-hidden="true" /></RouterLink>
      </nav>
    </div>
  </header>
</template>
