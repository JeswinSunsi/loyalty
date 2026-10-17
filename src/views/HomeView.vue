<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { Headphones, PenTool, Plus, QrCode, RotateCcw, ShoppingBag, Sparkles, Stamp, Watch } from '@lucide/vue';
import SiteHeader from '../components/SiteHeader.vue';
import SiteFooter from '../components/SiteFooter.vue';
import LoyaltyCard from '../components/LoyaltyCard.vue';
import HoverArrow from '../components/HoverArrow.vue';
import { memberCard, STAMP_TARGET } from '../store';

// The hero card is a real card you can stamp: each tap adds one more stamp, the third unlocks the gift.
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
const tryCaption = computed(() => [
  'A fresh card. Tap it to add your first stamp.',
  'One stamp down. Tap again.',
  'Two down. One more for a free gift.',
  'Card full. That’s a free gift.',
][tryMarks.value]);

const facts = [
  { value: '3', label: 'stamps fill a card' },
  { value: '1', label: 'free gift per card' },
  { value: '0', label: 'apps or passwords' },
];
const steps = [
  { icon: ShoppingBag, title: 'Shop as usual', note: 'Ask the team if your purchase earns a stamp.' },
  { icon: QrCode, title: 'Show your card', note: 'Open your card at the till. The team scans it and adds a stamp.' },
  { icon: Sparkles, title: 'Pick your gift', note: 'The third stamp fills the card. Choose your gift on the spot.' },
];
const gifts = [
  { icon: PenTool, name: 'Cleaning pen', note: 'For screens, lenses and earbuds' },
  { icon: Watch, name: 'Smart band', note: 'Steps, sleep and heart rate' },
  { icon: Headphones, name: 'Earbuds', note: 'Wireless, with charging case' },
  { icon: Sparkles, name: 'And more', note: 'New picks arrive with the season', more: true },
];
const faqs = [
  { q: 'Which purchases earn a stamp?', a: 'Ask the M Souq team at checkout. They’ll confirm whether your purchase earns a stamp before adding it to your card.' },
  { q: 'How do I collect my free gift?', a: 'Once your card has three stamps, show it at checkout and choose a gift from the current selection. The team redeems your stamps and a fresh card begins.' },
  { q: 'Where is my card kept?', a: 'Your card lives in the browser you created it in. Open this site on the same phone at checkout and your card will be right there. No app or password needed.' },
  { q: 'Can I collect more than one gift?', a: 'Yes. Every time you fill a card with three stamps, you earn another free gift.' },
];
</script>

<template>
  <div class="page-shell home">
    <SiteHeader />
    <main id="main-content">
      <section class="hero">
        <div class="container hero-inner">
          <p class="eyebrow"><span class="eyebrow-tag">Free</span> M Souq Rewards</p>
          <h1 class="display">Three stamps.<br /><span>One free gift.</span></h1>
          <p class="lede">Get a stamp each time you shop with us. Fill your card and choose a free gift.</p>
          <div class="cta-row">
            <RouterLink :to="memberCard ? '/card/' : '/join/'" class="btn btn-brand btn-lg">
              {{ memberCard ? 'Open my card' : 'Get your free card' }} <HoverArrow />
            </RouterLink>
            <RouterLink :to="{ path: '/', hash: '#how-it-works' }" class="text-link">How it works <HoverArrow /></RouterLink>
          </div>
        </div>

        <div class="showcase">
          <div class="container">
            <div
              class="try-card" :class="{ 'is-thump': thump }"
              role="button" tabindex="0" aria-label="Add a stamp to the example card"
              @click="stampIt" @keydown.enter.prevent="stampIt" @keydown.space.prevent="stampIt"
            >
              <LoyaltyCard name="Your name" number="20250316" :marks="tryMarks" decorative />
            </div>
            <div class="try-caption">
              <p aria-live="polite">{{ tryCaption }}</p>
              <span class="chip" aria-hidden="true">
                <template v-if="tryMarks === STAMP_TARGET"><RotateCcw :size="14" /> Again</template>
                <template v-else><Stamp :size="14" /> Tap</template>
              </span>
            </div>
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
          <h2 id="how-heading" class="title">Three visits. <span>One gift, no catches.</span></h2>
          <ol class="steps">
            <li v-for="(step, i) in steps" :key="step.title" class="step">
              <span class="icon-tile"><component :is="step.icon" :size="18" aria-hidden="true" /></span>
              <div>
                <h3 class="step-title"><span class="step-n">0{{ i + 1 }}</span>{{ step.title }}</h3>
                <p class="step-note">{{ step.note }}</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section id="gifts" class="section section-tint" aria-labelledby="gift-heading">
        <div class="container">
          <p class="kicker">The gift shelf</p>
          <h2 id="gift-heading" class="title">What a full card gets you. <span>The selection changes with the season.</span></h2>
          <ul class="gift-grid" aria-label="Gifts">
            <li v-for="gift in gifts" :key="gift.name" class="gift" :class="{ 'is-more': gift.more }">
              <span class="icon-tile"><component :is="gift.icon" :size="18" aria-hidden="true" /></span>
              <span class="gift-name">{{ gift.name }}</span>
              <span class="gift-note">{{ gift.note }}</span>
              <span class="gift-cost">Free with 3 stamps</span>
            </li>
          </ul>
        </div>
      </section>

      <section id="questions" class="section" aria-labelledby="faq-heading">
        <div class="container">
          <p class="kicker">Questions</p>
          <h2 id="faq-heading" class="title">Good to know.</h2>
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
          <h2 id="closing-heading" class="title">Your first stamp is <span>one visit away.</span></h2>
          <p class="closing-lede">Make your card now so it’s ready at the till.</p>
          <div class="cta-row">
            <RouterLink :to="memberCard ? '/card/' : '/join/'" class="btn btn-light btn-lg">
              {{ memberCard ? 'Open my card' : 'Get your free card' }} <HoverArrow />
            </RouterLink>
          </div>
          <p class="closing-fine">Free · No app · Ready in seconds</p>
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>
</template>
