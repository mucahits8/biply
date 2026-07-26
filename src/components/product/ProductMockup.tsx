import { NfcIcon } from "@/components/icons";
import type { CatalogItem } from "@/data/catalog";

type ProductMockupProps = {
  shape: CatalogItem["shape"];
  tone?: "light" | "dark";
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

  return (
    <div className={`relative ${sizeClass[size]} ${className}`} aria-hidden="true">
      {shape === "stand" ? <div className="absolute bottom-0 left-2 right-2 h-5 bg-zinc-200 shadow-[0_14px_28px_rgba(24,24,27,0.16)]" /> : null}
      <div
        className={`absolute inset-x-3 bottom-4 top-0 overflow-hidden border shadow-2xl backdrop-blur-xl ${
          isDark
            ? "border-zinc-700 bg-zinc-950 text-white"
            : "border-zinc-200 bg-white text-zinc-950"
        }`}
      >
        <div className="absolute left-1/2 top-3 h-1.5 w-12 -translate-x-1/2 rounded-full bg-current opacity-10" />
        <div className="flex h-full flex-col items-center justify-center gap-3 p-4 text-center">
          <div className="flex items-center gap-1.5 text-[10px] font-black tracking-tight">
            <span className="text-lg tracking-[-0.08em]">biply</span>
            <span className="text-[9px] opacity-60">NFC</span>
          </div>
          <div className="text-[10px] font-semibold opacity-70">Google yorum ekranınız anında açılır</div>
          <div className="grid place-items-center rounded-full border border-current/15 bg-current/5 p-4">
            <NfcIcon className="h-10 w-10" />
          </div>
          <div className="text-[9px] font-medium opacity-75">Telefonunu yaklaştır</div>
          <div className="grid gap-1 text-[9px] font-medium opacity-75">
            <span>Telefonunu dokundur</span>
            <span>QR yok</span>
          </div>
        </div>
      </div>
    </div>
  );
}
