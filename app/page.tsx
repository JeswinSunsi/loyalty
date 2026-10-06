import { ArrowRight, Gift, QrCode, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { LoyaltyCard } from "../components/loyalty-card";
import { SiteHeader } from "../components/site-header";

const steps = [
  { icon: ShoppingBag, title: "Shop at M Souq", text: "Pick up what you love, as usual." },
  { icon: QrCode, title: "Show your card", text: "Staff scan your code at checkout." },
  { icon: Gift, title: "Enjoy your reward", text: "Collect six marks to unlock a reward." },
];

export default function Home() {
  return <main className="min-h-[100dvh] overflow-x-clip">
    <SiteHeader actionHref="/login/" actionLabel="Sign in" />
    <div className="mx-auto max-w-[1100px] px-4 pb-14 sm:px-8">
      <section className="grid items-center gap-10 py-12 md:grid-cols-[1fr_1.03fr] md:gap-14 md:py-20">
        <div>
          <span className="inline-flex rounded-full border border-[#c7dbf5] bg-[#e9f3ff] px-3 py-1.5 text-xs font-bold uppercase tracking-[.16em] text-[#1856b9]">M Souq Rewards</span>
          <h1 className="mt-5 max-w-[600px] text-[clamp(2.6rem,7vw,5.2rem)] font-extrabold leading-[1.02] tracking-[-.07em] text-[#10274d]">A little more from every visit.</h1>
          <p className="mt-5 max-w-[490px] text-lg leading-relaxed text-[#4b6388]">Your M Souq rewards live on one easy card. Show it at checkout, collect marks, and enjoy a reward after six visits.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/join/" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#1856b9] px-6 py-3 text-base font-bold text-white shadow-[0_10px_22px_rgba(24,86,185,.18)] hover:bg-[#103f91]">Join rewards <ArrowRight className="h-5 w-5" /></Link>
            <Link href="/login/" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#b9d2f1] bg-white px-6 py-3 text-base font-bold text-[#1856b9] hover:bg-[#edf4ff]">I already have a card</Link>
          </div>
          <p className="mt-4 text-sm text-[#5a7093]">Free to join. No app download needed.</p>
        </div>
        <div className="relative md:pl-3">
          <div className="absolute -inset-5 rounded-[40px] bg-[radial-gradient(circle_at_60%_35%,#d4e9ff,transparent_65%)]" aria-hidden="true" />
          <div className="relative rotate-[-2deg] transition-transform hover:rotate-0"><LoyaltyCard card={{ name: "M Souq member", marks: 3 }} /></div>
          <div className="relative mx-auto mt-5 w-fit rounded-full border border-[#d8e6f8] bg-white px-4 py-2 text-sm font-semibold text-[#355d97] shadow-sm">One card. Six visits. A reward.</div>
        </div>
      </section>

      <section aria-labelledby="how-it-works" className="rounded-[28px] border border-[#d8e6f8] bg-white p-5 shadow-[0_12px_35px_rgba(22,68,137,.05)] sm:p-8">
        <div className="mb-6"><p className="text-sm font-bold uppercase tracking-[.14em] text-[#1856b9]">How it works</p><h2 id="how-it-works" className="mt-1 text-2xl font-extrabold tracking-[-.04em] text-[#10274d] sm:text-3xl">Rewards without the extra steps</h2></div>
        <div className="grid gap-3 md:grid-cols-3">
          {steps.map((step, index) => <div key={step.title} className="rounded-2xl bg-[#f3f8ff] p-5">
            <div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#dcecff] text-[#1856b9]"><step.icon className="h-5 w-5" /></span><span className="text-sm font-bold text-[#8da7ca]">0{index + 1}</span></div>
            <h3 className="mt-4 text-lg font-bold text-[#10274d]">{step.title}</h3><p className="mt-1 text-sm leading-relaxed text-[#4b6388]">{step.text}</p>
          </div>)}
        </div>
      </section>
      <footer className="flex flex-col justify-between gap-3 py-7 text-sm text-[#5a7093] sm:flex-row"><span>M Souq Rewards · Design preview</span><Link href="/staff/login/" className="font-semibold text-[#1856b9] hover:underline">Staff sign in</Link></footer>
    </div>
  </main>;
}
