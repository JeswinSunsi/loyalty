"use client";

import { type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { SiteHeader } from "../../components/site-header";

export default function LoginPage() {
  const router = useRouter();
  function previewCard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/card/");
  }

  return <main className="min-h-[100dvh]">
    <SiteHeader actionHref="/join/" actionLabel="Join rewards" />
    <div className="mx-auto max-w-[520px] px-4 py-9 sm:px-8 sm:py-16">
      <Link href="/" className="text-sm font-semibold text-[#1856b9] hover:underline">← Back to rewards</Link>
      <div className="mt-9 grid h-14 w-14 place-items-center rounded-2xl bg-[#dcecff] text-[#1856b9]"><LockKeyhole className="h-7 w-7" /></div>
      <p className="mt-6 text-sm font-bold uppercase tracking-[.14em] text-[#1856b9]">M Souq Rewards</p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-[-.06em] text-[#10274d] sm:text-5xl">Welcome back.</h1>
      <p className="mt-3 text-base leading-relaxed text-[#4b6388]">Enter your mobile number to see the member card screen.</p>
      <div className="mt-7 rounded-[24px] border border-[#d8e6f8] bg-white p-5 shadow-[0_12px_35px_rgba(22,68,137,.06)] sm:p-7">
        <form onSubmit={previewCard}>
          <label className="block text-sm font-semibold text-[#17365f]">Mobile number<input className="form-input mt-1.5" required type="tel" inputMode="tel" autoComplete="tel" placeholder="Your mobile number" /></label>
          <button className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1856b9] px-5 text-base font-bold text-white hover:bg-[#103f91]">Preview member card <ArrowRight className="h-5 w-5" /></button>
        </form>
        <p className="mt-4 text-xs leading-relaxed text-[#5a7093]">Design preview only. No login code is sent. Your number is not sent or saved.</p>
      </div>
      <p className="mt-6 text-sm text-[#4b6388]">New to M Souq Rewards? <Link href="/join/" className="font-bold text-[#1856b9] hover:underline">Join now</Link></p>
    </div>
  </main>;
}
