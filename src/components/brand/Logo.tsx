import Image from "next/image";
import { NfcIcon } from "@/components/icons";

type LogoProps = {
  compact?: boolean;
  className?: string;
  image?: boolean;
  light?: boolean;
};

export function Logo({ compact = false, className = "", image = false, light = false }: LogoProps) {
  if (image) {
    return (
      <div className={`inline-flex flex-col ${className}`} aria-label="biply by MUON Works">
        <Image
          src="/images/logo-biply-source.png"
          alt="biply by MUON Works"
          width={360}
          height={120}
          priority={compact}
          className={`h-auto w-[118px] object-contain ${light ? "invert" : "mix-blend-multiply"}`}
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex flex-col leading-none ${className}`} aria-label="biply by MUON Works">
      <div className={`relative inline-flex items-start pr-5 text-[34px] font-black tracking-[-0.08em] ${light ? "text-white" : "text-zinc-950"}`}>
        biply
        <NfcIcon className={`absolute -right-0.5 top-0.5 h-4 w-4 rotate-[-18deg] ${light ? "text-white" : "text-zinc-950"}`} />
      </div>
      {!compact ? (
        <span className={`mt-1 text-[10px] font-medium uppercase tracking-[0.28em] ${light ? "text-white/60" : "text-zinc-500"}`}>
          by MUON Works
        </span>
      ) : null}
    </div>
  );
}
