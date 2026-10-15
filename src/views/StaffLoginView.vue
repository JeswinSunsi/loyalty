<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ArrowRight, ScanLine } from '@lucide/vue';
import { RouterLink } from 'vue-router';
import SiteHeader from '../components/SiteHeader.vue';
const router = useRouter();
function openPreview() { void router.push('/staff/'); }
</script>

<template>
<main class="min-h-[100dvh]">
    <SiteHeader staff action-href="/" action-label="Customer view" />
    <div class="mx-auto max-w-[520px] px-4 py-9 sm:px-8 sm:py-16">
      <RouterLink to="/" class="text-sm font-semibold text-[#254fe0] hover:underline">← Back to rewards</RouterLink>
      <div class="mt-9 grid h-14 w-14 place-items-center rounded-2xl bg-[#e3ebd6] text-[#254fe0]"><ScanLine class="h-7 w-7" /></div>
      <p class="mt-6 text-sm font-bold uppercase tracking-[.14em] text-[#254fe0]">M Souq team</p>
      <h1 class="mt-2 text-4xl font-extrabold tracking-[-.06em] text-[#202923] sm:text-5xl">Staff sign in.</h1>
      <p class="mt-3 text-base leading-relaxed text-[#666f62]">See how reward marks are added at checkout.</p>
      <div class="mt-7 rounded-[20px] border border-[#dfe3d8] bg-white p-5 shadow-[0_4px_20px_rgba(34,51,29,.025)] sm:p-7">
        <form @submit.prevent="openPreview">
          <label class="block text-sm font-semibold text-[#374632]">Demo passcode<input class="form-input mt-1.5" required type="password" autocomplete="off" placeholder="Any demo passcode" /></label>
          <button class="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#254fe0] px-5 text-base font-bold text-white hover:bg-[#193cb8]">Preview staff screen <ArrowRight class="h-5 w-5" /></button>
        </form>
        <p class="mt-4 text-xs leading-relaxed text-[#717a6c]">Design preview only. No passcode is checked, sent, or saved. Do not enter a real passcode.</p>
      </div>
    </div>
  </main>
</template>
