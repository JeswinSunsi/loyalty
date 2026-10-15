<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ArrowDown, ArrowRight, Headphones, PenTool, Plus, Sparkles, Watch } from '@lucide/vue';
import SiteHeader from '../components/SiteHeader.vue';
import SiteFooter from '../components/SiteFooter.vue';
import LoyaltyCard from '../components/LoyaltyCard.vue';
import ArchStage from '../components/ArchStage.vue';
import StarMark from '../components/StarMark.vue';
import { memberCard } from '../store';

const steps = [
  { title: 'Shop with us', text: 'Buy as you normally would. Ask the team if your purchase earns a stamp.' },
  { title: 'Show your card', text: 'Open your card on your phone at the till. We scan it and add a stamp.' },
  { title: 'Pick your gift', text: 'Three stamps fills the card. Choose a free gift from the shelf, right there.' },
];
const gifts = [
  { icon: PenTool, name: 'Cleaning pen', note: 'For screens, lenses and earbuds' },
  { icon: Watch, name: 'Smart band', note: 'Counts steps, sleep and heart rate' },
  { icon: Headphones, name: 'Earbuds', note: 'Wireless, with a charging case' },
  { icon: Sparkles, name: 'And more', note: 'New gifts arrive each season' },
];
const faqs = [
  { q: 'Which purchases earn a stamp?', a: 'Ask the M Souq team at checkout. They’ll confirm whether your purchase earns a stamp before adding it to your card.' },
  { q: 'How do I collect my free gift?', a: 'Once your card has three stamps, show it at checkout and choose a gift from the current selection. The team redeems your stamps and a fresh card begins.' },
  { q: 'Do I need to download an app?', a: 'No. Your card opens in your phone’s web browser. There is no app to install and no password to remember.' },
  { q: 'Where is my card kept?', a: 'Your card is saved in the browser you created it in. Open this website on the same phone at checkout and your card will be right there.' },
  { q: 'Can I collect more than one gift?', a: 'Yes. Every time you fill a card with three stamps, you earn another free gift.' },
];
</script>

<template>
  <div class="page-shell">
    <SiteHeader />
    <main id="main-content">
      <section class="hero">
        <div class="container hero-grid">
          <div class="hero-copy">
            <p class="hero-tag"><StarMark /> M Souq Rewards</p>
            <h1 class="h-display">Three stamps.<br /><span class="hl">One free gift.</span></h1>
            <p class="lede lede-lg">Collect a stamp each time you shop with us. Fill your card, then pick a free gift from our shelf.</p>
            <div class="hero-actions">
              <RouterLink :to="memberCard ? '/card/' : '/join/'" class="btn btn-primary btn-lg">
                {{ memberCard ? 'Open my card' : 'Get your free card' }} <ArrowRight :size="20" aria-hidden="true" />
              </RouterLink>
              <RouterLink :to="{ path: '/', hash: '#how-it-works' }" class="link-arrow">See how it works <ArrowDown :size="18" aria-hidden="true" /></RouterLink>
            </div>
            <ul class="hero-fine">
              <li><StarMark /> Free to join</li>
              <li><StarMark /> No app needed</li>
              <li><StarMark /> Ready in a minute</li>
            </ul>
          </div>
          <figure class="hero-visual">
            <ArchStage><LoyaltyCard name="Layla" number="20250316" :marks="2" /></ArchStage>
            <figcaption>Two stamps in. One more and the gift is hers.</figcaption>
          </figure>
        </div>
      </section>

      <section id="how-it-works" class="section section-paper" aria-labelledby="how-heading">
        <div class="container">
          <div class="section-head">
            <h2 id="how-heading" class="h2">How it works</h2>
            <p class="lede">No points to count. Just three visits.</p>
          </div>
          <ol class="steps">
            <li v-for="(step, i) in steps" :key="step.title" class="step">
              <span class="step-arch" aria-hidden="true">{{ i + 1 }}</span>
              <h3 class="h3"><span class="sr-only">Step {{ i + 1 }}: </span>{{ step.title }}</h3>
              <p>{{ step.text }}</p>
            </li>
          </ol>
        </div>
      </section>

      <section id="gifts" class="section" aria-labelledby="gift-heading">
        <div class="container">
          <div class="section-head">
            <h2 id="gift-heading" class="h2">On the gift shelf</h2>
            <p class="lede">Fill your card and choose one, free. The shelf changes with the season, so ask in store to see what’s there today.</p>
          </div>
          <ul class="shelf">
            <li v-for="gift in gifts" :key="gift.name" class="gift">
              <div class="niche">
                <component :is="gift.icon" class="niche-icon" :size="44" :stroke-width="1.6" aria-hidden="true" />
                <span class="price-tag">Free</span>
              </div>
              <h3 class="h3">{{ gift.name }}</h3>
              <p>{{ gift.note }}</p>
            </li>
          </ul>
        </div>
      </section>

      <section id="questions" class="section section-sand" aria-labelledby="faq-heading">
        <div class="container faq-layout">
          <div class="section-head">
            <h2 id="faq-heading" class="h2">Good to know</h2>
            <p class="lede">Anything else? Ask us at the till. We’re happy to help.</p>
          </div>
          <div class="faq">
            <details v-for="item in faqs" :key="item.q">
              <summary>{{ item.q }}<span class="faq-icon"><Plus :size="20" aria-hidden="true" /></span></summary>
              <p>{{ item.a }}</p>
            </details>
          </div>
        </div>
      </section>

      <section class="section section-tight">
        <div class="container">
          <div class="stall">
            <div class="awning awning-gold" aria-hidden="true" />
            <div class="stall-body">
              <div>
                <h2 class="h2">Your first stamp is one visit away.</h2>
                <p>Make your card now so it’s ready at the till. All we need is your name.</p>
              </div>
              <RouterLink :to="memberCard ? '/card/' : '/join/'" class="btn btn-gold btn-lg">
                {{ memberCard ? 'Open my card' : 'Get your free card' }} <ArrowRight :size="20" aria-hidden="true" />
              </RouterLink>
            </div>
          </div>
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>
</template>
