import { cardFromRow, database, failure, isStaff, json, sameOrigin, validToken, type CustomerRow } from "../../../../lib/loyalty";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Invalid request origin." }, 403);
  try {
    if (!await isStaff(request)) return json({ error: "Staff sign-in required." }, 401);
    const { token } = await request.json() as { token?: string };
    if (!validToken(token)) return json({ error: "That QR code is not an M Souq card." }, 400);
    const now = new Date();
    const cutoff = new Date(now.getTime() - 30_000).toISOString();
    const db = database();
    const row = await db.prepare("UPDATE customers SET punches = punches + 1, last_punch_at = ? WHERE card_token = ? AND punches < 6 AND (last_punch_at IS NULL OR last_punch_at < ?) RETURNING name, phone_last4, punches, created_at")
      .bind(now.toISOString(), token, cutoff).first<CustomerRow>();
    if (row) return json({ card: cardFromRow(row), message: row.punches === 6 ? "Reward unlocked!" : "Mark added!" });
    const current = await db.prepare("SELECT name, phone_last4, punches, created_at, last_punch_at FROM customers WHERE card_token = ?")
      .bind(token).first<CustomerRow & { last_punch_at: string | null }>();
    if (!current) return json({ error: "Card not found." }, 404);
    if (current.punches >= 6) return json({ error: "This card has already unlocked its reward.", card: cardFromRow(current) }, 409);
    return json({ error: "A mark was just added. Wait 30 seconds before another.", card: cardFromRow(current) }, 409);
  } catch (error) { return failure(error); }
}
