<script setup lang="ts">
import { computed } from 'vue';
import { Check, Gift } from '@lucide/vue';
import BrandMark from './BrandMark.vue';
import { formatCardNumber, STAMP_TARGET } from '../store';

// A plain membership card, like the ones people already carry: brand, stamps with labels, name and number.
const props = withDefaults(defineProps<{ name: string; marks: number; number?: string }>(), { number: '' });
const marks = computed(() => Math.max(0, Math.min(STAMP_TARGET, props.marks)));
const complete = computed(() => marks.value === STAMP_TARGET);
const label = computed(() => `Rewards card for ${props.name}: ${marks.value} of ${STAMP_TARGET} stamps${complete.value ? ', free gift ready' : ''}.`);
</script>

<template>
  <div class="lc-wrap">
    <div class="lc" :class="{ 'is-complete': complete }" role="img" :aria-label="label">
      <div class="lc-top">
        <span class="lc-brand"><BrandMark :size="28" /> M Souq</span>
        <span class="lc-status">{{ complete ? 'Gift ready' : 'Rewards card' }}</span>
      </div>
      <ol class="lc-stamps">
        <li v-for="i in STAMP_TARGET" :key="i" :class="{ 'is-on': i <= marks, 'is-gift': i === STAMP_TARGET }">
          <span class="lc-dot">
            <Gift v-if="i === STAMP_TARGET" :stroke-width="2.2" />
            <Check v-else-if="i <= marks" :stroke-width="3" />
            <template v-else>{{ i }}</template>
          </span>
          <span class="lc-dot-label">{{ i === STAMP_TARGET ? 'Gift' : `Stamp ${i}` }}</span>
        </li>
      </ol>
      <div class="lc-bottom">
        <div class="lc-field">
          <span class="lc-label">Name</span>
          <span class="lc-name">{{ name }}</span>
        </div>
        <div v-if="number" class="lc-field lc-field-end">
          <span class="lc-label">Card number</span>
          <span class="lc-number">{{ formatCardNumber(number) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
