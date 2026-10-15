export type PreviewCard = { name: string; marks: number };
const nameKey = 'm-souq-preview-name';
export function getPreviewName(): string | null {
  try { return window.sessionStorage.getItem(nameKey); } catch { return null; }
}
export function savePreviewName(name: string): void {
  try { window.sessionStorage.setItem(nameKey, name); } catch { /* Preview still works when storage is unavailable. */ }
}
