<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ArrowRight } from '@lucide/vue';
import SiteHeader from '../components/SiteHeader.vue';
</script>
<template>
  <div class="page-shell">
    <SiteHeader />
    <main id="main-content" class="container empty">
      <p class="lost-code" aria-hidden="true">404</p>
      <h1 class="headline">We couldn’t find that page.</h1>
      <p class="lede">The link might be broken or out of date.</p>
      <RouterLink to="/" class="btn btn-primary btn-lg">Go to the home page <ArrowRight :size="18" aria-hidden="true" /></RouterLink>
    </main>
  </div>
</template>
