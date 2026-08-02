"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useCart } from "@/components/commerce/CartProvider";
import { PlusIcon } from "@/components/icons";
import { bundlePresets, products, promotions, type ProductSlug } from "@/data/catalog";
import { formatPrice, shopierUrlForProduct, whatsappUrl } from "@/lib/format";
import { calculateBulkPricing, formatDiscountRate } from "@/lib/pricing";

type CheckoutFields = {
  business: string;
  sector: string;
  phone: string;
  city: string;
  customHeadline: string;
  customOffer: string;
  customNotes: string;
};

type Quantities = Record<ProductSlug, number>;

const initialFields: CheckoutFields = {
  business: "",
  sector: "",
  phone: "",
  city: "",
  customHeadline: "",
  customOffer: "",
  customNotes: "",
};

const initialQuantities: Quantities = {
  "biply-stand": 1,
  "biply-square": 4,
  "biply-personal-square": 0,
  "biply-round": 8,
  "biply-personal-mini": 0,
};

function validate(fields: CheckoutFields, requiresPersonalText: boolean) {
  const errors: Partial<Record<keyof CheckoutFields, string>> = {};

  if (fields.business.trim().length < 2) errors.business = "İşletme adını girin.";
  if (!/^\+?[0-9\s()-]{10,}$/.test(fields.phone)) errors.phone = "Geçerli telefon girin.";
  if (requiresPersonalText && fields.customOffer.trim().length < 2) {
    errors.customOffer = "Kişiselleştirilmiş ürün için ürün üstü metni yazın.";
  }

  return errors;
}

function productForSlug(slug: ProductSlug) {
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    throw new Error(`Unknown product slug: ${slug}`);
  }

  return product;
}

export function CommerceExperience() {
  const { addItem, clearCart, openCart } = useCart();
  const [quantities, setQuantities] = useState<Quantities>(initialQuantities);
  const [fields, setFields] = useState(initialFields);
  const [submitted, setSubmitted] = useState(false);
  const hasPersonalizedProduct = quantities["biply-personal-mini"] > 0 || quantities["biply-personal-square"] > 0;
  const errors = submitted ? validate(fields, hasPersonalizedProduct) : {};
  const lines = products
    .map((product) => ({
      product,
      quantity: quantities[product.slug],
      price: product.price,
    }))
    .filter((line) => line.quantity > 0);
  const pricing = calculateBulkPricing(lines);
  const hasSelection = lines.length > 0;
  const isValid = Object.keys(validate(fields, hasPersonalizedProduct)).length === 0 && hasSelection;
  const directShopierProduct = lines.length === 1 && lines[0]?.quantity === 1 ? lines[0].product : undefined;
  const shopierCheckoutUrl = shopierUrlForProduct(directShopierProduct);

  const orderMessage = useMemo(() => {
    const orderLines = lines.map(
      ({ product, quantity }) => `- ${quantity} x ${product.name}: ${formatPrice(product.price * quantity)}`,
    );
    const personalizedLines = hasPersonalizedProduct
      ? [
          "Kişiselleştirilmiş ürün sabit şablon metni:",
          `Üst başlık: ${fields.customHeadline || "Google'da bize yorum yap"}`,
          `Ana kampanya metni: ${fields.customOffer || "-"}`,
          `Not: ${fields.customNotes || "-"}`,
        ]
      : [];

    return [
      "Merhaba Biply, lansman fiyatıyla sipariş oluşturmak istiyorum. Seçimlerim aşağıda.",
      `İşletme: ${fields.business || "-"}`,
      `Sektör: ${fields.sector || "-"}`,
      `Telefon: ${fields.phone || "-"}`,
      `Şehir: ${fields.city || "-"}`,
      ...personalizedLines,
      "Seçimler:",
      ...orderLines,
      `Ara toplam: ${formatPrice(pricing.subtotal)}`,
      `Çoklu alım avantajı: ${pricing.discountRate ? formatDiscountRate(pricing.discountRate) : "%0"}`,
      `Tasarruf: ${formatPrice(pricing.discountAmount)}`,
      `Toplam: ${formatPrice(pricing.total)}`,
      "Shopier üzerinden ödeme adımına geçiyorum. Sipariş notu için bu özeti kullanabilirsiniz.",
    ].join("\n");
  }, [fields, hasPersonalizedProduct, lines, pricing.discountAmount, pricing.discountRate, pricing.subtotal, pricing.total]);

  function updateField(field: keyof CheckoutFields, value: string) {
    setFields((current) => ({ ...current, [field]: value }));
  }

  function updateQuantity(slug: ProductSlug, nextQuantity: number) {
    setQuantities((current) => ({
      ...current,
      [slug]: Math.max(0, Math.min(99, nextQuantity)),
    }));
  }

  function applyPreset(nextQuantities: Quantities) {
    setQuantities(nextQuantities);
  }

  function addCurrentPackageToCart() {
    clearCart();
    lines.forEach(({ product, quantity }) => {
      addItem({ id: product.id, kind: "product", name: product.name, price: product.price, quantity });
    });
  }

  function addPromotionToCart(productSlug: ProductSlug, quantity: number) {
    const product = productForSlug(productSlug);
    addItem({ id: product.id, kind: "product", name: product.name, price: product.price, quantity });
  }

  function handleMockSubmit() {
    setSubmitted(true);
    if (isValid) {
      addCurrentPackageToCart();
      openCart();
    }
  }

  return (
    <div className="grid min-w-0 max-w-full gap-4 overflow-hidden lg:grid-cols-[1.08fr_0.92fr] lg:gap-6 lg:overflow-visible">
      <section id="paketler" className="smooth-card min-w-0 max-w-full scroll-mt-24 overflow-hidden border border-zinc-200 bg-white p-3 shadow-sm sm:p-6">
        <div className="mb-4 sm:mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700">Hızlı paket oluşturucu</p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-zinc-950 sm:text-5xl">
            İşletmen için doğru seti seç, avantajı anında gör.
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600 sm:mt-3">
            Birkaç temas noktası eklediğinde birim fiyat düşebilir. Hazır setlerden başla, adetleri istediğin gibi düzenle.
          </p>
        </div>

        <div className="no-scrollbar grid min-w-0 max-w-full auto-cols-[100%] grid-flow-col snap-x snap-mandatory gap-3 overflow-x-auto pb-1 md:grid-flow-row md:grid-cols-4 md:overflow-visible md:pb-0">
          {bundlePresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset.quantities)}
              className={`swipe-card border p-3 text-left transition hover:-translate-y-0.5 sm:p-4 ${
                preset.badge ? "border-zinc-950 bg-zinc-950 text-white shadow-lg shadow-zinc-950/15" : "border-zinc-200 bg-[#f7f3ed] text-zinc-950"
              }`}
            >
              <span className={preset.badge ? "text-[11px] font-black uppercase tracking-[0.18em] text-amber-300" : "text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500"}>
                {preset.eyebrow}
              </span>
              <span className="mt-2 block text-lg font-black tracking-[-0.03em]">{preset.name}</span>
              <span className={preset.badge ? "mt-1 block text-xs leading-5 text-zinc-300" : "mt-1 block text-xs leading-5 text-zinc-600"}>
                {preset.description}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-4 grid min-w-0 gap-2.5 sm:mt-5 sm:gap-3">
          {products.map((product) => (
            <article key={product.id} className="smooth-card grid min-w-0 grid-cols-[68px_minmax(0,1fr)] gap-3 border border-zinc-200 bg-[#fbfaf7] p-3 sm:grid-cols-[92px_minmax(0,1fr)_auto] sm:items-center sm:gap-4">
              <div className="relative h-20 overflow-hidden rounded-[1rem] bg-zinc-100 sm:h-20">
                <Image src={product.image} alt={product.imageAlt} fill sizes="92px" className="object-contain p-1" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-blue-700">
                    {product.badge}
                  </span>
                  <span className="text-xs font-bold text-zinc-500">{product.subtitle}</span>
                </div>
                <h3 className="mt-2 break-words text-xl font-black tracking-[-0.04em] text-zinc-950">{product.name}</h3>
                <p className="mt-1 hidden text-sm leading-5 text-zinc-600 sm:block">{product.hierarchy}</p>
                <div className="mt-2 flex min-w-0 flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-zinc-400 line-through">{formatPrice(product.oldPrice)}</span>
                  <strong className="text-sm text-zinc-950">{formatPrice(product.price)}</strong>
                  <span className="hidden text-[11px] font-black text-emerald-700 sm:inline">{product.saleBadge}</span>
                </div>
              </div>
              <div className="col-span-2 flex min-w-0 items-center justify-between gap-3 sm:col-auto sm:justify-end">
                <span className="min-w-0 text-xs font-black leading-5 text-emerald-700 sm:hidden">{product.saleBadge}</span>
                <div className="inline-grid h-12 grid-cols-[40px_48px_40px] items-center overflow-hidden rounded-full border border-zinc-200 bg-white">
                  <button type="button" className="h-full text-xl font-black" onClick={() => updateQuantity(product.slug, quantities[product.slug] - 1)} aria-label={`${product.name} azalt`}>
                    -
                  </button>
                  <span className="text-center text-sm font-black text-zinc-950">{quantities[product.slug]}</span>
                  <button type="button" className="h-full text-xl font-black" onClick={() => updateQuantity(product.slug, quantities[product.slug] + 1)} aria-label={`${product.name} artır`}>
                    +
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-4 sm:mt-5">
          <div className="sm:col-span-3">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Sık seçilen tamamlayıcılar</p>
          </div>
          <div className="no-scrollbar mt-3 grid min-w-0 max-w-full auto-cols-[100%] grid-flow-col snap-x snap-mandatory gap-3 overflow-x-auto pb-1 sm:grid-flow-row sm:grid-cols-2 sm:overflow-visible sm:pb-0 xl:grid-cols-4">
            {promotions.map((promotion) => (
              <article key={promotion.id} className="swipe-card overflow-hidden border border-zinc-200 bg-white shadow-sm">
                <div className="relative aspect-[4/3] bg-zinc-100">
                  <Image src={promotion.image} alt={promotion.imageAlt} fill sizes="(min-width: 640px) 30vw, 100vw" className="object-contain p-2" />
                  <span className="absolute left-3 top-3 rounded-full bg-amber-300 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-zinc-950">
                    {promotion.badge}
                  </span>
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="text-base font-black text-zinc-950">{promotion.name}</h3>
                  <p className="mt-1 min-h-10 text-xs leading-5 text-zinc-600">{promotion.description}</p>
                  <button
                    type="button"
                    onClick={() => addPromotionToCart(promotion.productSlug, promotion.quantity)}
                    className="mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-blue-700 px-4 text-xs font-black text-white"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Pakete ekle
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="min-w-0 space-y-4 lg:sticky lg:top-24 lg:self-start lg:space-y-6">
        <section className="smooth-card border border-zinc-200 bg-zinc-950 p-4 text-white shadow-xl shadow-zinc-950/15 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">Paketin</p>
          <div className="mt-4 space-y-3">
            {lines.length ? (
              lines.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-start justify-between gap-3 rounded-[1rem] bg-white/8 p-3">
                  <div>
                    <p className="text-sm font-black">{quantity} x {product.name}</p>
                    <p className="mt-1 text-xs text-zinc-400">{product.subtitle}</p>
                  </div>
                  <strong className="text-sm">{formatPrice(product.price * quantity)}</strong>
                </div>
              ))
            ) : (
              <p className="rounded-[1rem] border border-white/15 p-4 text-sm text-zinc-300">Henüz ürün seçmediniz.</p>
            )}
          </div>
          <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-sm">
            <div className="flex justify-between text-zinc-300">
              <span>Ara Toplam</span>
              <span>{formatPrice(pricing.subtotal)}</span>
            </div>
            <div className="flex justify-between text-emerald-300">
              <span>Çoklu Alım İndirimi</span>
              <span>-{formatPrice(pricing.discountAmount)}</span>
            </div>
            <div className="flex justify-between text-amber-300">
              <span>Çoklu alım avantajı</span>
              <span>{formatDiscountRate(pricing.discountRate)}</span>
            </div>
          </div>
          <div className="mt-4 rounded-[1.2rem] bg-white p-4 text-zinc-950">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
              {formatPrice(pricing.discountAmount)} tasarruf ettiniz
            </p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <span className="text-sm font-bold text-zinc-500">Toplam</span>
              <strong className="text-3xl font-black tracking-[-0.05em]">{formatPrice(pricing.total)}</strong>
            </div>
          </div>
          <button type="button" onClick={addCurrentPackageToCart} className="mt-4 min-h-12 w-full rounded-full bg-amber-300 text-sm font-black text-zinc-950 transition hover:-translate-y-0.5">
            Paketi Sepete Ekle
          </button>
          <a
            href={shopierCheckoutUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 flex min-h-12 items-center justify-center rounded-full border border-white/20 text-sm font-black text-white"
          >
            {directShopierProduct?.shopierUrl ? "Shopier'de Ürünü Aç" : "Shopier Mağazasına Git"}
          </a>
        </section>

        <section id="checkout" className="smooth-card scroll-mt-24 border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">Sipariş talebi</p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.05em] text-zinc-950 sm:text-3xl">Sipariş talebini oluştur.</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Siparişinizi WhatsApp&apos;tan netleştiriyoruz. Ödeme, teslimat ve kurulum bilgileri temsilcimiz tarafından paylaşılır.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="İşletme adı" error={errors.business}>
              <input value={fields.business} onChange={(event) => updateField("business", event.target.value)} placeholder="Örn. Biply Coffee" className="field-input" />
            </Field>
            <Field label="Telefon numaranız" error={errors.phone}>
              <input value={fields.phone} onChange={(event) => updateField("phone", event.target.value)} inputMode="tel" placeholder="05xx xxx xx xx" className="field-input" />
            </Field>
            <Field label="Sektör (opsiyonel)" error={errors.sector}>
              <select value={fields.sector} onChange={(event) => updateField("sector", event.target.value)} className="field-input">
                <option value="">Sektör seçin</option>
                <option>Kafe & restoran</option>
                <option>Klinik & güzellik</option>
                <option>Otel & konaklama</option>
                <option>Mağaza & showroom</option>
                <option>Oto servis</option>
                <option>Veteriner kliniği</option>
              </select>
            </Field>
            <Field label="Şehir (opsiyonel)" error={errors.city}>
              <input value={fields.city} onChange={(event) => updateField("city", event.target.value)} placeholder="İstanbul" className="field-input" />
            </Field>
          </div>

          <div className={`mt-4 rounded-[1.5rem] border p-4 ${hasPersonalizedProduct ? "border-amber-300 bg-amber-50" : "border-zinc-200 bg-[#fbfaf7]"}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-950">Kişiselleştirilmiş ürün yazısı</p>
              <span className="rounded-full bg-zinc-950 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white">
                Sabit şablon
              </span>
            </div>
            <p className="mt-1 text-xs font-bold leading-5 text-zinc-600">
              Bu alan Kişiselleştirilmiş Kare ve Kişiselleştirilmiş Mini içindir. Biply tasarımı sabit kalır; sadece ürünün üstündeki kısa kampanya metni yerleşir.
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Field label="Üst başlık (opsiyonel)" error={errors.customHeadline}>
                <input
                  value={fields.customHeadline}
                  onChange={(event) => updateField("customHeadline", event.target.value)}
                  placeholder="Google'da bize yorum yap"
                  className="field-input"
                />
              </Field>
              <Field label={hasPersonalizedProduct ? "Ürün üstü kampanya metni" : "Ürün üstü kampanya metni (opsiyonel)"} error={errors.customOffer}>
                <input
                  value={fields.customOffer}
                  onChange={(event) => updateField("customOffer", event.target.value)}
                  placeholder="Kahven bizden"
                  className="field-input"
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Kısa not (opsiyonel)" error={errors.customNotes}>
                  <textarea
                    value={fields.customNotes}
                    onChange={(event) => updateField("customNotes", event.target.value)}
                    placeholder="Sabit Biply şablonu içinde kullanılacak ikon veya küçük kampanya şartı..."
                    className="field-input min-h-28 py-3"
                  />
                </Field>
              </div>
            </div>
          </div>

          <button type="button" data-testid="mock-checkout" onClick={handleMockSubmit} className="mt-4 min-h-12 w-full rounded-full bg-zinc-950 text-sm font-black text-white">
            Sipariş özetini hazırla
          </button>
          <a
            data-testid="whatsapp-checkout"
            href={isValid ? whatsappUrl(orderMessage) : "#checkout"}
            onClick={() => setSubmitted(true)}
            className={`mt-3 flex min-h-12 items-center justify-center rounded-full border text-sm font-black ${
              isValid ? "border-emerald-600 text-emerald-700" : "border-zinc-200 text-zinc-400"
            }`}
          >
            Sipariş Notunu WhatsApp&apos;tan Gönder
          </a>
          <a
            href={isValid ? shopierCheckoutUrl : "#checkout"}
            target={isValid ? "_blank" : undefined}
            rel={isValid ? "noreferrer" : undefined}
            onClick={() => setSubmitted(true)}
            className={`mt-3 flex min-h-12 items-center justify-center rounded-full text-sm font-black ${
              isValid ? "bg-amber-300 text-zinc-950" : "bg-zinc-100 text-zinc-400"
            }`}
          >
            {directShopierProduct?.shopierUrl ? "Shopier'de Ürünü Aç" : "Shopier Mağazasına Git"}
          </a>
          <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[11px] font-bold text-zinc-500">
            <span>Sipariş teyidi</span>
            <span>Kurulum desteği</span>
            <span>Shopier ödeme</span>
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-zinc-600">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs font-bold text-red-600">{error}</span> : null}
    </label>
  );
}
