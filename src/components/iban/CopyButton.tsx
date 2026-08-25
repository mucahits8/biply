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
      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-950 shadow-sm transition hover:border-zinc-400 hover:bg-zinc-50 focus:outline-none focus:ring-4 focus:ring-emerald-200"
    >
      {copied ? <CheckIcon className="h-5 w-5 text-emerald-700" /> : <CopyIcon className="h-5 w-5" />}
    </button>
  );
}
