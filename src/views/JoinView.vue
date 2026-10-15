<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { ArrowLeft, ArrowRight, Gift } from '@lucide/vue';
import SiteHeader from '../components/SiteHeader.vue';
import LoyaltyCard from '../components/LoyaltyCard.vue';
import { createCard, memberCard } from '../preview';
const router = useRouter();
const name = ref('');
const error = ref('');
function submit() {
  if (!name.value.trim()) { error.value = 'Enter the name you’d like on your card.'; return; }
  createCard(name.value);
  void router.push('/card/');
}
</script>
<template>
  <div><SiteHeader action-href="/login/" action-label="Open my card" />
    <main id="main-content" class="form-layout">
      <section class="form-copy"><RouterLink to="/" class="back-link"><ArrowLeft :size="16" /> Back to rewards</RouterLink>
        <p class="eyebrow">YOUR M SOUQ REWARDS CARD</p><h1>Start with your name.</h1><p class="page-description">Your first stamp is the start of your next gift.</p>
        <div v-if="memberCard" class="notice">You already have a card in this tab. <RouterLink to="/card/">Open your card</RouterLink>, or create a new one below. A new card replaces your current demo progress.</div>
        <form class="form-panel" @submit.prevent="submit" novalidate>
          <label for="member-name">Name on your card</label><p id="name-hint" class="field-hint">A first name or nickname is fine.</p>
          <input id="member-name" v-model="name" class="form-input" required autocomplete="given-name" maxlength="60" placeholder="e.g. Alex" :aria-invalid="!!error" :aria-describedby="error ? 'name-hint name-error' : 'name-hint'" @input="error = ''" />
          <p v-if="error" id="name-error" class="field-error" role="alert">{{ error }}</p>
          <button class="primary-action full-width">Create demo card <ArrowRight :size="18" aria-hidden="true" /></button>
          <p class="form-note">Saved only in this browser tab. No phone number, password, or account needed for the demo.</p>
        </form>
      </section>
      <aside class="form-aside" aria-label="Your card preview"><span class="eyebrow">MADE FOR YOU</span><LoyaltyCard :card="{ name: name.trim() || 'Your name', marks: 0 }" /><div class="aside-caption"><Gift :size="22" /><p><strong>3 stamps. A free gift.</strong><br />Cleaning pens, smart bands, earbuds & more.</p></div></aside>
    </main>
  </div>
</template>
