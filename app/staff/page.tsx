"use client";

import { useState, useSyncExternalStore } from "react";
import { Camera, Check, ScanLine } from "lucide-react";
import { LoyaltyCard, type PreviewCard } from "../../components/loyalty-card";
import { SiteHeader } from "../../components/site-header";

const sampleCard: PreviewCard = { name: "M Souq member", marks: 3 };
const subscribe = () => () => {};
const getDemoQuery = () => new URLSearchParams(window.location.search).get("demo") === "1";
const getServerDemoQuery = () => false;

export default function StaffPage() {
  const demoQuery = useSyncExternalStore(subscribe, getDemoQuery, getServerDemoQuery);
  const [cardOverride, setCardOverride] = useState<PreviewCard | null>(null);
  const [cleared, setCleared] = useState(false);
  const card = cleared ? null : cardOverride ?? (demoQuery ? sampleCard : null);
  const [notice, setNotice] = useState("");

  function previewScan() {
    setCardOverride(sampleCard);
    setCleared(false);
    setNotice("Demo card found.");
  }

  function addMark() {
    if (!card || card.marks >= 6) return;
    const marks = card.marks + 1;
    setCardOverride({ ...card, marks });
    setNotice(marks === 6 ? "Reward ready!" : "Mark added.");
  }

  function nextCustomer() {
    setCardOverride(null);
    setCleared(true);
    setNotice("");
    window.history.replaceState(null, "", "/staff/");
  }

  return <main className="min-h-[100dvh]">
    <SiteHeader staff actionHref="/" actionLabel="Customer view" />

    <div className="mx-auto max-w-[980px] px-4 pb-12 pt-7 sm:px-8 sm:pt-10">
      <h1 className="text-3xl font-extrabold tracking-[-.05em] text-[#10274d] sm:text-4xl">Add a reward mark</h1>
      <p className="mt-2 text-base text-[#4b6388]">This preview shows the checkout flow for M Souq staff.</p>
      <div className="mt-6 grid items-start gap-5 md:grid-cols-[1fr_.9fr] md:gap-6">
        <section className="rounded-[24px] border border-[#d8e6f8] bg-white p-5 shadow-[0_12px_35px_rgba(22,68,137,.06)] sm:p-7">
          <h2 className="flex items-center gap-2 text-xl font-bold text-[#10274d]"><ScanLine className="h-5 w-5 text-[#1856b9]" /> Scan card</h2>
          <div className="mt-5 flex flex-col items-center rounded-2xl border border-dashed border-[#b9d2f1] bg-[#f3f8ff] px-5 py-9 text-center">
            <Camera className="h-9 w-9 text-[#1856b9]" />
            <p className="mt-3 text-sm text-[#4b6388]">In the finished system, staff scan the customer&apos;s QR code after a purchase.</p>
            <button type="button" onClick={previewScan} className="mt-5 min-h-12 w-full max-w-[260px] rounded-xl bg-[#1856b9] px-5 text-base font-bold text-white hover:bg-[#103f91]">Preview a scan</button>
          </div>
        </section>

        <section className="rounded-[24px] border border-[#d8e6f8] bg-white p-5 shadow-[0_12px_35px_rgba(22,68,137,.06)] sm:p-7">
          <h2 className="text-xl font-bold text-[#10274d]">Customer card</h2>
          {card ? <div className="mt-5">
            <LoyaltyCard card={card} />
            <p className="mt-4 text-sm text-[#4b6388]">{card.marks === 6 ? "Reward ready. Show the customer their completed card." : "Confirm the purchase, then add one mark."}</p>
            {card.marks < 6 && <button type="button" onClick={addMark} className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1856b9] px-5 text-base font-bold text-white hover:bg-[#103f91]"><Check className="h-5 w-5" /> Add one mark</button>}
            <button type="button" onClick={nextCustomer} className="mt-3 min-h-11 w-full rounded-xl border border-[#b9d2f1] px-4 text-sm font-semibold text-[#1856b9] hover:bg-[#edf4ff]">Next customer</button>
          </div> : <div className="mt-5 rounded-2xl bg-[#f3f8ff] px-5 py-10 text-center text-sm text-[#4b6388]">Customer card appears here after a scan.</div>}
          {notice && <p role="status" className="mt-4 rounded-xl bg-[#e2f1ff] px-4 py-3 text-sm font-semibold text-[#123b79]">{notice}</p>}
          <p className="mt-4 text-xs text-[#5a7093]">Design preview only. No marks are saved.</p>
        </section>
      </div>
    </div>
  </main>;
}
