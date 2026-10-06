"use client";

import { type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ScanLine } from "lucide-react";
import { SiteHeader } from "../../../components/site-header";

export default function StaffLoginPage() {
  const router = useRouter();
  function openPreview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/staff/");
  }

  return <main className="min-h-[100dvh]">
    <SiteHeader staff actionHref="/" actionLabel="Customer view" />
    <div className="mx-auto max-w-[520px] px-4 py-9 sm:px-8 sm:py-16">
      <Link href="/" className="text-sm font-semibold text-[#1856b9] hover:underline">← Back to rewards</Link>
      <div className="mt-9 grid h-14 w-14 place-items-center rounded-2xl bg-[#dcecff] text-[#1856b9]"><ScanLine className="h-7 w-7" /></div>
      <p className="mt-6 text-sm font-bold uppercase tracking-[.14em] text-[#1856b9]">M Souq team</p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-[-.06em] text-[#10274d] sm:text-5xl">Staff sign in.</h1>
      <p className="mt-3 text-base leading-relaxed text-[#4b6388]">See how reward marks are added at checkout.</p>
      <div className="mt-7 rounded-[24px] border border-[#d8e6f8] bg-white p-5 shadow-[0_12px_35px_rgba(22,68,137,.06)] sm:p-7">
        <form onSubmit={openPreview}>
          <label className="block text-sm font-semibold text-[#17365f]">Demo passcode<input className="form-input mt-1.5" required type="password" autoComplete="off" placeholder="Any demo passcode" /></label>
          <button className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1856b9] px-5 text-base font-bold text-white hover:bg-[#103f91]">Preview staff screen <ArrowRight className="h-5 w-5" /></button>
        </form>
        <p className="mt-4 text-xs leading-relaxed text-[#5a7093]">Design preview only. No passcode is checked, sent, or saved. Do not enter a real passcode.</p>
      </div>
    </div>
  </main>;
}
