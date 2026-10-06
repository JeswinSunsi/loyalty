import { failure, findCard, isStaff, json, sameOrigin, validToken } from "../../../../lib/loyalty";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Invalid request origin." }, 403);
  try {
    if (!await isStaff(request)) return json({ error: "Staff sign-in required." }, 401);
    const { token } = await request.json() as { token?: string };
    if (!validToken(token)) return json({ error: "That QR code is not an M Souq card." }, 400);
    const card = await findCard(token);
    return card ? json({ card }) : json({ error: "Card not found." }, 404);
  } catch (error) { return failure(error); }
}
