import { cardFromRow, database, failure, freshToken, json, normalizePhone, sameOrigin, sign, validBirthDate, type CustomerRow } from "../../../lib/loyalty";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Invalid request origin." }, 403);
  try {
    const body = await request.json() as { name?: string; phone?: string; birthDate?: string };
    const name = body.name?.trim().replace(/\s+/g, " ") ?? "";
    const phone = normalizePhone(body.phone ?? "");
    const birthDate = body.birthDate ?? "";
    if (name.length < 2 || name.length > 60) return json({ error: "Enter your full name (2–60 characters)." }, 400);
    if (!phone) return json({ error: "Enter a valid phone number with 8–15 digits." }, 400);
    if (!validBirthDate(birthDate)) return json({ error: "Enter a valid date of birth." }, 400);

    const phoneHash = await sign(`phone:${phone}`);
    const birthHash = await sign(`birth:${phone}:${birthDate}`);
    const token = freshToken();
    const now = new Date().toISOString();
    const db = database();
    const existing = await db.prepare("SELECT id FROM customers WHERE phone_hash = ?").bind(phoneHash).first();
    if (existing) return json({ error: "This number already has a card. Use ‘Find my card’ to open it." }, 409);
    try {
      await db.prepare("INSERT INTO customers (id, name, phone_hash, birth_hash, phone_last4, card_token, punches, created_at) VALUES (?, ?, ?, ?, ?, ?, 0, ?)")
        .bind(crypto.randomUUID(), name, phoneHash, birthHash, phone.slice(-4), token, now).run();
    } catch (error) {
      if (String(error).includes("UNIQUE constraint")) return json({ error: "This number already has a card. Use ‘Find my card’ to open it." }, 409);
      throw error;
    }
    return json({ token, card: cardFromRow({ name, phone_last4: phone.slice(-4), punches: 0, created_at: now } as CustomerRow) }, 201);
  } catch (error) { return failure(error); }
}
