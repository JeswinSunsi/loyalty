<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import QRCode from 'qrcode';
import { ScanLine } from '@lucide/vue';
import LoyaltyCard from '../components/LoyaltyCard.vue';
import { getPreviewName, savePreviewName, type PreviewCard } from '../preview';
import { RouterLink } from 'vue-router';
import SiteHeader from '../components/SiteHeader.vue';
const savedName = getPreviewName();
const customCard = ref<PreviewCard | null>(null);
const card = computed(() => customCard.value ?? (savedName ? { name: savedName, marks: 0 } : { name: 'M Souq member', marks: 3 }));
const name = ref('');
const qr = ref('');
const qrError = ref(false);
const staffUrl = new URL(import.meta.env.BASE_URL + 'staff/?demo=1', window.location.origin).href;
onMounted(async () => {
  try {
    qr.value = await QRCode.toDataURL(staffUrl, {
      width: 420, margin: 2, errorCorrectionLevel: 'M',
      color: { dark: '#202923', light: '#ffffff' },
    });
  } catch { qrError.value = true; }
});
function previewCard() {
  const nextName = name.value.trim().replace(/\s+/g, ' ');
  if (!nextName) return;
  savePreviewName(nextName);
  customCard.value = { name: nextName, marks: 0 };
}
</script>

<template>
<main class="min-h-[100dvh]">
    <SiteHeader action-href="/" action-label="Home" />
    <div class="mx-auto max-w-[1080px] px-4 pb-12 pt-7 sm:px-8 sm:pt-10">
      <div class="mb-7">
        <p class="text-sm font-bold uppercase tracking-[.12em] text-[#254fe0]">Your M Souq card</p>
        <h1 class="mt-2 text-[clamp(2.1rem,6vw,3.5rem)] font-extrabold leading-[1.06] tracking-[-.06em] text-[#202923]">Good to see you.</h1>
        <p class="mt-3 max-w-[600px] text-base leading-relaxed text-[#666f62]">Your next reward is {{ 6 - card.marks }} {{ 6 - card.marks === 1 ? "visit" : "visits" }} away. Show your code at checkout.</p>
      </div>

      <div class="grid items-start gap-5 md:grid-cols-[1.2fr_.8fr] md:gap-6">
        <section aria-label="Loyalty card preview">
          <LoyaltyCard :card="card" />
        </section>

        <div class="space-y-5">
          <section class="rounded-[20px] border border-[#dfe3d8] bg-white p-5 text-center shadow-[0_4px_20px_rgba(34,51,29,.025)] sm:p-6" aria-label="Checkout code preview">
            <h2 class="flex items-center justify-center gap-2 text-xl font-bold text-[#202923]"><ScanLine class="h-5 w-5 text-[#254fe0]" /> Scan at checkout</h2>
            <div class="mx-auto mt-4 max-w-[220px] rounded-xl border border-[#dfe3d8] bg-white p-2">
              <img v-if="qr" :src="qr" alt="Demo QR code for M Souq staff preview" width="220" height="220" class="aspect-square w-full" />
              <p v-else-if="qrError" role="status">Code unavailable. <RouterLink to="/staff/?demo=1" class="text-[#254fe0] underline">Open staff preview</RouterLink></p>
              <div v-else class="aspect-square w-full animate-pulse rounded-lg bg-[#edf0e7]" />
            </div>
            <p class="mt-3 text-sm text-[#666f62]">Demo code. Open it to see the staff view.</p>
          </section>

          <section class="rounded-[20px] border border-[#dfe3d8] bg-white p-5 shadow-[0_4px_20px_rgba(34,51,29,.025)] sm:p-6">
            <h2 class="text-xl font-bold text-[#202923]">Preview your card</h2>
            <p class="mt-1 text-sm text-[#666f62]">Enter a name to see how your M Souq card looks.</p>
            <form @submit.prevent="previewCard" class="mt-4">
              <label class="block text-sm font-semibold text-[#374632]">Your name<input required autocomplete="name" v-model="name" maxlength="60" placeholder="Enter your name" class="form-input mt-1.5" /></label>
              <button class="mt-4 min-h-12 w-full rounded-xl bg-[#254fe0] px-5 text-base font-bold text-white hover:bg-[#193cb8]">Preview card</button>
            </form>
            <p class="mt-3 text-xs text-[#717a6c]">Design preview only. Your name stays in this tab. No marks are saved.</p>
          </section>
        </div>
      </div>
      <p class="mt-8 text-center text-sm text-[#717a6c]">Need staff view? <RouterLink to="/staff/login/" class="font-bold text-[#254fe0] hover:underline">Open staff sign in</RouterLink></p>
    </div>
  </main>
</template>
