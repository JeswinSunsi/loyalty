<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { ArrowRight, Headphones, PenTool, Plus, RotateCcw, Scissors, Sparkles, Stamp, Watch } from '@lucide/vue';
import SiteHeader from '../components/SiteHeader.vue';
import SiteFooter from '../components/SiteFooter.vue';
import LoyaltyCard from '../components/LoyaltyCard.vue';
import InkStamp from '../components/InkStamp.vue';
import { memberCard, STAMP_TARGET } from '../store';

// The hero card is a real card you can stamp: each tap presses one more stamp, the third unlocks the gift.
const tryMarks = ref(1);
const thump = ref(false);
let thumpTimer = 0;
function stampIt() {
  tryMarks.value = tryMarks.value >= STAMP_TARGET ? 0 : tryMarks.value + 1;
  thump.value = false;
  requestAnimationFrame(() => { thump.value = true; });
  window.clearTimeout(thumpTimer);
  thumpTimer = window.setTimeout(() => { thump.value = false; }, 400);
}
onBeforeUnmount(() => window.clearTimeout(thumpTimer));

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
    <SiteHeader inverse />
    <main id="main-content">
      <section class="hero">
        <InkStamp class="hero-ghost" ring="STAMP · STAMP · STAMP · FREE GIFT · " :texture="false" />
        <div class="container hero-inner">
          <p class="hero-kicker">M Souq Rewards</p>
          <h1 class="display">Shop at M Souq.<br /><span>Get free gifts.</span></h1>
          <p class="hero-lede">Collect a stamp each time you buy. Three stamps gets you a gift: earbuds, a smart band and more.</p>

          <div
            class="try-card" :class="{ 'is-thump': thump, 'is-full': tryMarks === STAMP_TARGET }"
            role="button" tabindex="0" aria-label="Add a stamp to the example card"
            @click="stampIt" @keydown.enter.prevent="stampIt" @keydown.space.prevent="stampIt"
          >
            <LoyaltyCard name="Your name" number="20250316" :marks="tryMarks" decorative />
          </div>
          <div class="try-caption">
            <span class="try-chip" aria-hidden="true">
              <template v-if="tryMarks === STAMP_TARGET"><RotateCcw :size="14" /> Again</template>
              <template v-else><Stamp :size="14" /> Tap</template>
            </span>
          </div>

          <div class="hero-cta">
            <RouterLink :to="memberCard ? '/card/' : '/join/'" class="btn btn-saffron btn-lg btn-block">
              {{ memberCard ? 'Open my card' : 'Get my card' }}<ArrowRight :size="18" aria-hidden="true" />
            </RouterLink>
            <p class="hero-fine">Free · No app · No hassle</p>
          </div>
        </div>
      </section>

      <section id="how-it-works" class="section" aria-labelledby="how-heading">
        <div class="container">
          <p class="kicker">How it works</p>
          <h2 id="how-heading" class="title">Collect stamps,<br />pick a gift.</h2>

          <div class="receipt-wrap">
            <div class="receipt">
              <div class="r-head">
                <strong>M Souq</strong>
              </div>
              <hr class="r-rule" />
              <ol class="r-lines r-steps">
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
              <p class="r-foot">Show your card at the counter<br />Thank you for shopping</p>
              <div class="r-barcode" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      <section id="gifts" class="section section-tint" aria-labelledby="gift-heading">
        <div class="container">
          <p class="kicker">Gifts</p>
          <h2 id="gift-heading" class="title">On the gift shelf right now.</h2>
          <ul class="shelf" aria-label="Gifts">
            <li v-for="gift in gifts" :key="gift.name" class="tag" :class="{ 'is-more': gift.more }">
              <component :is="gift.icon" class="tag-icon" :size="30" :stroke-width="1.6" aria-hidden="true" />
              <span class="tag-name">{{ gift.name }}</span>
              <span class="tag-note">{{ gift.note }}</span>
              <span class="tag-price">
                <span class="tag-cost">3 stamps</span>
                <span class="tag-free">Free</span>
              </span>
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

      <section class="container closing">
        <div class="coupon">
          <Scissors class="coupon-cut" :size="18" aria-hidden="true" />
          <InkStamp class="coupon-stamp" />
          <template v-if="memberCard">
            <h2 class="title">Get rewarded every time you shop.</h2>
            <p>Show your card at the counter and we’ll add your stamp.</p>
          </template>
          <template v-else>
            <h2 class="title">Get your card before you shop.</h2>
            <p>It’s free and takes about ten seconds.</p>
          </template>
          <RouterLink :to="memberCard ? '/card/' : '/join/'" class="btn btn-primary btn-lg btn-block">
            {{ memberCard ? 'Open my card' : 'Get my card' }}<ArrowRight :size="18" aria-hidden="true" />
          </RouterLink>
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>
</template>
