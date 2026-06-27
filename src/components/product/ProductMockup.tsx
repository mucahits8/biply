import { NfcIcon, QrIcon } from "@/components/icons";
import type { CatalogItem } from "@/data/catalog";

type ProductMockupProps = {
  shape: CatalogItem["shape"];
  tone?: "light" | "dark" | "glass" | "social";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClass = {
  sm: "h-24 w-24",
  md: "h-40 w-40",
  lg: "h-64 w-64",
};

export function ProductMockup({ shape, tone = "light", size = "md", className = "" }: ProductMockupProps) {
  const isDark = tone === "dark";
  const isSocial = tone === "social" || shape === "social";
  const isGlass = tone === "glass" || shape === "glass";

  return (
    <div className={`relative ${sizeClass[size]} ${className}`} aria-hidden="true">
      {shape === "desk" ? <div className="absolute bottom-0 left-2 right-2 h-5 rounded-full bg-gradient-to-r from-amber-200 via-stone-200 to-emerald-200 shadow-[0_14px_28px_rgba(24,24,27,0.16)]" /> : null}
      <div
        className={`absolute inset-x-3 bottom-4 top-0 overflow-hidden rounded-[1.65rem] border shadow-2xl backdrop-blur-xl ${
          isDark
            ? "border-zinc-700 bg-zinc-950 text-white"
            : isSocial
              ? "border-rose-200 bg-gradient-to-br from-rose-500 via-pink-500 to-orange-400 text-white"
              : isGlass
                ? "border-white/80 bg-white/35 text-zinc-950 shadow-zinc-300/40"
                : "border-zinc-200 bg-white text-zinc-950"
        }`}
      >
        <div className="absolute left-1/2 top-3 h-1.5 w-12 -translate-x-1/2 rounded-full bg-current opacity-10" />
        <div className="flex h-full flex-col items-center justify-center gap-3 p-4 text-center">
          <div className="flex items-center gap-1.5 text-[10px] font-black tracking-tight">
            <span className="text-lg tracking-[-0.08em]">biply</span>
            <span className="text-[9px] opacity-60">NFC</span>
          </div>
          <div className="text-[10px] font-semibold opacity-70">Google Yorumlarınızı Bekliyoruz</div>
          <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div className="grid place-items-center rounded-full border border-current/15 bg-current/5 p-2">
              <NfcIcon className="h-8 w-8" />
            </div>
            <div className="h-12 w-px bg-current/15" />
            <div className="grid place-items-center rounded-xl border border-current/15 bg-current/5 p-2">
              <QrIcon className="h-8 w-8" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-[9px] font-medium opacity-75">
            <span>Telefonunu dokundur</span>
            <span>veya QR kodu tara</span>
          </div>
        </div>
      </div>
    </div>
  );
}
