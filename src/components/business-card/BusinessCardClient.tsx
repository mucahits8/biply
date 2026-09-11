"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { BusinessCardProfile } from "@/data/business-cards";
import { CopyIcon, NfcIcon, PlusIcon } from "@/components/icons";

type BusinessCardClientProps = {
  profile: BusinessCardProfile;
};

const iconShell =
  "grid h-11 w-11 shrink-0 place-items-center rounded-[0.95rem] border border-zinc-200 bg-white text-zinc-950 shadow-sm";

export function BusinessCardClient({ profile }: BusinessCardClientProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const featuredLinks = profile.links.filter((link) => link.featured);
  const secondaryLinks = profile.links.filter((link) => !link.featured);
  const shareText = `${profile.fullName} dijital kartviziti`;
  const qrUrl = useMemo(
    () =>
      `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(
        profile.profileUrl,
      )}`,
    [profile.profileUrl],
  );

  async function copyValue(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(null), 1500);
    } catch {
      window.prompt("Kopyalamak için seçin", value);
    }
  }

  async function shareCard() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: profile.fullName,
          text: shareText,
          url: profile.profileUrl,
        });
        return;
      } catch {
        return;
      }
    }

    await copyValue("Profil linki", profile.profileUrl);
  }

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-[#08142c]">
      <section className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col px-4 py-5 sm:py-8">
        <header className="flex items-center justify-between pb-5">
          <Link href="/" className="text-3xl font-black tracking-[-0.07em] text-[#174A9C]" aria-label="Biply ana sayfa">
            Biply
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={shareCard}
              className="grid h-11 w-11 place-items-center rounded-full border border-zinc-200 bg-white text-[#174A9C] shadow-sm"
              aria-label="Kartı paylaş"
            >
              <ShareIcon className="h-5 w-5" />
            </button>
            <span className="grid h-11 w-11 place-items-center rounded-full border border-zinc-200 bg-white text-[#174A9C] shadow-sm">
              <NfcIcon className="h-5 w-5" />
            </span>
          </div>
        </header>

        <section className="relative overflow-hidden rounded-[1.35rem] border border-white bg-white p-5 text-center shadow-[0_22px_70px_rgb(8_20_44/0.10)]">
          <div className="pointer-events-none absolute -left-16 -top-20 h-48 w-48 rounded-full bg-[#e9f1ff]" />
          <div className="pointer-events-none absolute right-5 top-6 rotate-[-8deg] text-right font-mono text-[11px] font-bold uppercase leading-4 tracking-[0.22em] text-[#174A9C]/20">
            daha
            <br />
            fazla
            <br />
            baglanti
          </div>

          <div className="relative mx-auto grid h-28 w-28 place-items-center rounded-full border border-zinc-200 bg-[#f7f9fc] p-1 shadow-inner">
            <div className="grid h-full w-full place-items-center rounded-full bg-[#174A9C] text-3xl font-black text-white">
              MS
            </div>
          </div>

          <div className="relative mt-4">
            <h1 className="text-4xl font-black leading-none tracking-[-0.06em] text-[#08142c]">{profile.fullName}</h1>
            <p className="mt-2 text-lg font-bold tracking-[-0.02em] text-[#344367]">{profile.title}</p>
            <p className="mt-1 text-lg font-black text-[#174A9C]">{profile.company}</p>
            <p className="mx-auto mt-3 max-w-[21rem] text-sm font-semibold leading-6 text-[#66708a]">{profile.summary}</p>
          </div>

          <a
            href={`/kartvizit/${profile.slug}/vcard`}
            download={`${profile.slug}.vcf`}
            className="relative mt-6 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-[1.05rem] bg-[#123c80] px-5 text-base font-black text-white shadow-lg shadow-[#123c80]/20"
          >
            <PlusIcon className="h-5 w-5" />
            Rehbere Kaydet
          </a>

          <div className="relative mt-4 grid grid-cols-4 gap-2">
            <QuickAction href={`tel:${profile.phone}`} label="Ara" icon={<PhoneIcon className="h-5 w-5" />} />
            <QuickAction
              href={`https://wa.me/${profile.whatsapp.replace(/\D/g, "")}`}
              label="WhatsApp"
              icon={<WhatsAppIcon className="h-5 w-5" />}
            />
            <QuickAction href={`mailto:${profile.email}`} label="E-posta" icon={<MailIcon className="h-5 w-5" />} />
            <button
              type="button"
              onClick={shareCard}
              className="flex min-h-[5.4rem] flex-col items-center justify-center gap-2 rounded-[1rem] border border-zinc-200 bg-white px-2 text-xs font-black text-[#08142c] shadow-sm"
            >
              <ShareIcon className="h-5 w-5 text-[#174A9C]" />
              Paylaş
            </button>
          </div>
        </section>

        <section className="mt-7">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-[-0.05em] text-[#08142c]">Bağlantılar</h2>
            <a href={profile.website} className="text-sm font-bold text-[#174A9C]">
              Tümünü Gör
            </a>
          </div>
          <div className="grid gap-2.5">
            {featuredLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="grid min-h-[4.7rem] grid-cols-[3.25rem_1fr_1.5rem] items-center gap-2 rounded-[1rem] border border-zinc-200 bg-white px-3 text-left shadow-sm"
              >
                <span className={iconShell}>{iconForLink(link.kind)}</span>
                <span className="min-w-0">
                  <span className="block text-base font-black tracking-[-0.02em] text-[#08142c]">{link.label}</span>
                  <span className="mt-0.5 block truncate text-sm font-semibold text-[#66708a]">{link.description}</span>
                </span>
                <ArrowUpRightIcon className="h-5 w-5 text-[#66708a]" />
              </a>
            ))}
          </div>
          {secondaryLinks.length > 0 ? (
            <div className="mt-3 flex gap-2">
              {secondaryLinks.map((link) => (
                <a key={link.label} href={link.href} className={iconShell} aria-label={link.label}>
                  {iconForLink(link.kind)}
                </a>
              ))}
            </div>
          ) : null}
        </section>

        <section className="mt-7">
          <h2 className="mb-3 text-2xl font-black tracking-[-0.05em] text-[#08142c]">İletişim Bilgileri</h2>
          <div className="overflow-hidden rounded-[1rem] border border-zinc-200 bg-white shadow-sm">
            <ContactRow
              href={`tel:${profile.phone}`}
              value={profile.phoneDisplay}
              icon={<PhoneIcon className="h-5 w-5 text-[#174A9C]" />}
              onCopy={() => copyValue("Telefon", profile.phoneDisplay)}
            />
            <ContactRow
              href={`mailto:${profile.email}`}
              value={profile.email}
              icon={<MailIcon className="h-5 w-5 text-[#174A9C]" />}
              onCopy={() => copyValue("E-posta", profile.email)}
            />
            <ContactRow
              href={profile.website}
              value={profile.website.replace("https://", "")}
              icon={<GlobeIcon className="h-5 w-5 text-[#174A9C]" />}
              onCopy={() => copyValue("Web sitesi", profile.website)}
            />
          </div>
          {copied ? <p className="mt-2 text-center text-xs font-bold text-[#174A9C]">{copied} kopyalandı.</p> : null}
        </section>

        <section className="mt-6 grid grid-cols-[1fr_112px] items-center gap-4 rounded-[1.1rem] border border-[#dce9fb] bg-[#eaf3ff] p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-white text-[#174A9C] shadow-sm">
              <NfcIcon className="h-8 w-8" />
            </span>
            <p className="text-sm font-bold leading-5 text-[#223253]">Kartınızı telefona dokundurun veya bağlantıyı paylaşın.</p>
          </div>
          <div className="rounded-[0.9rem] bg-white p-2 text-center shadow-sm">
            <img src={qrUrl} alt={`${profile.fullName} dijital kartvizit QR kodu`} className="h-24 w-24" loading="lazy" />
            <p className="mt-1 text-[10px] font-black text-[#66708a]">QR tarayın</p>
          </div>
        </section>

        <footer className="mt-auto pt-8 text-center">
          <Link href="/" className="text-xs font-semibold text-[#66708a]">
            Powered by <span className="font-black text-[#174A9C]">Biply</span>
          </Link>
          <p className="mt-3 text-[9px] font-black uppercase tracking-[0.32em] text-[#a8b0c0]">Daha fazla bağlantı, daha büyük fırsatlar</p>
        </footer>
      </section>
    </main>
  );
}

function QuickAction({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      className="flex min-h-[5.4rem] flex-col items-center justify-center gap-2 rounded-[1rem] border border-zinc-200 bg-white px-2 text-xs font-black text-[#08142c] shadow-sm"
    >
      <span className="text-[#174A9C]">{icon}</span>
      {label}
    </a>
  );
}

function ContactRow({
  href,
  value,
  icon,
  onCopy,
}: {
  href: string;
  value: string;
  icon: React.ReactNode;
  onCopy: () => void;
}) {
  return (
    <div className="grid min-h-14 grid-cols-[2.5rem_1fr_2.5rem] items-center border-b border-zinc-100 px-3 last:border-b-0">
      <span>{icon}</span>
      <a href={href} className="min-w-0 truncate text-sm font-bold text-[#223253]">
        {value}
      </a>
      <button type="button" onClick={onCopy} className="grid h-10 w-10 place-items-center rounded-full text-[#66708a]" aria-label={`${value} kopyala`}>
        <CopyIcon className="h-5 w-5" />
      </button>
    </div>
  );
}

function iconForLink(kind: BusinessCardProfile["links"][number]["kind"]) {
  if (kind === "linkedin") return <LinkedInIcon className="h-6 w-6 text-[#0a66c2]" />;
  if (kind === "instagram") return <InstagramIcon className="h-6 w-6 text-[#d62976]" />;
  if (kind === "website") return <GlobeIcon className="h-6 w-6 text-[#174A9C]" />;
  if (kind === "location") return <PinIcon className="h-6 w-6 text-[#174A9C]" />;
  return <GlobeIcon className="h-6 w-6 text-[#174A9C]" />;
}

type IconProps = { className?: string };

function PhoneIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M7.5 4.5 9.9 7c.7.7.7 1.8.1 2.6l-.8 1c1 2 2.6 3.6 4.6 4.6l1-.8c.8-.6 1.9-.6 2.6.1l2.1 2.1c.7.7.8 1.8.1 2.6-.8 1-2 1.6-3.3 1.4-6.7-.8-12-6.1-12.8-12.8-.2-1.3.4-2.5 1.4-3.3.8-.6 1.9-.5 2.6 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MailIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M4 6h16v12H4V6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GlobeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" stroke="currentColor" strokeWidth="2" />
      <path d="M3.5 12h17M12 3c2.2 2.4 3.4 5.4 3.4 9S14.2 18.6 12 21c-2.2-2.4-3.4-5.4-3.4-9S9.8 5.4 12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M5.5 18.5 6.6 15A7.2 7.2 0 1 1 9 17.4l-3.5 1.1Z" stroke="#19c65f" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9.7 8.4c.2-.5.4-.5.7-.5h.5c.2 0 .4.1.5.4l.6 1.4c.1.3.1.5-.1.7l-.4.5c.6 1.1 1.4 1.9 2.5 2.5l.5-.4c.2-.2.5-.2.7-.1l1.4.6c.3.1.4.3.4.6v.4c0 .3-.1.6-.5.8-.5.3-1.1.4-1.7.3-2.7-.5-5.4-3.2-5.9-5.9-.1-.5 0-1.1.3-1.6Z" fill="#19c65f" />
    </svg>
  );
}

function LinkedInIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="4" fill="currentColor" />
      <path d="M8 10v7M8 7.2v.1M11.5 17v-4c0-1.6 1-3 2.8-3 1.7 0 2.7 1.1 2.7 3.1V17" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="2" />
      <path d="M12 15.4a3.4 3.4 0 1 0 0-6.8 3.4 3.4 0 0 0 0 6.8Z" stroke="currentColor" strokeWidth="2" />
      <path d="M17 7.2h.1" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

function PinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M12 21s7-5.2 7-11A7 7 0 1 0 5 10c0 5.8 7 11 7 11Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function ShareIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M8.5 12.5 15.5 16.4M15.5 7.6 8.5 11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6.5 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM17.5 9.8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM17.5 20.2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function ArrowUpRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
