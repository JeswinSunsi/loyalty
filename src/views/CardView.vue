<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { ArrowRight, Gift, QrCode, Scissors, Sparkles, Stamp } from '@lucide/vue';
import SiteHeader from '../components/SiteHeader.vue';
import SiteFooter from '../components/SiteFooter.vue';
import LoyaltyCard from '../components/LoyaltyCard.vue';
import InkStamp from '../components/InkStamp.vue';
import { formatCardNumber, memberCard, STAMP_TARGET, storageAvailable, type ActivityKind } from '../store';
import { qrShape } from '../qr';
import { FLIP_MS } from '../motion';
import { curtain } from '../transition';

const route = useRoute();
const router = useRouter();
// The welcome only greets the first visit; drop the flag so a refresh shows the everyday view.
const welcome = ref(route.query.welcome === '1');
if (welcome.value) void router.replace({ query: {} });
// Came in behind the card curtain: the page settles into place as the curtain sweeps away.
const arriving = curtain.value !== 'idle';
const remaining = computed(() => STAMP_TARGET - (memberCard.value?.marks ?? 0));
const ready = computed(() => remaining.value === 0);
const firstName = computed(() => memberCard.value?.name.split(' ')[0] ?? '');
// Headlines run in two lines like the front page: plain, then the saffron half.
const headline = computed(() => ready.value ? ['Your gift', 'is ready.']
  : remaining.value === 1 ? ['One more stamp', 'until your gift.']
  : [`${['', 'One', 'Two', 'Three'][remaining.value]} more stamps`, 'until your gift.']);
const lede = computed(() => welcome.value ? 'Next time you shop, tap your card at the counter and we’ll add your first stamp.'
  : ready.value ? 'Tap your card at the counter and pick something from the gift shelf.'
  : 'Tap your card at the counter. We’ll scan it and add your stamp.');

const showCode = ref(false);
const qr = computed(() => {
  if (!memberCard.value) return null;
  try { return qrShape(new URL(`${import.meta.env.BASE_URL}staff/?card=${memberCard.value.number}`, window.location.origin).href); }
  catch { return null; }
});
const cardEl = ref<HTMLElement | null>(null);
// From the coupon further down: lift the card up, then quietly bring its spot into view behind the dimmed page,
// so it has a short way home when put away.
function presentCode() {
  showCode.value = true;
  window.setTimeout(() => cardEl.value?.scrollIntoView({ block: 'center' }), FLIP_MS);
}

const slip: Record<ActivityKind, { icon: typeof Stamp; item: string; amount: string }> = {
  created: { icon: Sparkles, item: 'Card created', amount: 'New' },
  stamp: { icon: Stamp, item: 'Stamp', amount: '+1' },
  redeemed: { icon: Gift, item: 'Gift collected', amount: '−3' },
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
    <SiteHeader inverse />
    <main id="main-content">
      <template v-if="memberCard">
        <section class="hero member-hero" :class="{ 'is-welcome': welcome, 'is-arriving': arriving }">
          <InkStamp class="hero-ghost" ring="MEMBER · M SOUQ · REWARDS · " :texture="false" />
          <div class="container hero-inner">
            <p v-if="!storageAvailable" class="callout" role="status">This browser isn’t letting us save your card. Your stamps may not be here next time.</p>
            <p class="hero-kicker">
              <template v-if="welcome"><Sparkles :size="14" aria-hidden="true" /> Your card is ready</template>
              <template v-else>Hi, {{ firstName }}</template>
            </p>
            <h1 v-if="welcome" class="display">Welcome,<br /><span class="display-name">{{ firstName }}.</span></h1>
            <h1 v-else class="display" aria-live="polite">{{ headline[0] }}<br /><span>{{ headline[1] }}</span></h1>
            <p class="hero-lede">{{ lede }}</p>

            <div ref="cardEl" class="member-card" :class="{ 'is-new': welcome, 'is-arriving': arriving }">
              <LoyaltyCard v-model:flipped="showCode" :name="memberCard.name" :number="memberCard.number" :marks="memberCard.marks" :qr="qr" flippable />
            </div>
            <div class="try-caption member-caption">
              <p aria-live="polite">
                <template v-if="showCode">Show this to the cashier.</template>
                <template v-else-if="ready">Tap to collect your gift.</template>
                <template v-else>Tap your card to show your code.</template>
              </p>
              <button type="button" class="try-chip" :aria-pressed="showCode" @click="showCode = !showCode">
                <QrCode :size="14" aria-hidden="true" /> Code
              </button>
            </div>
            <p v-if="!qr" class="callout" role="status">Your code couldn’t load. Read your card number out at the counter instead.</p>
          </div>
        </section>

        <section class="section" aria-labelledby="slip-heading">
          <div class="container">
            <p class="kicker">History</p>
            <h2 id="slip-heading" class="title">Your stamps<br />and gifts.</h2>

            <div class="receipt-wrap">
              <div class="receipt">
                <div class="r-head">
                  <strong>M Souq</strong>
                </div>
                <hr class="r-rule" />
                <dl class="r-meta">
                  <div><dt>Member</dt><dd>{{ memberCard.name }}</dd></div>
                  <div><dt>Card no.</dt><dd>{{ formatCardNumber(memberCard.number) }}</dd></div>
                  <div><dt>Since</dt><dd>{{ sinceLabel }}</dd></div>
                </dl>
                <hr class="r-rule" />
                <ol class="r-lines r-activity">
                  <li v-for="item in memberCard.activity" :key="item.id" :class="`is-${item.kind}`">
                    <component :is="slip[item.kind].icon" class="r-n" :size="15" aria-hidden="true" />
                    <span class="r-item">{{ slip[item.kind].item }}</span>
                    <span class="r-dots" aria-hidden="true" />
                    <span class="r-amt">{{ slip[item.kind].amount }}</span>
                    <time class="r-note" :datetime="item.at">{{ when(item.at) }}</time>
                  </li>
                </ol>
                <hr class="r-rule" />
                <dl class="r-total">
                  <div><dt>Stamps</dt><span class="r-dots" aria-hidden="true" /><dd>{{ memberCard.marks }} / {{ STAMP_TARGET }}</dd></div>
                  <div>
                    <dt>Your gift</dt><span class="r-dots" aria-hidden="true" />
                    <dd><span v-if="ready" class="r-free">Ready</span><template v-else>{{ remaining }} to go</template></dd>
                  </div>
                </dl>
                <hr class="r-rule" />
                <p class="r-foot">Show your card at the counter<br />Thank you for shopping</p>
                <div class="r-barcode" aria-hidden="true" />
              </div>
            </div>
          </div>
        </section>

        <section class="container closing">
          <div class="coupon">
            <Scissors class="coupon-cut" :size="18" aria-hidden="true" />
            <InkStamp class="coupon-stamp" />
            <template v-if="ready">
              <h2 class="title">Your gift is waiting at the counter.</h2>
              <p>Show your code and pick something from the shelf.</p>
              <button type="button" class="btn btn-primary btn-lg btn-block" @click="presentCode">
                Show my code<QrCode :size="18" aria-hidden="true" />
              </button>
            </template>
            <template v-else>
              <h2 class="title">See what you could get.</h2>
              <p>Earbuds, smart bands, cleaning pens and more.</p>
              <RouterLink :to="{ path: '/', hash: '#gifts' }" class="btn btn-primary btn-lg btn-block">
                See the gifts<ArrowRight :size="18" aria-hidden="true" />
              </RouterLink>
            </template>
          </div>
        </section>
      </template>

      <section v-else class="hero member-hero" :class="{ 'is-arriving': arriving }">
        <InkStamp class="hero-ghost" ring="STAMP · STAMP · STAMP · FREE GIFT · " :texture="false" />
        <div class="container hero-inner">
          <p class="hero-kicker">My card</p>
          <h1 class="display">No card<br /><span>on this phone.</span></h1>
          <p class="hero-lede">Your card is saved in the browser you signed up on. Don’t have one yet? It’s free and takes about ten seconds.</p>
          <div class="try-card empty-card" aria-hidden="true"><LoyaltyCard name="Your name" :marks="0" decorative /></div>
          <div class="hero-cta">
            <RouterLink to="/join/" class="btn btn-saffron btn-lg btn-block">Get my card<ArrowRight :size="18" aria-hidden="true" /></RouterLink>
            <p class="hero-fine">Free · No app · No hassle</p>
          </div>
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>
</template>
