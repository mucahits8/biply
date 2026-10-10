"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useState } from "react";

const PAYMENT_ACCOUNTS = [
  {
    accountHolder: "Şevval Yılmaz",
    iban: "TR32 0006 2000 3940 0006 6408 32",
  },
  {
    accountHolder: "Ömer Fatih Yılmaz",
    iban: "TR45 0001 5001 5800 7277 7655 72",
  },
  {
    accountHolder: "Eyüp Yılmaz",
    iban: "TR81 0001 2001 3500 0001 1090 40",
  },
];

type CopiedField = `${number}-${"accountHolder" | "iban"}` | null;

export function ParmaxActions() {
  const [copiedField, setCopiedField] = useState<CopiedField>(null);

  async function copy(value: string, field: Exclude<CopiedField, null>) {
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
    window.setTimeout(() => setCopiedField(null), 2000);
  }

  return (
    <>
      <section className="mb-4 overflow-hidden rounded-2xl bg-[#211E1A] shadow-[0_5px_18px_rgba(0,0,0,0.11)] ring-1 ring-[#3A332B]">
        <div className="border-b border-[#3A332B] px-4 py-2.5">
          <p className="text-[10px] font-bold tracking-[0.16em] text-[#C08A36]">
            ÖDEME BİLGİLERİ
          </p>
        </div>

        {PAYMENT_ACCOUNTS.map((account, index) => (
          <div
            key={account.iban}
            className="border-b border-[#3A332B] last:border-b-0"
          >
            <PaymentRow
              label="Hesap Sahibi"
              value={account.accountHolder}
              copied={copiedField === `${index}-accountHolder`}
              onCopy={() => copy(account.accountHolder, `${index}-accountHolder`)}
            />
            <PaymentRow
              label="IBAN"
              value={account.iban}
              copied={copiedField === `${index}-iban`}
              onCopy={() => copy(account.iban, `${index}-iban`)}
              tabular
              last
            />
          </div>
        ))}
      </section>

      <div className="space-y-2.5">
        <ActionLink
          href="https://parmaxemlak.sahibinden.com/"
          icon={
            <Image
              src="/images/parmax/sahibinden.png"
              alt=""
              width={52}
              height={52}
              className="size-full object-contain"
            />
          }
          iconClassName="overflow-hidden bg-[#fff200]"
          title="Sahibinden Mağazam"
          description="Tüm güncel ilanlarımızı inceleyin"
        />

        <ActionLink
          href="https://wa.me/905308810609"
          icon={
            <Image
              src="/images/parmax/whatsapp.webp"
              alt=""
              width={52}
              height={52}
              className="size-full object-contain"
            />
          }
          iconClassName="overflow-hidden bg-[#2A2621]"
          title="WhatsApp'tan Yazın"
          description="+90 530 881 06 09"
        />

        <ActionLink
          href="https://parmaxemlak.com/"
          icon={<GlobeIcon />}
          iconClassName="bg-[#2A2621] text-[#C08A36]"
          title="Web Sitemizi Ziyaret Edin"
          description="Kurumsal web sitemize göz atın"
        />
      </div>
    </>
  );
}

type PaymentRowProps = {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
  tabular?: boolean;
  last?: boolean;
};

function PaymentRow({ label, value, copied, onCopy, tabular, last }: PaymentRowProps) {
  return (
    <div
      className={`flex min-h-[68px] items-center gap-3 px-4 py-3 ${
        last ? "" : "border-b border-[#3A332B]"
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#C08A36]">
          {label}
        </p>
        <p
          className={`mt-1 break-words font-semibold leading-5 text-[#F3EDE3] ${
            tabular
              ? "text-[14px] tracking-[0.025em] [font-variant-numeric:tabular-nums]"
              : "text-[15px]"
          }`}
        >
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={onCopy}
        className={`flex shrink-0 items-center gap-1.5 rounded-lg border border-[#3A332B] bg-[#2A2621] px-3 py-2 text-[11px] font-semibold transition ${
          copied ? "text-[#C08A36]" : "text-[#A9A095] hover:text-[#C08A36]"
        }`}
        aria-label={`${label} kopyala`}
      >
        <CopyIcon />
        <span aria-live="polite">{copied ? "Kopyalandı" : "Kopyala"}</span>
      </button>
    </div>
  );
}

type ActionLinkProps = {
  href: string;
  icon: ReactNode;
  iconClassName: string;
  title: string;
  description: string;
};

function ActionLink({ href, icon, iconClassName, title, description }: ActionLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex min-h-[76px] w-full items-center gap-3 rounded-2xl bg-[#211E1A] px-3.5 py-3 shadow-[0_4px_14px_rgba(0,0,0,0.09)] ring-1 ring-[#3A332B] transition hover:bg-[#2A2621] hover:shadow-[0_6px_18px_rgba(0,0,0,0.12)]"
    >
      <span
        className={`grid size-[52px] shrink-0 place-items-center rounded-[14px] ${iconClassName}`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-sm font-semibold text-[#F3EDE3]">{title}</span>
        <span className="mt-0.5 block truncate text-[11px] text-[#A9A095]">
          {description}
        </span>
      </span>
      <span className="shrink-0 pr-1 text-[#A9A095]" aria-hidden="true">
        <ChevronIcon />
      </span>
    </a>
  );
}

function CopyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="size-3.5"
      aria-hidden="true"
    >
      <rect x="8" y="8" width="11" height="11" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="size-6"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.2 2.5 3.3 5.5 3.3 9S14.2 18.5 12 21c-2.2-2.5-3.3-5.5-3.3-9S9.8 5.5 12 3Z" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      className="size-4"
      aria-hidden="true"
    >
      <path d="m8 5 5 5-5 5" />
    </svg>
  );
}
