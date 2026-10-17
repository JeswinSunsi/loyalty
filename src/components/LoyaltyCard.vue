<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { Check, Gift } from '@lucide/vue';
import BrandMark from './BrandMark.vue';
import { formatCardNumber, STAMP_TARGET } from '../store';
import { glide } from '../motion';
import type { QrShape } from '../qr';

const props = withDefaults(defineProps<{ name: string; marks: number; number?: string; decorative?: boolean; flippable?: boolean; qr?: QrShape | null }>(), { number: '', decorative: false, flippable: false, qr: null });
const flipped = defineModel<boolean>('flipped', { default: false });
const marks = computed(() => Math.max(0, Math.min(STAMP_TARGET, props.marks)));
const complete = computed(() => marks.value === STAMP_TARGET);
const status = computed(() => complete.value ? 'Gift ready' : STAMP_TARGET - marks.value === 1 ? '1 to go' : `${STAMP_TARGET - marks.value} to go`);
/*
  Opening lifts the card out of the page: it floats to the middle of the screen over a dimmed page, turning over and
  standing up as a tall pass with the code. Closing sends it back to its place. The floating card is laid out at its
  open size and only glides (transform) between the two spots, so it is never re-laid out or blurred mid-way.
*/
const wrapEl = ref<HTMLElement | null>(null);
const floatEl = ref<HTMLElement | null>(null);
const floating = ref(false);
watch(flipped, async open => {
  const el = floatEl.value;
  const home = wrapEl.value;
  if (!el || !home) return;
  const from = el.getBoundingClientRect();
  if (open) {
    floating.value = true;
    await nextTick();
    glide(el, from);
    return;
  }
  const landing = glide(el, from, home.getBoundingClientRect());
  if (!landing) { floating.value = false; return; }
  landing.onfinish = () => {
    if (flipped.value) return;
    floating.value = false;
    void nextTick(() => landing.cancel());
  };
});
function toggle() { if (props.flippable) flipped.value = !flipped.value; }
function close() { flipped.value = false; }
// While the card is up, the page behind stays put.
function holdPage(event: Event) { if (floating.value) event.preventDefault(); }
function onKey(event: KeyboardEvent) { if (event.key === 'Escape' && flipped.value) close(); }
if (props.flippable) window.addEventListener('keydown', onKey);
onBeforeUnmount(() => window.removeEventListener('keydown', onKey));

const label = computed(() => flipped.value
  ? 'Showing your checkout code. Tap to put your card back.'
  : `${props.name}’s card, ${marks.value} of ${STAMP_TARGET} stamps${complete.value ? ', free gift ready' : ''}. Tap to show your checkout code.`);
</script>

<template>
  <div ref="wrapEl" class="lc-wrap" :class="{ 'is-flippable': flippable }">
    <div v-if="flippable" class="lc-backdrop" :class="{ 'is-on': flipped }" aria-hidden="true" @click="close" @wheel="holdPage" @touchmove="holdPage">
      <p class="lc-backdrop-hint">Tap anywhere to put your card away</p>
    </div>
    <div ref="floatEl" class="lc-float" :class="{ 'is-floating': floating }" @wheel="holdPage" @touchmove="holdPage">
      <div class="lc-stage" :class="{ 'is-flipped': flippable && flipped }">
        <div class="lc-lift">
          <div
            class="lc-flipper" :class="{ 'is-flippable': flippable }"
            :role="flippable ? 'button' : undefined" :tabindex="flippable ? 0 : undefined"
            :aria-pressed="flippable ? flipped : undefined" :aria-label="flippable ? label : undefined"
            @click="toggle" @keydown.enter.prevent="toggle" @keydown.space.prevent="toggle"
          >
            <div class="lc lc-front" :class="{ 'is-complete': complete }" :aria-hidden="decorative || (flippable && flipped) || undefined">
              <div class="lc-glow" aria-hidden="true" />
              <div class="lc-body">
                <div class="lc-top">
                  <span class="lc-brand"><BrandMark :size="24" /> M Souq</span>
                  <span class="lc-status">{{ status }}</span>
                </div>
                <ol class="lc-stamps" :aria-label="`${marks} of ${STAMP_TARGET} stamps collected${complete ? '. Free gift ready.' : ''}`">
                  <li v-for="i in STAMP_TARGET" :key="i" class="lc-slot" :class="{ 'is-filled': i <= marks, 'is-gift': i === STAMP_TARGET }">
                    <span v-if="i <= marks" class="lc-stamp" :class="{ 'is-gift-stamp': i === STAMP_TARGET }" aria-hidden="true">
                      <Gift v-if="i === STAMP_TARGET" :stroke-width="2" />
                      <Check v-else :stroke-width="2.5" />
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
              <!-- A ticket: blurple stub with who it belongs to, notched where it meets the white face that carries the code. -->
              <div class="lc-portrait">
                <div class="lc-pass-head">
                  <div class="lc-top">
                    <span class="lc-brand"><BrandMark :size="20" /> M Souq</span>
                    <span class="lc-status">{{ status }}</span>
                  </div>
                  <div class="lc-field">
                    <span class="lc-label">Member</span>
                    <span class="lc-name">{{ name }}</span>
                  </div>
                </div>
                <div class="lc-pass-body">
                  <div class="lc-qr-area">
                    <div class="lc-qr">
                      <svg v-if="qr" :viewBox="`-1 -1 ${qr.size + 2} ${qr.size + 2}`" shape-rendering="crispEdges" role="img" aria-label="Your rewards code">
                        <path :d="qr.path" fill="currentColor" />
                      </svg>
                      <span v-else class="lc-qr-msg">Read your card number at the counter</span>
                      <span class="lc-scan" aria-hidden="true" />
                    </div>
                  </div>
                  <p class="lc-back-number">{{ formatCardNumber(number) }}</p>
                  <p class="lc-back-title">{{ complete ? 'Scan to collect your gift' : 'Scan at the counter' }}</p>
                </div>
              </div>
              <span class="lc-shine" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
