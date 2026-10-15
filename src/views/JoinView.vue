<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { ArrowLeft, ArrowRight, Info } from '@lucide/vue';
import SiteHeader from '../components/SiteHeader.vue';
import SiteFooter from '../components/SiteFooter.vue';
import LoyaltyCard from '../components/LoyaltyCard.vue';
import ArchStage from '../components/ArchStage.vue';
import StarMark from '../components/StarMark.vue';
import { createCard, memberCard } from '../store';
const router = useRouter();
const name = ref('');
const error = ref('');
function submit() {
  if (!name.value.trim()) { error.value = 'Please enter the name you’d like on your card.'; return; }
  createCard(name.value);
  void router.push({ path: '/card/', query: { welcome: '1' } });
}
</script>
<template>
  <div class="page-shell">
    <SiteHeader />
    <main id="main-content" class="page-main">
      <div class="container">
        <RouterLink to="/" class="back-link"><ArrowLeft :size="20" aria-hidden="true" /> Back to home</RouterLink>
        <div class="join-grid">
          <section class="join-copy" aria-labelledby="join-title">
            <h1 id="join-title" class="h1">What should we<br />call you?</h1>
            <p class="lede">That’s all we need. Your card is ready the moment you press create.</p>

            <div v-if="memberCard" class="alert alert-info" role="note">
              <Info :size="22" aria-hidden="true" />
              <p>You already have a card on this phone with {{ memberCard.marks }} of 3 stamps. <RouterLink to="/card/">Open your card</RouterLink>. Creating a new card will replace it.</p>
            </div>

            <form class="join-form" novalidate @submit.prevent="submit">
              <label for="member-name" class="field-label">Name on your card</label>
              <input
                id="member-name" v-model="name" class="input input-lg" required autocomplete="given-name" maxlength="40" placeholder="For example, Layla"
                :aria-invalid="!!error" :aria-describedby="error ? 'name-error name-hint' : 'name-hint'" @input="error = ''"
              />
              <p v-if="error" id="name-error" class="field-error" role="alert">{{ error }}</p>
              <p id="name-hint" class="field-hint">A first name or nickname is perfect. No phone number, email or password.</p>
              <button class="btn btn-primary btn-lg btn-block">Create my card <ArrowRight :size="20" aria-hidden="true" /></button>
            </form>
          </section>

          <aside class="join-preview" aria-label="Card preview">
            <ArchStage><LoyaltyCard :name="name.trim() || 'Your name'" :marks="0" /></ArchStage>
            <p class="preview-note"><StarMark /> Three stamps on this card gets you a free gift.</p>
          </aside>
        </div>
      </div>
    </main>
    <SiteFooter />
  </div>
</template>
