<script setup lang="ts">
import { RouterLink } from 'vue-router';
import BrandMark from './BrandMark.vue';
const year = new Date().getFullYear();
</script>
<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <span class="footer-brand"><BrandMark :size="22" /> © {{ year }} M Souq</span>
      <nav class="footer-links" aria-label="Footer">
        <RouterLink :to="{ path: '/', hash: '#questions' }">Questions</RouterLink>
        <RouterLink to="/staff/">Staff checkout</RouterLink>
      </nav>
    </div>
  </footer>
</template>
