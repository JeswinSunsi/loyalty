<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ArrowRight, LockKeyhole } from '@lucide/vue';
import { RouterLink } from 'vue-router';
import SiteHeader from '../components/SiteHeader.vue';
const router = useRouter();
function previewCard() { void router.push('/card/'); }
</script>

<template>
<main class="min-h-[100dvh]">
    <SiteHeader action-href="/join/" action-label="Join rewards" />
    <div class="mx-auto max-w-[520px] px-4 py-9 sm:px-8 sm:py-16">
      <RouterLink to="/" class="text-sm font-semibold text-[#254fe0] hover:underline">← Back to rewards</RouterLink>
      <div class="mt-9 grid h-14 w-14 place-items-center rounded-2xl bg-[#e3ebd6] text-[#254fe0]"><LockKeyhole class="h-7 w-7" /></div>
      <p class="mt-6 text-sm font-bold uppercase tracking-[.14em] text-[#254fe0]">M Souq Rewards</p>
      <h1 class="mt-2 text-4xl font-extrabold tracking-[-.06em] text-[#202923] sm:text-5xl">Welcome back.</h1>
      <p class="mt-3 text-base leading-relaxed text-[#666f62]">Enter your mobile number to see the member card screen.</p>
      <div class="mt-7 rounded-[20px] border border-[#dfe3d8] bg-white p-5 shadow-[0_4px_20px_rgba(34,51,29,.025)] sm:p-7">
        <form @submit.prevent="previewCard">
          <label class="block text-sm font-semibold text-[#374632]">Mobile number<input class="form-input mt-1.5" required type="tel" inputmode="tel" autocomplete="tel" placeholder="Your mobile number" /></label>
          <button class="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#254fe0] px-5 text-base font-bold text-white hover:bg-[#193cb8]">Preview member card <ArrowRight class="h-5 w-5" /></button>
        </form>
        <p class="mt-4 text-xs leading-relaxed text-[#717a6c]">Design preview only. No login code is sent. Your number is not sent or saved.</p>
      </div>
      <p class="mt-6 text-sm text-[#666f62]">New to M Souq Rewards? <RouterLink to="/join/" class="font-bold text-[#254fe0] hover:underline">Join now</RouterLink></p>
    </div>
  </main>
</template>
