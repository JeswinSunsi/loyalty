<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ArrowRight } from '@lucide/vue';
import SiteHeader from '../components/SiteHeader.vue';
import SiteFooter from '../components/SiteFooter.vue';
</script>
<template>
  <div class="page-shell">
    <SiteHeader />
    <main id="main-content" class="page-main">
      <div class="container lost">
        <div class="lost-arch" aria-hidden="true"><span>404</span></div>
        <h1 class="h1">This stall is closed.</h1>
        <p class="lede">The page you’re looking for isn’t here. The link may be old or mistyped.</p>
        <RouterLink to="/" class="btn btn-primary btn-lg">Back to the rewards <ArrowRight :size="20" aria-hidden="true" /></RouterLink>
      </div>
    </main>
    <SiteFooter />
  </div>
</template>
