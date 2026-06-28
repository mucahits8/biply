import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { Logo } from "@/components/brand/Logo";
import { ArrowIcon, CheckIcon, NfcIcon, QrIcon } from "@/components/icons";
import { products } from "@/data/catalog";
import { formatPrice } from "@/lib/format";

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

  return (
    <main className="min-h-screen bg-[#f7f3ed] px-4 py-5 text-zinc-950 md:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between">
          <Link href="/" aria-label="Biply ana sayfa"><Logo compact image /></Link>
          <Link href="/#urunler" className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-black">
            Ürünlere dön <ArrowIcon className="h-4 w-4 rotate-180" />
          </Link>
        </header>

        <section className="grid gap-8 rounded-[2.5rem] border border-white/80 bg-white/65 p-5 shadow-xl shadow-zinc-950/8 backdrop-blur md:grid-cols-[0.95fr_1.05fr] md:p-10">
          <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] bg-zinc-950 md:min-h-[520px]">
            <Image
              src={product.image}
              alt={product.imageAlt}
              fill
              priority
              sizes="(min-width: 768px) 48vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/45 via-transparent to-transparent" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-500">{product.eyebrow}</p>
            <h1 className="mt-3 text-5xl font-black tracking-[-0.075em] md:text-7xl">{product.name}</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-600">{product.description}</p>
            <div className="mt-6 flex items-end gap-3">
              <strong className="text-4xl font-black tracking-[-0.06em]">{formatPrice(product.price)}</strong>
              <span className="pb-1 text-sm font-bold text-zinc-500">başlangıç</span>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <AddToCartButton item={{ id: product.id, kind: "product", name: product.name, price: product.price }} className="w-full">
                Sepete ekle
              </AddToCartButton>
              <Link href="/#paketler" className="inline-flex min-h-12 items-center justify-center rounded-full border border-zinc-300 bg-white text-sm font-black">
                Pakette incele
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black tracking-[-0.05em]">NFC önce, QR yedek.</h2>
            <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-center">
              <div className="rounded-[1.5rem] bg-[#f7f3ed] p-5">
                <NfcIcon className="mx-auto h-16 w-16" />
                <p className="mt-3 text-sm font-black">Telefonunu dokundur</p>
              </div>
              <div className="h-24 w-px bg-zinc-200" />
              <div className="rounded-[1.5rem] bg-[#f7f3ed] p-5 opacity-75">
                <QrIcon className="mx-auto h-16 w-16" />
                <p className="mt-3 text-sm font-black">veya QR kodu tara</p>
              </div>
            </div>
          </div>
          <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black tracking-[-0.05em]">Ürün detayları</h2>
            <div className="mt-5 grid gap-3">
              {[...product.features, ...product.details].map((detail) => (
                <p key={detail} className="flex gap-3 rounded-2xl bg-[#f7f3ed] p-4 text-sm font-bold text-zinc-700">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0" />
                  <span>{detail}</span>
                </p>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
