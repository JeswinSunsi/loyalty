<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ArrowLeft } from '@lucide/vue';
import BrandMark from './BrandMark.vue';
import { memberCard } from '../store';
withDefaults(defineProps<{ staff?: boolean }>(), { staff: false });
</script>
<template>
  <a class="skip-link" href="#main-content">Skip to content</a>
  <header class="site-header">
    <div class="container header-inner">
      <RouterLink to="/" class="brand" aria-label="M Souq Rewards home">
        <BrandMark :size="38" />
        <span class="brand-text">
          <span class="brand-name">M Souq</span>
          <span class="brand-sub">{{ staff ? 'Staff checkout' : 'Rewards' }}</span>
        </span>
      </RouterLink>
      <nav class="header-nav" aria-label="Main">
        <RouterLink v-if="staff" to="/" class="nav-link"><ArrowLeft :size="18" aria-hidden="true" /> Customer site</RouterLink>
        <template v-else>
          <RouterLink :to="{ path: '/', hash: '#how-it-works' }" class="nav-link nav-wide">How it works</RouterLink>
          <RouterLink :to="{ path: '/', hash: '#gifts' }" class="nav-link nav-wide">Gifts</RouterLink>
          <RouterLink :to="{ path: '/', hash: '#questions' }" class="nav-link nav-wide">Help</RouterLink>
          <RouterLink :to="memberCard ? '/card/' : '/join/'" class="btn btn-primary btn-sm">{{ memberCard ? 'My card' : 'Join free' }}</RouterLink>
        </template>
      </nav>
    </div>
    <div class="awning" aria-hidden="true" />
  </header>
</template>
