import { NfcIcon } from "@/components/icons";

type LogoProps = {
  compact?: boolean;
  className?: string;
};

export function Logo({ compact = false, className = "" }: LogoProps) {
  return (
    <div className={`inline-flex flex-col leading-none ${className}`} aria-label="biply by MUON Works">
      <div className="relative inline-flex items-start pr-5 text-[34px] font-black tracking-[-0.08em] text-zinc-950">
        biply
        <NfcIcon className="absolute -right-0.5 top-0.5 h-4 w-4 rotate-[-18deg] text-zinc-950" />
      </div>
      {!compact ? (
        <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">
          by MUON Works
        </span>
      ) : null}
    </div>
  );
}
