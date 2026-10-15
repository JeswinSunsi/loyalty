<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
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
const tryCaption = computed(() => [
  'A fresh card. Tap it to press your first stamp.',
  'One stamp down. Tap again.',
  'Two down. One more for a free gift.',
  'Card full. That’s a free gift.',
][tryMarks.value]);

const visits = [
  { note: 'Shop as usual. Ask the team if your purchase earns a stamp.' },
  { note: 'Open your card at the till. The team scans it and adds a stamp.' },
  { note: 'Third stamp fills the card. Pick your gift on the spot.' },
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
    <SiteHeader inverse />
    <main id="main-content">
      <section class="hero">
        <InkStamp class="hero-ghost" ring="STAMP · STAMP · STAMP · FREE GIFT · " :texture="false" />
        <div class="container hero-inner">
          <p class="hero-kicker">M Souq Rewards</p>
          <h1 class="display">Three stamps.<br /><span>One free gift.</span></h1>
          <p class="hero-lede">Get a stamp each time you shop with us. Fill your card and choose a free gift.</p>

          <div
            class="try-card" :class="{ 'is-thump': thump, 'is-full': tryMarks === STAMP_TARGET }"
            role="button" tabindex="0" aria-label="Press a stamp on the example card"
            @click="stampIt" @keydown.enter.prevent="stampIt" @keydown.space.prevent="stampIt"
          >
            <LoyaltyCard name="Your name" number="20250316" :marks="tryMarks" decorative />
          </div>
          <div class="try-caption">
            <p aria-live="polite">{{ tryCaption }}</p>
            <span class="try-chip" aria-hidden="true">
              <template v-if="tryMarks === STAMP_TARGET"><RotateCcw :size="14" /> Again</template>
              <template v-else><Stamp :size="14" /> Tap</template>
            </span>
          </div>

          <div class="hero-cta">
            <RouterLink :to="memberCard ? '/card/' : '/join/'" class="btn btn-saffron btn-lg btn-block">
              {{ memberCard ? 'Open my card' : 'Get your free card' }}<ArrowRight :size="18" aria-hidden="true" />
            </RouterLink>
            <p class="hero-fine">Free · No app · Ready in seconds</p>
          </div>
        </div>
      </section>

      <section id="how-it-works" class="section" aria-labelledby="how-heading">
        <div class="container">
          <p class="kicker">How it works</p>
          <h2 id="how-heading" class="title">Three visits.<br />One gift.</h2>
          <p class="section-lede">Every qualifying visit earns one stamp. Here’s how a full card adds up.</p>

          <div class="receipt-wrap">
            <div class="receipt">
              <div class="r-head">
                <strong>M Souq</strong>
                <span>Rewards · stamp slip</span>
              </div>
              <hr class="r-rule" />
              <ol class="r-lines">
                <li v-for="(visit, i) in visits" :key="i">
                  <span class="r-n">0{{ i + 1 }}</span>
                  <span class="r-item">Visit</span>
                  <span class="r-dots" aria-hidden="true" />
                  <span class="r-amt">+1 stamp</span>
                  <span class="r-note">{{ visit.note }}</span>
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
          <p class="kicker">The gift shelf</p>
          <h2 id="gift-heading" class="title">What a full card gets you.</h2>
          <p class="section-lede">The selection changes with the season. Ask in store to see what’s on the shelf today.</p>
          <ul class="shelf" aria-label="Gifts">
            <li v-for="gift in gifts" :key="gift.name" class="tag" :class="{ 'is-more': gift.more }">
              <component :is="gift.icon" class="tag-icon" :size="30" :stroke-width="1.6" aria-hidden="true" />
              <span class="tag-name">{{ gift.name }}</span>
              <span class="tag-note">{{ gift.note }}</span>
              <span class="tag-price">
                <span class="tag-cost">With 3 stamps</span>
                <span class="tag-free">Free</span>
              </span>
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

      <section class="container closing">
        <div class="coupon">
          <Scissors class="coupon-cut" :size="18" aria-hidden="true" />
          <InkStamp class="coupon-stamp" />
          <h2 class="title">Your first stamp is one visit away.</h2>
          <p>Make your card now so it’s ready at the till.</p>
          <RouterLink :to="memberCard ? '/card/' : '/join/'" class="btn btn-primary btn-lg btn-block">
            {{ memberCard ? 'Open my card' : 'Get your free card' }}<ArrowRight :size="18" aria-hidden="true" />
          </RouterLink>
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>
</template>
