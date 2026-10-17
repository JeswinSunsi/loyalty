<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { Headphones, PenTool, Plus, Sparkles, Watch } from '@lucide/vue';
import SiteHeader from '../components/SiteHeader.vue';
import SiteFooter from '../components/SiteFooter.vue';
import LoyaltyCard from '../components/LoyaltyCard.vue';
import HoverArrow from '../components/HoverArrow.vue';
import { memberCard, STAMP_TARGET } from '../store';

// The hero card fills itself: a new stamp every four seconds, then a fresh card.
const STAMP_EVERY_MS = 4000;
const demoMarks = ref(1);
let demoTimer = 0;
onMounted(() => {
  demoTimer = window.setInterval(() => { demoMarks.value = demoMarks.value >= STAMP_TARGET ? 0 : demoMarks.value + 1; }, STAMP_EVERY_MS);
});
onBeforeUnmount(() => window.clearInterval(demoTimer));

const facts = [
  { value: 'Free', label: 'to join' },
  { value: '20+', label: 'free gifts' },
];
// How it works, rung up as a till receipt.
const steps = [
  { title: 'Make your card', amount: 'Free' },
  { title: 'Shop at M Souq', amount: '+1 stamp' },
  { title: 'Get rewards', amount: 'Gift' },
];
const gifts = [
  { icon: Headphones, name: 'Earbuds', note: 'Wireless, with a charging case' },
  { icon: Watch, name: 'Smart band', note: 'Tracks steps, sleep and heart rate' },
  { icon: PenTool, name: 'Cleaning pen', note: 'For screens, camera lenses and earbuds' },
  { icon: Sparkles, name: 'More in store', note: 'Ask at the counter to see what’s in today', more: true },
];
const faqs = [
  { q: 'Does every purchase count?', a: 'Most do. Ask at the counter and we’ll tell you before we stamp your card.' },
  { q: 'How do I get my gift?', a: 'Once you have three stamps, show your card at the counter and pick a gift. We’ll reset your card so you can start collecting again.' },
  { q: 'Where is my card saved?', a: 'In the browser on the phone you signed up with. Open this site on that phone and your card will be there. No app, no password.' },
  { q: 'Is there a limit on gifts?', a: 'No. Every time you fill a card, you get another gift.' },
];
</script>

<template>
  <div class="page-shell home">
    <SiteHeader />
    <main id="main-content">
      <section class="hero">
        <div class="container hero-inner">
          <p class="eyebrow"><span class="eyebrow-tag">Free</span> M Souq Rewards</p>
          <h1 class="display">Shop at M Souq.<br /><span>Get free gifts.</span></h1>
          <p class="lede">Collect a stamp each time you buy. Three stamps gets you a gift: earbuds, a smart band and more.</p>
          <div class="cta-row">
            <RouterLink :to="memberCard ? '/card/' : '/join/'" class="btn btn-brand btn-lg">
              {{ memberCard ? 'Open my card' : 'Get my card' }} <HoverArrow />
            </RouterLink>
            <RouterLink :to="{ path: '/', hash: '#gifts' }" class="text-link">See the gifts <HoverArrow /></RouterLink>
          </div>
        </div>

        <div class="showcase" aria-hidden="true">
          <div class="container">
            <LoyaltyCard name="Your name" number="20250316" :marks="demoMarks" decorative />
          </div>
        </div>
      </section>

      <section class="container facts" aria-label="At a glance">
        <dl class="fact-grid">
          <div v-for="fact in facts" :key="fact.label" class="fact">
            <dt>{{ fact.label }}</dt>
            <dd>{{ fact.value }}</dd>
          </div>
        </dl>
      </section>

      <section id="how-it-works" class="section" aria-labelledby="how-heading">
        <div class="container">
          <p class="kicker">How it works</p>
          <h2 id="how-heading" class="title">Collect stamps, <span>pick a gift.</span></h2>
          <div class="receipt-wrap">
            <div class="receipt">
              <div class="r-head">
                <strong>M Souq</strong>
              </div>
              <hr class="r-rule" />
              <ol class="r-lines">
                <li v-for="step in steps" :key="step.title">
                  <span class="r-item">{{ step.title }}</span>
                  <span class="r-dots" aria-hidden="true" />
                  <span class="r-amt">{{ step.amount }}</span>
                </li>
              </ol>
              <hr class="r-rule" />
              <dl class="r-total">
                <div><dt>Stamps</dt><span class="r-dots" aria-hidden="true" /><dd>3 / 3</dd></div>
                <div><dt>Your gift</dt><span class="r-dots" aria-hidden="true" /><dd><span class="r-free">Free</span></dd></div>
              </dl>
              <hr class="r-rule" />
              <p class="r-foot">Show your card at checkout<br />Thank you for shopping</p>
              <div class="r-barcode" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      <section id="gifts" class="section section-tint" aria-labelledby="gift-heading">
        <div class="container">
          <p class="kicker">Gifts</p>
          <h2 id="gift-heading" class="title">On the gift shelf <span>right now.</span></h2>
          <ul class="gift-grid" aria-label="Gifts">
            <li v-for="gift in gifts" :key="gift.name" class="gift" :class="{ 'is-more': gift.more }">
              <span class="icon-tile"><component :is="gift.icon" :size="18" aria-hidden="true" /></span>
              <span class="gift-name">{{ gift.name }}</span>
              <span class="gift-note">{{ gift.note }}</span>
              <span class="gift-cost">3 stamps</span>
            </li>
          </ul>
        </div>
      </section>

      <section id="questions" class="section" aria-labelledby="faq-heading">
        <div class="container">
          <p class="kicker">FAQ</p>
          <h2 id="faq-heading" class="title">Questions</h2>
          <div class="faq">
            <details v-for="item in faqs" :key="item.q">
              <summary>{{ item.q }}<Plus class="faq-icon" :size="18" aria-hidden="true" /></summary>
              <p>{{ item.a }}</p>
            </details>
          </div>
        </div>
      </section>

      <section class="closing" aria-labelledby="closing-heading">
        <div class="container">
          <template v-if="memberCard">
            <h2 id="closing-heading" class="title">Get rewarded <span>every time you shop.</span></h2>
            <p class="closing-lede">Show your card at the counter and we’ll add your stamp.</p>
          </template>
          <template v-else>
            <h2 id="closing-heading" class="title">Get your card <span>before you shop.</span></h2>
            <p class="closing-lede">It’s free and takes about ten seconds.</p>
          </template>
          <div class="cta-row">
            <RouterLink :to="memberCard ? '/card/' : '/join/'" class="btn btn-light btn-lg">
              {{ memberCard ? 'Open my card' : 'Get my card' }} <HoverArrow />
            </RouterLink>
          </div>
          <p class="closing-fine">No app. No hassle.</p>
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>
</template>
