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
      <div class="container">
        <section class="panel empty-state">
          <p class="error-code">Error 404</p>
          <h1 class="h1">We can’t find that page</h1>
          <p class="lede">The link may be old or mistyped. Let’s get you back to your rewards.</p>
          <div class="empty-actions">
            <RouterLink to="/" class="btn btn-primary btn-lg">Go to the home page <ArrowRight :size="20" aria-hidden="true" /></RouterLink>
          </div>
        </section>
      </div>
    </main>
    <SiteFooter />
  </div>
</template>
