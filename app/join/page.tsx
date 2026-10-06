"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { LoyaltyCard } from "../../components/loyalty-card";
import { SiteHeader } from "../../components/site-header";

export default function JoinPage() {
  const router = useRouter();
  const [name, setName] = useState("");

  function previewCard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = name.trim().replace(/\s+/g, " ");
    if (!cleanName) return;
    window.sessionStorage.setItem("m-souq-preview-name", cleanName);
    router.push("/card/");
  }

  return <main className="min-h-[100dvh]">
    <SiteHeader actionHref="/login/" actionLabel="Sign in" />
    <div className="mx-auto grid max-w-[1060px] items-center gap-10 px-4 py-9 sm:px-8 sm:py-14 md:grid-cols-[.95fr_1.05fr] md:gap-16">
      <div>
        <Link href="/" className="text-sm font-semibold text-[#1856b9] hover:underline">← Back to rewards</Link>
        <p className="mt-8 text-sm font-bold uppercase tracking-[.14em] text-[#1856b9]">Join M Souq Rewards</p>
        <h1 className="mt-2 text-[clamp(2.3rem,6vw,4rem)] font-extrabold leading-[1.06] tracking-[-.06em] text-[#10274d]">Your next visit counts.</h1>
        <p className="mt-4 text-base leading-relaxed text-[#4b6388]">One quick step to see your M Souq rewards card.</p>
        <div className="mt-7 rounded-[24px] border border-[#d8e6f8] bg-white p-5 shadow-[0_12px_35px_rgba(22,68,137,.06)] sm:p-7">
          <form onSubmit={previewCard} className="space-y-4">
            <label className="block text-sm font-semibold text-[#17365f]">Your name<input className="form-input mt-1.5" required autoComplete="name" maxLength={60} value={name} onChange={event => setName(event.target.value)} placeholder="Name on your card" /></label>
            <label className="block text-sm font-semibold text-[#17365f]">Mobile number<input className="form-input mt-1.5" required type="tel" inputMode="tel" autoComplete="tel" placeholder="Your mobile number" /></label>
            <button className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1856b9] px-5 text-base font-bold text-white hover:bg-[#103f91]">Preview my card <ArrowRight className="h-5 w-5" /></button>
          </form>
          <p className="mt-4 text-xs leading-relaxed text-[#5a7093]">Design preview only. No account is created. Your number is not sent or saved; your name stays in this tab for the card preview.</p>
        </div>
        <p className="mt-5 text-sm text-[#4b6388]">Already joined? <Link href="/login/" className="font-bold text-[#1856b9] hover:underline">Sign in</Link></p>
      </div>
      <aside className="rounded-[28px] bg-[#e8f3ff] p-5 sm:p-8" aria-label="Rewards card example">
        <LoyaltyCard card={{ name: name.trim() || "Your name", marks: 0 }} />
        <div className="mt-6 space-y-3 text-sm font-semibold text-[#355d97]"><p className="flex items-center gap-2"><Check className="h-5 w-5 text-[#1856b9]" /> Keep your card on your phone</p><p className="flex items-center gap-2"><Check className="h-5 w-5 text-[#1856b9]" /> Show it each time you shop</p><p className="flex items-center gap-2"><Check className="h-5 w-5 text-[#1856b9]" /> Collect six marks for a reward</p></div>
      </aside>
    </div>
  </main>;
}
