import { ArrowIcon } from "@/components/icons";

type MobileSwipeHintProps = {
  label: string;
  detail?: string;
  className?: string;
};

export function MobileSwipeHint({ label, detail = "Kartların tamamını görmek için parmağınızı yana doğru sürükleyin.", className = "" }: MobileSwipeHintProps) {
  return (
    <div className={`mb-2 rounded-[1.15rem] border border-amber-300 bg-amber-200/85 p-3 text-zinc-950 shadow-sm lg:hidden ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="min-w-0 text-[11px] font-black uppercase tracking-[0.12em]">{label}</span>
        <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-black">
          Sağa kaydır
          <span className="swipe-nudge inline-grid h-6 w-6 place-items-center rounded-full bg-zinc-950 text-white">
            <ArrowIcon className="h-3.5 w-3.5" />
          </span>
        </span>
      </div>
      <p className="mt-1 text-xs font-bold leading-5 text-zinc-700">{detail}</p>
    </div>
  );
}
