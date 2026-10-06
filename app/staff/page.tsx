"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { Camera, Check, LogOut, ScanLine, X } from "lucide-react";

type Card = { name: string; phoneLast4: string; punches: number; unlocked: boolean; memberSince: string };
type Result = { authenticated?: boolean; card?: Card; message?: string; error?: string };

async function request(path: string, body?: object, method = "POST"): Promise<Result> {
  const response = await fetch(path, {
    method, headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined, cache: "no-store",
  });
  return response.json();
}

function tokenFromScan(raw: string): string | null {
  const value = raw.trim();
  if (/^[a-f0-9]{64}$/.test(value)) return value;
  try {
    const token = new URL(value).searchParams.get("card");
    return token && /^[a-f0-9]{64}$/.test(token) ? token : null;
  } catch { return null; }
}

export default function StaffPage() {
  const [auth, setAuth] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState("");
  const [cardInput, setCardInput] = useState("");
  const [token, setToken] = useState("");
  const [card, setCard] = useState<Card | null>(null);
  const [scanning, setScanning] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const scanner = useRef<{ stop: () => Promise<unknown>; clear: () => void | Promise<unknown> } | null>(null);

  useEffect(() => {
    void request("/api/staff/session", undefined, "GET").then(r => setAuth(!!r.authenticated)).catch(() => {
      setAuth(false); setError("Staff sign-in is unavailable. Try again.");
    });
  }, []);

  const loadCard = useCallback(async (value: string) => {
    const parsed = tokenFromScan(value);
    if (!parsed) { setError("Enter a valid M Souq card link or code."); return; }
    setBusy(true); setError(""); setNotice("");
    try {
      const result = await request("/api/staff/card", { token: parsed });
      if (result.error) { setError(result.error); setCard(null); return; }
      setToken(parsed); setCard(result.card ?? null); setCardInput("");
    } catch { setError("Could not find this card. Try again."); }
    finally { setBusy(false); }
  }, []);

  useEffect(() => {
    if (!auth) return;
    const initial = new URLSearchParams(window.location.search).get("card");
    if (initial) void loadCard(initial);
  }, [auth, loadCard]);

  useEffect(() => {
    if (!scanning) return;
    let cancelled = false;
    const start = async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (cancelled) return;
        const instance = new Html5Qrcode("reader", { verbose: false });
        scanner.current = instance;
        await instance.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 230, height: 230 } }, decoded => {
          if (cancelled) return;
          cancelled = true;
          void instance.stop().then(() => instance.clear()).catch(() => undefined);
          scanner.current = null; setScanning(false); void loadCard(decoded);
        }, () => undefined);
      } catch {
        if (!cancelled) { setScanning(false); setError("Camera could not start. Allow camera access or enter a card link below."); }
      }
    };
    void start();
    return () => {
      cancelled = true;
      if (scanner.current) {
        const active = scanner.current; scanner.current = null;
        void active.stop().then(() => active.clear()).catch(() => undefined);
      }
    };
  }, [scanning, loadCard]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const result = await request("/api/staff/session", { passcode });
      if (result.error) setError(result.error);
      else { setAuth(true); setPasscode(""); }
    } catch { setError("Could not sign in. Try again."); }
    finally { setBusy(false); }
  }

  async function addMark() {
    if (!token || !card || card.unlocked) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const result = await request("/api/staff/punch", { token });
      if (result.card) setCard(result.card);
      if (result.error) setError(result.error);
      else setNotice(result.message ?? "Mark added.");
    } catch { setError("Could not add a mark. Try again."); }
    finally { setBusy(false); }
  }

  async function signOut() {
    try {
      await request("/api/staff/session", undefined, "DELETE");
      setAuth(false); setCard(null); setToken(""); setNotice(""); setError("");
    } catch { setError("Could not sign out. Try again."); }
  }

  function nextCustomer() {
    setCard(null); setToken(""); setNotice(""); setError("");
    history.replaceState(null, "", "/staff");
  }

  return <main className="min-h-[100dvh]">
    <header className="border-b border-[#dbe6f6] bg-white/85">
      <div className="mx-auto flex max-w-[980px] items-center justify-between gap-3 px-4 py-4 sm:px-8">
        <a href="/" className="inline-flex items-center gap-2.5 text-[#10274d]"><span className="grid h-10 w-10 place-items-center rounded-[13px] bg-[#1856b9] text-xl font-black text-white">M</span><span className="text-xl font-extrabold tracking-[-.06em]">M Souq</span></a>
        {auth ? <button onClick={signOut} className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-[#355d97] hover:bg-[#e9f2ff]"><LogOut className="h-4 w-4" /> Sign out</button> : <span className="text-sm font-semibold text-[#54729e]">Staff</span>}
      </div>
    </header>

    {auth === null ? <p role="status" className="py-20 text-center text-[#4b6388]">Opening staff desk…</p> : !auth ?
      <div className="mx-auto max-w-[460px] px-4 pb-12 pt-12 sm:px-6 sm:pt-20">
        <h1 className="text-3xl font-extrabold tracking-[-.05em] text-[#10274d]">Staff sign-in</h1>
        <p className="mt-2 text-base text-[#4b6388]">Enter your M Souq staff passcode.</p>
        <form onSubmit={signIn} className="mt-7 rounded-[24px] border border-[#d8e6f8] bg-white p-5 shadow-[0_18px_45px_rgba(22,68,137,.07)] sm:p-7">
          <label className="block text-sm font-semibold text-[#17365f]">Passcode<input type="password" autoComplete="current-password" value={passcode} onChange={e => setPasscode(e.target.value)} required placeholder="Enter passcode" className="form-input mt-1.5" /></label>
          {error && <p role="alert" className="mt-4 rounded-xl bg-[#fff1ed] px-4 py-3 text-sm text-[#973c28]">{error}</p>}
          <button disabled={busy} className="mt-5 min-h-12 w-full rounded-xl bg-[#1856b9] px-5 text-base font-bold text-white hover:bg-[#103f91] disabled:opacity-60">{busy ? "Checking…" : "Sign in"}</button>
        </form>
      </div> :
      <div className="mx-auto max-w-[980px] px-4 pb-12 pt-7 sm:px-8 sm:pt-10">
        <h1 className="text-3xl font-extrabold tracking-[-.05em] text-[#10274d] sm:text-4xl">Add a reward mark</h1>
        <p className="mt-2 text-base text-[#4b6388]">Scan a customer’s card after their purchase.</p>
        <div className="mt-6 grid items-start gap-5 md:grid-cols-[1fr_.9fr] md:gap-6">
          <section className="rounded-[24px] border border-[#d8e6f8] bg-white p-5 shadow-[0_12px_35px_rgba(22,68,137,.06)] sm:p-7">
            <h2 className="flex items-center gap-2 text-xl font-bold text-[#10274d]"><ScanLine className="h-5 w-5 text-[#1856b9]" /> Scan card</h2>
            {scanning ? <div className="mt-5">
              <div id="reader" className="mx-auto w-full max-w-[360px] overflow-hidden rounded-xl" />
              <button type="button" onClick={() => setScanning(false)} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-[#1856b9] hover:bg-[#eaf2fc]"><X className="h-4 w-4" /> Stop camera</button>
            </div> : <div className="mt-5 flex flex-col items-center rounded-2xl border border-dashed border-[#b9d2f1] bg-[#f3f8ff] px-5 py-9 text-center">
              <Camera className="h-9 w-9 text-[#1856b9]" />
              <p className="mt-3 text-sm text-[#4b6388]">Point your camera at the customer’s QR code.</p>
              <button type="button" onClick={() => { setError(""); setScanning(true); }} className="mt-5 min-h-12 w-full max-w-[260px] rounded-xl bg-[#1856b9] px-5 text-base font-bold text-white hover:bg-[#103f91]">Open camera</button>
            </div>}
            <details className="mt-5 rounded-xl border border-[#dbe6f6] p-4"><summary className="cursor-pointer text-sm font-semibold text-[#1856b9]">Enter card link or code instead</summary>
              <form onSubmit={e => { e.preventDefault(); void loadCard(cardInput); }} className="mt-4 flex flex-col gap-2 sm:flex-row">
                <input value={cardInput} onChange={e => setCardInput(e.target.value)} placeholder="Paste card link or code" aria-label="Card link or code" className="form-input min-w-0 flex-1" />
                <button disabled={busy || !cardInput} className="min-h-12 rounded-xl bg-[#1856b9] px-5 text-sm font-bold text-white disabled:opacity-60">Find card</button>
              </form>
            </details>
          </section>
          <section className="rounded-[24px] border border-[#d8e6f8] bg-white p-5 shadow-[0_12px_35px_rgba(22,68,137,.06)] sm:p-7">
            <h2 className="text-xl font-bold text-[#10274d]">Customer card</h2>
            {card ? <div className="mt-5">
              <div className="loyalty-card relative overflow-hidden rounded-[22px] p-5 text-white">
                <div className="relative flex justify-between gap-3 text-sm font-semibold"><span>M Souq Rewards</span><span>•••• {card.phoneLast4}</span></div>
                <p className="relative mt-8 truncate text-2xl font-extrabold tracking-[-.04em]">{card.name}</p>
                <div className="relative mt-5 grid grid-cols-6 gap-2" aria-label={card.punches + " of 6 purchases counted"}>{Array.from({ length: 6 }, (_, i) => <span key={i} aria-hidden="true" className={(i < card.punches ? "bg-white text-[#1551ad]" : "border border-white/55 bg-white/10") + " grid aspect-square place-items-center rounded-full text-sm font-bold"}>{i < card.punches ? <Check className="h-4 w-4" /> : i + 1}</span>)}</div>
              </div>
              <p className="mt-4 text-sm text-[#4b6388]">{card.unlocked ? "Reward ready. This card is complete." : "Confirm the purchase, then add one mark."}</p>
              {!card.unlocked && <button type="button" onClick={addMark} disabled={busy} className="mt-4 min-h-12 w-full rounded-xl bg-[#1856b9] px-5 text-base font-bold text-white hover:bg-[#103f91] disabled:opacity-60">{busy ? "Adding…" : "Add one mark"}</button>}
              <button type="button" onClick={nextCustomer} className="mt-3 min-h-11 w-full rounded-xl border border-[#b9d2f1] px-4 text-sm font-semibold text-[#1856b9] hover:bg-[#edf4ff]">Next customer</button>
            </div> : <div className="mt-5 rounded-2xl bg-[#f3f8ff] px-5 py-10 text-center text-sm text-[#4b6388]">Customer card appears here after scan.</div>}
            {notice && <p role="status" className="mt-4 rounded-xl bg-[#e2f1ff] px-4 py-3 text-sm font-semibold text-[#123b79]">{notice}</p>}
            {error && <p role="alert" className="mt-4 rounded-xl bg-[#fff1ed] px-4 py-3 text-sm text-[#973c28]">{error}</p>}
          </section>
        </div>
      </div>}
  </main>;
}
