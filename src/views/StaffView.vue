<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Camera, Check, ScanLine } from '@lucide/vue';
import LoyaltyCard from '../components/LoyaltyCard.vue';
import SiteHeader from '../components/SiteHeader.vue';
import type { PreviewCard } from '../preview';
const route = useRoute();
const router = useRouter();
const sampleCard: PreviewCard = { name: 'M Souq member', marks: 3 };
const cardOverride = ref<PreviewCard | null>(null);
const cleared = ref(false);
const card = computed(() => cleared.value ? null : cardOverride.value ?? (route.query.demo === '1' ? sampleCard : null));
const notice = ref('');
function previewScan() {
  cardOverride.value = { ...sampleCard };
  cleared.value = false;
  notice.value = 'Demo card found.';
}
function addMark() {
  if (!card.value || card.value.marks >= 6) return;
  const marks = card.value.marks + 1;
  cardOverride.value = { ...card.value, marks };
  notice.value = marks === 6 ? 'Reward ready!' : 'Mark added.';
}
function nextCustomer() {
  cardOverride.value = null;
  cleared.value = true;
  notice.value = '';
  void router.replace('/staff/');
}
</script>

<template>
<main class="min-h-[100dvh]">
    <SiteHeader staff action-href="/" action-label="Customer view" />

    <div class="mx-auto max-w-[980px] px-4 pb-12 pt-7 sm:px-8 sm:pt-10">
      <h1 class="text-3xl font-extrabold tracking-[-.05em] text-[#202923] sm:text-4xl">Add a reward mark</h1>
      <p class="mt-2 text-base text-[#666f62]">This preview shows the checkout flow for M Souq staff.</p>
      <div class="mt-6 grid items-start gap-5 md:grid-cols-[1fr_.9fr] md:gap-6">
        <section class="rounded-[20px] border border-[#dfe3d8] bg-white p-5 shadow-[0_4px_20px_rgba(34,51,29,.025)] sm:p-7">
          <h2 class="flex items-center gap-2 text-xl font-bold text-[#202923]"><ScanLine class="h-5 w-5 text-[#254fe0]" /> Scan card</h2>
          <div class="mt-5 flex flex-col items-center rounded-2xl border border-dashed border-[#d0d8c6] bg-[#f3f5ed] px-5 py-9 text-center">
            <Camera class="h-9 w-9 text-[#254fe0]" />
            <p class="mt-3 text-sm text-[#666f62]">In the finished system, staff scan the customer&apos;s QR code after a purchase.</p>
            <button type="button" @click="previewScan" class="mt-5 min-h-12 w-full max-w-[260px] rounded-xl bg-[#254fe0] px-5 text-base font-bold text-white hover:bg-[#193cb8]">Preview a scan</button>
          </div>
        </section>

        <section class="rounded-[20px] border border-[#dfe3d8] bg-white p-5 shadow-[0_4px_20px_rgba(34,51,29,.025)] sm:p-7">
          <h2 class="text-xl font-bold text-[#202923]">Customer card</h2>
          <div v-if="card" class="mt-5">
            <LoyaltyCard :card="card" />
            <p class="mt-4 text-sm text-[#666f62]">{{ card.marks === 6 ? "Reward ready. Show the customer their completed card." : "Confirm the purchase, then add one mark." }}</p>
            <button v-if="card.marks < 6" type="button" @click="addMark" class="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#254fe0] px-5 text-base font-bold text-white hover:bg-[#193cb8]"><Check class="h-5 w-5" /> Add one mark</button>
            <button type="button" @click="nextCustomer" class="mt-3 min-h-11 w-full rounded-xl border border-[#d0d8c6] px-4 text-sm font-semibold text-[#254fe0] hover:bg-[#edf1e5]">Next customer</button>
          </div><div v-else class="mt-5 rounded-2xl bg-[#f3f5ed] px-5 py-10 text-center text-sm text-[#666f62]">Customer card appears here after a scan.</div>
          <p v-if="notice" role="status" class="mt-4 rounded-xl bg-[#e6eedb] px-4 py-3 text-sm font-semibold text-[#374d31]">{{ notice }}</p>
          <p class="mt-4 text-xs text-[#717a6c]">Design preview only. No marks are saved.</p>
        </section>
      </div>
    </div>
  </main>
</template>
