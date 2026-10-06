import { env } from "cloudflare:workers";

export type Card = { name: string; phoneLast4: string; punches: number; unlocked: boolean; memberSince: string };
export type CustomerRow = { name: string; phone_last4: string; punches: number; created_at: string };

export function database(): D1Database {
  if (!env.DB) throw new Error("Loyalty database is unavailable");
  return env.DB;
}

function appSecret(): string {
  if (!env.APP_SECRET || env.APP_SECRET.length < 32) throw new Error("APP_SECRET is not configured");
  return env.APP_SECRET;
}

export function staffPasscode(): string {
  if (!env.STAFF_PASSCODE || env.STAFF_PASSCODE.length < 12) throw new Error("STAFF_PASSCODE is not configured");
  return env.STAFF_PASSCODE;
}

export async function sign(value: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(appSecret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(signature), byte => byte.toString(16).padStart(2, "0")).join("");
}

export function equal(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let i = 0; i < a.length; i++) difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return difference === 0;
}

export function normalizePhone(value: string): string | null {
  const cleaned = value.trim().replace(/[\s().-]/g, "");
  return /^\+?[0-9]{8,15}$/.test(cleaned) ? cleaned : null;
}

export function validBirthDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value && value <= new Date().toISOString().slice(0, 10);
}

export function validToken(value: unknown): value is string {
  return typeof value === "string" && /^[a-f0-9]{64}$/.test(value);
}

export function freshToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
}

export function cardFromRow(row: CustomerRow): Card {
  return { name: row.name, phoneLast4: row.phone_last4, punches: row.punches, unlocked: row.punches >= 6, memberSince: row.created_at.slice(0, 10) };
}

export async function findCard(token: string): Promise<Card | null> {
  const row = await database().prepare("SELECT name, phone_last4, punches, created_at FROM customers WHERE card_token = ?")
    .bind(token).first<CustomerRow>();
  return row ? cardFromRow(row) : null;
}

export function json(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("Origin");
  return !origin || origin === new URL(request.url).origin;
}

export function failure(error: unknown): Response {
  console.error("Loyalty request failed", error);
  return json({ error: "Something went wrong. Please try again in a moment." }, 500);
}

const staffCookie = "punch_staff";

export async function newStaffSession(): Promise<string> {
  const expires = Date.now() + 12 * 60 * 60 * 1000;
  const payload = `v1.${expires}`;
  return `${payload}.${await sign(`staff:${payload}`)}`;
}

export async function isStaff(request: Request): Promise<boolean> {
  const value = request.headers.get("Cookie")?.split(";").map(v => v.trim()).find(v => v.startsWith(`${staffCookie}=`))?.slice(staffCookie.length + 1);
  if (!value) return false;
  const parts = value.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return false;
  const expires = Number(parts[1]);
  if (!Number.isFinite(expires) || expires < Date.now()) return false;
  return equal(parts[2], await sign(`staff:v1.${parts[1]}`));
}

export function staffCookieHeader(value: string, clear = false): string {
  return `${staffCookie}=${value}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${clear ? 0 : 43200}`;
}
