<script setup lang="ts">
import { RouterLink } from 'vue-router';
import BrandMark from './BrandMark.vue';
import HoverArrow from './HoverArrow.vue';
withDefaults(defineProps<{ staff?: boolean }>(), { staff: false });
</script>
<template>
  <a class="skip-link" href="#main-content">Skip to content</a>
  <header class="site-header" :class="{ 'is-staff': staff }">
    <div class="header-inner">
      <RouterLink to="/" class="brand" aria-label="M Souq Rewards home">
        <BrandMark :size="26" />
        <span class="brand-name">M Souq</span>
        <span class="brand-tag">{{ staff ? 'Staff' : 'Rewards' }}</span>
      </RouterLink>
      <nav class="header-nav" aria-label="Main">
        <RouterLink v-if="staff" to="/" class="nav-link">Customer site <HoverArrow /></RouterLink>
        <RouterLink v-else to="/card/" class="btn btn-primary btn-sm">My card <HoverArrow /></RouterLink>
      </nav>
    </div>
  </header>
</template>
