"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import QRCode from "qrcode";
import { Check, Gift, RefreshCw } from "lucide-react";

type Card = { name: string; phoneLast4: string; punches: number; unlocked: boolean; memberSince: string };
type ApiResult = { card?: Card; token?: string; error?: string };

async function post(path: string, body: object): Promise<{ status: number; data: ApiResult }> {
  const response = await fetch(path, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body), cache: "no-store",
  });
  return { status: response.status, data: await response.json() };
}

function Brand() {
  return <span className="inline-flex items-center gap-2.5 text-[#10274d]">
    <span className="grid h-10 w-10 place-items-center rounded-[13px] bg-[#1856b9] text-xl font-black text-white">M</span>
    <span className="flex flex-col leading-none"><span className="text-xl font-extrabold tracking-[-.06em]">M Souq</span><span className="mt-1 text-[11px] font-bold uppercase tracking-[.18em] text-[#54729e]">Rewards</span></span>
  </span>;
}

function LoyaltyCard({ card, preview = false }: { card: Card; preview?: boolean }) {
  return <div className="loyalty-card relative w-full overflow-hidden rounded-[28px] p-6 text-white shadow-[0_24px_50px_rgba(23,73,154,.22)] sm:p-8">
    <div className="relative flex items-start justify-between gap-3">
      <span className="text-xl font-black tracking-[-.06em] sm:text-2xl">M Souq<span className="font-medium text-[#a9d9ff]">.</span></span>
      <span className="rounded-full border border-white/30 px-3 py-1.5 text-xs font-semibold">Rewards card</span>
    </div>
    <div className="relative mt-9 flex items-end justify-between gap-3 sm:mt-11">
      <div className="min-w-0"><p className="text-sm font-medium text-[#c9e4ff]">{preview ? "Your card" : "Member"}</p><p className="mt-1 truncate text-[clamp(1.65rem,5vw,2.35rem)] font-extrabold leading-tight tracking-[-.05em]">{preview ? "Your name here" : card.name}</p></div>
      <span className="shrink-0 text-lg font-bold tabular-nums">{card.punches}<span className="text-[#add8ff]"> / 6</span></span>
    </div>
    <div className="relative mt-7 grid grid-cols-6 gap-2 sm:gap-3" aria-label={card.punches + " of 6 purchases counted"}>
      {Array.from({ length: 6 }, (_, i) => <span key={i} className={(i < card.punches ? "bg-white text-[#1551ad]" : "border border-white/55 bg-white/10 text-white/80") + " grid aspect-square place-items-center rounded-full text-sm font-bold"} aria-hidden="true">{i < card.punches ? <Check className="h-5 w-5 stroke-[3]" /> : i + 1}</span>)}
    </div>
    <div className="relative mt-6 flex items-center justify-between gap-3 border-t border-white/25 pt-4 text-sm font-medium text-[#d6ebff]">
      <span>{preview ? "Ready when you are" : "•••• " + card.phoneLast4}</span>
      <span>{card.unlocked ? "Reward ready" : (6 - card.punches) + " to go"}</span>
    </div>
  </div>;
}

export default function Home() {
  const [card, setCard] = useState<Card | null>(null);
  const [token, setToken] = useState("");
  const [qr, setQr] = useState("");
  const [mode, setMode] = useState<"join" | "find">("join");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async (value: string) => {
    try {
      const result = await post("/api/customer/card", { token: value });
      if (result.data.card) { setCard(result.data.card); setError(""); }
      else if (result.status === 404) {
        localStorage.removeItem("punch.card");
        setToken(""); setCard(null); setError("Card not found. Enter your details to open it again.");
      } else setError(result.data.error ?? "Could not update your card. Try again.");
    } catch { setError("Could not update your card. Try again."); }
    finally { setChecking(false); }
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("punch.card");
      if (saved) { setToken(saved); void refresh(saved); }
      else setChecking(false);
    } catch { setChecking(false); }
  }, [refresh]);

  useEffect(() => {
    if (!token) { setQr(""); return; }
    void QRCode.toDataURL(window.location.origin + "/staff?card=" + token, {
      width: 420, margin: 2, errorCorrectionLevel: "M", color: { dark: "#10274d", light: "#ffffff" },
    }).then(setQr).catch(() => setError("Could not make your scan code. Reload this page."));
    const onVisible = () => { if (document.visibilityState === "visible") void refresh(token); };
    document.addEventListener("visibilitychange", onVisible);
    const interval = window.setInterval(onVisible, 15000);
    return () => { document.removeEventListener("visibilitychange", onVisible); window.clearInterval(interval); };
  }, [token, refresh]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setBusy(true);
    try {
      let result = await post(mode === "join" ? "/api/customer" : "/api/customer/lookup", mode === "join" ? { name, phone, birthDate } : { phone, birthDate });
      if (mode === "join" && result.status === 409) result = await post("/api/customer/lookup", { phone, birthDate });
      if (result.data.error) { setError(result.data.error); return; }
      if (result.data.card && result.data.token) {
        try { localStorage.setItem("punch.card", result.data.token); } catch { /* Card remains open for this visit. */ }
        setToken(result.data.token); setCard(result.data.card);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch { setError("Could not open your card. Try again."); }
    finally { setBusy(false); }
  }

  const preview: Card = { name: "", phoneLast4: "", punches: 0, unlocked: false, memberSince: "" };

  return <main className="min-h-[100dvh]">
    <header className="border-b border-[#dbe6f6] bg-white/85">
      <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-4 px-4 py-4 sm:px-8"><Brand /><a href="/staff" className="rounded-full px-3 py-2 text-sm font-semibold text-[#355d97] hover:bg-[#e9f2ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1856b9]">Staff</a></div>
    </header>

    <div className="mx-auto max-w-[1080px] px-4 pb-12 pt-7 sm:px-8 sm:pt-10">
      {checking ? <p role="status" className="py-16 text-center text-base text-[#4a6389]">Opening your card…</p> : card ? <>
        <div className="mb-6"><h1 className="text-3xl font-extrabold tracking-[-.05em] text-[#10274d] sm:text-4xl">Your M Souq card</h1><p className="mt-2 text-base text-[#4b6388]">Show your code at checkout after each purchase.</p></div>
        {error && <p role="alert" className="mb-5 rounded-xl bg-[#fff1ed] px-4 py-3 text-sm text-[#973c28]">{error}</p>}
        <div className="grid items-start gap-5 md:grid-cols-[1.2fr_.8fr] md:gap-6">
          <section className="order-2 md:order-1" aria-label="Loyalty progress"><LoyaltyCard card={card} />
            {card.unlocked && <div role="status" className="mt-5 flex gap-3 rounded-2xl border border-[#a9d3ff] bg-[#e2f1ff] p-4 text-[#123b79]"><Gift className="h-6 w-6 shrink-0" /><div><p className="font-bold">Your reward is ready</p><p className="mt-1 text-sm">Show your card to M Souq staff.</p></div></div>}
          </section>
          <section className="order-1 rounded-[24px] border border-[#d8e6f8] bg-white p-5 text-center shadow-[0_12px_35px_rgba(22,68,137,.06)] md:order-2 sm:p-6" aria-label="Card scan code">
            <h2 className="text-xl font-bold text-[#10274d]">Scan at checkout</h2>
            <div className="mx-auto mt-4 max-w-[220px] rounded-xl border border-[#dbe6f6] bg-white p-2">{qr ? <img src={qr} alt="M Souq loyalty card QR code" className="aspect-square w-full" /> : <div className="aspect-square w-full animate-pulse rounded-lg bg-[#eaf2fc]" />}</div>
            <p className="mt-3 text-sm text-[#4b6388]">Ask staff to scan after your purchase.</p>
            <button type="button" onClick={() => void refresh(token)} className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-[#1856b9] hover:bg-[#eaf2fc]"><RefreshCw className="h-4 w-4" /> Update progress</button>
          </section>
        </div>
      </> : <>
        <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,.9fr)] lg:gap-12">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.12em] text-[#1856b9]">M Souq Rewards</p>
            <h1 className="mt-2 max-w-[590px] text-[clamp(2.25rem,6vw,4rem)] font-extrabold leading-[1.05] tracking-[-.065em] text-[#10274d]">A simpler way to earn your reward.</h1>
            <p className="mt-4 max-w-[510px] text-base leading-relaxed text-[#4b6388]">Get one mark per purchase. Your sixth mark unlocks a reward at M Souq.</p>
            <div className="mt-7 hidden lg:block"><LoyaltyCard card={preview} preview /></div>
          </div>
          <section className="rounded-[24px] border border-[#d8e6f8] bg-white p-5 shadow-[0_18px_45px_rgba(22,68,137,.07)] sm:p-7" aria-label="Open your rewards card">
            <div className="grid grid-cols-2 rounded-xl bg-[#edf4ff] p-1" role="group" aria-label="Card options">
              <button type="button" aria-pressed={mode === "join"} onClick={() => { setMode("join"); setError(""); }} className={(mode === "join" ? "bg-white text-[#123b79] shadow-sm" : "text-[#54729e]") + " min-h-11 rounded-lg px-3 text-sm font-semibold"}>Get a card</button>
              <button type="button" aria-pressed={mode === "find"} onClick={() => { setMode("find"); setError(""); }} className={(mode === "find" ? "bg-white text-[#123b79] shadow-sm" : "text-[#54729e]") + " min-h-11 rounded-lg px-3 text-sm font-semibold"}>Open my card</button>
            </div>
            <h2 className="mt-6 text-2xl font-bold tracking-[-.04em] text-[#10274d]">{mode === "join" ? "Get your card" : "Welcome back"}</h2>
            <p className="mt-1 text-sm text-[#4b6388]">{mode === "join" ? "Enter your details once. Your card appears right away." : "Use the phone number and birth date you joined with."}</p>
            <form onSubmit={submit} className="mt-5 space-y-4">
              {mode === "join" && <label className="block text-sm font-semibold text-[#17365f]">Your name<input required autoComplete="name" value={name} onChange={e => setName(e.target.value)} minLength={2} maxLength={60} placeholder="Your full name" className="form-input mt-1.5" /></label>}
              <label className="block text-sm font-semibold text-[#17365f]">Phone number<input required type="tel" autoComplete="tel" inputMode="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Your mobile number" className="form-input mt-1.5" /></label>
              <label className="block text-sm font-semibold text-[#17365f]">Date of birth<input required type="date" autoComplete="bday" max={new Date().toISOString().slice(0, 10)} value={birthDate} onChange={e => setBirthDate(e.target.value)} className="form-input mt-1.5" /></label>
              {mode === "join" && <p className="text-sm text-[#5a7093]">Your birth date helps you find your card later.</p>}
              {error && <p role="alert" className="rounded-xl bg-[#fff1ed] px-4 py-3 text-sm text-[#973c28]">{error}</p>}
              <button disabled={busy} className="min-h-12 w-full rounded-xl bg-[#1856b9] px-5 py-3 text-base font-bold text-white transition-colors hover:bg-[#103f91] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1856b9] disabled:cursor-wait disabled:opacity-60">{busy ? "Opening…" : mode === "join" ? "Get my card" : "Open my card"}</button>
            </form>
          </section>
          <div className="lg:hidden"><LoyaltyCard card={preview} preview /></div>
        </div>
      </>}
    </div>
  </main>;
}
