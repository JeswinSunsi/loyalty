<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { ArrowRight, Gift, QrCode, Sparkles, Stamp, TriangleAlert } from '@lucide/vue';
import SiteHeader from '../components/SiteHeader.vue';
import SiteFooter from '../components/SiteFooter.vue';
import LoyaltyCard from '../components/LoyaltyCard.vue';
import SealRing from '../components/SealRing.vue';
import CodeDialog from '../components/CodeDialog.vue';
import { formatCardNumber, memberCard, STAMP_TARGET, storageAvailable, type ActivityKind } from '../store';
import { gifts } from '../gifts';
import { qrShape } from '../qr';
import { curtain } from '../transition';

// Came in behind the card curtain: the page holds its entrance until the curtain lifts.
const arriving = curtain.value !== 'idle';

const marks = computed(() => memberCard.value?.marks ?? 0);
const remaining = computed(() => STAMP_TARGET - marks.value);
const ready = computed(() => remaining.value === 0);
const firstName = computed(() => memberCard.value?.name.split(' ')[0] ?? '');
// Two-line headline: plain first line, gold-foil second line, like the front page.
const headline = computed(() => ready.value ? ['Your free gift', 'is ready.']
  : remaining.value === STAMP_TARGET ? ['Your card is ready.', 'Three stamps to go.']
  : remaining.value === 1 ? ['One more stamp', 'to your free gift.']
  : ['Two more stamps', 'to your free gift.']);
const meterNote = computed(() => ready.value ? 'Gift unlocked' : `${remaining.value} to go`);

const showCode = ref(false);
const qr = computed(() => {
  if (!memberCard.value) return null;
  try { return qrShape(new URL(`${import.meta.env.BASE_URL}staff/?card=${memberCard.value.number}`, window.location.origin).href); }
  catch { return null; }
});

const timelineIcon: Record<ActivityKind, typeof Stamp> = { created: Sparkles, stamp: Stamp, redeemed: Gift };
const dayFormat = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
const timeFormat = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' });
function day(at: string) {
  const date = new Date(at);
  return date.toDateString() === new Date().toDateString() ? 'Today' : dayFormat.format(date);
}
const since = computed(() => memberCard.value ? new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(new Date(memberCard.value.since)) : '');
</script>

<template>
  <div class="page-shell">
    <SiteHeader />
    <main id="main-content">
      <template v-if="memberCard">
        <section class="hero member-hero" :class="{ 'is-arriving': arriving, 'is-ready': ready }" aria-labelledby="card-headline">
          <div class="container member-grid">
            <p v-if="!storageAvailable" class="hero-note" role="status">
              <TriangleAlert :size="20" aria-hidden="true" /> This browser isn’t letting us save your card. Your stamps may not be here next time.
            </p>

            <div class="member-head">
              <p class="kicker">Hello, {{ firstName }}</p>
              <h1 id="card-headline" class="h-display" aria-live="polite">{{ headline[0] }}<br /><em class="foil-text">{{ headline[1] }}</em></h1>
            </div>

            <figure class="member-visual">
              <div class="hero-stage">
                <SealRing class="hero-ring" />
                <div class="hero-card"><LoyaltyCard :name="memberCard.name" :number="memberCard.number" :marks="memberCard.marks" /></div>
              </div>
              <figcaption>Member since {{ since }}</figcaption>
            </figure>

            <div class="member-body">
              <div class="meter">
                <div class="meter-head">
                  <p class="meter-count"><strong>{{ marks }}</strong> of {{ STAMP_TARGET }} stamps</p>
                  <p class="meter-note">{{ meterNote }}</p>
                </div>
                <ol class="meter-track" role="progressbar" :aria-valuenow="marks" aria-valuemin="0" :aria-valuemax="STAMP_TARGET" :aria-valuetext="`${marks} of ${STAMP_TARGET} stamps`">
                  <li v-for="i in STAMP_TARGET" :key="i" :class="{ 'is-on': i <= marks, 'is-gift': i === STAMP_TARGET }">
                    <span class="meter-fill" />
                    <span class="meter-label">{{ i === STAMP_TARGET ? 'Gift' : `Stamp ${i}` }}</span>
                  </li>
                </ol>
              </div>

              <div class="member-actions">
                <button type="button" class="btn btn-gold btn-lg" @click="showCode = true">
                  <QrCode :size="22" aria-hidden="true" /> {{ ready ? 'Redeem my gift' : 'Show my code' }}
                </button>
                <RouterLink :to="{ path: '/', hash: '#gifts' }" class="btn btn-outline-light btn-lg">See the gifts</RouterLink>
              </div>
              <p class="member-hint">{{ ready ? 'Show your code at the till and pick a gift from the shelf.' : 'Show your code at the till. The cashier scans it and adds your stamp.' }}</p>
            </div>
          </div>
        </section>

        <section class="section member-more">
          <div class="container member-more-grid">
            <section v-reveal aria-labelledby="activity-title">
              <p class="kicker">Your activity</p>
              <h2 id="activity-title" class="h2">Every stamp, as it lands.</h2>
              <ol class="timeline">
                <li v-for="item in memberCard.activity" :key="item.id" :class="`is-${item.kind}`">
                  <span class="timeline-dot"><component :is="timelineIcon[item.kind]" :size="18" aria-hidden="true" /></span>
                  <div class="timeline-body">
                    <p class="timeline-title">{{ item.text }}</p>
                    <time :datetime="item.at">{{ day(item.at) }} · {{ timeFormat.format(new Date(item.at)) }}</time>
                  </div>
                </li>
              </ol>
              <p class="timeline-foot">Card no. {{ formatCardNumber(memberCard.number) }}</p>
            </section>

            <aside v-reveal="1" class="shelf-block" aria-labelledby="shelf-title">
              <p class="kicker">On the gift shelf</p>
              <h2 id="shelf-title" class="h2">{{ ready ? 'Pick one today.' : 'What your card gets you.' }}</h2>
              <ul class="mini-shelf">
                <li v-for="gift in gifts" :key="gift.name">
                  <span class="mini-icon"><component :is="gift.icon" :size="22" aria-hidden="true" /></span>
                  <span class="mini-text"><strong>{{ gift.name }}</strong><span>{{ gift.note }}</span></span>
                </li>
              </ul>
              <RouterLink :to="{ path: '/', hash: '#questions' }" class="text-link">Questions about rewards <ArrowRight :size="18" aria-hidden="true" /></RouterLink>
            </aside>
          </div>
        </section>

        <CodeDialog v-model:open="showCode" :qr="qr" :number="memberCard.number" :name="memberCard.name" :ready="ready" />
      </template>

      <section v-else class="hero member-hero" :class="{ 'is-arriving': arriving }" aria-labelledby="empty-title">
        <div class="container member-grid">
          <div class="member-head">
            <p class="kicker">My card</p>
            <h1 id="empty-title" class="h-display">No card on<br /><em class="foil-text">this phone yet.</em></h1>
          </div>
          <figure class="member-visual">
            <div class="hero-stage">
              <SealRing class="hero-ring" />
              <div class="hero-card"><LoyaltyCard name="Your name" :marks="0" /></div>
            </div>
          </figure>
          <div class="member-body">
            <p class="lede">Your card is saved in the browser where you made it. Haven’t got one? It takes less than a minute.</p>
            <div class="member-actions">
              <RouterLink to="/join/" class="btn btn-gold btn-lg">Get your free card <ArrowRight :size="20" aria-hidden="true" /></RouterLink>
              <RouterLink to="/" class="btn btn-outline-light btn-lg">Back to home</RouterLink>
            </div>
          </div>
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>
</template>
