import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { CommerceExperience } from "@/components/commerce/CommerceExperience";
import { MobileStickyCta } from "@/components/commerce/MobileStickyCta";
import { Logo } from "@/components/brand/Logo";
import { CheckIcon, NfcIcon, ShieldIcon } from "@/components/icons";
import { ProductFamily } from "@/components/landing/ProductFamily";
import { SectionHeader } from "@/components/landing/SectionHeader";
import { MobileSwipeHint } from "@/components/ui/MobileSwipeHint";
import { comparisonRows, faqs, products, sectors, testimonials } from "@/data/catalog";
import { formatPrice } from "@/lib/format";

export function HomePage() {
  return (
    <main className="min-h-screen bg-[#f7f3ed] text-zinc-950">
      <Header />
      <DealMarquee />
      <Hero />
      <MobileSignalFlow />
      <QuickBuyStrip />
      <ProofStrip />

      <section id="urunler" className="section-pad hidden lg:block">
        <SectionHeader
          eyebrow="Hızlı seçim"
          title="İlk Biply&apos;ni seç, sepete ekle."
          description="Kasa için Stand, masa ve cam yüzeyler için Kare, özel yazılı kare için Kişiselleştirilmiş Kare, çoklu masa için Mini."
        />
        <ProductFamily />
      </section>

      <section className="section-pad pt-0">
        <CommerceExperience />
      </section>

      <section id="nasil-calisir" className="section-pad hidden pt-0 lg:block">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="smooth-card reveal-soft relative min-h-[420px] overflow-hidden bg-zinc-950 shadow-xl shadow-zinc-950/10">
            <Image
              src="/media/biply-stand-hotel.png"
              alt="Stand ile Google yorum ekranını açan otel müşterisi"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-contain p-3"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-zinc-950/5 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 rounded-[1.4rem] bg-white/92 p-4 shadow-lg backdrop-blur">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">QR yok. Uygulama yok.</p>
              <p className="mt-1 text-xl font-black tracking-[-0.04em] text-zinc-950">Müşteri sadece telefonunu yaklaştırır.</p>
            </div>
          </div>
          <div className="grid content-center gap-4">
            <SectionHeader
              eyebrow="Nasıl çalışır"
              title="Google yorumlarını tek dokunuşa indir."
              description="Müşteriniz telefonunu Biply'ye yaklaştırır, Google yorum ekranınız anında açılır."
            />
            <div className="grid gap-3">
              {[
                ["1", "Doğru temas noktasına Biply yerleşir.", "Kasa, masa, resepsiyon, cam ya da bekleme alanı."],
                ["2", "Müşteri NFC alanına telefonunu yaklaştırır.", "Ek uygulama indirme veya QR tarama adımı yoktur."],
                ["3", "Google yorum ekranı açılır.", "Memnuniyet anı kaybolmadan yorum alma şansı artar."],
              ].map(([number, title, copy]) => (
                <article key={number} className="smooth-card grid grid-cols-[48px_1fr] gap-4 border border-zinc-200 bg-white p-4 shadow-sm">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-zinc-950 text-sm font-black text-white">{number}</span>
                  <div>
                    <h3 className="text-lg font-black tracking-[-0.03em]">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-zinc-600">{copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad hidden pt-0 lg:block">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <SectionHeader
              eyebrow="Karşılaştırma"
              title="Hangisini almalıyım sorusunu hızlı cevapla."
              description="Tek kritik nokta için Stand, çok yönlü kullanım için Kare, özel yazılı yüzey için Kişiselleştirilmiş Kare, çok sayıda masa için Mini."
            />
            <div className="smooth-card overflow-hidden border border-zinc-200 bg-white shadow-sm">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-zinc-950 text-white">
                  <tr>
                    <th className="p-3 font-black">Özellik</th>
                    <th className="p-3 font-black">Stand</th>
                    <th className="p-3 font-black">Kare</th>
                    <th className="p-3 font-black">Kişisel Kare</th>
                    <th className="p-3 font-black">Mini</th>
                    <th className="p-3 font-black">Kişisel Mini</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row[0]} className="border-t border-zinc-100">
                      {row.map((cell, index) => (
                        <td key={`${row[0]}-${index}`} className={index === 0 ? "p-3 font-black text-zinc-950" : "p-3 font-bold text-zinc-600"}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
            <ImageCard image="/media/biply-square-salon-mirror.png" title="Kare" copy="Ayna, cam ve bankolarda görünür temas noktası." />
            <ImageCard image="/media/biply-round-bakery-counter.png" title="Mini" copy="Her masaya, her tezgaha kompakt yorum çağrısı." />
          </div>
        </div>
      </section>

      <section id="sektorler" className="section-pad hidden pt-0 lg:block">
        <SectionHeader eyebrow="Sektörler" title="Memnuniyet anı olan her yerde çalışır." centered />
        <div className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="grid grid-cols-2 gap-3">
            {sectors.map((sector) => (
              <div key={sector} className="smooth-card border border-zinc-200 bg-white p-4 text-sm font-black text-zinc-950 shadow-sm">
                {sector}
              </div>
            ))}
          </div>
          <div className="smooth-card relative min-h-[360px] overflow-hidden bg-zinc-950 shadow-xl shadow-zinc-950/10">
            <Image
              src="/media/biply-round-window-large.png"
              alt="Came yapıştırılmış Mini NFC Google yorum etiketi"
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-contain p-3"
            />
          </div>
        </div>
      </section>

      <section id="guven" className="section-pad hidden pt-0 lg:block">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            [<NfcIcon key="nfc" className="h-8 w-8" />, "NFC odaklı deneyim", "QR yok, uygulama yok, sadece dokundur."],
          [<ShieldIcon key="shield" className="h-8 w-8" />, "Kurumsal görünüm", "Beyaz, sade ve premium fiziksel temas noktası."],
            [<CheckIcon key="check" className="h-8 w-8" />, "Shopier satın alma", "Sepete ekle, ürününü seç, ödeme adımına Shopier üzerinden geç."],
          ].map(([icon, title, copy]) => (
            <article key={String(title)} className="smooth-card border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="grid h-14 w-14 place-items-center rounded-full border border-zinc-200">{icon}</div>
              <h3 className="mt-4 text-lg font-black text-zinc-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="sss" className="section-pad pt-0">
        <SectionHeader eyebrow="SSS" title="Karar vermeden önce net cevaplar." centered />
        <div className="mx-auto grid max-w-3xl gap-3">
          {faqs.map((faq) => (
            <details key={faq.question} className="smooth-card group border border-zinc-200 bg-white p-5 shadow-sm">
              <summary className="cursor-pointer list-none text-base font-black text-zinc-950">{faq.question}</summary>
              <p className="mt-3 text-sm leading-6 text-zinc-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="final" className="section-pad pt-0 pb-28 md:pb-16">
        <div className="smooth-card bg-zinc-950 p-7 text-center text-white shadow-xl shadow-zinc-950/10 md:p-12">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300">Lansmana özel</p>
          <h2 className="mx-auto mt-3 max-w-3xl text-4xl font-black tracking-[-0.05em] md:text-6xl">
            Daha fazla temas noktası seç, toplam fiyat otomatik düşsün.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-300">
            Paketini oluştur, tasarrufunu gör, Shopier üzerinden satın alma adımına geç.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a href="#paketler" className="inline-flex min-h-12 items-center justify-center bg-amber-300 px-6 text-sm font-black text-zinc-950">
              Biply&apos;ni Seç
            </a>
            <a href="#urunler" className="inline-flex min-h-12 items-center justify-center border border-white/20 px-6 text-sm font-black text-white">
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
    <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-[#f7f3ed]/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 md:px-6">
        <Link href="/" aria-label="Biply ana sayfa"><Logo compact image /></Link>
        <nav className="hidden items-center gap-6 text-sm font-bold text-zinc-600 md:flex">
          <a href="#mobil-urunler" className="lg:hidden">Ürünler</a>
          <a href="#urunler" className="hidden lg:inline">Ürünler</a>
          <a href="#paketler">Paket Oluştur</a>
          <a href="#sss">SSS</a>
        </nav>
        <a href="#paketler" className="hidden min-h-11 items-center justify-center rounded-full bg-zinc-950 px-5 text-sm font-black text-white md:inline-flex">
          Hızlı Fiyat Al
        </a>
        <a href="#mobil-urunler" className="inline-flex min-h-10 items-center justify-center rounded-full bg-zinc-950 px-4 text-xs font-black text-white md:hidden">
          Fiyat
        </a>
      </div>
    </header>
  );
}

function MobileProductShelf() {
  return (
    <div id="mobil-urunler" className="mt-4 scroll-mt-24 lg:hidden">
      <div className="mb-3">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">Hızlı seçim</p>
        <h2 className="mt-1 text-2xl font-black leading-[0.98] tracking-[-0.055em] text-zinc-950">
          Biply&apos;ni seç, sepete ekle.
        </h2>
        <p className="mt-1.5 text-sm font-semibold leading-6 text-zinc-600">
          Stand kritik nokta, Kare çoklu yüzey, Kişiselleştirilmiş Kare özel yazı, Mini masa yoğun işletmeler için.
        </p>
      </div>
      <div className="mb-3 rounded-[1.1rem] border border-zinc-200 bg-white p-3 text-xs font-bold leading-5 text-zinc-600 shadow-sm">
        Her kart ayrı ürün: fiyatı gör, sepete ekle veya detayına gir. Yana kaydırdıkça diğer ürün seçenekleri gelir.
      </div>
      <ProductFamily />
    </div>
  );
}

function MobileSignalFlow() {
  const signals = [
    ["1", "Dokundur", "Müşteri telefonunu yaklaştırır, Google yorum ekranı açılır."],
    ["2", "Seç", "Stand, Kare, Kişiselleştirilmiş Kare, Mini veya Kişiselleştirilmiş Mini."],
    ["3", "Kişiselleştir", "Kişiselleştirilmiş ürünlerde sabit Biply şablonuna ürün üstü metnini yaz."],
    ["4", "Tamamla", "Sepete ekle, Shopier ödeme adımına geç."],
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 pb-5 lg:hidden">
      <MobileSwipeHint label="4 adımda yorum akışı" detail="Biply'nin müşteriye nasıl yorum yazdırdığını görmek için adımları kaydırın." />
      <div className="no-scrollbar grid auto-cols-[100%] grid-flow-col snap-x snap-mandatory gap-3 overflow-x-auto pb-1">
        {signals.map(([step, title, copy], index) => (
          <article key={step} className="swipe-card rounded-[1.25rem] border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-zinc-950 text-sm font-black text-white">{step}</span>
              <h3 className="text-xl font-black tracking-[-0.045em] text-zinc-950">{title}</h3>
            </div>
            <p className="mt-3 text-sm font-semibold leading-6 text-zinc-600">{copy}</p>
            <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3 text-[11px] font-black text-zinc-500">
              <span>{index + 1} / {signals.length}</span>
              <span>Devamı sağda</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function QuickBuyStrip() {
  return (
    <section id="hizli-secim" className="mx-auto hidden max-w-7xl scroll-mt-24 px-4 pb-4 md:px-6 lg:block">
      <div className="smooth-card overflow-hidden border border-zinc-200 bg-white shadow-xl shadow-zinc-950/8">
        <div className="grid gap-0 lg:grid-cols-[0.6fr_1.4fr]">
          <div className="bg-zinc-950 p-5 text-white sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">Hızlı seçim</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.05em]">İlk Biply&apos;ni hemen sepete ekle.</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              Stand kritik nokta, Kare çoklu yüzey, Kişisel Kare özel yazı, Mini yoğun masa için.
            </p>
            <div className="mt-4 rounded-[1.2rem] bg-white/10 p-3 text-sm font-bold text-white">
              <span className="text-amber-300" aria-label="Beş yıldız">★★★★★</span>
              <span className="ml-2">Yorum istemek yerine dokundur.</span>
            </div>
          </div>
          <div className="grid gap-3 p-3 sm:grid-cols-2 xl:grid-cols-5 sm:p-4">
            {products.map((product) => (
              <article key={product.id} className="smooth-card border border-zinc-200 bg-[#fbfaf7] p-3">
                <div className="flex items-center gap-3 sm:block">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[1.2rem] bg-zinc-100 sm:h-28 sm:w-full">
                    <Image src={product.image} alt={product.imageAlt} fill sizes="(min-width: 640px) 20vw, 80px" className="object-contain p-1" />
                  </div>
                  <div className="min-w-0 flex-1 sm:mt-3">
                    <p className="truncate text-[11px] font-black uppercase tracking-[0.12em] text-blue-700">{product.subtitle}</p>
                    <h3 className="mt-1 text-lg font-black tracking-[-0.04em] text-zinc-950">{product.name.replace("Biply ", "")}</h3>
                    <p className="mt-1 text-xs font-bold text-zinc-500">{product.hierarchy}</p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-xs font-bold text-zinc-400 line-through">{formatPrice(product.oldPrice)}</span>
                      <strong className="text-base text-zinc-950">{formatPrice(product.price)}</strong>
                    </div>
                  </div>
                </div>
                <AddToCartButton
                  item={{ id: product.id, kind: "product", name: product.name, price: product.price }}
                  className="mt-3 min-h-11 w-full text-xs"
                >
                  Sepete Ekle
                </AddToCartButton>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProofStrip() {
  return (
    <section id="yorumlar" className="mx-auto hidden max-w-7xl px-4 pb-4 md:block md:px-6">
      <div className="grid gap-3 md:grid-cols-[0.7fr_1.3fr] md:items-stretch">
        <div className="smooth-card bg-zinc-950 p-5 text-white shadow-xl shadow-zinc-950/10">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">Güven veren temas</p>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.05em]">Müşteri memnunken yorum ekranı hazır.</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-300">Telefonu yaklaştırır, yıldızları seçer, yorumu gönderir. Satın alma kararı için gereken şey bu kadar net.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article key={testimonial.name} className="smooth-card border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black text-zinc-500">{testimonial.sector}</span>
                <span className="text-sm text-amber-400" aria-label="Yorum puanı görseli">★★★★★</span>
              </div>
              <p className="mt-3 text-sm font-bold leading-6 text-zinc-800">&quot;{testimonial.quote}&quot;</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function DealMarquee() {
  const items = [
    "Lansmana özel fiyatlar",
    "Stand 2.000 TL",
    "Kare 1.250 TL",
    "Kişisel Kare 1.350 TL",
    "Mini 750 TL",
    "10+ adette %20 avantaj",
    "Shopier ile hızlı satın alma",
    "Kişisel Mini 850 TL",
    "QR yok",
    "Uygulama yok",
  ];
  const content = [...items, ...items];

  return (
      <section className="border-y border-amber-300/80 bg-[linear-gradient(90deg,#ffd43b,#ffed8a,#ffd43b)] py-2.5 text-zinc-950 shadow-[0_10px_28px_rgba(24,24,27,0.08)]">
      <div className="marquee-track" aria-label="Biply lansman fırsatları">
        <div className="marquee-content">
          {content.map((item, index) => (
            <span key={`${item}-${index}`} className="marquee-pill border-transparent bg-transparent text-zinc-950">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-5 pt-4 md:px-6 md:pt-7">
      <div className="grid items-start gap-4 lg:grid-cols-[0.62fr_1.38fr] lg:gap-5 xl:gap-7">
        <div className="reveal-soft lg:pt-1">
          <div className="inline-flex max-w-full rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-zinc-600 shadow-sm sm:px-4 sm:py-2 sm:text-xs">
            Lansmana özel NFC yorum ürünleri
          </div>
          <h1 className="mt-3 max-w-[560px] text-[2.55rem] font-black leading-[0.9] tracking-[-0.055em] text-zinc-950 sm:text-6xl lg:mt-4 lg:text-[4.25rem] xl:text-[4.85rem]">
            Google yorumlarını tek dokunuşa indir.
          </h1>
          <p className="mt-3 max-w-[520px] text-[15px] font-semibold leading-7 text-zinc-600 sm:text-lg sm:leading-8">
            Müşteriniz telefonunu Biply&apos;ye yaklaştırır, Google yorum ekranınız anında açılır.
          </p>
          <div className="mt-4 hidden max-w-[760px] grid-cols-5 gap-2 text-xs font-bold text-zinc-600 lg:grid lg:gap-2.5">
            {products.map((product) => (
              <div key={product.id} className="smooth-card border border-zinc-200 bg-white p-2 shadow-md shadow-zinc-950/5 sm:p-3">
                <span className="block truncate text-sm font-black text-zinc-950">{product.name.replace("Biply ", "")}</span>
                <span className="mt-1 block text-[10px] text-zinc-400 line-through">{formatPrice(product.oldPrice)}</span>
                <strong className="mt-0.5 block text-sm text-blue-700">{formatPrice(product.price)}</strong>
                <AddToCartButton
                  item={{ id: product.id, kind: "product", name: product.name, price: product.price }}
                  className="mt-2 min-h-9 w-full px-2 text-[11px] shadow-none"
                >
                  Ekle
                </AddToCartButton>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-bold text-zinc-700 lg:mt-4">
            <span className="text-amber-400" aria-label="Beş yıldız">★★★★★</span>
            <span>Kafe, otel ve kliniklerde yorum istemeyi doğal hale getirir.</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:gap-3 lg:mt-5">
            <a href="#mobil-urunler" className="inline-flex min-h-12 items-center justify-center rounded-full bg-zinc-950 px-4 text-sm font-black text-white shadow-xl shadow-zinc-950/20 transition hover:-translate-y-0.5 sm:px-7 lg:hidden">
              Biply&apos;ni Seç
            </a>
            <a href="#hizli-secim" className="hidden min-h-12 items-center justify-center rounded-full bg-zinc-950 px-7 text-sm font-black text-white shadow-xl shadow-zinc-950/20 transition hover:-translate-y-0.5 lg:inline-flex">
              Biply&apos;ni Seç
            </a>
            <a href="#nasil-calisir" className="inline-flex min-h-12 items-center justify-center rounded-full border border-zinc-300 bg-white px-4 text-sm font-black text-zinc-950 transition hover:-translate-y-0.5 sm:px-7">
              Nasıl Çalışır?
            </a>
          </div>
          <MobileProductShelf />
        </div>
        <div className="smooth-card reveal-soft overflow-hidden bg-zinc-950 p-2 shadow-2xl shadow-zinc-950/15 sm:p-3 lg:mt-3">
          <div className="relative aspect-[1.55/1] min-h-[190px] overflow-hidden rounded-[1.15rem] bg-zinc-900 sm:aspect-[1.78/1] sm:min-h-[320px]">
            <Image
              src="/media/biply-review-phone-hero.png"
              alt="Biply ile açılan Google yorum ekranında beş yıldız seçen müşteri"
              fill
              priority
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/20 via-transparent to-zinc-950/5" />
            <div className="absolute left-3 top-3 rounded-full bg-white/94 px-4 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-zinc-950 shadow-lg backdrop-blur sm:left-4 sm:top-4 sm:text-xs">
              QR yok. Uygulama yok.
            </div>
          </div>
          <div className="mt-2 grid gap-2 rounded-[1.15rem] bg-white p-3 text-zinc-950 shadow-xl sm:grid-cols-[1fr_auto] sm:items-center sm:p-3.5">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-blue-700 sm:text-xs">Lansman fiyatları aktif</p>
              <p className="mt-1 text-base font-black tracking-[-0.04em] sm:text-lg">Stand 2.000 TL | Kare 1.250 TL | Kişisel Kare 1.350 TL | Mini 750 TL | Kişisel Mini 850 TL</p>
              <p className="mt-1 text-xs font-bold text-emerald-700">Çoklu alımda %20&apos;ye varan avantaj</p>
            </div>
            <a href="#mobil-urunler" className="inline-flex min-h-11 items-center justify-center rounded-full bg-amber-300 px-5 text-sm font-black text-zinc-950 lg:hidden">
              Fiyatları Gör
            </a>
            <a href="#hizli-secim" className="hidden min-h-11 items-center justify-center rounded-full bg-amber-300 px-5 text-sm font-black text-zinc-950 lg:inline-flex">
              Fiyatları Gör
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ImageCard({ image, title, copy }: { image: string; title: string; copy: string }) {
  return (
    <article className="relative min-h-[260px] overflow-hidden bg-zinc-950 shadow-lg shadow-zinc-950/10">
      <Image src={image} alt="" fill sizes="(min-width: 1024px) 45vw, 100vw" className="scale-110 object-cover opacity-35 blur-xl" />
      <Image src={image} alt={`${title} kullanım görseli`} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-contain p-2" />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent" />
      <div className="absolute bottom-4 left-4 right-4 text-white">
        <h3 className="text-2xl font-black tracking-[-0.04em]">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-white/80">{copy}</p>
      </div>
    </article>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white px-4 py-10 md:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <Logo image />
        <div className="flex flex-wrap gap-4 text-sm font-bold text-zinc-500">
          <a href="#sss">Sıkça Sorulan Sorular</a>
          <a href="#checkout">Sipariş Oluştur</a>
          <span>Google Review NFC Ürünleri</span>
        </div>
      </div>
    </footer>
  );
}
