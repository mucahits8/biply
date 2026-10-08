import type { Metadata } from "next";
import Image from "next/image";
import { ParmaxActions } from "@/components/parmax/ParmaxActions";

export const metadata: Metadata = {
  title: {
    absolute: "Parmax Emlak | Biply",
  },
  description:
    "Parmax Emlak ödeme bilgileri, Sahibinden mağazası ve iletişim bağlantıları.",
  alternates: {
    canonical: "https://www.biply.com.tr/emlak/parmax",
  },
};

export default function ParmaxPage() {
  return (
    <main className="min-h-screen bg-[#171512] px-4 py-6 text-[#F3EDE3] sm:py-8">
      <section className="mx-auto w-full max-w-[440px]">
        <header className="text-center">
          <div className="mx-auto grid size-[104px] place-items-center overflow-hidden rounded-[24px] bg-[#211E1A] p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.16)] ring-1 ring-[#3A332B]">
            <Image
              src="/images/parmax/logo.png"
              alt="Parmax Emlak logosu"
              width={132}
              height={119}
              preload
              className="size-full object-contain"
            />
          </div>
          <h1 className="mt-3.5 text-[26px] font-bold tracking-[-0.035em] text-[#F3EDE3] sm:text-[30px]">
            Parmax Emlak
          </h1>
        </header>

        <div className="mt-5">
          <ParmaxActions />
        </div>

        <footer className="mt-6 flex items-center justify-center gap-2 text-[9px] font-medium tracking-[0.08em] text-[#A9A095]">
          <span>Powered by</span>
          <Image
            src="/images/logo-biply-2026.png"
            alt="Biply"
            width={66}
            height={29}
            className="h-auto w-[58px] object-contain opacity-75 invert"
          />
        </footer>
      </section>
    </main>
  );
}
