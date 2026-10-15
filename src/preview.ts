import { ref } from 'vue';

export const STAMP_TARGET = 3;
export type PreviewCard = { name: string; marks: number };
export type Activity = { id: string; text: string; at: string };
type DemoCard = PreviewCard & { activity: Activity[] };
const storageKey = 'm-souq-demo-card-v2';

function restore(): DemoCard | null {
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey) || 'null') as DemoCard | null;
    if (!saved || typeof saved.name !== 'string' || !Number.isInteger(saved.marks) || saved.marks < 0 || saved.marks > STAMP_TARGET || !Array.isArray(saved.activity)) return null;
    return saved;
  } catch { return null; }
}
export const memberCard = ref<DemoCard | null>(restore());
export const storageAvailable = ref(true);
function persist() {
  try { sessionStorage.setItem(storageKey, JSON.stringify(memberCard.value)); }
  catch { storageAvailable.value = false; }
}
function record(text: string) {
  if (!memberCard.value) return;
  memberCard.value.activity.unshift({ id: crypto.randomUUID(), text, at: new Date().toISOString() });
  memberCard.value.activity = memberCard.value.activity.slice(0, 12);
  persist();
}
export function createCard(name: string) {
  memberCard.value = { name: name.trim().replace(/\s+/g, ' ').slice(0, 60), marks: 0, activity: [] };
  record('Card created');
}
export function loadExample() {
  memberCard.value = { name: 'M Souq member', marks: 1, activity: [] };
  record('Example card opened · 1 stamp');
}
export function addStamp() {
  if (!memberCard.value || memberCard.value.marks >= STAMP_TARGET) return false;
  memberCard.value.marks += 1;
  record(`Stamp added · ${memberCard.value.marks} of ${STAMP_TARGET}`);
  return true;
}
export function redeemGift() {
  if (memberCard.value?.marks !== STAMP_TARGET) return false;
  memberCard.value.marks = 0;
  record('Free gift redeemed · new card started');
  return true;
}
export function undoChange(previous: DemoCard) {
  memberCard.value = structuredClone(previous);
  persist();
}
