import { cardFromRow, database, failure, json, normalizePhone, sameOrigin, sign, validBirthDate, type CustomerRow } from "../../../../lib/loyalty";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Invalid request origin." }, 403);
  try {
    const body = await request.json() as { phone?: string; birthDate?: string };
    const phone = normalizePhone(body.phone ?? "");
    const birthDate = body.birthDate ?? "";
    if (!phone || !validBirthDate(birthDate)) return json({ error: "Check your number and date of birth." }, 400);
    const row = await database().prepare("SELECT name, phone_last4, punches, created_at, card_token FROM customers WHERE phone_hash = ? AND birth_hash = ?")
      .bind(await sign(`phone:${phone}`), await sign(`birth:${phone}:${birthDate}`)).first<CustomerRow & { card_token: string }>();
    return row ? json({ token: row.card_token, card: cardFromRow(row) }) : json({ error: "No card matches those details." }, 404);
  } catch (error) { return failure(error); }
}
