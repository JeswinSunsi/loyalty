"use client";

import { useEffect, useState, useSyncExternalStore, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import QRCode from "qrcode";
import { Gift, ScanLine } from "lucide-react";
import { LoyaltyCard, type PreviewCard } from "../../components/loyalty-card";
import { SiteHeader } from "../../components/site-header";

const subscribe = () => () => {};
const getSavedName = () => window.sessionStorage.getItem("m-souq-preview-name");
const getServerName = () => null;

export default function CardPage() {
  const savedName = useSyncExternalStore(subscribe, getSavedName, getServerName);
  const [customCard, setCustomCard] = useState<PreviewCard | null>(null);
  const card = customCard ?? (savedName ? { name: savedName, marks: 0 } : { name: "M Souq member", marks: 3 });
  const [name, setName] = useState("");
  const [qr, setQr] = useState("");

  useEffect(() => {
    void QRCode.toDataURL(window.location.origin + "/staff/?demo=1", {
      width: 420, margin: 2, errorCorrectionLevel: "M",
      color: { dark: "#10274d", light: "#ffffff" },
    }).then(setQr);
  }, []);

  function previewCard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextName = name.trim().replace(/\s+/g, " ");
    if (!nextName) return;
    window.sessionStorage.setItem("m-souq-preview-name", nextName);
    setCustomCard({ name: nextName, marks: 0 });
  }

  return <main className="min-h-[100dvh]">
    <SiteHeader actionHref="/" actionLabel="Home" />
    <div className="mx-auto max-w-[1080px] px-4 pb-12 pt-7 sm:px-8 sm:pt-10">
      <div className="mb-7">
        <p className="text-sm font-bold uppercase tracking-[.12em] text-[#1856b9]">Your M Souq card</p>
        <h1 className="mt-2 text-[clamp(2.1rem,6vw,3.5rem)] font-extrabold leading-[1.06] tracking-[-.06em] text-[#10274d]">Your rewards, all in one card.</h1>
        <p className="mt-3 max-w-[600px] text-base leading-relaxed text-[#4b6388]">Show your code after each purchase. Six marks unlock your reward at M Souq.</p>
      </div>

      <div className="grid items-start gap-5 md:grid-cols-[1.2fr_.8fr] md:gap-6">
        <section aria-label="Loyalty card preview">
          <LoyaltyCard card={card} />
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#c7dcf7] bg-[#e8f3ff] p-4 text-[#123b79]">
            <Gift className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm leading-relaxed"><strong>Simple to use.</strong> Staff scan the card at checkout and add one mark.</p>
          </div>
        </section>

        <div className="space-y-5">
          <section className="rounded-[24px] border border-[#d8e6f8] bg-white p-5 text-center shadow-[0_12px_35px_rgba(22,68,137,.06)] sm:p-6" aria-label="Checkout code preview">
            <h2 className="flex items-center justify-center gap-2 text-xl font-bold text-[#10274d]"><ScanLine className="h-5 w-5 text-[#1856b9]" /> Scan at checkout</h2>
            <div className="mx-auto mt-4 max-w-[220px] rounded-xl border border-[#dbe6f6] bg-white p-2">
              {qr ? <Image src={qr} alt="Demo QR code for M Souq staff preview" width={220} height={220} unoptimized className="aspect-square w-full" /> : <div className="aspect-square w-full animate-pulse rounded-lg bg-[#eaf2fc]" />}
            </div>
            <p className="mt-3 text-sm text-[#4b6388]">Demo code. Open it to see the staff view.</p>
          </section>

          <section className="rounded-[24px] border border-[#d8e6f8] bg-white p-5 shadow-[0_12px_35px_rgba(22,68,137,.06)] sm:p-6">
            <h2 className="text-xl font-bold text-[#10274d]">Preview your card</h2>
            <p className="mt-1 text-sm text-[#4b6388]">Enter a name to see how your M Souq card looks.</p>
            <form onSubmit={previewCard} className="mt-4">
              <label className="block text-sm font-semibold text-[#17365f]">Your name<input required autoComplete="name" value={name} onChange={event => setName(event.target.value)} maxLength={60} placeholder="Enter your name" className="form-input mt-1.5" /></label>
              <button className="mt-4 min-h-12 w-full rounded-xl bg-[#1856b9] px-5 text-base font-bold text-white hover:bg-[#103f91]">Preview card</button>
            </form>
            <p className="mt-3 text-xs text-[#5a7093]">Design preview only. Your name stays in this tab. No marks are saved.</p>
          </section>
        </div>
      </div>
      <p className="mt-8 text-center text-sm text-[#5a7093]">Need staff view? <Link href="/staff/login/" className="font-bold text-[#1856b9] hover:underline">Open staff sign in</Link></p>
    </div>
  </main>;
}
