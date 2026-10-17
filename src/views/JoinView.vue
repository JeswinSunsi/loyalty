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
  if (!name.value.trim()) { error.value = 'Please type your name.'; return; }
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
          <p class="eyebrow"><span class="eyebrow-tag">Free</span> Your rewards card</p>
          <h1 class="display">What’s your<br /><span>name?</span></h1>
          <p class="lede">We’ll put it on your card. It’s the only thing we ask for.</p>

          <div v-if="memberCard" class="callout" role="note">
            <Info :size="18" aria-hidden="true" />
            <p>This phone already has a card with {{ memberCard.marks }} of 3 stamps. <RouterLink to="/card/">Open it</RouterLink>. Making a new card will replace it.</p>
          </div>

          <form class="panel join-form" novalidate @submit.prevent="submit">
            <label for="member-name" class="field-label">Your name</label>
            <input
              id="member-name" v-model="name" class="input input-lg" required autocomplete="given-name" maxlength="40" placeholder="e.g. Layla"
              :aria-invalid="!!error" :aria-describedby="error ? 'name-hint name-error' : 'name-hint'" @input="error = ''"
            />
            <p v-if="error" id="name-error" class="field-error" role="alert">{{ error }}</p>
            <p id="name-hint" class="field-hint">Your first name or a nickname is fine.</p>
            <button class="btn btn-brand btn-lg btn-block">Create my card <HoverArrow /></button>
          </form>
        </section>
      </div>

      <aside class="showcase join-preview" aria-label="Card preview">
        <div class="container">
          <LoyaltyCard :name="name.trim() || 'Your name'" :marks="0" />
          <p class="try-caption join-preview-note"><Gift :size="16" aria-hidden="true" /> Fill it with three stamps for a free gift.</p>
        </div>
      </aside>
    </main>
  </div>
</template>
