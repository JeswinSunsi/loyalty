<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue';
import { Gift } from '@lucide/vue';
import BrandMark from './BrandMark.vue';
import InkStamp from './InkStamp.vue';
import { formatCardNumber, STAMP_TARGET } from '../store';
import { settle } from '../motion';
import type { QrShape } from '../qr';

const props = withDefaults(defineProps<{ name: string; marks: number; number?: string; decorative?: boolean; flippable?: boolean; qr?: QrShape | null }>(), { number: '', decorative: false, flippable: false, qr: null });
const flipped = defineModel<boolean>('flipped', { default: false });
const patternId = `lc-lattice-${useId()}`;
const marks = computed(() => Math.max(0, Math.min(STAMP_TARGET, props.marks)));
const complete = computed(() => marks.value === STAMP_TARGET);
const status = computed(() => complete.value ? 'Gift ready' : STAMP_TARGET - marks.value === 1 ? '1 to go' : `${STAMP_TARGET - marks.value} to go`);
// A slight, varied tilt makes each stamp feel pressed by hand.
const angles = [-12, 8, -5];

// Flipping turns the card over and stands it upright, so the back is a tall card with the code.
// The stage snaps to its new height in one layout; the card then glides from where it was and hops a touch.
const liftEl = ref<HTMLElement | null>(null);
watch(flipped, async () => {
  const el = liftEl.value;
  if (!el) return;
  const from = el.getBoundingClientRect().top;
  await nextTick();
  settle(el, from, 12);
});
function toggle() { if (props.flippable) flipped.value = !flipped.value; }
const label = computed(() => flipped.value
  ? 'Showing your checkout code. Tap to flip back to your stamps.'
  : `${props.name}’s card, ${marks.value} of ${STAMP_TARGET} stamps${complete.value ? ', free gift ready' : ''}. Tap to show your checkout code.`);
</script>

<template>
  <div class="lc-wrap">
    <div class="lc-stage" :class="{ 'is-flippable': flippable, 'is-flipped': flippable && flipped }">
      <div ref="liftEl" class="lc-lift">
        <div
          class="lc-flipper" :class="{ 'is-flippable': flippable }"
          :role="flippable ? 'button' : undefined" :tabindex="flippable ? 0 : undefined"
          :aria-pressed="flippable ? flipped : undefined" :aria-label="flippable ? label : undefined"
          @click="toggle" @keydown.enter.prevent="toggle" @keydown.space.prevent="toggle"
        >
          <div class="lc lc-front" :class="{ 'is-complete': complete }" :aria-hidden="decorative || (flippable && flipped) || undefined">
            <svg class="lc-pattern" aria-hidden="true">
              <defs>
                <pattern :id="patternId" width="36" height="36" patternUnits="userSpaceOnUse">
                  <g fill="none" stroke="currentColor" stroke-width=".8">
                    <rect x="10" y="10" width="16" height="16" />
                    <rect x="10" y="10" width="16" height="16" transform="rotate(45 18 18)" />
                  </g>
                </pattern>
              </defs>
              <rect width="100%" height="100%" :fill="`url(#${patternId})`" />
            </svg>
            <div class="lc-glow" aria-hidden="true" />
            <div class="lc-body">
              <div class="lc-top">
                <span class="lc-brand"><BrandMark :size="26" /> M Souq</span>
                <span class="lc-status">{{ status }}</span>
              </div>
              <ol class="lc-stamps" :aria-label="`${marks} of ${STAMP_TARGET} stamps collected${complete ? '. Free gift ready.' : ''}`">
                <li v-for="i in STAMP_TARGET" :key="i" class="lc-slot" :class="{ 'is-filled': i <= marks, 'is-gift': i === STAMP_TARGET }">
                  <span v-if="i <= marks" class="lc-stamp" :class="{ 'is-gift-stamp': i === STAMP_TARGET }" :style="{ '--angle': `${angles[i - 1]}deg` }" aria-hidden="true">
                    <Gift v-if="i === STAMP_TARGET" :stroke-width="2" />
                    <InkStamp v-else />
                  </span>
                  <Gift v-else-if="i === STAMP_TARGET" class="lc-slot-icon" :stroke-width="1.6" aria-hidden="true" />
                  <span v-else class="lc-slot-num" aria-hidden="true">{{ i }}</span>
                </li>
              </ol>
              <div class="lc-bottom">
                <div class="lc-field">
                  <span class="lc-label">Member</span>
                  <span class="lc-name">{{ name }}</span>
                </div>
                <div v-if="number" class="lc-field lc-field-end">
                  <span class="lc-label">Card no.</span>
                  <span class="lc-number">{{ formatCardNumber(number) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="flippable" class="lc lc-back" :class="{ 'is-complete': complete }" :aria-hidden="!flipped">
            <svg class="lc-pattern" aria-hidden="true">
              <defs>
                <pattern :id="`${patternId}-back`" width="36" height="36" patternUnits="userSpaceOnUse">
                  <g fill="none" stroke="#fff" stroke-width=".8">
                    <rect x="10" y="10" width="16" height="16" />
                    <rect x="10" y="10" width="16" height="16" transform="rotate(45 18 18)" />
                  </g>
                </pattern>
              </defs>
              <rect width="100%" height="100%" :fill="`url(#${patternId}-back)`" />
            </svg>
            <div class="lc-portrait">
              <div class="lc-top">
                <span class="lc-brand"><BrandMark :size="20" /> M Souq</span>
                <span class="lc-pips" aria-hidden="true"><span v-for="i in STAMP_TARGET" :key="i" :class="{ on: i <= marks }" /></span>
              </div>
              <div class="lc-qr">
                <svg v-if="qr" :viewBox="`-1 -1 ${qr.size + 2} ${qr.size + 2}`" shape-rendering="crispEdges" role="img" aria-label="Your rewards code">
                  <path :d="qr.path" fill="currentColor" />
                </svg>
                <span v-else class="lc-qr-msg">Read your card number at the till</span>
                <span class="lc-scanline" aria-hidden="true" />
              </div>
              <p class="lc-back-title">{{ complete ? 'Scan to redeem' : 'Scan at checkout' }}</p>
              <p class="lc-back-number"><span class="lc-label">No.</span> {{ formatCardNumber(number) }}</p>
              <div class="lc-bottom">
                <div class="lc-field">
                  <span class="lc-label">Member</span>
                  <span class="lc-name">{{ name }}</span>
                </div>
              </div>
            </div>
            <span class="lc-shine" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
