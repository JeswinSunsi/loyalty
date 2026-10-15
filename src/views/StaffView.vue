<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowRight, Check, Gift, RotateCcw, ScanLine, Search, Stamp } from '@lucide/vue';
import SiteHeader from '../components/SiteHeader.vue';
import { addStamp, findCard, formatCardNumber, memberCard, redeemGift, restoreCard, STAMP_TARGET, type MemberCard } from '../store';

const route = useRoute();
const router = useRouter();
const query = ref(typeof route.query.card === 'string' ? route.query.card : '');
const loaded = ref(findCard(query.value));
const lookupError = ref(query.value && !loaded.value ? 'That code doesn’t match a card on this device.' : '');
const card = computed(() => loaded.value ? memberCard.value : null);
const initial = computed(() => card.value?.name.charAt(0).toUpperCase() ?? '');
const notice = ref('');
const changed = ref(false);
const confirming = ref(false);
let previous: MemberCard | null = null;

function lookup() {
  if (!query.value.replace(/\D/g, '')) { lookupError.value = 'Enter the 8-digit number shown under the customer’s code.'; return; }
  if (!findCard(query.value)) { lookupError.value = 'No card found with that number. Check the digits and try again.'; return; }
  lookupError.value = '';
  reset();
  loaded.value = true;
}
function reset() { changed.value = false; previous = null; confirming.value = false; notice.value = ''; }
function snapshot() { previous = JSON.parse(JSON.stringify(memberCard.value)) as MemberCard; }
function stamp() {
  if (changed.value) return;
  snapshot();
  if (addStamp()) { changed.value = true; notice.value = memberCard.value?.marks === STAMP_TARGET ? 'Stamp added. This card now has a free gift ready.' : 'Stamp added.'; }
}
function redeem() {
  snapshot();
  if (redeemGift()) { changed.value = true; confirming.value = false; notice.value = 'Gift redeemed. Their new card starts at zero.'; }
}
function undo() {
  if (previous) restoreCard(previous);
  reset();
  notice.value = 'Undone. The card is back to how it was.';
}
function nextCustomer() {
  reset();
  loaded.value = false;
  query.value = '';
  lookupError.value = '';
  if (route.query.card) void router.replace({ query: {} });
}
</script>

<template>
  <div class="page-shell staff-shell">
    <SiteHeader staff />
    <main id="main-content" class="container staff">
      <header class="staff-head">
        <p class="kicker">Checkout</p>
        <h1 class="headline">{{ card ? 'Customer card' : 'Find a customer card' }}</h1>
      </header>

      <div class="staff-stack">
        <section class="panel lookup" aria-labelledby="lookup-title">
          <h2 id="lookup-title" class="panel-title">Look up a card</h2>
          <p class="panel-sub">Scanning the customer’s code opens their card here. Or type the number printed under it.</p>
          <form class="lookup-form" novalidate @submit.prevent="lookup">
            <label for="card-number" class="field-label">Card number</label>
            <div class="lookup-row">
              <input
                id="card-number" v-model="query" class="input input-mono" inputmode="numeric" autocomplete="off" placeholder="0000 0000" maxlength="12"
                :aria-invalid="!!lookupError" :aria-describedby="lookupError ? 'lookup-error' : undefined" @input="lookupError = ''"
              />
              <button class="btn btn-primary"><Search :size="17" aria-hidden="true" /> Find</button>
            </div>
            <p v-if="lookupError" id="lookup-error" class="field-error" role="alert">{{ lookupError }}</p>
          </form>
          <div class="scan-hint"><ScanLine :size="20" aria-hidden="true" /><span>Use your phone camera on the customer’s code</span></div>
        </section>

        <section v-if="card" class="panel customer" aria-labelledby="customer-name">
          <div class="customer-head">
            <span class="avatar" aria-hidden="true">{{ initial }}</span>
            <div class="customer-id">
              <h2 id="customer-name">{{ card.name }}</h2>
              <p>Card {{ formatCardNumber(card.number) }}</p>
            </div>
            <span class="badge" :class="{ 'badge-gold': card.marks === STAMP_TARGET }">{{ card.marks === STAMP_TARGET ? 'Gift ready' : `${card.marks} of ${STAMP_TARGET}` }}</span>
          </div>

          <ol class="tracker" :aria-label="`${card.marks} of ${STAMP_TARGET} stamps`">
            <li v-for="i in STAMP_TARGET" :key="i" :class="{ 'is-on': i <= card.marks, 'is-gift': i === STAMP_TARGET }">
              <span class="tracker-dot" aria-hidden="true"><Gift v-if="i === STAMP_TARGET" :size="26" :stroke-width="1.75" /><Check v-else-if="i <= card.marks" :size="26" :stroke-width="2.25" /><span v-else>{{ i }}</span></span>
              <span class="tracker-label">{{ i === STAMP_TARGET ? 'Gift' : `Stamp ${i}` }}</span>
            </li>
          </ol>

          <div class="staff-action">
            <div v-if="confirming" class="confirm" role="group" aria-labelledby="confirm-title">
              <h3 id="confirm-title">Hand over a free gift?</h3>
              <p>Make sure the customer has picked a gift. This uses all three stamps and starts a new card.</p>
              <div class="confirm-actions">
                <button class="btn btn-ghost" @click="confirming = false">Cancel</button>
                <button class="btn btn-brand" @click="redeem"><Gift :size="17" aria-hidden="true" /> Confirm redemption</button>
              </div>
            </div>
            <template v-else>
              <div v-if="notice" class="notice" role="status">
                <Check :size="18" aria-hidden="true" /><span>{{ notice }}</span>
                <button v-if="changed" class="notice-undo" @click="undo"><RotateCcw :size="14" aria-hidden="true" /> Undo</button>
              </div>
              <template v-if="card.marks === STAMP_TARGET">
                <p v-if="!notice" class="action-hint">Ask the customer to choose from the gifts in store.</p>
                <button class="btn btn-brand btn-lg btn-block" @click="confirming = true"><Gift :size="18" aria-hidden="true" /> Redeem free gift</button>
              </template>
              <template v-else-if="!changed">
                <p class="action-hint">Confirm the purchase qualifies, then add one stamp.</p>
                <button class="btn btn-primary btn-lg btn-block" @click="stamp"><Stamp :size="18" aria-hidden="true" /> Add stamp</button>
              </template>
            </template>
          </div>

          <button v-if="!confirming" class="btn btn-ghost btn-block next-btn" @click="nextCustomer">
            {{ changed ? 'Done · next customer' : 'Close card' }}<ArrowRight :size="17" aria-hidden="true" />
          </button>
        </section>
      </div>
    </main>
  </div>
</template>
