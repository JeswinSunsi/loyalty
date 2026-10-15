<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import QRCode from 'qrcode';
import { ArrowRight, Gift, QrCode, RotateCcw, Sparkles, Stamp } from '@lucide/vue';
import SiteHeader from '../components/SiteHeader.vue';
import SiteFooter from '../components/SiteFooter.vue';
import LoyaltyCard from '../components/LoyaltyCard.vue';
import { memberCard, STAMP_TARGET, storageAvailable, type ActivityKind } from '../store';

const route = useRoute();
const router = useRouter();
// The welcome only greets the first visit; drop the flag so a refresh shows the everyday view.
const welcome = ref(route.query.welcome === '1');
if (welcome.value) void router.replace({ query: {} });
const remaining = computed(() => STAMP_TARGET - (memberCard.value?.marks ?? 0));
const firstName = computed(() => memberCard.value?.name.split(' ')[0] ?? '');
const headline = computed(() => remaining.value === 0 ? 'Your free gift is ready.' : remaining.value === 1 ? 'One more stamp to go.' : `${remaining.value} stamps to your free gift.`);
const qr = ref('');
const qrError = ref(false);
const showCode = ref(false);

onMounted(async () => {
  if (!memberCard.value) return;
  const url = new URL(`${import.meta.env.BASE_URL}staff/?card=${memberCard.value.number}`, window.location.origin).href;
  try { qr.value = await QRCode.toDataURL(url, { width: 480, margin: 1, errorCorrectionLevel: 'M', color: { dark: '#17140f', light: '#ffffff' } }); }
  catch { qrError.value = true; }
});

const activityIcons: Record<ActivityKind, typeof Stamp> = { created: Sparkles, stamp: Stamp, redeemed: Gift };
const dateFormat = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' });
const timeFormat = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' });
function when(at: string) {
  const date = new Date(at);
  return date.toDateString() === new Date().toDateString() ? `Today, ${timeFormat.format(date)}` : dateFormat.format(date);
}
const sinceLabel = computed(() => memberCard.value ? new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(new Date(memberCard.value.since)) : '');
</script>

<template>
  <div class="page-shell">
    <SiteHeader />
    <main id="main-content" class="container member">
      <template v-if="memberCard">
        <p v-if="!storageAvailable" class="callout" role="status">This browser isn’t letting us save your card. Your stamps may not be here next time.</p>

        <header class="member-head" :class="{ 'is-welcome': welcome }">
          <template v-if="welcome">
            <p class="welcome-tag"><Sparkles :size="14" aria-hidden="true" /> Welcome to M Souq Rewards</p>
            <h1 class="headline">You’re in, {{ firstName }}.</h1>
            <p class="member-lede">At checkout, tap your card to show your code and collect your first stamp.</p>
          </template>
          <template v-else>
            <p class="kicker">Hi, {{ firstName }}</p>
            <h1 class="headline" aria-live="polite">{{ headline }}</h1>
          </template>
        </header>

        <div class="member-stack">
          <div class="member-card" :class="{ 'is-new': welcome }">
            <LoyaltyCard v-model:flipped="showCode" :name="memberCard.name" :number="memberCard.number" :marks="memberCard.marks" :qr="qr" flippable />
            <button class="flip-hint" :class="{ 'is-ready': remaining === 0 }" @click="showCode = !showCode">
              <template v-if="showCode"><RotateCcw :size="16" aria-hidden="true" /> Back to my stamps</template>
              <template v-else><QrCode :size="16" aria-hidden="true" /> {{ remaining === 0 ? 'Tap your card to redeem your gift' : 'Tap your card to show your code' }}</template>
            </button>
            <p v-if="qrError" class="callout" role="status">Your code couldn’t load. Read your card number out at checkout instead.</p>
          </div>

          <section class="panel activity" aria-labelledby="activity-title">
            <div class="panel-head"><h2 id="activity-title">Activity</h2><span>Member since {{ sinceLabel }}</span></div>
            <ul>
              <li v-for="item in memberCard.activity" :key="item.id" :class="`is-${item.kind}`">
                <span class="activity-icon"><component :is="activityIcons[item.kind]" :size="15" aria-hidden="true" /></span>
                <span class="activity-text">{{ item.text }}</span>
                <time :datetime="item.at">{{ when(item.at) }}</time>
              </li>
            </ul>
          </section>
        </div>

      </template>

      <section v-else class="empty">
        <div class="empty-card" aria-hidden="true"><LoyaltyCard name="Your name" :marks="0" decorative /></div>
        <h1 class="headline">No card on this device yet.</h1>
        <p class="lede">Your card is saved in the browser where you made it. Haven’t got one? It takes a few seconds.</p>
        <RouterLink to="/join/" class="btn btn-primary btn-lg">Get your free card <ArrowRight :size="18" aria-hidden="true" /></RouterLink>
      </section>
    </main>
    <SiteFooter />
  </div>
</template>
