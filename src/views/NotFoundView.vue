<script setup lang="ts">
import { RouterLink } from 'vue-router';
import SiteHeader from '../components/SiteHeader.vue';
</script>
<template>
  <main class="min-h-[100dvh]">
    <SiteHeader action-href="/" action-label="Home" />
    <div class="mx-auto max-w-[520px] px-4 py-16 sm:px-8">
      <h1 class="text-4xl font-extrabold tracking-[-.06em]">Page not found.</h1>
      <RouterLink to="/" class="primary-action mt-7">Back to rewards</RouterLink>
    </div>
  </main>
</template>
