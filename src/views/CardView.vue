<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { ArrowRight, CircleCheck, Gift, QrCode, Sparkles, Stamp, TriangleAlert } from '@lucide/vue';
import SiteHeader from '../components/SiteHeader.vue';
import SiteFooter from '../components/SiteFooter.vue';
import LoyaltyCard from '../components/LoyaltyCard.vue';
import CodeDialog from '../components/CodeDialog.vue';
import { memberCard, STAMP_TARGET, storageAvailable, type ActivityKind } from '../store';
import { qrShape } from '../qr';

const route = useRoute();
const router = useRouter();
// The welcome only greets the first visit; drop the flag so a refresh shows the everyday view.
const welcome = ref(route.query.welcome === '1');
if (welcome.value) void router.replace({ query: {} });

const marks = computed(() => memberCard.value?.marks ?? 0);
const remaining = computed(() => STAMP_TARGET - marks.value);
const ready = computed(() => remaining.value === 0);
const firstName = computed(() => memberCard.value?.name.split(' ')[0] ?? '');
const headline = computed(() => ready.value ? 'Your free gift is ready.'
  : remaining.value === 1 ? 'One more stamp to go.'
  : `${['', 'One', 'Two', 'Three'][remaining.value]} stamps to your free gift.`);
const progressText =computed(() => ready.value ? 'Your card is full. Your free gift is ready.'
  : remaining.value === 1 ? '1 more stamp to get your free gift.'
  : `${remaining.value} more stamps to get your free gift.`);

const showCode = ref(false);
const qr = computed(() => {
  if (!memberCard.value) return null;
  try { return qrShape(new URL(`${import.meta.env.BASE_URL}staff/?card=${memberCard.value.number}`, window.location.origin).href); }
  catch { return null; }
});

const activityIcon: Record<ActivityKind, typeof Stamp> = { created: Sparkles, stamp: Stamp, redeemed: Gift };
const dateFormat = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
const timeFormat = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' });
function when(at: string) {
  const date = new Date(at);
  return `${date.toDateString() === new Date().toDateString() ? 'Today' : dateFormat.format(date)} at ${timeFormat.format(date)}`;
}
</script>

<template>
  <div class="page-shell">
    <SiteHeader />
    <main id="main-content" class="page-main">
      <div v-if="memberCard" class="container">
        <div v-if="welcome" class="alert alert-success" role="status">
          <CircleCheck :size="24" aria-hidden="true" />
          <div>
            <p class="alert-title">Your card is ready, {{ firstName }}!</p>
            <p>Next time you shop, press <strong>Show my code</strong> at the till to collect your first stamp.</p>
          </div>
        </div>
        <div v-if="!storageAvailable" class="alert alert-warning" role="status">
          <TriangleAlert :size="24" aria-hidden="true" />
          <p>This browser isn’t letting us save your card. Your stamps may not be here next time.</p>
        </div>

        <header class="page-head">
          <p class="kicker">Hello, {{ firstName }}</p>
          <h1 class="h1" aria-live="polite">{{ headline }}</h1>
        </header>

        <div class="card-grid">
          <section class="panel" aria-label="Your card">
            <LoyaltyCard :name="memberCard.name" :number="memberCard.number" :marks="memberCard.marks" />
            <button type="button" class="btn btn-primary btn-lg btn-block code-btn" @click="showCode = true">
              <QrCode :size="22" aria-hidden="true" /> Show my code
            </button>
            <p class="help-text">Press this at the till. The cashier scans the code to add your stamp.</p>
          </section>

          <div class="card-side">
            <section class="panel" :class="{ 'panel-accent': ready }" aria-labelledby="progress-title">
              <h2 id="progress-title" class="h3">Your progress</h2>
              <p class="progress-count"><strong>{{ marks }}</strong> of {{ STAMP_TARGET }} stamps</p>
              <div class="progress" role="progressbar" :aria-valuenow="marks" aria-valuemin="0" :aria-valuemax="STAMP_TARGET" aria-labelledby="progress-title">
                <span class="progress-fill" :style="{ width: `${(marks / STAMP_TARGET) * 100}%` }" />
              </div>
              <p class="progress-text" aria-live="polite">
                <Gift v-if="ready" :size="22" aria-hidden="true" />{{ progressText }}
              </p>
              <RouterLink :to="{ path: '/', hash: '#gifts' }" class="text-link">See the gifts you can choose <ArrowRight :size="18" aria-hidden="true" /></RouterLink>
            </section>

            <section class="panel" aria-labelledby="activity-title">
              <h2 id="activity-title" class="h3">Recent activity</h2>
              <ul class="activity">
                <li v-for="item in memberCard.activity" :key="item.id" :class="`is-${item.kind}`">
                  <span class="activity-icon"><component :is="activityIcon[item.kind]" :size="20" aria-hidden="true" /></span>
                  <span class="activity-text">
                    <span class="activity-title">{{ item.text }}</span>
                    <time :datetime="item.at">{{ when(item.at) }}</time>
                  </span>
                </li>
              </ul>
            </section>
          </div>
        </div>

        <CodeDialog v-model:open="showCode" :qr="qr" :number="memberCard.number" :name="memberCard.name" :ready="ready" />
      </div>

      <div v-else class="container">
        <section class="panel empty-state" aria-labelledby="empty-title">
          <span class="empty-icon"><QrCode :size="36" aria-hidden="true" /></span>
          <h1 id="empty-title" class="h1">No card on this phone yet</h1>
          <p class="lede">Your card is saved in the browser where you made it. If you don’t have one yet, it only takes a minute.</p>
          <div class="empty-actions">
            <RouterLink to="/join/" class="btn btn-primary btn-lg">Get your free card <ArrowRight :size="20" aria-hidden="true" /></RouterLink>
            <RouterLink to="/" class="btn btn-secondary btn-lg">Back to home</RouterLink>
          </div>
        </section>
      </div>
    </main>
    <SiteFooter />
  </div>
</template>
