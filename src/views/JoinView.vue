<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { ArrowLeft, ArrowRight, Check, Gift, Info } from '@lucide/vue';
import SiteHeader from '../components/SiteHeader.vue';
import SiteFooter from '../components/SiteFooter.vue';
import LoyaltyCard from '../components/LoyaltyCard.vue';
import { createCard, memberCard } from '../store';
const router = useRouter();
const name = ref('');
const error = ref('');
function submit() {
  if (!name.value.trim()) { error.value = 'Please enter the name you’d like on your card.'; return; }
  createCard(name.value);
  void router.push('/card/');
}
</script>
<template>
  <div class="page-shell">
    <SiteHeader />
    <main id="main-content" class="page-main">
      <div class="container">
        <RouterLink to="/" class="back-link"><ArrowLeft :size="20" aria-hidden="true" /> Back to home</RouterLink>
        <div class="join-grid">
          <section v-reveal class="panel join-panel" aria-labelledby="join-title">
            <p class="kicker">Get your free card</p>
            <h1 id="join-title" class="h1">What should we call you?</h1>
            <p class="lede">Just your name. Your card is ready straight away.</p>

            <div v-if="memberCard" class="alert alert-info" role="note">
              <Info :size="22" aria-hidden="true" />
              <p>You already have a card on this phone with {{ memberCard.marks }} of 3 stamps. <RouterLink to="/card/">Open your card</RouterLink>. Creating a new card will replace it.</p>
            </div>

            <form class="join-form" novalidate @submit.prevent="submit">
              <label for="member-name" class="field-label">Your name</label>
              <input
                id="member-name" v-model="name" class="input" required autocomplete="given-name" maxlength="40" placeholder="For example, Layla"
                :aria-invalid="!!error" :aria-describedby="error ? 'name-error name-hint' : 'name-hint'" @input="error = ''"
              />
              <p v-if="error" id="name-error" class="field-error" role="alert">{{ error }}</p>
              <p id="name-hint" class="field-hint">Your first name or a nickname is fine.</p>
              <button class="btn btn-primary btn-lg btn-block">Create my card <ArrowRight :size="20" aria-hidden="true" /></button>
            </form>

            <ul class="trust-list trust-list-compact">
              <li><Check :size="20" aria-hidden="true" /> No phone number or email</li>
              <li><Check :size="20" aria-hidden="true" /> No password to remember</li>
            </ul>
          </section>

          <aside v-reveal="2" class="join-preview" aria-label="Card preview">
            <p class="preview-label">Your card will look like this</p>
            <LoyaltyCard :name="name.trim() || 'Your name'" :marks="0" />
            <p class="preview-note"><Gift :size="22" aria-hidden="true" /> Collect 3 stamps on this card to get a free gift.</p>
          </aside>
        </div>
      </div>
    </main>
    <SiteFooter />
  </div>
</template>
