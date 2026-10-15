<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ArrowLeft, ArrowRight, ScanLine } from '@lucide/vue';
import SiteHeader from '../components/SiteHeader.vue';
</script>
<template>
  <div><SiteHeader staff action-href="/" action-label="Customer view" />
    <main id="main-content" class="compact-page"><RouterLink to="/" class="back-link"><ArrowLeft :size="16" /> Back to rewards</RouterLink><span class="page-icon"><ScanLine :size="28" /></span><p class="eyebrow">FOR THE M SOUQ TEAM</p><h1>Rewards at checkout.</h1><p class="page-description">Find a card, add a stamp, or redeem a free gift.</p>
      <section class="form-panel"><h2>Try the staff flow</h2><p class="page-description">Use the card from this tab, or an example card. You can add stamps, undo a change, and try redeeming a gift.</p><RouterLink to="/staff/" class="primary-action full-width">Open staff demo <ArrowRight :size="18" /></RouterLink><p class="form-note">Staff sign-in and camera scanning are not connected in this demo. No passcode is required.</p></section>
    </main>
  </div>
</template>
