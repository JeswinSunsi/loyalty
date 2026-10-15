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
      <h1 class="headline">This page isn’t on the card.</h1>
      <p class="lede">The link may be old or mistyped. Let’s get you back to your rewards.</p>
      <RouterLink to="/" class="btn btn-primary btn-lg">Back to rewards <ArrowRight :size="18" aria-hidden="true" /></RouterLink>
    </main>
  </div>
</template>
