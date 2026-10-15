<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowRight, Check } from '@lucide/vue';
import LoyaltyCard from '../components/LoyaltyCard.vue';
import { savePreviewName } from '../preview';
import { RouterLink } from 'vue-router';
import SiteHeader from '../components/SiteHeader.vue';
const router = useRouter();
const name = ref('');
function previewCard() {
  const cleanName = name.value.trim().replace(/\s+/g, ' ');
  if (!cleanName) return;
  savePreviewName(cleanName);
  void router.push('/card/');
}
</script>

<template>
<main class="min-h-[100dvh]">
    <SiteHeader action-href="/login/" action-label="Sign in" />
    <div class="mx-auto grid max-w-[1060px] items-center gap-10 px-4 py-9 sm:px-8 sm:py-14 md:grid-cols-[.95fr_1.05fr] md:gap-16">
      <div>
        <RouterLink to="/" class="text-sm font-semibold text-[#254fe0] hover:underline">← Back to rewards</RouterLink>
        <p class="mt-8 text-sm font-bold uppercase tracking-[.14em] text-[#254fe0]">Join M Souq Rewards</p>
        <h1 class="mt-2 text-[clamp(2.3rem,6vw,4rem)] font-extrabold leading-[1.06] tracking-[-.06em] text-[#202923]">Your next visit counts.</h1>
        <p class="mt-4 text-base leading-relaxed text-[#666f62]">One quick step to see your M Souq rewards card.</p>
        <div class="mt-7 rounded-[20px] border border-[#dfe3d8] bg-white p-5 shadow-[0_4px_20px_rgba(34,51,29,.025)] sm:p-7">
          <form @submit.prevent="previewCard" class="space-y-4">
            <label class="block text-sm font-semibold text-[#374632]">Your name<input class="form-input mt-1.5" required autocomplete="name" maxlength="60" v-model="name" placeholder="Name on your card" /></label>
            <label class="block text-sm font-semibold text-[#374632]">Mobile number<input class="form-input mt-1.5" required type="tel" inputmode="tel" autocomplete="tel" placeholder="Your mobile number" /></label>
            <button class="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#254fe0] px-5 text-base font-bold text-white hover:bg-[#193cb8]">Preview my card <ArrowRight class="h-5 w-5" /></button>
          </form>
          <p class="mt-4 text-xs leading-relaxed text-[#717a6c]">Design preview only. No account is created. Your number is not sent or saved; your name stays in this tab for the card preview.</p>
        </div>
        <p class="mt-5 text-sm text-[#666f62]">Already joined? <RouterLink to="/login/" class="font-bold text-[#254fe0] hover:underline">Sign in</RouterLink></p>
      </div>
      <aside class="rounded-[28px] bg-[#eaf0df] p-5 sm:p-8" aria-label="Rewards card example">
        <LoyaltyCard :card="{ name: name.trim() || 'Your name', marks: 0 }" />
        <div class="mt-6 space-y-3 text-sm font-semibold text-[#53644a]"><p class="flex items-center gap-2"><Check class="h-5 w-5 text-[#254fe0]" /> Keep your card on your phone</p><p class="flex items-center gap-2"><Check class="h-5 w-5 text-[#254fe0]" /> Show it each time you shop</p><p class="flex items-center gap-2"><Check class="h-5 w-5 text-[#254fe0]" /> Collect six marks for a reward</p></div>
      </aside>
    </div>
  </main>
</template>
