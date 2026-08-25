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
    <main className="min-h-screen bg-[linear-gradient(145deg,#fffaf0_0%,#fbf7ef_42%,#f6eddf_100%)] px-5 py-8 text-zinc-950 sm:px-6">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-xl flex-col">
        <p className="text-[13px] font-black uppercase text-blue-700 sm:text-sm" style={{ letterSpacing: "0.36em" }}>
          IBAN PAYLAŞIM KARTI
        </p>

        <div className="flex flex-1 flex-col justify-center py-10">
          <div className="mx-auto mb-12 grid h-32 w-32 place-items-center rounded-full border border-zinc-200 bg-white shadow-xl shadow-zinc-950/10 sm:h-36 sm:w-36">
            <Image src="/images/logo-biply-2026.png" alt="Biply" width={360} height={120} priority className="h-auto w-[92px] object-contain sm:w-[104px]" />
          </div>

          <div className="grid gap-5 sm:gap-6">
            <InfoRow label="Hesap Sahibi" value={profile.recipientName} copyValue={profile.recipientName} copyLabel="Hesap sahibini kopyala" />
            <InfoRow label="IBAN" value={profile.iban} copyValue={compactIban} copyLabel="IBAN bilgisini kopyala" mono />
            {profile.bankName ? <InfoRow label="Banka" value={profile.bankName} copyValue={profile.bankName} copyLabel="Banka adını kopyala" /> : null}
            {profile.description ? (
              <InfoRow label="Açıklama" value={profile.description} copyValue={profile.description} copyLabel="Açıklamayı kopyala" />
            ) : null}
          </div>
        </div>

        <footer className="pb-3 text-center text-sm font-bold text-zinc-400">
          <span className="inline-flex items-center justify-center gap-3">
            <Image src="/images/logo-biply-2026.png" alt="Biply" width={360} height={120} className="h-auto w-[82px] object-contain opacity-45 grayscale" />
            <span>biply.com.tr</span>
          </span>
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
    <div className="flex min-h-28 items-center gap-4 rounded-[1.35rem] border border-zinc-200 bg-white px-5 py-5 shadow-sm shadow-zinc-950/5 sm:min-h-32 sm:px-7">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-black uppercase text-blue-700/75 sm:text-sm" style={{ letterSpacing: "0.28em" }}>
          {label}
        </p>
        <p className={`mt-3 break-words text-2xl font-medium leading-8 text-zinc-950 sm:text-3xl ${mono ? "font-mono text-xl sm:text-2xl" : ""}`}>
          {value}
        </p>
      </div>
      <CopyButton value={copyValue} label={copyLabel} />
    </div>
  );
}
