<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { QrCode } from '@lucide/vue';
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
// From the panel further down: lift the card up, then quietly bring its spot into view behind the dimmed page,
// so it has a short way home when put away.
function presentCode() {
  showCode.value = true;
  window.setTimeout(() => cardEl.value?.scrollIntoView({ block: 'center' }), FLIP_MS);
}

const kinds: Record<ActivityKind, { item: string; amount: string }> = {
  created: { item: 'Card created', amount: 'New' },
  stamp: { item: 'Stamp', amount: '+1' },
  redeemed: { item: 'Gift collected', amount: '−3' },
};
// Printed like a till date, always the same width so the lines stay in a column: "05 Oct".
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function when(at: string) {
  const date = new Date(at);
  return `${String(date.getDate()).padStart(2, '0')} ${months[date.getMonth()]}`;
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
              <template v-if="welcome"><span class="eyebrow-tag">New</span> Your card is ready</template>
              <template v-else>Hi, {{ firstName }}</template>
            </p>
            <h1 v-if="welcome" class="display">Welcome,<br /><span class="display-name">{{ firstName }}.</span></h1>
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
                  <template v-if="showCode">Show this to the cashier.</template>
                  <template v-else-if="ready">Tap to collect your gift.</template>
                  <template v-else>Tap your card to show your code.</template>
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
            <p class="kicker">History</p>
            <h2 id="activity-heading" class="title">Your stamps <span>and gifts.</span></h2>

            <!-- The member slip: the same till receipt as the front page, printed with this card's history. -->
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
                    <time class="r-date" :datetime="item.at">{{ when(item.at) }}</time>
                    <span class="r-item">{{ kinds[item.kind].item }}</span>
                    <span class="r-dots" aria-hidden="true" />
                    <span class="r-amt">{{ kinds[item.kind].amount }}</span>
                  </li>
                </ol>
                <hr class="r-rule" />
                <dl class="r-total">
                  <div><dt>Stamps</dt><span class="r-dots" aria-hidden="true" /><dd>{{ memberCard.marks }} / {{ STAMP_TARGET }}</dd></div>
                  <div>
                    <dt>Your gift</dt><span class="r-dots" aria-hidden="true" />
                    <dd><span v-if="ready" class="r-free">Ready</span><template v-else>{{ STAMP_TARGET - memberCard.marks }} to go</template></dd>
                  </div>
                </dl>
                <hr class="r-rule" />
                <p class="r-foot">Show your card at the counter<br />Thank you for shopping</p>
                <div class="r-barcode" aria-hidden="true" />
              </div>
            </div>
          </div>
        </section>

        <section class="closing" aria-labelledby="closing-heading">
          <div class="container">
            <template v-if="ready">
              <h2 id="closing-heading" class="title">Your gift is waiting <span>at the counter.</span></h2>
              <p class="closing-lede">Show your code and pick something from the shelf.</p>
              <div class="cta-row">
                <button type="button" class="btn btn-light btn-lg" @click="presentCode">Show my code <HoverArrow /></button>
              </div>
            </template>
            <template v-else>
              <h2 id="closing-heading" class="title">See what you <span>could get.</span></h2>
              <p class="closing-lede">Earbuds, smart bands, cleaning pens and more.</p>
              <div class="cta-row">
                <RouterLink :to="{ path: '/', hash: '#gifts' }" class="btn btn-light btn-lg">See the gifts <HoverArrow /></RouterLink>
              </div>
            </template>
          </div>
        </section>
      </template>

      <section v-else class="hero member-hero">
        <div class="container hero-inner">
          <p class="eyebrow">My card</p>
          <h1 class="display">No card<br /><span>on this phone.</span></h1>
          <p class="lede">Your card is saved in the browser you signed up on. Don’t have one yet? It’s free and takes about ten seconds.</p>
          <div class="cta-row">
            <RouterLink to="/join/" class="btn btn-brand btn-lg">Get my card <HoverArrow /></RouterLink>
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
