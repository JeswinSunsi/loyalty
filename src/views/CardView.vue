<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { ArrowRight, Gift, QrCode, RotateCcw, Scissors, Sparkles, Stamp } from '@lucide/vue';
import SiteHeader from '../components/SiteHeader.vue';
import SiteFooter from '../components/SiteFooter.vue';
import LoyaltyCard from '../components/LoyaltyCard.vue';
import InkStamp from '../components/InkStamp.vue';
import { formatCardNumber, memberCard, STAMP_TARGET, storageAvailable, type ActivityKind } from '../store';
import { qrShape } from '../qr';
import { settle } from '../motion';

const route = useRoute();
const router = useRouter();
// The welcome only greets the first visit; drop the flag so a refresh shows the everyday view.
const welcome = ref(route.query.welcome === '1');
if (welcome.value) void router.replace({ query: {} });
const remaining = computed(() => STAMP_TARGET - (memberCard.value?.marks ?? 0));
const ready = computed(() => remaining.value === 0);
const firstName = computed(() => memberCard.value?.name.split(' ')[0] ?? '');
// Headlines run in two lines like the front page: plain, then the saffron half.
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
// The card's stage changes height in one step when it turns; everything under it glides along instead of jumping.
const belowEl = ref<HTMLElement | null>(null);
watch(showCode, async () => {
  const el = belowEl.value;
  if (!el) return;
  const from = el.getBoundingClientRect().top;
  await nextTick();
  settle(el, from);
});
const cardEl = ref<HTMLElement | null>(null);
function presentCode() {
  showCode.value = true;
  cardEl.value?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

const slip: Record<ActivityKind, { icon: typeof Stamp; item: string; amount: string }> = {
  created: { icon: Sparkles, item: 'Card opened', amount: 'New' },
  stamp: { icon: Stamp, item: 'Stamp', amount: '+1' },
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
    <SiteHeader inverse />
    <main id="main-content">
      <template v-if="memberCard">
        <section class="hero member-hero is-split" :class="{ 'is-welcome': welcome }">
          <InkStamp class="hero-ghost" ring="MEMBER · M SOUQ · REWARDS · " :texture="false" />
          <div class="container hero-inner">
            <p v-if="!storageAvailable" class="callout" role="status">This browser isn’t letting us save your card. Your stamps may not be here next time.</p>
            <p class="hero-kicker">
              <template v-if="welcome"><Sparkles :size="14" aria-hidden="true" /> Welcome to M Souq Rewards</template>
              <template v-else>Hi, {{ firstName }}</template>
            </p>
            <h1 v-if="welcome" class="display">You’re in,<br /><span class="display-name">{{ firstName }}.</span></h1>
            <h1 v-else class="display" aria-live="polite">{{ headline[0] }}<br /><span>{{ headline[1] }}</span></h1>
            <p class="hero-lede">{{ lede }}</p>

            <div ref="cardEl" class="member-card" :class="{ 'is-new': welcome }">
              <LoyaltyCard v-model:flipped="showCode" :name="memberCard.name" :number="memberCard.number" :marks="memberCard.marks" :qr="qr" flippable />
            </div>
          </div>
        </section>

        <div ref="belowEl" class="member-below">
          <div class="member-hero-foot">
            <div class="container">
              <div class="try-caption member-caption">
                <p aria-live="polite">
                  <template v-if="showCode">Hold your screen up to the scanner at the till.</template>
                  <template v-else-if="ready">Your card is full. Tap it to redeem your gift.</template>
                  <template v-else>Tap your card to show your checkout code.</template>
                </p>
                <button type="button" class="try-chip" :aria-pressed="showCode" @click="showCode = !showCode">
                  <template v-if="showCode"><RotateCcw :size="14" aria-hidden="true" /> Stamps</template>
                  <template v-else><QrCode :size="14" aria-hidden="true" /> Code</template>
                </button>
              </div>
              <p v-if="!qr" class="callout" role="status">Your code couldn’t load. Read your card number out at checkout instead.</p>
            </div>
          </div>

          <section class="section" aria-labelledby="slip-heading">
            <div class="container">
              <p class="kicker">Your activity</p>
              <h2 id="slip-heading" class="title">Every stamp,<br />on the slip.</h2>
              <p class="section-lede">Stamps show up here the moment the team adds them at the till.</p>

              <div class="receipt-wrap">
                <div class="receipt">
                  <div class="r-head">
                    <strong>M Souq</strong>
                    <span>Rewards · member slip</span>
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
                  <p class="r-foot">Show your card at checkout<br />Thank you for shopping</p>
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
                <h2 class="title">Your free gift is waiting.</h2>
                <p>Show your code at the till and choose from the gift shelf.</p>
                <button type="button" class="btn btn-primary btn-lg btn-block" @click="presentCode">
                  Show my code<QrCode :size="18" aria-hidden="true" />
                </button>
              </template>
              <template v-else>
                <h2 class="title">Pick your gift when the card’s full.</h2>
                <p>Cleaning pens, smart bands, earbuds and more. The shelf changes with the season.</p>
                <RouterLink :to="{ path: '/', hash: '#gifts' }" class="btn btn-primary btn-lg btn-block">
                  See the gift shelf<ArrowRight :size="18" aria-hidden="true" />
                </RouterLink>
              </template>
            </div>
          </section>
        </div>
      </template>

      <section v-else class="hero member-hero">
        <InkStamp class="hero-ghost" ring="STAMP · STAMP · STAMP · FREE GIFT · " :texture="false" />
        <div class="container hero-inner">
          <p class="hero-kicker">My card</p>
          <h1 class="display">No card<br /><span>here yet.</span></h1>
          <p class="hero-lede">Your card is saved in the browser where you made it. Haven’t got one? It takes a few seconds.</p>
          <div class="try-card empty-card" aria-hidden="true"><LoyaltyCard name="Your name" :marks="0" decorative /></div>
          <div class="hero-cta">
            <RouterLink to="/join/" class="btn btn-saffron btn-lg btn-block">Get your free card<ArrowRight :size="18" aria-hidden="true" /></RouterLink>
            <p class="hero-fine">Free · No app · Ready in seconds</p>
          </div>
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>
</template>
