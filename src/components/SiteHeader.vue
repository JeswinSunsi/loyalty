<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ArrowUpRight } from '@lucide/vue';
import BrandMark from './BrandMark.vue';
import { memberCard, STAMP_TARGET } from '../store';
withDefaults(defineProps<{ staff?: boolean; inverse?: boolean }>(), { staff: false, inverse: false });
</script>
<template>
  <a class="skip-link" href="#main-content">Skip to content</a>
  <header class="site-header" :class="{ 'is-staff': staff, 'is-inverse': inverse }">
    <div class="header-inner">
      <RouterLink to="/" class="brand" aria-label="M Souq Rewards home">
        <BrandMark :size="30" />
        <span class="brand-name">M Souq</span>
        <span class="brand-tag">{{ staff ? 'Staff' : 'Rewards' }}</span>
      </RouterLink>
      <nav class="header-nav" aria-label="Main">
        <RouterLink v-if="staff" to="/" class="nav-link">Customer site <ArrowUpRight :size="15" aria-hidden="true" /></RouterLink>
        <RouterLink v-else to="/card/" class="nav-card" :aria-label="memberCard ? `My card, ${memberCard.marks} of ${STAMP_TARGET} stamps` : 'My card'">
          My card
          <span v-if="memberCard" class="nav-dots" aria-hidden="true">
            <span v-for="i in STAMP_TARGET" :key="i" :class="{ on: i <= memberCard.marks }" />
          </span>
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
