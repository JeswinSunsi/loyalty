<script setup lang="ts">
import { nextTick, reactive } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { ArrowLeft, Gift, Info } from '@lucide/vue';
import SiteHeader from '../components/SiteHeader.vue';
import LoyaltyCard from '../components/LoyaltyCard.vue';
import HoverArrow from '../components/HoverArrow.vue';
import { createCard, memberCard, PHONE_PREFIX } from '../store';

const fields = ['name', 'birthDate', 'phone'] as const;
type Field = typeof fields[number];
const router = useRouter();
const form = reactive({ name: '', birthDate: '', phone: '' });
const errors = reactive<Record<Field, string>>({ name: '', birthDate: '', phone: '' });

// Birth dates run from 120 years ago up to today, in the visitor's own calendar day.
function isoDay(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
const today = new Date();
const maxBirthDate = isoDay(today);
const minBirthDate = isoDay(new Date(today.getFullYear() - 120, today.getMonth(), today.getDate()));

function check(): Field | null {
  errors.name = form.name.trim() ? '' : 'Please type your name.';
  errors.birthDate = !form.birthDate ? 'Please add your date of birth.'
    : form.birthDate > maxBirthDate || form.birthDate < minBirthDate ? 'Please check your date of birth.' : '';
  // Omani mobile numbers are 8 digits and start with 7 or 9.
  errors.phone = /^[79]\d{7}$/.test(form.phone.replace(/\D/g, '')) ? '' : 'Please enter an 8-digit mobile number.';
  return fields.find(field => errors[field]) ?? null;
}
async function submit() {
  const firstError = check();
  if (firstError) {
    await nextTick();
    document.getElementById(`member-${firstError}`)?.focus();
    return;
  }
  createCard(form);
  void router.push({ path: '/card/', query: { welcome: '1' } });
}
function describedBy(field: Field) {
  return errors[field] ? `${field}-error` : undefined;
}
</script>
<template>
  <div class="page-shell join-page">
    <SiteHeader />
    <main id="main-content" class="hero join-hero">
      <div class="container hero-inner">
        <section class="join-copy">
          <RouterLink to="/" class="back-link"><ArrowLeft :size="16" aria-hidden="true" /> Back</RouterLink>
          <p class="eyebrow"><span class="eyebrow-tag">Free</span> Your rewards card</p>
          <h1 class="display">Get your<br /><span>free card.</span></h1>
          <p class="lede">Fill in your details and your card is ready right away.</p>

          <div v-if="memberCard" class="callout" role="note">
            <Info :size="18" aria-hidden="true" />
            <p>This phone already has a card with {{ memberCard.marks }} of 3 stamps. <RouterLink to="/card/">Open it</RouterLink>. Making a new card will replace it.</p>
          </div>

          <form class="join-form" novalidate @submit.prevent="submit">
            <p id="details-label" class="form-label">Your details</p>
            <!-- One joined block, label on the left of each row, as in Stripe's checkout. -->
            <div class="field-group" role="group" aria-labelledby="details-label">
              <div class="field-row" :class="{ 'is-invalid': errors.name }">
                <label for="member-name">Name</label>
                <input
                  id="member-name" v-model="form.name" required autocomplete="name" maxlength="40" placeholder="Full name"
                  :aria-invalid="!!errors.name" :aria-describedby="describedBy('name')" @input="errors.name = ''"
                />
              </div>
              <div class="field-row" :class="{ 'is-invalid': errors.birthDate }">
                <label for="member-birthDate">Date of birth</label>
                <input
                  id="member-birthDate" v-model="form.birthDate" type="date" required autocomplete="bday" :min="minBirthDate" :max="maxBirthDate"
                  :aria-invalid="!!errors.birthDate" :aria-describedby="describedBy('birthDate')" @input="errors.birthDate = ''"
                />
              </div>
              <div class="field-row" :class="{ 'is-invalid': errors.phone }">
                <label for="member-phone">Phone</label>
                <span class="field-prefix" aria-hidden="true">{{ PHONE_PREFIX }}</span>
                <input
                  id="member-phone" v-model="form.phone" type="tel" inputmode="numeric" required autocomplete="tel-national" maxlength="9" placeholder="9123 4567"
                  :aria-invalid="!!errors.phone" :aria-describedby="describedBy('phone')" @input="errors.phone = ''"
                />
              </div>
            </div>
            <div class="field-errors">
              <template v-for="field in fields" :key="field">
                <p v-if="errors[field]" :id="`${field}-error`" class="field-error" role="alert">{{ errors[field] }}</p>
              </template>
            </div>

            <button class="btn btn-brand btn-lg btn-block">Create my card <HoverArrow /></button>
          </form>
        </section>
      </div>

      <aside class="showcase join-preview" aria-label="Card preview">
        <div class="container">
          <LoyaltyCard :name="form.name.trim() || 'Your name'" :marks="0" />
          <p class="try-caption join-preview-note"><Gift :size="16" aria-hidden="true" /> Fill it with three stamps for a free gift.</p>
        </div>
      </aside>
    </main>
  </div>
</template>
