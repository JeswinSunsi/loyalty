import { equal, failure, isStaff, json, newStaffSession, sameOrigin, staffCookieHeader, staffPasscode } from "../../../../lib/loyalty";

export async function GET(request: Request) {
  try { return json({ authenticated: await isStaff(request) }); }
  catch (error) { return failure(error); }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Invalid request origin." }, 403);
  try {
    const { passcode } = await request.json() as { passcode?: string };
    if (!passcode || !equal(passcode, staffPasscode())) return json({ error: "That staff passcode is incorrect." }, 401);
    const response = json({ authenticated: true });
    response.headers.set("Set-Cookie", staffCookieHeader(await newStaffSession()));
    return response;
  } catch (error) { return failure(error); }
}

export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Invalid request origin." }, 403);
  const response = json({ authenticated: false });
  response.headers.set("Set-Cookie", staffCookieHeader("", true));
  return response;
}
