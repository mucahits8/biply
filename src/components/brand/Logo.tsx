import Image from "next/image";
import { NfcIcon } from "@/components/icons";

type LogoProps = {
  compact?: boolean;
  className?: string;
  image?: boolean;
  light?: boolean;
};

export function Logo({ compact = false, className = "", image = false, light = false }: LogoProps) {
  const imageWidth = compact ? "w-[112px] md:w-[124px]" : "w-[132px]";

  if (image) {
    return (
      <div className={`inline-flex flex-col ${className}`} aria-label="Biply">
        <Image
          src="/images/logo-biply-2026.png"
          alt="Biply"
          width={360}
          height={120}
          loading={compact ? "eager" : "lazy"}
          fetchPriority={compact ? "high" : "auto"}
          className={`h-auto ${imageWidth} object-contain ${light ? "invert" : ""}`}
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex flex-col leading-none ${className}`} aria-label="Biply">
      <div className={`relative inline-flex items-start pr-5 text-[34px] font-black tracking-[-0.08em] ${light ? "text-white" : "text-zinc-950"}`}>
        biply
        <NfcIcon className={`absolute -right-0.5 top-0.5 h-4 w-4 rotate-[-18deg] ${light ? "text-white" : "text-zinc-950"}`} />
      </div>
    </div>
  );
}
