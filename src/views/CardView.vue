<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { Gift, QrCode, Sparkles, Stamp } from '@lucide/vue';
import SiteHeader from '../components/SiteHeader.vue';
import SiteFooter from '../components/SiteFooter.vue';
import LoyaltyCard from '../components/LoyaltyCard.vue';
import HoverArrow from '../components/HoverArrow.vue';
import { formatCardNumber, memberCard, STAMP_TARGET, storageAvailable, type ActivityKind } from '../store';
import { qrShape } from '../qr';
import { FLIP_MS } from '../motion';

const route = useRoute();
const router = useRouter();
// The welcome only greets the first visit; drop the flag so a refresh shows the everyday view.
const welcome = ref(route.query.welcome === '1');
if (welcome.value) void router.replace({ query: {} });
const remaining = computed(() => STAMP_TARGET - (memberCard.value?.marks ?? 0));
const ready = computed(() => remaining.value === 0);
const firstName = computed(() => memberCard.value?.name.split(' ')[0] ?? '');
// Headlines run in two tones like the front page: the news, then the softer half.
const headline = computed(() => ready.value ? ['Your gift', 'is ready.']
  : remaining.value === 1 ? ['One more', 'stamp to go.']
  : [`${['', 'One', 'Two', 'Three'][remaining.value]} stamps`, 'to your gift.']);
const lede = computed(() => welcome.value ? 'At checkout, tap your card to show your code and collect your first stamp.'
  : ready.value ? 'Tap your card to show your code, then choose your gift at the till.'
  : 'Tap your card at the till to show your code. The team scans it and adds your stamp.');

const showCode = ref(false);
const qr = computed(() => {
  if (!memberCard.value) return null;
  try { return qrShape(new URL(`${import.meta.env.BASE_URL}staff/?card=${memberCard.value.number}`, window.location.origin).href); }
  catch { return null; }
});
const cardEl = ref<HTMLElement | null>(null);
// From the panel further down: lift the card up, then quietly bring its spot into view behind the dimmed page,
// so it has a short way home when put away.
function presentCode() {
  showCode.value = true;
  window.setTimeout(() => cardEl.value?.scrollIntoView({ block: 'center' }), FLIP_MS);
}

const kinds: Record<ActivityKind, { icon: typeof Stamp; item: string; amount: string }> = {
  created: { icon: Sparkles, item: 'Card opened', amount: 'New' },
  stamp: { icon: Stamp, item: 'Stamp added', amount: '+1' },
  redeemed: { icon: Gift, item: 'Free gift', amount: '−3' },
};
const dateFormat = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' });
const timeFormat = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' });
function when(at: string) {
  const date = new Date(at);
  return `${date.toDateString() === new Date().toDateString() ? 'Today' : dateFormat.format(date)}, ${timeFormat.format(date)}`;
}
const sinceLabel = computed(() => memberCard.value ? new Intl.DateTimeFormat(undefined, { month: 'short', year: 'numeric' }).format(new Date(memberCard.value.since)) : '');
</script>

<template>
  <div class="page-shell member-page">
    <SiteHeader />
    <main id="main-content">
      <template v-if="memberCard">
        <section class="hero member-hero" :class="{ 'is-welcome': welcome }">
          <div class="container hero-inner">
            <p v-if="!storageAvailable" class="callout" role="status">This browser isn’t letting us save your card. Your stamps may not be here next time.</p>
            <p class="eyebrow">
              <template v-if="welcome"><span class="eyebrow-tag">New</span> Welcome to M Souq Rewards</template>
              <template v-else>Hi, {{ firstName }}</template>
            </p>
            <h1 v-if="welcome" class="display">You’re in,<br /><span class="display-name">{{ firstName }}.</span></h1>
            <h1 v-else class="display" aria-live="polite">{{ headline[0] }}<br /><span>{{ headline[1] }}</span></h1>
            <p class="lede">{{ lede }}</p>
          </div>

          <div class="showcase">
            <div class="container">
              <div ref="cardEl" class="member-card" :class="{ 'is-new': welcome }">
                <LoyaltyCard v-model:flipped="showCode" :name="memberCard.name" :number="memberCard.number" :marks="memberCard.marks" :qr="qr" flippable />
              </div>
              <div class="try-caption">
                <p aria-live="polite">
                  <template v-if="showCode">Hold your screen up to the scanner at the till.</template>
                  <template v-else-if="ready">Your card is full. Tap it to redeem your gift.</template>
                  <template v-else>Tap your card to show your checkout code.</template>
                </p>
                <button type="button" class="chip chip-button" :aria-pressed="showCode" @click="showCode = !showCode">
                  <QrCode :size="14" aria-hidden="true" /> Code
                </button>
              </div>
              <p v-if="!qr" class="callout" role="status">Your code couldn’t load. Read your card number out at checkout instead.</p>
            </div>
          </div>
        </section>

        <section class="section" aria-labelledby="activity-heading">
          <div class="container">
            <p class="kicker">Your activity</p>
            <h2 id="activity-heading" class="title">Every stamp, <span>the moment it’s added.</span></h2>

            <div class="panel activity">
              <dl class="summary">
                <div><dt>Member</dt><dd>{{ memberCard.name }}</dd></div>
                <div><dt>Card no.</dt><dd class="mono">{{ formatCardNumber(memberCard.number) }}</dd></div>
                <div><dt>Since</dt><dd>{{ sinceLabel }}</dd></div>
              </dl>
              <div class="progress" role="img" :aria-label="`${memberCard.marks} of ${STAMP_TARGET} stamps`">
                <div class="progress-head">
                  <span>Stamps</span>
                  <span class="mono">{{ memberCard.marks }} / {{ STAMP_TARGET }}</span>
                </div>
                <div class="progress-track"><span class="progress-fill" :class="{ 'is-ready': ready }" :style="{ width: `${(memberCard.marks / STAMP_TARGET) * 100}%` }" /></div>
              </div>
              <ol class="rows">
                <li v-for="item in memberCard.activity" :key="item.id" class="row" :class="`is-${item.kind}`">
                  <span class="icon-tile icon-tile-sm"><component :is="kinds[item.kind].icon" :size="15" aria-hidden="true" /></span>
                  <span class="row-main">
                    <span class="row-item">{{ kinds[item.kind].item }}</span>
                    <time class="row-time" :datetime="item.at">{{ when(item.at) }}</time>
                  </span>
                  <span class="row-amt">{{ kinds[item.kind].amount }}</span>
                </li>
              </ol>
            </div>
          </div>
        </section>

        <section class="closing" aria-labelledby="closing-heading">
          <div class="container">
            <template v-if="ready">
              <h2 id="closing-heading" class="title">Your free gift <span>is waiting.</span></h2>
              <p class="closing-lede">Show your code at the till and choose from the gift shelf.</p>
              <div class="cta-row">
                <button type="button" class="btn btn-light btn-lg" @click="presentCode">Show my code <HoverArrow /></button>
              </div>
            </template>
            <template v-else>
              <h2 id="closing-heading" class="title">Pick your gift <span>when the card’s full.</span></h2>
              <p class="closing-lede">Cleaning pens, smart bands, earbuds and more. The shelf changes with the season.</p>
              <div class="cta-row">
                <RouterLink :to="{ path: '/', hash: '#gifts' }" class="btn btn-light btn-lg">See the gift shelf <HoverArrow /></RouterLink>
              </div>
            </template>
          </div>
        </section>
      </template>

      <section v-else class="hero member-hero">
        <div class="container hero-inner">
          <p class="eyebrow">My card</p>
          <h1 class="display">No card<br /><span>here yet.</span></h1>
          <p class="lede">Your card is saved in the browser where you made it. Haven’t got one? It takes a few seconds.</p>
          <div class="cta-row">
            <RouterLink to="/join/" class="btn btn-brand btn-lg">Get your free card <HoverArrow /></RouterLink>
          </div>
        </div>
        <div class="showcase">
          <div class="container">
            <div class="empty-card" aria-hidden="true"><LoyaltyCard name="Your name" :marks="0" decorative /></div>
          </div>
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>
</template>
