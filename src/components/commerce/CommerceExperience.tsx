"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useCart } from "@/components/commerce/CartProvider";
import { CheckIcon, PlusIcon } from "@/components/icons";
import { packages, upsells } from "@/data/catalog";
import { formatPrice, whatsappUrl } from "@/lib/format";

type CheckoutFields = {
  business: string;
  sector: string;
  phone: string;
  city: string;
};

const initialFields: CheckoutFields = {
  business: "",
  sector: "",
  phone: "",
  city: "",
};

function validate(fields: CheckoutFields) {
  const errors: Partial<Record<keyof CheckoutFields, string>> = {};

  if (fields.business.trim().length < 2) errors.business = "İşletme adını girin.";
  if (!fields.sector) errors.sector = "Sektör seçin.";
  if (!/^\+?[0-9\s()-]{10,}$/.test(fields.phone)) errors.phone = "Geçerli telefon girin.";
  if (fields.city.trim().length < 2) errors.city = "Şehir girin.";

  return errors;
}

export function CommerceExperience() {
  const { addItem, items, total, selectedPackage, openCart } = useCart();
  const [fields, setFields] = useState(initialFields);
  const [submitted, setSubmitted] = useState(false);
  const errors = submitted ? validate(fields) : {};
  const isValid = Object.keys(validate(fields)).length === 0 && items.length > 0;

  const orderMessage = useMemo(() => {
    const orderLines = items.map((item) => `- ${item.name} x${item.quantity}: ${formatPrice(item.price * item.quantity)}`);
    return [
      "Merhaba Biply, sipariş/teklif almak istiyorum.",
      `İşletme: ${fields.business || "-"}`,
      `Sektör: ${fields.sector || "-"}`,
      `Telefon: ${fields.phone || "-"}`,
      `Şehir: ${fields.city || "-"}`,
      "Seçimler:",
      ...orderLines,
      `Toplam: ${formatPrice(total)}`,
    ].join("\n");
  }, [fields, items, total]);

  function updateField(field: keyof CheckoutFields, value: string) {
    setFields((current) => ({ ...current, [field]: value }));
  }

  function handleMockSubmit() {
    setSubmitted(true);
    if (isValid) openCart();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <section id="paketler" className="scroll-mt-24 rounded-[2.3rem] border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">Paketler</p>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.055em] text-zinc-950 sm:text-5xl">İşletmene uygun paketi seç.</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600">Bir paket seç; sepet anında oluşsun, sonraki adımda temas noktalarını büyüt.</p>
        </div>
        <div className="grid gap-4">
          {packages.map((pack) => {
            const selected = selectedPackage?.id === pack.id;
            return (
              <article
                key={pack.id}
                data-testid={`package-card-${pack.slug}`}
                className={`relative rounded-[1.7rem] border p-5 transition ${
                  pack.badge ? "border-zinc-950 bg-zinc-950 text-white shadow-xl shadow-zinc-950/15" : "border-zinc-200 bg-[#fbfaf7] text-zinc-950"
                } ${selected ? "ring-4 ring-emerald-200" : ""}`}
              >
                {pack.badge ? (
                  <span className="absolute -top-3 left-5 rounded-full bg-blue-600 px-3 py-1 text-[11px] font-black text-white">{pack.badge}</span>
                ) : null}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-black tracking-[-0.05em]">{pack.name}</h3>
                    <p className={`mt-2 text-sm leading-6 ${pack.badge ? "text-zinc-300" : "text-zinc-600"}`}>{pack.description}</p>
                  </div>
                  <div className="text-right">
                    <strong className="block text-xl font-black">{formatPrice(pack.price)}</strong>
                    {!pack.quoteOnly ? <span className={pack.badge ? "text-xs text-zinc-300" : "text-xs text-zinc-500"}>’den başlayan</span> : null}
                  </div>
                </div>
                <ul className="mt-4 space-y-2 text-sm">
                  {pack.includes.map((item) => (
                    <li key={item} className="flex gap-2">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  data-testid={`add-package-${pack.slug}`}
                  onClick={() => addItem({ id: pack.id, kind: "package", name: `${pack.name} Paketi`, price: pack.price })}
                  className={`mt-5 min-h-12 w-full rounded-full text-sm font-black transition focus:outline-none focus:ring-4 ${
                    pack.badge ? "bg-white text-zinc-950 hover:bg-zinc-100 focus:ring-white/30" : "border border-zinc-300 bg-white hover:bg-zinc-950 hover:text-white focus:ring-zinc-200"
                  }`}
                >
                  {pack.quoteOnly ? "Teklif al" : selected ? "Sepette" : "Paketimi oluştur"}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <div className="space-y-6">
        <section id="ek-urunler" className="scroll-mt-24 rounded-[2.3rem] border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">Ek temas noktaları</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.055em] text-zinc-950">Paketini işletmenin temas sistemine çevir.</h2>
          </div>

          <div className="rounded-[1.5rem] border border-zinc-200 bg-[#fbfaf7] p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-zinc-500">Seçilen paket</span>
              <strong className="text-zinc-950">{selectedPackage?.name ?? "Henüz seçilmedi"}</strong>
            </div>
            <div className="mt-3 flex items-end justify-between border-t border-zinc-200 pt-3">
              <span className="text-sm font-bold text-zinc-500">Toplam</span>
              <strong className="text-2xl font-black tracking-[-0.05em] text-zinc-950">{formatPrice(total)}</strong>
            </div>
          </div>

          <p className="mt-5 text-sm font-bold text-zinc-950">İhtiyacına göre ek ürün seç.</p>
          <p className="mt-1 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">Paketle birlikte daha avantajlı</p>

          <div className="mt-4 space-y-3">
            {upsells.map((upsell) => (
              <article key={upsell.id} className="grid grid-cols-[56px_1fr_auto] items-center gap-3 rounded-[1.3rem] border border-zinc-200 bg-[#fbfaf7] p-3">
                <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-zinc-100">
                  <Image src={upsell.image} alt={upsell.imageAlt} fill sizes="56px" className="object-cover" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-zinc-950">+ {upsell.name}</h3>
                  <p className="text-xs text-zinc-500">{upsell.description}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs">
                    <span className="text-zinc-400 line-through">{formatPrice(upsell.oldPrice)}</span>
                    <strong className="text-zinc-950">{formatPrice(upsell.price)}</strong>
                  </div>
                </div>
                <button
                  type="button"
                  data-testid={`add-extra-${upsell.slug}`}
                  onClick={() => addItem({ id: upsell.id, kind: "upsell", name: upsell.name, price: upsell.price })}
                  className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                  aria-label={`${upsell.name} sepete ekle`}
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </article>
            ))}
          </div>
        </section>

        <section id="checkout" className="scroll-mt-24 rounded-[2.3rem] border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">Sipariş bilgileri</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.055em] text-zinc-950">İşletmenizin müşterileri bir dokunuş uzağında.</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">Güvenli sipariş özetiyle ilerleyin; istersen WhatsApp’tan hızlı teklif alın.</p>
          </div>

          <div className="space-y-3">
            <Field label="İşletme adı" error={errors.business}>
              <input value={fields.business} onChange={(event) => updateField("business", event.target.value)} placeholder="Örn. Biply Coffee" className="field-input" />
            </Field>
            <Field label="Sektör" error={errors.sector}>
              <select value={fields.sector} onChange={(event) => updateField("sector", event.target.value)} className="field-input">
                <option value="">Sektör seçin</option>
                <option>Kafe & restoran</option>
                <option>Klinik & güzellik</option>
                <option>Otel & konaklama</option>
                <option>Mağaza & showroom</option>
              </select>
            </Field>
            <Field label="Telefon numaranız" error={errors.phone}>
              <input value={fields.phone} onChange={(event) => updateField("phone", event.target.value)} inputMode="tel" placeholder="05xx xxx xx xx" className="field-input" />
            </Field>
            <Field label="Şehir" error={errors.city}>
              <input value={fields.city} onChange={(event) => updateField("city", event.target.value)} placeholder="İstanbul" className="field-input" />
            </Field>
          </div>

          <button type="button" data-testid="mock-checkout" onClick={handleMockSubmit} className="mt-4 min-h-12 w-full rounded-full bg-zinc-950 text-sm font-black text-white">
            Sipariş özetini oluştur
          </button>
          <div className="my-4 flex items-center gap-3 text-xs font-bold text-zinc-400">
            <span className="h-px flex-1 bg-zinc-200" /> veya <span className="h-px flex-1 bg-zinc-200" />
          </div>
          <a
            data-testid="whatsapp-checkout"
            href={isValid ? whatsappUrl(orderMessage) : "#checkout"}
            onClick={() => setSubmitted(true)}
            className={`flex min-h-12 items-center justify-center rounded-full border text-sm font-black ${
              isValid ? "border-emerald-500 text-emerald-700" : "border-zinc-200 text-zinc-400"
            }`}
          >
            WhatsApp’tan hızlı teklif al
          </a>
          <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[11px] font-bold text-zinc-500">
            <span>KVKK uyumlu</span>
            <span>7/24 destek</span>
            <span>%100 memnuniyet</span>
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
