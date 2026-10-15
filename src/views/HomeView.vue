<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ArrowRight, Check, ChevronDown, Gift, Headphones, PenTool, QrCode, ShoppingBag, Sparkles, Watch } from '@lucide/vue';
import SiteHeader from '../components/SiteHeader.vue';
import SiteFooter from '../components/SiteFooter.vue';
import LoyaltyCard from '../components/LoyaltyCard.vue';
import { memberCard } from '../store';

const steps = [
  { icon: ShoppingBag, title: 'Shop at M Souq', text: 'Buy as you normally would. Ask the team if your purchase earns a stamp.' },
  { icon: QrCode, title: 'Show your card', text: 'Open your card on your phone at the till. The cashier scans it and adds one stamp.' },
  { icon: Gift, title: 'Get a free gift', text: 'When you have 3 stamps, choose a free gift from the gift shelf.' },
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
            <p class="kicker">M Souq Rewards</p>
            <h1 class="h-display">Collect 3 stamps.<br /><em>Get a free gift.</em></h1>
            <p class="lede lede-lg">Get one stamp each time you shop with us. When your card is full, choose a free gift in store.</p>
            <div class="hero-actions">
              <RouterLink :to="memberCard ? '/card/' : '/join/'" class="btn btn-primary btn-lg">
                {{ memberCard ? 'Open my card' : 'Get your free card' }} <ArrowRight :size="20" aria-hidden="true" />
              </RouterLink>
              <RouterLink :to="{ path: '/', hash: '#how-it-works' }" class="btn btn-secondary btn-lg">How it works</RouterLink>
            </div>
            <ul class="trust-list">
              <li><Check :size="20" aria-hidden="true" /> Free to join</li>
              <li><Check :size="20" aria-hidden="true" /> No app to download</li>
              <li><Check :size="20" aria-hidden="true" /> No password needed</li>
            </ul>
          </div>
          <figure class="hero-visual">
            <LoyaltyCard name="Layla" number="20250316" :marks="2" />
            <figcaption>Example card: 2 stamps collected, 1 more for a free gift.</figcaption>
          </figure>
        </div>
      </section>

      <section id="how-it-works" class="section" aria-labelledby="how-heading">
        <div class="container">
          <div class="section-head">
            <h2 id="how-heading" class="h2">How it works</h2>
            <p class="lede">Three simple steps. No points to count.</p>
          </div>
          <ol class="steps">
            <li v-for="(step, i) in steps" :key="step.title" class="step">
              <div class="step-top">
                <span class="step-num" aria-hidden="true">{{ i + 1 }}</span>
                <component :is="step.icon" class="step-icon" :size="26" :stroke-width="1.6" aria-hidden="true" />
              </div>
              <h3 class="h3"><span class="sr-only">Step {{ i + 1 }}: </span>{{ step.title }}</h3>
              <p>{{ step.text }}</p>
            </li>
          </ol>
        </div>
      </section>

      <section id="gifts" class="section section-alt" aria-labelledby="gift-heading">
        <div class="container">
          <div class="section-head">
            <h2 id="gift-heading" class="h2">Gifts you can choose</h2>
            <p class="lede">Fill your card with 3 stamps and choose one, free. The selection changes with the season, so ask in store to see today’s gifts.</p>
          </div>
          <ul class="gift-grid">
            <li v-for="gift in gifts" :key="gift.name" class="gift">
              <span class="gift-icon"><component :is="gift.icon" :size="30" aria-hidden="true" /></span>
              <h3 class="h3">{{ gift.name }}</h3>
              <p>{{ gift.note }}</p>
              <span class="badge badge-accent">Free gift</span>
            </li>
          </ul>
        </div>
      </section>

      <section id="questions" class="section" aria-labelledby="faq-heading">
        <div class="container faq-layout">
          <div class="section-head">
            <h2 id="faq-heading" class="h2">Common questions</h2>
            <p class="lede">Still unsure? Our team at the till is happy to help.</p>
          </div>
          <div class="faq">
            <details v-for="item in faqs" :key="item.q">
              <summary>{{ item.q }}<ChevronDown class="faq-icon" :size="24" aria-hidden="true" /></summary>
              <p>{{ item.a }}</p>
            </details>
          </div>
        </div>
      </section>

      <section class="section section-tight">
        <div class="container">
          <div class="cta-band">
            <div>
              <h2 class="h2">Start collecting today</h2>
              <p>It takes less than a minute. All you need is your name.</p>
            </div>
            <RouterLink :to="memberCard ? '/card/' : '/join/'" class="btn btn-light btn-lg">
              {{ memberCard ? 'Open my card' : 'Get your free card' }} <ArrowRight :size="20" aria-hidden="true" />
            </RouterLink>
          </div>
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>
</template>
