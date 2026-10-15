<script setup lang="ts">
import { RouterLink } from 'vue-router';
import SiteHeader from '../components/SiteHeader.vue';
import { ArrowDown, ArrowRight, Gift, QrCode, ShoppingBag } from '@lucide/vue';
import LoyaltyCard from '../components/LoyaltyCard.vue';
const steps = [
  { icon: ShoppingBag, title: 'Make it a M Souq day.', text: 'Pop in. Pick up something you love.' },
  { icon: QrCode, title: 'One scan. One step closer.', text: 'Show your card at checkout. We’ll add a mark.' },
  { icon: Gift, title: 'Your sixth is a little sweeter.', text: 'Six visits unlock a reward. It’s our way of saying thanks.' },
];
</script>

<template>
<main class="home-page min-h-[100dvh] overflow-x-clip">
    <SiteHeader action-href="/login/" action-label="Sign in" />
    <div class="home-shell">
      <section class="home-hero">
        <div class="hero-copy">
          <p class="eyebrow"><span /> YOUR EVERYDAY, WITH A LITTLE EXTRA</p>
          <h1>Good visits.<br /><span>Great</span> <em>rewards.</em></h1>
          <p class="hero-description">Your favourite stop. A little more rewarding.<br class="hidden sm:block" /> Six visits, one thank you. All on your M Souq card.</p>
          <div class="hero-actions">
            <RouterLink to="/join/" class="primary-action">Get my card <ArrowRight :size="19" /></RouterLink>
            <RouterLink to="/login/" class="text-action">Already a member? <ArrowRight :size="16" /></RouterLink>
          </div>
          <p class="hero-footnote">Free to join <span>·</span> No app needed <span>·</span> Just you</p>
        </div>
        <div class="hero-card-stage">
          <div class="stage-heading"><span>YOUR NEXT LITTLE OBSESSION</span><span>№ 001</span></div>
          <div class="hero-card"><LoyaltyCard :card="{ name: 'M Souq member', marks: 3 }" /></div>
          <div class="stage-caption"><span class="caption-rule" /><span>A card worth coming back to.</span></div>
        </div>
      </section>
      <section class="how-section" aria-labelledby="how-it-works">
        <div class="how-heading"><div><p class="eyebrow">SMALL RITUAL. GOOD REWARDS.</p><h2 id="how-it-works">Nothing extra to do.<br />Something extra for you.</h2></div><ArrowDown :size="25" :stroke-width="1.3" aria-hidden="true" /></div>
        <div class="how-steps"><div v-for="(step, index) in steps" :key="step.title" class="how-step">
          <div class="step-topline"><span>0{{ index + 1 }}</span><component :is="step.icon" :size="23" :stroke-width="1.4" /></div>
          <h3>{{ step.title }}</h3><p>{{ step.text }}</p>
        </div></div>
      </section>
      <footer class="site-footer"><span>M Souq Rewards <span class="footer-divider">/</span> A little more, every day.</span><div><span class="preview-label">Design preview</span><RouterLink to="/staff/login/">Staff sign in <ArrowRight :size="13" /></RouterLink></div></footer>
    </div>
  </main>
</template>
