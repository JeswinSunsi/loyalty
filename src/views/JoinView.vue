<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { ArrowLeft, Gift, Info } from '@lucide/vue';
import SiteHeader from '../components/SiteHeader.vue';
import LoyaltyCard from '../components/LoyaltyCard.vue';
import HoverArrow from '../components/HoverArrow.vue';
import { createCard, memberCard } from '../store';
const router = useRouter();
const name = ref('');
const error = ref('');
function submit() {
  if (!name.value.trim()) { error.value = 'Add the name you’d like on your card.'; return; }
  createCard(name.value);
  void router.push({ path: '/card/', query: { welcome: '1' } });
}
</script>
<template>
  <div class="page-shell join-page">
    <SiteHeader />
    <main id="main-content" class="hero join-hero">
      <div class="container hero-inner">
        <section class="join-copy">
          <RouterLink to="/" class="back-link"><ArrowLeft :size="16" aria-hidden="true" /> Back</RouterLink>
          <p class="eyebrow">Get your card</p>
          <h1 class="display">What should<br /><span>we call you?</span></h1>
          <p class="lede">That’s all we need. Your card is ready the moment you tap create.</p>

          <div v-if="memberCard" class="callout" role="note">
            <Info :size="18" aria-hidden="true" />
            <p>You already have a card on this device with {{ memberCard.marks }} of 3 stamps. <RouterLink to="/card/">Open it</RouterLink>, or create a new one below. A new card replaces the current one.</p>
          </div>

          <form class="panel join-form" novalidate @submit.prevent="submit">
            <label for="member-name" class="field-label">Name on your card</label>
            <input
              id="member-name" v-model="name" class="input input-lg" required autocomplete="given-name" maxlength="40" placeholder="e.g. Layla"
              :aria-invalid="!!error" :aria-describedby="error ? 'name-hint name-error' : 'name-hint'" @input="error = ''"
            />
            <p v-if="error" id="name-error" class="field-error" role="alert">{{ error }}</p>
            <p id="name-hint" class="field-hint">A first name or nickname is perfect. No phone number or password needed.</p>
            <button class="btn btn-brand btn-lg btn-block">Create my card <HoverArrow /></button>
          </form>
        </section>
      </div>

      <aside class="showcase join-preview" aria-label="Card preview">
        <div class="container">
          <LoyaltyCard :name="name.trim() || 'Your name'" :marks="0" />
          <p class="try-caption join-preview-note"><Gift :size="16" aria-hidden="true" /> Three stamps on this card earns you a free gift.</p>
        </div>
      </aside>
    </main>
  </div>
</template>
