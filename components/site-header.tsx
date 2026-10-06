import Link from "next/link";

type SiteHeaderProps = {
  actionHref?: string;
  actionLabel?: string;
  staff?: boolean;
};

export function SiteHeader({ actionHref, actionLabel, staff = false }: SiteHeaderProps) {
  return <header className="border-b border-[#dbe6f6] bg-white/90">
    <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-3 px-4 py-4 sm:px-8">
      <Link href="/" className="inline-flex items-center gap-2.5 text-[#10274d]" aria-label="M Souq Rewards home">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[13px] bg-[#1856b9] text-xl font-black text-white">M</span>
        <span className="flex flex-col leading-none"><span className="text-xl font-extrabold tracking-[-.06em]">M Souq</span><span className="mt-1 text-[11px] font-bold uppercase tracking-[.18em] text-[#54729e]">{staff ? "Staff" : "Rewards"}</span></span>
      </Link>
      {actionHref && actionLabel && <Link href={actionHref} className="rounded-full border border-[#c7dbf5] px-4 py-2 text-sm font-bold text-[#1856b9] hover:bg-[#edf4ff]">{actionLabel}</Link>}
    </div>
  </header>;
}
