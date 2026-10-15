<script setup lang="ts">
import InkStamp from './InkStamp.vue';
import { curtain } from '../transition';
</script>
<template>
  <div v-if="curtain !== 'idle'" class="ct" :class="`is-${curtain}`" aria-hidden="true">
    <div class="ct-panel">
      <div class="ct-mark">
        <InkStamp class="ct-stamp" ring="MY CARD · M SOUQ · REWARDS · " />
        <p class="ct-label">Opening your card</p>
      </div>
    </div>
  </div>
</template>
