<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ArrowRight, Check, Gift, Headphones, PenTool, QrCode, ShoppingBag, Watch } from '@lucide/vue';
import SiteHeader from '../components/SiteHeader.vue';
import LoyaltyCard from '../components/LoyaltyCard.vue';
import { memberCard } from '../preview';
const steps = [
  { icon: ShoppingBag, title: 'Shop at M Souq', text: 'Ask our team which purchases earn a stamp.' },
  { icon: QrCode, title: 'Show your rewards card', text: 'At checkout, show your code to the team to collect your stamp.' },
  { icon: Gift, title: 'Collect 3. Choose a gift.', text: 'Once you have 3 stamps, ask the team to redeem your free gift in store.' },
];
</script>
<template>
  <div class="home-page">
    <SiteHeader :action-href="memberCard ? '/card/' : '/login/'" action-label="Open my card" />
    <main id="main-content" class="home-shell">
      <section class="home-hero">
        <div class="hero-copy">
          <p class="eyebrow"><span /> M SOUQ REWARDS</p>
          <h1>3 stamps.<br /><span>A free gift.</span></h1>
          <p class="hero-description">Shop with us. Collect stamps. Choose a gift.<br />Your rewards card keeps it all in one place.</p>
          <div class="hero-actions">
            <RouterLink :to="memberCard ? '/card/' : '/join/'" class="primary-action">{{ memberCard ? 'View my card' : 'Get a rewards card' }}<ArrowRight :size="18" aria-hidden="true" /></RouterLink>
            <a href="#the-gifts" class="text-action">Explore the gifts <ArrowRight :size="16" aria-hidden="true" /></a>
          </div>
          <p class="hero-footnote"><Check :size="15" aria-hidden="true" /> No app to download. Open your card in your browser.</p>
        </div>
        <div class="hero-card-stage">
          <div class="stage-heading"><span>EXAMPLE REWARDS CARD</span><span class="pill">1 of 3 collected</span></div>
          <LoyaltyCard :card="{ name: 'Your name', marks: 1 }" />
          <div class="stage-reward"><span class="icon-tile"><Gift :size="22" aria-hidden="true" /></span><div><strong>A free gift is 2 stamps away</strong><p>Every stamp brings you closer.</p></div><ArrowRight :size="18" aria-hidden="true" /></div>
        </div>
      </section>
      <section id="the-gifts" class="gift-section" aria-labelledby="gift-heading">
        <div class="section-intro"><p class="eyebrow">THE GIFTS</p><h2 id="gift-heading">Choose your free gift.</h2><p>Cleaning pens, smart bands, earbuds, and more. Ask in store for the current selection.</p></div>
        <div class="gift-options">
          <div class="gift-option"><span class="gift-illustration"><PenTool :size="40" :stroke-width="1.3" aria-hidden="true" /></span><span>Cleaning pens</span></div>
          <div class="gift-option"><span class="gift-illustration"><Watch :size="40" :stroke-width="1.3" aria-hidden="true" /></span><span>Smart bands</span></div>
          <div class="gift-option"><span class="gift-illustration"><Headphones :size="40" :stroke-width="1.3" aria-hidden="true" /></span><span>Earbuds & more</span></div>
        </div>
      </section>
      <section id="how-it-works" class="how-section" aria-labelledby="how-heading">
        <div class="section-heading"><div><p class="eyebrow">HOW IT WORKS</p><h2 id="how-heading">From your first stamp to your next gift.</h2></div><span class="pill">Just 3 stamps</span></div>
        <div class="how-steps"><div v-for="(step, index) in steps" :key="step.title" class="how-step"><div class="step-topline"><span>0{{ index + 1 }}</span><component :is="step.icon" :size="24" :stroke-width="1.5" aria-hidden="true" /></div><h3>{{ step.title }}</h3><p>{{ step.text }}</p></div></div>
      </section>
      <section class="questions" aria-labelledby="questions-heading"><h2 id="questions-heading">A few useful details</h2><div>
        <details><summary>Which purchases earn stamps?</summary><p>Ask the M Souq team before you shop. They can confirm whether your purchase earns a stamp.</p></details>
        <details><summary>How do I collect my free gift?</summary><p>Collect 3 stamps, then show your card to the team in store. They’ll confirm the available gifts and redeem your stamps. Your next card starts at zero.</p></details>
        <details><summary>How does this demo work?</summary><p>Create a card with a name, then try adding stamps and redeeming a gift in the staff demo. Your progress stays in this browser tab until you close it. No account is created.</p></details>
      </div></section>
    </main>
    <footer class="site-footer home-shell"><span>© M Souq <span class="footer-divider">/</span> Rewards</span><RouterLink to="/staff/login/">Staff checkout <ArrowRight :size="14" aria-hidden="true" /></RouterLink></footer>
  </div>
</template>
