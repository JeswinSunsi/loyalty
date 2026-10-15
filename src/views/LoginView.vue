<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import { ArrowLeft, ArrowRight, CreditCard } from '@lucide/vue';
import SiteHeader from '../components/SiteHeader.vue';
import { memberCard, loadExample } from '../preview';
const router = useRouter();
function example() { loadExample(); void router.push('/card/'); }
</script>
<template>
  <div><SiteHeader action-href="/join/" action-label="Create a card" />
    <main id="main-content" class="compact-page"><RouterLink to="/" class="back-link"><ArrowLeft :size="16" /> Back to rewards</RouterLink>
      <span class="page-icon"><CreditCard :size="27" aria-hidden="true" /></span><p class="eyebrow">M SOUQ REWARDS</p><h1>Your card, right here.</h1>
      <div v-if="memberCard" class="form-panel"><p class="page-description">Welcome back, {{ memberCard.name }}. Your card has {{ memberCard.marks }} of 3 stamps.</p><RouterLink to="/card/" class="primary-action full-width">Open my card <ArrowRight :size="18" /></RouterLink><p class="form-note">Your demo card is saved in this browser tab.</p></div>
      <div v-else class="form-panel"><h2>No card in this tab yet</h2><p class="page-description">Create your own card, or explore an example with one stamp already collected.</p><RouterLink to="/join/" class="primary-action full-width">Create a demo card <ArrowRight :size="18" /></RouterLink><button type="button" class="secondary-action full-width" @click="example">Try an example card</button><p class="form-note">Demo cards stay in the tab where you create them. Closing the tab clears your progress.</p></div>
    </main>
  </div>
</template>
