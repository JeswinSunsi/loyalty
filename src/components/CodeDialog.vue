<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { X } from '@lucide/vue';
import { formatCardNumber } from '../store';
import type { QrShape } from '../qr';

// The checkout code opens in a standard dialog from a clearly labelled button, rather than a hidden tap-to-flip.
defineProps<{ qr: QrShape | null; number: string; name: string; ready: boolean }>();
const open = defineModel<boolean>('open', { default: false });
const dialogEl = ref<HTMLDialogElement | null>(null);

function sync(show: boolean) {
  const dialog = dialogEl.value;
  if (!dialog) return;
  if (show && !dialog.open) dialog.showModal();
  else if (!show && dialog.open) dialog.close();
}
watch(open, sync);
onMounted(() => sync(open.value));
</script>

<template>
  <dialog ref="dialogEl" class="code-dialog" aria-labelledby="code-title" @close="open = false" @click.self="open = false">
    <div class="code-head">
      <div>
        <p class="code-kicker">M Souq Rewards</p>
        <h2 id="code-title">{{ ready ? 'Scan to collect your gift' : 'Scan at checkout' }}</h2>
      </div>
      <button type="button" class="code-close" aria-label="Close" @click="open = false"><X :size="22" aria-hidden="true" /></button>
    </div>
    <div class="code-sheet">
      <p class="code-sub">Show this screen to the cashier. They will scan it {{ ready ? 'and hand you your free gift' : 'and add your stamp' }}.</p>
      <div class="code-qr">
        <svg v-if="qr" :viewBox="`-1 -1 ${qr.size + 2} ${qr.size + 2}`" shape-rendering="crispEdges" role="img" aria-label="Your rewards code">
          <path :d="qr.path" fill="currentColor" />
        </svg>
        <p v-else class="code-qr-msg">The code couldn’t load. Read your card number to the cashier instead.</p>
      </div>
      <dl class="code-meta">
        <div class="code-field"><dt>Name</dt><dd class="code-name">{{ name }}</dd></div>
        <div class="code-field"><dt>Card number</dt><dd class="code-number">{{ formatCardNumber(number) }}</dd></div>
      </dl>
      <button type="button" class="btn btn-primary btn-lg btn-block" @click="open = false">Done</button>
    </div>
  </dialog>
</template>
