import { ref } from 'vue';

export const STAMP_TARGET = 3;
export type ActivityKind = 'created' | 'stamp' | 'redeemed';
export type Activity = { id: string; kind: ActivityKind; text: string; at: string };
export type MemberCard = { number: string; name: string; marks: number; since: string; activity: Activity[] };
const storageKey = 'm-souq-rewards-card';

function valid(saved: unknown): saved is MemberCard {
  const card = saved as MemberCard | null;
  return !!card && typeof card.name === 'string' && typeof card.number === 'string' && typeof card.since === 'string'
    && Number.isInteger(card.marks) && card.marks >= 0 && card.marks <= STAMP_TARGET && Array.isArray(card.activity);
}
function restore(): MemberCard | null {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey) || 'null');
    return valid(saved) ? saved : null;
  } catch { return null; }
}

export const memberCard = ref<MemberCard | null>(restore());
export const storageAvailable = ref(true);

// Keep every open tab in step, so a stamp added at checkout shows up on the customer's card straight away.
window.addEventListener('storage', event => {
  if (event.key === storageKey) memberCard.value = restore();
});

function persist() {
  try { localStorage.setItem(storageKey, JSON.stringify(memberCard.value)); }
  catch { storageAvailable.value = false; }
}
function record(kind: ActivityKind, text: string) {
  if (!memberCard.value) return;
  memberCard.value.activity.unshift({ id: crypto.randomUUID(), kind, text, at: new Date().toISOString() });
  memberCard.value.activity = memberCard.value.activity.slice(0, 12);
  persist();
}
function newCardNumber() {
  const digits = crypto.getRandomValues(new Uint32Array(1))[0] % 90_000_000 + 10_000_000;
  return String(digits);
}

export function formatCardNumber(number: string) {
  return number.replace(/(\d{4})(?=\d)/g, '$1 ');
}
export function findCard(input: string) {
  const digits = input.replace(/\D/g, '');
  return !!digits && memberCard.value?.number === digits;
}
export function createCard(name: string) {
  memberCard.value = { number: newCardNumber(), name: name.trim().replace(/\s+/g, ' ').slice(0, 40), marks: 0, since: new Date().toISOString(), activity: [] };
  record('created', 'Card created');
}
export function addStamp() {
  if (!memberCard.value || memberCard.value.marks >= STAMP_TARGET) return false;
  memberCard.value.marks += 1;
  record('stamp', `Stamp ${memberCard.value.marks} of ${STAMP_TARGET} collected`);
  return true;
}
export function redeemGift() {
  if (memberCard.value?.marks !== STAMP_TARGET) return false;
  memberCard.value.marks = 0;
  record('redeemed', 'Free gift redeemed');
  return true;
}
export function restoreCard(previous: MemberCard) {
  memberCard.value = structuredClone(previous);
  persist();
}
