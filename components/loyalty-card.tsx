import { Check } from "lucide-react";

export type PreviewCard = { name: string; marks: number };

export function LoyaltyCard({ card }: { card: PreviewCard }) {
  return <div className="loyalty-card relative w-full overflow-hidden rounded-[28px] p-6 text-white shadow-[0_24px_50px_rgba(23,73,154,.22)] sm:p-8">
    <div className="relative flex items-start justify-between gap-3">
      <span className="text-xl font-black tracking-[-.06em] sm:text-2xl">M Souq<span className="font-medium text-[#a9d9ff]">.</span></span>
      <span className="rounded-full border border-white/30 px-3 py-1.5 text-xs font-semibold">Rewards card</span>
    </div>
    <div className="relative mt-9 flex items-end justify-between gap-3 sm:mt-11">
      <div className="min-w-0">
        <p className="text-sm font-medium text-[#c9e4ff]">Member</p>
        <p className="mt-1 break-words text-[clamp(1.5rem,4.5vw,2.35rem)] font-extrabold leading-tight tracking-[-.05em]">{card.name}</p>
      </div>
      <span className="shrink-0 text-lg font-bold tabular-nums">{card.marks}<span className="text-[#add8ff]"> / 6</span></span>
    </div>
    <div className="relative mt-7 grid grid-cols-6 gap-2 sm:gap-3" aria-label={card.marks + " of 6 purchases counted"}>
      {Array.from({ length: 6 }, (_, index) => <span key={index} aria-hidden="true" className={(index < card.marks ? "bg-white text-[#1551ad]" : "border border-white/55 bg-white/10 text-white/80") + " grid aspect-square place-items-center rounded-full text-sm font-bold"}>
        {index < card.marks ? <Check className="h-5 w-5 stroke-[3]" /> : index + 1}
      </span>)}
    </div>
    <div className="relative mt-6 flex items-center justify-between gap-3 border-t border-white/25 pt-4 text-sm font-medium text-[#d6ebff]">
      <span>M Souq Rewards</span><span>{card.marks === 6 ? "Reward ready" : (6 - card.marks) + " to go"}</span>
    </div>
  </div>;
}
