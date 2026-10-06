import { failure, findCard, json, sameOrigin, validToken } from "../../../../lib/loyalty";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Invalid request origin." }, 403);
  try {
    const { token } = await request.json() as { token?: string };
    if (!validToken(token)) return json({ error: "Card not found." }, 404);
    const card = await findCard(token);
    return card ? json({ card }) : json({ error: "Card not found." }, 404);
  } catch (error) { return failure(error); }
}
