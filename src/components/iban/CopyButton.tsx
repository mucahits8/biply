"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "@/components/icons";

type CopyButtonProps = {
  value: string;
  label: string;
};

export function CopyButton({ value, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copyValue() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={copyValue}
      aria-label={label}
      title={label}
      className={`inline-flex h-10 w-[106px] shrink-0 items-center justify-center gap-1.5 rounded-md border px-2 text-[11px] font-semibold transition focus:outline-none focus:ring-4 focus:ring-emerald-200 sm:text-xs ${
        copied
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-950"
      }`}
    >
      {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
      <span aria-live="polite">{copied ? "Kopyalandı" : "Kopyala"}</span>
    </button>
  );
}
