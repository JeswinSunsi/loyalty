<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import QRCode from 'qrcode';
import { ArrowRight, Check, Expand, Gift, QrCode, X } from '@lucide/vue';
import SiteHeader from '../components/SiteHeader.vue';
import LoyaltyCard from '../components/LoyaltyCard.vue';
import { memberCard, STAMP_TARGET, storageAvailable } from '../preview';
const remaining = computed(() => STAMP_TARGET - (memberCard.value?.marks ?? 0));
const qr = ref('');
const qrError = ref(false);
const codeDialog = ref<HTMLDialogElement | null>(null);
const staffUrl = new URL(import.meta.env.BASE_URL + 'staff/?demo=1', window.location.origin).href;
onMounted(async () => {
  try { qr.value = await QRCode.toDataURL(staffUrl, { width: 480, margin: 3, errorCorrectionLevel: 'M', color: { dark: '#142a57', light: '#ffffff' } }); }
  catch { qrError.value = true; }
});
function timeLabel(at: string) { return new Date(at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
</script>
<template>
  <div><SiteHeader action-href="/" action-label="Rewards home" />
    <main id="main-content" class="dashboard-shell">
      <template v-if="memberCard">
        <div class="page-heading"><div><p class="eyebrow">MY REWARDS CARD</p><h1>{{ remaining === 0 ? 'Your free gift is ready.' : remaining === 1 ? 'Just 1 more stamp.' : remaining + ' stamps to your free gift.' }}</h1><p class="page-description">{{ remaining === 0 ? 'Show your card in store and choose from the available gifts.' : 'Show your code at checkout. Our team will add your stamp.' }}</p></div><span class="pill" :class="{ 'success-pill': remaining === 0 }"><Gift v-if="remaining === 0" :size="15" />{{ remaining === 0 ? 'Ready to redeem' : memberCard.marks + ' of 3 stamps' }}</span></div>
        <p v-if="!storageAvailable" class="notice" role="status">Browser storage is unavailable. Your demo progress will be lost when you refresh.</p>
        <div class="member-grid">
          <div class="member-main"><LoyaltyCard :card="memberCard" />
            <section class="reward-panel"><span class="icon-tile"><Gift :size="24" /></span><div><p class="eyebrow">{{ remaining === 0 ? 'YOUR NEXT STEP' : 'WHAT YOU’RE COLLECTING FOR' }}</p><h2>{{ remaining === 0 ? 'Choose your free gift in store' : 'A free gift with 3 stamps' }}</h2><p>Cleaning pens, smart bands, earbuds, and more. Ask our team for the current selection.</p></div></section>
            <section class="activity-panel"><div class="panel-heading"><h2>Card activity</h2><span class="small-label">THIS DEMO</span></div><ul><li v-for="item in memberCard.activity" :key="item.id"><span class="activity-dot"><Check :size="13" /></span><span>{{ item.text }}</span><time :datetime="item.at">{{ timeLabel(item.at) }}</time></li></ul></section>
          </div>
          <aside class="checkout-panel"><span class="icon-tile"><QrCode :size="24" /></span><h2>Show at checkout</h2><p>Open your code for the team.</p><div class="qr-frame"><img v-if="qr" :src="qr" alt="Demo QR code that opens staff checkout" width="240" height="240" /><p v-else-if="qrError" role="status">Code unavailable. You can still use the staff demo below.</p><span v-else role="status">Preparing your code…</span></div><button class="primary-action full-width" :disabled="!qr" @click="codeDialog?.showModal()"><Expand :size="18" /> Enlarge code</button><p class="form-note">Demo code: opens staff checkout. Camera scanning and live member lookup are not connected.</p><RouterLink to="/staff/?demo=1" class="text-action">Try staff checkout <ArrowRight :size="16" /></RouterLink></aside>
        </div>
        <p class="dashboard-note">Your demo progress stays in this tab. You can return to your card after trying staff checkout.</p>
        <dialog ref="codeDialog" class="code-dialog" aria-labelledby="code-title"><button class="close-dialog" aria-label="Close checkout code" @click="codeDialog?.close()"><X :size="24" /></button><p class="eyebrow">M SOUQ REWARDS</p><h2 id="code-title">Show this code to the team</h2><img v-if="qr" :src="qr" alt="Demo QR code that opens staff checkout" width="480" height="480" /><p>{{ memberCard.name }}</p><span class="form-note">Demo code · opens staff checkout</span></dialog>
      </template>
      <section v-else class="empty-state"><span class="page-icon"><QrCode :size="28" /></span><h1>Let’s get your card ready.</h1><p class="page-description">Create a demo card to collect stamps and explore your rewards.</p><RouterLink to="/join/" class="primary-action">Create a demo card <ArrowRight :size="18" /></RouterLink><RouterLink to="/login/" class="text-action">Or try an example card</RouterLink></section>
    </main>
  </div>
</template>
