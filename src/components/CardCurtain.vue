<script setup lang="ts">
import BrandMark from './BrandMark.vue';
import SealRing from './SealRing.vue';
import { curtain, curtainOrigin } from '../transition';
</script>
<template>
  <div
    v-if="curtain !== 'idle'" class="ct" :class="`is-${curtain}`" aria-hidden="true"
    :style="{ '--ox': `${curtainOrigin.x}%`, '--oy': `${curtainOrigin.y}%` }"
  >
    <div class="ct-panel">
      <div class="ct-seal">
        <SealRing class="ct-ring" text="MY CARD · M SOUQ REWARDS · MY CARD · M SOUQ REWARDS · " />
        <BrandMark :size="76" class="ct-mark" />
      </div>
      <p class="ct-label">Opening your card</p>
    </div>
  </div>
</template>
