<script setup lang="ts">
import { RouterLink } from 'vue-router';
import BrandMark from './BrandMark.vue';
const year = new Date().getFullYear();
</script>
<template>
  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <BrandMark :size="40" />
        <div>
          <p class="footer-name">M Souq Rewards</p>
          <p class="footer-note">Three stamps. One free gift. See you at the till.</p>
        </div>
      </div>
      <nav class="footer-links" aria-label="Footer">
        <RouterLink :to="{ path: '/', hash: '#how-it-works' }">How it works</RouterLink>
        <RouterLink :to="{ path: '/', hash: '#questions' }">Help and questions</RouterLink>
        <RouterLink to="/staff/">Staff checkout</RouterLink>
      </nav>
      <p class="footer-copy">© {{ year }} M Souq</p>
    </div>
  </footer>
</template>
