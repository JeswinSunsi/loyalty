<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { ArrowRight, Check, Gift, RotateCcw, ScanLine, ShieldCheck } from '@lucide/vue';
import SiteHeader from '../components/SiteHeader.vue';
import { addStamp, loadExample, memberCard, redeemGift, undoChange } from '../preview';
const route = useRoute();
const loaded = ref(route.query.demo === '1');
if (loaded.value && !memberCard.value) loadExample();
const card = computed(() => loaded.value ? memberCard.value : null);
const notice = ref('');
const changed = ref(false);
const confirming = ref(false);
let previous: NonNullable<typeof memberCard.value> | null = null;
function openCard() {
  if (!memberCard.value) loadExample();
  loaded.value = true;
  notice.value = '';
  confirming.value = false;
}
function snapshot() { previous = JSON.parse(JSON.stringify(memberCard.value)) as NonNullable<typeof memberCard.value>; }
function stamp() {
  if (changed.value) return;
  snapshot();
  if (addStamp()) { changed.value = true; notice.value = memberCard.value?.marks === 3 ? 'Stamp added. This card is ready for a free gift.' : 'Stamp added to the card.'; }
}
function redeem() {
  snapshot();
  if (redeemGift()) { changed.value = true; confirming.value = false; notice.value = 'Gift redeemed. A new card is ready to collect stamps.'; }
}
function undo() {
  if (previous) undoChange(previous);
  previous = null;
  changed.value = false;
  notice.value = 'Change undone. The previous stamp balance has been restored.';
}
function nextCheckout() { loaded.value = false; changed.value = false; previous = null; confirming.value = false; notice.value = ''; }
</script>
<template>
  <div><SiteHeader staff action-href="/card/" action-label="Customer card" />
    <main id="main-content" class="dashboard-shell staff-shell">
      <div class="page-heading"><div><p class="eyebrow">STAFF CHECKOUT</p><h1>Customer rewards</h1><p class="page-description">Check the customer’s card, then add a stamp or redeem their gift.</p></div><span class="pill"><ShieldCheck :size="16" /> Staff demo</span></div>
      <div class="staff-grid" :class="{ 'has-card': card }">
        <section class="staff-lookup panel"><span class="step-label">01 · FIND THE CARD</span><h2>Open a customer card</h2><div class="scan-area"><span class="scan-corners"><ScanLine :size="48" :stroke-width="1.3" /></span><h3>Start with a demo card</h3><p>{{ memberCard ? 'Use ' + memberCard.name + '’s card from this tab.' : 'An example card starts with 1 of 3 stamps.' }}</p><button class="primary-action full-width" :disabled="loaded" @click="openCard">{{ loaded ? 'Card opened' : memberCard ? 'Open card from this tab' : 'Load example card' }}<Check v-if="loaded" :size="18" /><ArrowRight v-else :size="18" /></button></div><p class="form-note">In the live service, the customer’s code will identify their card. This demo does not use your camera.</p><RouterLink to="/card/" class="text-action">View customer card <ArrowRight :size="16" /></RouterLink></section>
        <section class="staff-actions panel"><span class="step-label">02 · COMPLETE THE CHECKOUT</span>
          <template v-if="card"><div class="customer-heading"><div><p class="small-label">CUSTOMER</p><h2>{{ card.name }}</h2></div><span class="pill" :class="{ 'success-pill': card.marks === 3 }">{{ card.marks }} of 3 stamps</span></div>
            <div class="staff-progress" role="img" :aria-label="card.marks + ' of 3 stamps'"><span v-for="index in 3" :key="index" aria-hidden="true" :class="{ collected: index <= card.marks }"><Check v-if="index <= card.marks" :size="25" /><Gift v-else-if="index === 3" :size="25" /><span v-else>{{ index }}</span></span></div>
            <div v-if="confirming" class="redeem-confirm"><h3>Redeem this free gift?</h3><p>Confirm the customer has chosen an available gift. This uses all 3 stamps and starts a new card.</p><button class="primary-action full-width" @click="redeem">Confirm gift redemption <Gift :size="18" /></button><button class="secondary-action full-width" @click="confirming = false">Keep the stamps</button></div>
            <template v-else-if="!changed"><h3>{{ card.marks === 3 ? 'Free gift available' : 'Ready to add a stamp' }}</h3><p class="page-description">{{ card.marks === 3 ? 'Ask the customer to choose from the gifts available in store.' : 'Confirm this purchase earns a stamp before continuing.' }}</p><button v-if="card.marks < 3" class="primary-action full-width" @click="stamp">Add 1 stamp <Check :size="18" /></button><button v-else class="primary-action full-width" @click="confirming = true">Redeem free gift <Gift :size="18" /></button></template>
            <div v-if="notice && !confirming" class="success-notice" role="status"><Check :size="19" /><span>{{ notice }}</span></div>
            <button v-if="changed && !confirming" class="undo-action" @click="undo"><RotateCcw :size="16" /> Undo last change</button>
            <button v-if="changed && card.marks === 3 && !confirming" class="primary-action full-width" @click="confirming = true">Redeem free gift <Gift :size="18" /></button>
            <button v-if="!confirming" class="secondary-action full-width" @click="nextCheckout">{{ changed ? 'Next checkout' : 'Close card' }}<ArrowRight :size="17" /></button>
          </template>
          <div v-else class="staff-empty"><span class="icon-tile"><Gift :size="28" /></span><h2>No card open yet</h2><p>Open a card to see its stamp balance and available actions.</p><span class="small-label">3 STAMPS = 1 FREE GIFT</span></div>
        </section>
      </div>
    </main>
  </div>
</template>
