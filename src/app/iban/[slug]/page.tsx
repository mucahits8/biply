import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/iban/CopyButton";
import { getCompactIban, getIbanProfileBySlug, ibanProfiles } from "@/data/iban-profiles";

type IbanPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return ibanProfiles.map((profile) => ({ slug: profile.slug }));
}

export async function generateMetadata({ params }: IbanPageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = getIbanProfileBySlug(slug);

  if (!profile) {
    return {
      title: {
        absolute: "IBAN bilgisi bulunamadı",
      },
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: {
      absolute: `${profile.businessName} IBAN Bilgisi | Biply`,
    },
    description: `${profile.businessName} için IBAN ve hesap sahibi bilgisi.`,
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `https://www.biply.com.tr/iban/${profile.slug}`,
    },
    openGraph: {
      title: `${profile.businessName} IBAN Bilgisi`,
      description: "NFC ile açılan hızlı ödeme bilgisi.",
      url: `https://www.biply.com.tr/iban/${profile.slug}`,
      siteName: "Biply",
      type: "website",
      locale: "tr_TR",
    },
  };
}

export default async function IbanPage({ params }: IbanPageProps) {
  const { slug } = await params;
  const profile = getIbanProfileBySlug(slug);

  if (!profile) notFound();

  const compactIban = getCompactIban(profile.iban);

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#f7f5f0] px-4 py-6 text-zinc-950 sm:px-6 sm:py-10">
      <div className="iban-flow-field" aria-hidden="true">
        <span className="iban-flow-line iban-flow-line-one" />
        <span className="iban-flow-line iban-flow-line-two" />
        <span className="iban-flow-line iban-flow-line-three" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-lg flex-col sm:min-h-[calc(100vh-5rem)]">
        <header className="flex items-center justify-between border-b border-zinc-200 pb-5">
          <div>
            <p className="text-[11px] font-bold uppercase text-blue-700" style={{ letterSpacing: "0.18em" }}>
              Güvenli ödeme bilgileri
            </p>
            <h1 className="mt-1.5 text-xl font-semibold leading-tight text-zinc-950 sm:text-2xl">{profile.businessName}</h1>
          </div>
          <Image src="/images/logo-biply-2026.png" alt="Biply" width={360} height={120} priority className="h-auto w-[74px] object-contain sm:w-[82px]" />
        </header>

        <div className="pt-7 sm:pt-10">
          <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm shadow-zinc-950/5">
            <InfoRow label="Hesap Sahibi" value={profile.recipientName} copyValue={profile.recipientName} copyLabel="Hesap sahibini kopyala" />
            <InfoRow label="IBAN" value={profile.iban} copyValue={compactIban} copyLabel="IBAN bilgisini kopyala" mono />
            {profile.bankName ? <InfoRow label="Banka" value={profile.bankName} copyValue={profile.bankName} copyLabel="Banka adını kopyala" /> : null}
            {profile.description ? (
              <InfoRow label="Açıklama" value={profile.description} copyValue={profile.description} copyLabel="Açıklamayı kopyala" />
            ) : null}
          </div>
        </div>

        <footer className="mt-auto pt-8 pb-1 text-center text-xs font-medium text-zinc-400">
          biply.com.tr
        </footer>
      </section>
    </main>
  );
}

function InfoRow({
  label,
  value,
  copyValue,
  copyLabel,
  mono = false,
}: {
  label: string;
  value: string;
  copyValue: string;
  copyLabel: string;
  mono?: boolean;
}) {
  return (
    <div className="flex min-h-[88px] items-center gap-3 border-b border-zinc-100 px-4 py-4 last:border-b-0 sm:min-h-24 sm:px-5">
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase text-blue-700/70 sm:text-[11px]" style={{ letterSpacing: "0.16em" }}>
          {label}
        </p>
        <p className={`mt-1.5 break-words text-lg font-medium leading-6 text-zinc-950 sm:text-xl ${mono ? "font-mono text-base leading-6 sm:text-lg" : ""}`}>
          {value}
        </p>
      </div>
      <CopyButton value={copyValue} label={copyLabel} />
    </div>
  );
}
