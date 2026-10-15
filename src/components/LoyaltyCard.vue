<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { Check, Gift, MoveUpRight, Smartphone } from '@lucide/vue';
import { STAMP_TARGET, type PreviewCard } from '../preview';

type MotionPermission = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<'granted' | 'denied'> };
const props = defineProps<{ card: PreviewCard }>();
const surface = ref<HTMLDivElement | null>(null);
const marks = computed(() => Math.max(0, Math.min(STAMP_TARGET, props.card.marks)));
const tiltEnabled = ref(false);
const tiltPending = ref(false);
const motionMessage = ref('');
let frame = 0;
let mounted = false;
let stopTilt: (() => void) | undefined;

function moveLight(x: number, y: number) {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => {
    const el = surface.value;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const safeX = reduced ? 0 : Math.max(-1, Math.min(1, x));
    const safeY = reduced ? 0 : Math.max(-1, Math.min(1, y));
    el.style.setProperty('--rx', `${-safeY * 7}deg`);
    el.style.setProperty('--ry', `${safeX * 9}deg`);
    el.style.setProperty('--light-x', `${50 + safeX * 40}%`);
    el.style.setProperty('--light-y', `${40 + safeY * 40}%`);
    el.style.setProperty('--foil-angle', `${120 + safeX * 35 + safeY * 20}deg`);
  });
}
function reset() { moveLight(0, 0); }
function preferenceChanged() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) tiltEnabled.value = false;
  reset();
}
onMounted(() => {
  mounted = true;
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', preferenceChanged);
  window.addEventListener('blur', reset);
});
onBeforeUnmount(() => {
  mounted = false;
  stopTilt?.();
  cancelAnimationFrame(frame);
  window.matchMedia('(prefers-reduced-motion: reduce)').removeEventListener('change', preferenceChanged);
  window.removeEventListener('blur', reset);
});
watch(tiltEnabled, enabled => {
  stopTilt?.();
  stopTilt = undefined;
  if (!enabled) return;
  let origin: { beta: number; gamma: number } | null = null;
  let received = false;
  const onTilt = (event: DeviceOrientationEvent) => {
    if (document.hidden || event.beta === null || event.gamma === null) return;
    received = true;
    if (!origin) origin = { beta: event.beta, gamma: event.gamma };
    const x = (event.gamma - origin.gamma) / 24;
    const y = (event.beta - origin.beta) / 24;
    const angle = (window.screen.orientation?.angle ?? 0) * Math.PI / 180;
    moveLight(x * Math.cos(angle) + y * Math.sin(angle), y * Math.cos(angle) - x * Math.sin(angle));
  };
  const recalibrate = () => { origin = null; reset(); };
  const timeout = window.setTimeout(() => {
    if (!received) {
      tiltEnabled.value = false;
      motionMessage.value = 'Tilt is unavailable here. Slide a finger across the card to catch the light.';
    }
  }, 2500);
  window.addEventListener('deviceorientation', onTilt);
  window.addEventListener('orientationchange', recalibrate);
  document.addEventListener('visibilitychange', recalibrate);
  stopTilt = () => {
    window.clearTimeout(timeout);
    window.removeEventListener('deviceorientation', onTilt);
    window.removeEventListener('orientationchange', recalibrate);
    document.removeEventListener('visibilitychange', recalibrate);
  };
});
async function toggleTilt() {
  if (tiltPending.value) return;
  if (tiltEnabled.value) {
    tiltEnabled.value = false;
    motionMessage.value = '';
    reset();
    return;
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    motionMessage.value = 'Motion stays still to match your device’s reduced-motion setting.';
    return;
  }
  if (!window.isSecureContext || typeof DeviceOrientationEvent === 'undefined') {
    motionMessage.value = 'Slide a finger across the card to catch the light. Phone tilt needs a supported browser and HTTPS.';
    return;
  }
  tiltPending.value = true;
  try {
    const sensor = DeviceOrientationEvent as MotionPermission;
    const permission = sensor.requestPermission ? await sensor.requestPermission() : 'granted';
    if (!mounted) return;
    if (permission === 'granted') {
      tiltEnabled.value = true;
      motionMessage.value = '';
    } else {
      motionMessage.value = 'Motion access is off. You can still move the light with your finger.';
    }
  } catch {
    if (mounted) motionMessage.value = 'Tilt couldn’t start. Slide a finger across the card instead.';
  } finally {
    if (mounted) tiltPending.value = false;
  }
}
function onPointerMove(event: PointerEvent) {
  if (tiltEnabled.value) return;
  const bounds = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
  moveLight((event.clientX - bounds.left) / bounds.width * 2 - 1, (event.clientY - bounds.top) / bounds.height * 2 - 1);
}
</script>

<template>
  <div class="card-experience">
    <div class="card-perspective" @pointermove="onPointerMove" @pointerleave="!tiltEnabled && reset()" @pointercancel="reset">
      <div ref="surface" class="loyalty-card" :data-complete="marks === STAMP_TARGET">
        <div class="card-guilloche" aria-hidden="true" />
        <div class="card-monogram" aria-hidden="true">m.</div>
        <div class="card-foil" aria-hidden="true" />
        <div class="card-glare" aria-hidden="true" />
        <div class="card-content">
          <div class="card-topline"><span class="card-brand">M Souq<span>.</span></span><span class="card-edition">REWARDS<MoveUpRight :size="15" /></span></div>
          <div class="card-member"><span class="card-label">CARDHOLDER</span><p>{{ card.name }}</p></div>
          <div class="card-stamps" role="img" :aria-label="`${marks} of ${STAMP_TARGET} stamps collected${marks === STAMP_TARGET ? '. Free gift ready.' : ''}`">
            <span v-for="index in STAMP_TARGET" :key="index" aria-hidden="true" class="card-stamp" :class="{ 'is-collected': index <= marks, 'is-reward': index === STAMP_TARGET }">
              <Check v-if="index <= marks" :size="21" :stroke-width="2.4" />
              <Gift v-else-if="index === STAMP_TARGET" :size="21" :stroke-width="1.5" />
              <span v-else class="stamp-number">0{{ index }}</span>
            </span>
          </div>
          <div class="card-bottomline"><span>3 STAMPS = A FREE GIFT</span><span aria-live="polite">{{ marks === STAMP_TARGET ? 'Free gift ready' : `${marks} of ${STAMP_TARGET} stamps` }}</span></div>
        </div>
      </div>
    </div>
    <div class="card-interaction-note">
      <span class="pointer-hint"><span class="light-dot" /> Your digital rewards card</span>
      <button type="button" class="tilt-toggle" :aria-pressed="tiltEnabled" :disabled="tiltPending" @click="toggleTilt"><Smartphone :size="14" />{{ tiltPending ? 'Enabling…' : tiltEnabled ? 'Phone tilt on · Turn off' : 'Enable phone tilt' }}</button>
    </div>
    <p v-if="motionMessage" class="motion-message" role="status">{{ motionMessage }}</p>
  </div>
</template>
