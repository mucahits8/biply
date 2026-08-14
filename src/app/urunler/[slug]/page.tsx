import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { Logo } from "@/components/brand/Logo";
import { ArrowIcon, CheckIcon, NfcIcon } from "@/components/icons";
import { ProductDetailGallery } from "@/components/product/ProductDetailGallery";
import { ProductStickyCta } from "@/components/product/ProductStickyCta";
import { MobileSwipeHint } from "@/components/ui/MobileSwipeHint";
import { products, type CatalogItem } from "@/data/catalog";
import { formatPrice, shopierUrlForProduct } from "@/lib/format";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) return {};

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | Biply`,
      description: product.description,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) notFound();

  const gallery = product.gallery.length ? product.gallery : [product.image];
  const relatedProducts = products.filter((item) => item.id !== product.id);
  const shopierUrl = shopierUrlForProduct(product);

  return (
    <main className="min-h-screen bg-[#f7f3ed] px-4 py-5 text-zinc-950 md:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="sticky top-0 z-40 -mx-4 mb-6 flex items-center justify-between border-b border-zinc-200/70 bg-[#f7f3ed]/90 px-4 py-3 backdrop-blur-xl md:-mx-6 md:px-6">
          <Link href="/" aria-label="Biply ana sayfa"><Logo compact image /></Link>
          <Link href="/#mobil-urunler" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 text-sm font-black">
            Ürünlere dön <ArrowIcon className="h-4 w-4 rotate-180" />
          </Link>
        </header>

        <section className="smooth-card grid gap-4 border border-white/80 bg-white/72 p-3 shadow-xl shadow-zinc-950/8 backdrop-blur md:gap-7 md:p-6 lg:grid-cols-[1.05fr_0.95fr] lg:p-8">
          <ProductDetailGallery images={gallery} productName={product.name} primaryAlt={product.imageAlt} />
          <div className="flex flex-col justify-center px-1 pb-2 md:px-0 lg:sticky lg:top-24 lg:self-start">
            <div className="inline-flex w-fit rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-blue-700 shadow-sm">
              {product.badge}
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.24em] text-zinc-500 md:mt-5">{product.eyebrow}</p>
            <h1 className="mt-2 break-words text-4xl font-black tracking-[-0.075em] md:mt-3 md:text-6xl xl:text-7xl">{product.name}</h1>
            <p className="mt-2 text-lg font-black tracking-[-0.03em] text-zinc-950 md:mt-3 md:text-xl">{product.hierarchy}</p>
            <p className="mt-3 max-w-xl text-base leading-7 text-zinc-600 md:mt-5 md:text-lg md:leading-8">{product.description}</p>
            <div className="mt-5 hidden gap-3 sm:grid sm:grid-cols-2">
              <div className="rounded-[1.4rem] bg-zinc-950 p-4 text-white shadow-lg shadow-zinc-950/10">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-amber-300">Neden alınır?</p>
                <p className="mt-2 text-sm font-bold leading-6 text-zinc-200">{product.detailStory.proof}</p>
              </div>
              <div className="rounded-[1.4rem] border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-blue-700">En iyi kullanım</p>
                <p className="mt-2 text-sm font-bold leading-6 text-zinc-700">{product.detailStory.bestFor}</p>
              </div>
            </div>
            <div className="mt-4 rounded-[1.3rem] border border-zinc-200 bg-white p-4 shadow-sm md:mt-6 md:rounded-[1.5rem]">
              <div>
                <span className="block text-xs font-black uppercase tracking-[0.14em] text-emerald-700">Lansman fiyatı</span>
                <span className="block text-sm font-bold text-zinc-400 line-through">{formatPrice(product.oldPrice)}</span>
                <div className="mt-1 flex flex-wrap items-end gap-3">
                  <strong className="text-4xl font-black tracking-[-0.06em]">{formatPrice(product.price)}</strong>
                  <span className="pb-1 text-sm font-bold text-emerald-700">{product.saleBadge}</span>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 md:mt-4">
                {["QR yok", "Uygulama yok", "NFC hazır"].map((item) => (
                  <span key={item} className="rounded-full bg-[#f7f3ed] px-3 py-2 text-center text-xs font-black text-zinc-700">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-bold text-zinc-700 sm:text-sm">
              <span className="bg-[#f7f3ed] p-3">Ölçü: {product.size}</span>
              <span className="bg-[#f7f3ed] p-3">Form: {product.form}</span>
              <span className="bg-[#f7f3ed] p-3">Montaj: {product.mounting}</span>
              <span className="bg-[#f7f3ed] p-3">İdeal adet: {product.idealQuantity}</span>
            </div>
            {product.slug === "biply-personal-mini" || product.slug === "biply-personal-square" ? (
              <div className="mt-4 rounded-[1.25rem] border border-amber-300 bg-amber-50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-zinc-950">Sabit şablon, özel yazı</p>
                <p className="mt-2 text-sm font-bold leading-6 text-zinc-700">
                  Satın alırken Shopier sipariş notuna ürün üstünde yazmasını istediğiniz kampanya metnini ekleyin. Tasarım Biply şablonunda kalır.
                </p>
              </div>
            ) : null}
            <div className="mt-5 grid gap-3 sm:grid-cols-2 md:mt-7">
              <AddToCartButton item={{ id: product.id, kind: "product", name: product.name, price: product.price }} className="w-full">
                Sepete Ekle
              </AddToCartButton>
              <a href={shopierUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-full border border-zinc-300 bg-white text-sm font-black">
                {product.shopierUrl ? "Shopier'de Satın Al" : "Shopier Mağazasına Git"}
              </a>
            </div>
            <p className="mt-3 text-center text-xs font-bold text-zinc-500 sm:text-left">
              Sepete ekledikten sonra çoklu alım avantajı otomatik hesaplanır. Ödeme adımı Shopier&apos;de tamamlanır.
            </p>
            <div className="mt-5 hidden rounded-[1.3rem] bg-zinc-950 p-4 text-white md:block">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-300">Tek dokunuş akışı</p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                Müşteri memnuniyet anındayken telefonu yaklaştırır, Google yorum ekranı açılır, ekibiniz açıklama yapmak zorunda kalmaz.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 hidden smooth-card border border-zinc-200 bg-white p-3 shadow-sm md:mt-8 md:block">
          <div className="grid gap-2 sm:grid-cols-4">
            <a href="#aciklama" className="rounded-full bg-zinc-950 px-4 py-3 text-center text-sm font-black text-white">Ürün hikayesi</a>
            <a href="#yorum-etkisi" className="rounded-full bg-[#f7f3ed] px-4 py-3 text-center text-sm font-black text-zinc-950">Tepkiler</a>
            <a href="#galeri" className="rounded-full bg-[#f7f3ed] px-4 py-3 text-center text-sm font-black text-zinc-950">Görseller</a>
            <a href="#birlikte" className="rounded-full bg-[#f7f3ed] px-4 py-3 text-center text-sm font-black text-zinc-950">Yanına ekle</a>
          </div>
        </section>

        <MobileProductExtras product={product} relatedProducts={relatedProducts} />

        <section id="aciklama" className="mt-8 hidden scroll-mt-24 gap-5 md:grid md:grid-cols-[0.9fr_1.1fr]">
          <div className="smooth-card border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">{product.eyebrow}</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.06em]">{product.detailStory.headline}</h2>
            <p className="mt-4 text-base leading-8 text-zinc-600">{product.detailStory.body}</p>
            <div className="mt-5 grid items-center gap-4 text-center">
              <div className="rounded-[1.5rem] bg-[#f7f3ed] p-5">
                <NfcIcon className="mx-auto h-16 w-16" />
                <p className="mt-3 text-sm font-black">Telefonunu yaklaştır</p>
                <p className="mt-2 text-sm leading-6 text-zinc-600">Müşteri Google yorum ekranına tek dokunuşla ulaşır.</p>
              </div>
            </div>
            <div className="mt-5">
              <h3 className="text-lg font-black tracking-[-0.03em]">Başlıca kullanım alanları</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.useCases.map((useCase) => (
                  <span key={useCase} className="rounded-full bg-[#f7f3ed] px-3 py-2 text-xs font-bold text-zinc-700">
                    {useCase}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="smooth-card border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black tracking-[-0.05em]">Satın alma kararını kolaylaştıran noktalar</h2>
            <div className="mt-5 grid gap-3">
              {product.salesMoments.map((moment, index) => (
                <article key={moment.title} className="rounded-[1.4rem] bg-[#f7f3ed] p-4">
                  <div className="flex gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-zinc-950 text-sm font-black text-white">{index + 1}</span>
                    <div>
                      <h3 className="text-base font-black tracking-[-0.03em]">{moment.title}</h3>
                      <p className="mt-1 text-sm font-bold leading-6 text-zinc-600">{moment.body}</p>
                    </div>
                  </div>
                </article>
              ))}
              {[...product.features, ...product.details].map((detail, index) => (
                <p key={`${detail}-${index}`} className="flex gap-3 rounded-2xl bg-[#f7f3ed] p-4 text-sm font-bold text-zinc-700">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0" />
                  <span>{detail}</span>
                </p>
              ))}
            </div>
            <AddToCartButton item={{ id: product.id, kind: "product", name: product.name, price: product.price }} className="mt-5 w-full">
              Bu ürünü sepete ekle
            </AddToCartButton>
          </div>
        </section>

        <section id="yorum-etkisi" className="mt-8 hidden scroll-mt-24 md:block">
          <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="smooth-card overflow-hidden border border-zinc-200 bg-zinc-950 text-white shadow-xl shadow-zinc-950/12">
              <div className="p-6 md:p-7">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">Müşteri tepkisi</p>
                <h2 className="mt-2 text-3xl font-black tracking-[-0.06em] md:text-4xl">
                  İnsanların aklındaki bariyeri azaltır: “Nereye yorum bırakacağım?”
                </h2>
                <p className="mt-4 text-sm leading-7 text-zinc-300">
                  Biply müşteriye tek cümlelik bir davranış verir: telefonunu yaklaştır. Aşağıdaki tepkiler satış sayfasında kullanılabilecek doğal senaryolardır.
                </p>
              </div>
              <div className="grid gap-px bg-white/10">
                {product.customerReactions.map((reaction) => (
                  <article key={`${reaction.persona}-${reaction.moment}`} className="bg-zinc-950 p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-zinc-950">{reaction.persona}</span>
                      <span className="text-xs font-bold text-zinc-400">{reaction.moment}</span>
                    </div>
                    <p className="mt-3 text-lg font-black leading-7 tracking-[-0.03em] text-white">&quot;{reaction.quote}&quot;</p>
                    <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-emerald-300">{reaction.signal}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="smooth-card border border-zinc-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">Örnek Google yorumları</p>
                  <h2 className="mt-1 text-3xl font-black tracking-[-0.06em]">Müşteri memnunken yorum yazmak kolaylaşır.</h2>
                </div>
                <div className="rounded-full bg-amber-300 px-4 py-2 text-sm font-black text-zinc-950" aria-label="Beş yıldız">
                  ★★★★★
                </div>
              </div>
              <div className="mt-5 grid gap-3">
                {product.reviewExamples.map((review) => (
                  <article key={`${review.name}-${review.sector}`} className="rounded-[1.4rem] border border-zinc-200 bg-[#fbfaf7] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-black text-zinc-950">{review.name}</p>
                        <p className="text-xs font-bold text-zinc-500">{review.sector}</p>
                      </div>
                      <span className="text-sm text-amber-400" aria-label="Beş yıldız">★★★★★</span>
                    </div>
                    <p className="mt-3 text-sm font-bold leading-6 text-zinc-700">&quot;{review.quote}&quot;</p>
                  </article>
                ))}
              </div>
              <div className="mt-5 rounded-[1.5rem] bg-[#f7f3ed] p-5">
                <h3 className="text-xl font-black tracking-[-0.04em]">{product.closingPitch.title}</h3>
                <p className="mt-2 text-sm font-bold leading-6 text-zinc-600">{product.closingPitch.body}</p>
                <AddToCartButton item={{ id: product.id, kind: "product", name: product.name, price: product.price }} className="mt-4 w-full">
                  {product.name} sepete ekle
                </AddToCartButton>
              </div>
            </div>
          </div>
        </section>

        <section id="galeri" className="mt-8 hidden scroll-mt-24 md:block">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">Galeri</p>
              <h2 className="mt-1 text-3xl font-black tracking-[-0.05em]">Ürünü gerçek temas noktalarında gör.</h2>
            </div>
            <span className="hidden text-sm font-bold text-zinc-500 sm:block">Yana kaydır</span>
          </div>
          <div className="flex snap-x gap-4 overflow-x-auto pb-3">
            {gallery.map((image, index) => (
              <div key={`gallery-${image}-${index}`} className="relative min-h-[280px] min-w-[82%] snap-center overflow-hidden rounded-[1.6rem] bg-zinc-950 shadow-lg shadow-zinc-950/10 sm:min-w-[46%] lg:min-w-[32%]">
                <Image src={image} alt={`${product.name} kullanım sahnesi ${index + 1}`} fill sizes="(min-width: 1024px) 32vw, 82vw" className="object-contain p-2" />
                <div className="absolute bottom-3 left-3 rounded-full bg-white/92 px-3 py-1 text-[11px] font-black text-zinc-950">{index + 1} / {gallery.length}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="birlikte" className="mt-8 hidden scroll-mt-24 pb-28 md:block md:pb-16">
          <div className="smooth-card border border-zinc-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Birlikte daha güçlü</p>
                <h2 className="text-3xl font-black tracking-[-0.05em]">Bu ürünü alanlar genelde şunları da ekliyor.</h2>
              </div>
              <Link href="/#paketler" className="text-sm font-black text-blue-700">Paket avantajını gör</Link>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {relatedProducts.map((related) => (
                <article key={related.id} className="smooth-card grid gap-4 border border-zinc-200 bg-[#fbfaf7] p-3 sm:grid-cols-[132px_1fr]">
                  <div className="relative min-h-[150px] overflow-hidden rounded-[1.3rem] bg-zinc-100">
                    <Image src={related.image} alt={related.imageAlt} fill sizes="132px" className="object-contain p-1" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[11px] font-black uppercase tracking-[0.14em] text-blue-700">{related.subtitle}</p>
                    <h3 className="mt-1 text-xl font-black tracking-[-0.04em]">{related.name}</h3>
                    <p className="mt-1 text-sm leading-5 text-zinc-600">{related.hierarchy}</p>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-xs font-bold text-zinc-400 line-through">{formatPrice(related.oldPrice)}</span>
                      <strong className="text-lg">{formatPrice(related.price)}</strong>
                    </div>
                    <AddToCartButton item={{ id: related.id, kind: "product", name: related.name, price: related.price }} className="mt-3 min-h-11 w-full text-xs">
                      Bu ürünü de sepete ekle
                    </AddToCartButton>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
      <ProductStickyCta product={product} />
    </main>
  );
}

function MobileProductExtras({
  product,
  relatedProducts,
}: {
  product: CatalogItem;
  relatedProducts: CatalogItem[];
}) {
  const mobileDetails = [
    {
      title: "Nerede kullanılır?",
      body: product.detailStory.bestFor,
      chips: product.useCases.slice(0, 6),
    },
    {
      title: "Müşteri ne hisseder?",
      body: product.customerReactions[0]?.quote ?? product.detailStory.proof,
      chips: product.customerReactions.slice(0, 3).map((reaction) => reaction.signal),
    },
    {
      title: "Neden çalışır?",
      body: product.detailStory.proof,
      chips: product.features.slice(0, 4),
    },
  ];

  return (
    <section className="mt-5 space-y-4 pb-28 md:hidden">
      <div className="rounded-[1.35rem] bg-zinc-950 p-4 text-white shadow-xl shadow-zinc-950/15">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">Kısa cevap</p>
        <h2 className="mt-2 text-2xl font-black tracking-[-0.05em]">Koy. Dokundur. Yorum ekranı açılsın.</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-zinc-300">{product.detailStory.body}</p>
      </div>

      <div className="space-y-2">
        {mobileDetails.map((item, index) => (
          <details key={item.title} className="smooth-card group border border-zinc-200 bg-white p-4 shadow-sm" open={index === 0}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-base font-black text-zinc-950">
              {item.title}
              <span className="text-xl leading-none text-zinc-400 transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm font-semibold leading-6 text-zinc-600">{item.body}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.chips.map((chip) => (
                <span key={chip} className="rounded-full bg-[#f7f3ed] px-3 py-2 text-xs font-black text-zinc-700">
                  {chip}
                </span>
              ))}
            </div>
          </details>
        ))}
      </div>

      <div className="rounded-[1.35rem] border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Yanına ekle</p>
            <h2 className="mt-1 text-2xl font-black tracking-[-0.05em]">Bir temas noktası daha kapat.</h2>
          </div>
        </div>
        <MobileSwipeHint label={`${relatedProducts.length} öneri`} detail="Bu ürünün yanına eklenebilecek diğer Biply seçeneklerini görmek için kaydırın." className="mt-3" />
        <div className="no-scrollbar mt-3 grid auto-cols-[100%] grid-flow-col snap-x snap-mandatory gap-3 overflow-x-auto pb-1">
          {relatedProducts.map((related, index) => (
            <article key={related.id} className="swipe-card rounded-[1.15rem] border border-zinc-200 bg-[#fbfaf7] p-3">
              <div className="relative h-28 overflow-hidden rounded-[1rem] bg-zinc-100">
                <Image src={related.image} alt={related.imageAlt} fill sizes="72vw" className="object-contain p-1" />
              </div>
              <h3 className="mt-3 text-xl font-black tracking-[-0.04em]">{related.name}</h3>
              <p className="mt-1 text-xs font-bold leading-5 text-zinc-600">{related.hierarchy}</p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-xs font-bold text-zinc-400 line-through">{formatPrice(related.oldPrice)}</span>
                <strong className="text-lg">{formatPrice(related.price)}</strong>
              </div>
              <AddToCartButton item={{ id: related.id, kind: "product", name: related.name, price: related.price }} className="mt-3 min-h-10 w-full text-xs">
                Sepete Ekle
              </AddToCartButton>
              <div className="mt-3 flex items-center justify-between text-[11px] font-black text-zinc-500">
                <span>{index + 1} / {relatedProducts.length}</span>
                <span>Diğer öneriler sağda</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
