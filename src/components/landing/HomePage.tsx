import Link from "next/link";
import { CommerceExperience } from "@/components/commerce/CommerceExperience";
import { MobileStickyCta } from "@/components/commerce/MobileStickyCta";
import { Logo } from "@/components/brand/Logo";
import { ArrowIcon, CheckIcon, NfcIcon, QrIcon, ShieldIcon } from "@/components/icons";
import { ProductFamily } from "@/components/landing/ProductFamily";
import { SectionHeader } from "@/components/landing/SectionHeader";
import { ProductMockup } from "@/components/product/ProductMockup";
import { faqs, sectors } from "@/data/catalog";

export function HomePage() {
  return (
    <main className="min-h-screen bg-[#f7f3ed] text-zinc-950">
      <Header />
      <Hero />
      <section id="nasil-calisir" className="section-pad">
        <SectionHeader
          eyebrow="Nasıl çalışır"
          title="Müşteriniz memnun. Yorumu bir dokunuş uzağında."
          description="Biply, müşterinin zaten yaşadığı iyi deneyimi görünür hale getiren sade bir temas noktasıdır. NFC önce gelir; QR yalnızca yedek kapıdır."
          centered
        />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["1", "Telefonunu dokundur", "Müşteri Biply NFC alanına telefonu yaklaştırır."],
            ["2", "Deneyimini paylaş", "Google yorum sayfası veya seçilen aksiyon açılır."],
            ["3", "Takip edilebilir akış", "Sipariş, şube ve ürün kombinasyonu tek sistemde planlanır."],
          ].map(([number, title, copy]) => (
            <article key={number} className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-zinc-950 text-sm font-black text-white">{number}</span>
              <h3 className="mt-5 text-2xl font-black tracking-[-0.05em]">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-600">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="google-review" className="section-pad pt-0">
        <div className="grid gap-6 rounded-[2.5rem] border border-white/80 bg-white/70 p-5 shadow-sm backdrop-blur md:grid-cols-[1fr_0.85fr] md:p-8">
          <div className="grid place-items-center rounded-[2rem] bg-gradient-to-br from-white via-[#f4f1eb] to-zinc-100 p-6">
            <div className="relative w-full max-w-sm rounded-[2rem] border border-white/80 bg-white/55 p-6 text-center shadow-2xl shadow-zinc-950/10 backdrop-blur-xl">
              <div className="text-4xl font-black text-blue-600">G</div>
              <div className="mt-1 text-xl text-amber-400" aria-label="Beş yıldız görseli">★★★★★</div>
              <h2 className="mt-4 text-2xl font-black tracking-[-0.05em]">Google Yorumlarınızı Bekliyoruz</h2>
              <p className="mt-2 text-zinc-600">Deneyiminizi paylaşın</p>
              <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                <div className="grid place-items-center rounded-full border border-zinc-200 bg-white p-5">
                  <NfcIcon className="h-14 w-14" />
                </div>
                <div className="h-20 w-px bg-zinc-200" />
                <div className="grid place-items-center rounded-2xl border border-zinc-200 bg-white p-5">
                  <QrIcon className="h-14 w-14" />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm font-bold text-zinc-700">
                <span>Telefonunu dokundur</span>
                <span>veya QR kodu tara</span>
              </div>
              <Logo compact className="mt-6 items-center" />
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <SectionHeader
              eyebrow="Google Review odak alanı"
              title="Google yorumlarını tek dokunuşla kolaylaştırın."
              description="Google G küçük ve açıklayıcı kalır; asıl deneyim Biply’nin sade, premium temas diliyle taşınır."
            />
            <div className="grid gap-3">
              {[
                "NFC alanı QR’dan daha baskın görünür.",
                "Nötr ve güvenli metinler kullanılır.",
                "Cam, masa ve kart temasları birlikte çalışır.",
              ].map((item) => (
                <p key={item} className="flex items-center gap-3 rounded-2xl bg-white p-4 text-sm font-bold text-zinc-700">
                  <CheckIcon className="h-5 w-5" /> {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="urunler" className="section-pad pt-0">
        <SectionHeader
          eyebrow="Ürün ailesi"
          title="Her temas noktası için bir Biply."
          description="Desk, Glass, Card ve Pad; işletmenin farklı anlarında aynı aksiyonu sadeleştirir."
        />
        <ProductFamily />
      </section>

      <section className="section-pad pt-0">
        <CommerceExperience />
      </section>

      <section id="instagram" className="section-pad pt-0">
        <div className="grid gap-6 rounded-[2.5rem] bg-zinc-950 p-6 text-white md:grid-cols-[0.8fr_1.2fr] md:p-10">
          <div className="grid place-items-center rounded-[2rem] bg-white/8 p-6">
            <ProductMockup shape="social" tone="social" size="lg" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-400">Instagram / sosyal medya ürünü</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.06em] md:text-6xl">Yorumdan sonra takip akışını da büyüt.</h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-300">Biply sosyal medya kartı; Instagram, TikTok veya WhatsApp aksiyonlarını aynı premium temas diliyle açar.</p>
            <a href="#upsell" className="mt-6 inline-flex min-h-12 w-fit items-center justify-center rounded-full bg-white px-6 text-sm font-black text-zinc-950">
              Upsell’e ekle
            </a>
          </div>
        </div>
      </section>

      <section id="sektorler" className="section-pad pt-0">
        <SectionHeader eyebrow="Sektörler" title="Memnuniyet anı olan her yerde çalışır." centered />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {sectors.map((sector) => (
            <div key={sector} className="rounded-[1.5rem] border border-zinc-200 bg-white p-5 text-sm font-black text-zinc-950 shadow-sm">
              {sector}
            </div>
          ))}
        </div>
      </section>

      <section id="guven" className="section-pad pt-0">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            [<NfcIcon key="nfc" className="h-8 w-8" />, "NFC ile hızlı erişim"],
            [<QrIcon key="qr" className="h-8 w-8" />, "QR kod ile yedek erişim"],
            [<ShieldIcon key="shield" className="h-8 w-8" />, "Dayanıklı akrilik yapı"],
            [<CheckIcon key="check" className="h-8 w-8" />, "Kolay kurulum"],
          ].map(([icon, title]) => (
            <article key={String(title)} className="rounded-[1.7rem] border border-zinc-200 bg-white p-5 text-center shadow-sm">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-zinc-200">{icon}</div>
              <h3 className="mt-4 text-sm font-black text-zinc-950">{title}</h3>
            </article>
          ))}
        </div>
      </section>

      <section id="sss" className="section-pad pt-0">
        <SectionHeader eyebrow="SSS" title="Karar vermeden önce net cevaplar." centered />
        <div className="mx-auto grid max-w-3xl gap-3">
          {faqs.map((faq) => (
            <details key={faq.question} className="group rounded-[1.5rem] border border-zinc-200 bg-white p-5 shadow-sm">
              <summary className="cursor-pointer list-none text-base font-black text-zinc-950">{faq.question}</summary>
              <p className="mt-3 text-sm leading-6 text-zinc-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="final" className="section-pad pt-0 pb-28 md:pb-16">
        <div className="rounded-[2.5rem] bg-white p-7 text-center shadow-xl shadow-zinc-950/8 md:p-12">
          <h2 className="mx-auto max-w-3xl text-4xl font-black tracking-[-0.06em] text-zinc-950 md:text-6xl">Google yorumlarını tek dokunuşla kolaylaştırın.</h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-600">Paketinizi oluşturun, temas noktalarını seçin, sipariş özetini WhatsApp’tan gönderin.</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a href="#paketler" className="inline-flex min-h-12 items-center justify-center rounded-full bg-zinc-950 px-6 text-sm font-black text-white">
              Paketini Oluştur
            </a>
            <a href="#urunler" className="inline-flex min-h-12 items-center justify-center rounded-full border border-zinc-300 px-6 text-sm font-black text-zinc-950">
              Ürünleri İncele
            </a>
          </div>
        </div>
      </section>
      <Footer />
      <MobileStickyCta />
    </main>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-[#f7f3ed]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" aria-label="Biply ana sayfa"><Logo compact /></Link>
        <nav className="hidden items-center gap-6 text-sm font-bold text-zinc-600 md:flex">
          <a href="#urunler">Ürünler</a>
          <a href="#paketler">Paketler</a>
          <a href="#sss">SSS</a>
        </nav>
        <a href="#paketler" className="hidden min-h-11 items-center justify-center rounded-full bg-zinc-950 px-5 text-sm font-black text-white md:inline-flex">
          Paketini Oluştur
        </a>
        <a href="#paketler" className="inline-flex min-h-10 items-center justify-center rounded-full bg-zinc-950 px-4 text-xs font-black text-white md:hidden">
          Paket seç
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="section-pad pt-8 md:pt-14">
      <div className="grid items-center gap-8 lg:grid-cols-[0.88fr_1.12fr]">
        <div>
          <div className="inline-flex rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-600">
            NFC + QR ile akıllı etkileşim
          </div>
          <h1 className="mt-4 text-4xl font-black leading-[0.92] tracking-[-0.075em] text-zinc-950 sm:text-7xl">
            Google yorumlarını tek dokunuşla kolaylaştırın.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8">
            Müşteriniz memnun. Biply; NFC öncelikli ürünleriyle yorumu, takibi ve siparişi bir dokunuş uzağına taşır.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a href="#paketler" className="inline-flex min-h-13 items-center justify-center rounded-full bg-zinc-950 px-7 text-sm font-black text-white shadow-xl shadow-zinc-950/20">
              Paketini Oluştur
            </a>
            <a href="#urunler" className="inline-flex min-h-13 items-center justify-center rounded-full border border-zinc-300 bg-white px-7 text-sm font-black text-zinc-950">
              Ürünleri İncele
            </a>
          </div>
          <div className="mt-8 hidden grid-cols-3 gap-3 text-center text-xs font-bold text-zinc-600 sm:grid">
            <span className="rounded-2xl bg-white p-3">NFC + QR</span>
            <span className="rounded-2xl bg-white p-3">Premium tasarım</span>
            <span className="rounded-2xl bg-white p-3">Türkiye geneli</span>
          </div>
        </div>
        <div className="relative min-h-[430px] overflow-hidden sm:min-h-[520px] rounded-[2.5rem] border border-white/80 bg-gradient-to-br from-white via-[#f6f2ec] to-zinc-200 p-5 shadow-2xl shadow-zinc-950/10">
          <div className="absolute right-5 top-5 z-10"><Logo compact /></div>
          <div className="absolute left-8 top-16 rotate-[-7deg]"><ProductMockup shape="desk" tone="light" size="lg" /></div>
          <div className="absolute bottom-16 left-1/2 z-10 -translate-x-1/2 rotate-[3deg]"><ProductMockup shape="desk" tone="dark" size="lg" /></div>
          <div className="absolute right-4 top-32 rotate-[8deg]"><ProductMockup shape="glass" tone="glass" size="lg" /></div>
          <div className="absolute bottom-7 left-6 right-6 z-20 rounded-[1.5rem] border border-white/70 bg-white/75 p-4 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Dokundur</p>
                <p className="text-lg font-black tracking-[-0.04em]">Telefonunu dokundur veya QR kodu tara</p>
              </div>
              <ArrowIcon className="h-8 w-8 shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white px-4 py-10 md:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <Logo />
        <div className="flex flex-wrap gap-4 text-sm font-bold text-zinc-500">
          <a href="#sss">Sıkça Sorulan Sorular</a>
          <a href="#checkout">İletişim</a>
          <span>Gizlilik Politikası</span>
        </div>
      </div>
    </footer>
  );
}
