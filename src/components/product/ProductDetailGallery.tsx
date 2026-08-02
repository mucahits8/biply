"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowIcon } from "@/components/icons";

type ProductDetailGalleryProps = {
  images: string[];
  productName: string;
  primaryAlt: string;
};

export function ProductDetailGallery({ images, productName, primaryAlt }: ProductDetailGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const scrollTo = useCallback((index: number) => {
    const safeIndex = Math.max(0, Math.min(images.length - 1, index));
    const track = trackRef.current;

    setActiveIndex(safeIndex);
    if (track) {
      track.scrollTo({ left: safeIndex * track.clientWidth, behavior: "smooth" });
    }
  }, [images.length]);

  useEffect(() => {
    if (!isLightboxOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsLightboxOpen(false);
      if (event.key === "ArrowLeft") scrollTo(activeIndex - 1);
      if (event.key === "ArrowRight") scrollTo(activeIndex + 1);
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, isLightboxOpen, scrollTo]);

  function handleScroll() {
    const track = trackRef.current;
    if (!track) return;
    const nextIndex = Math.round(track.scrollLeft / track.clientWidth);
    setActiveIndex(Math.max(0, Math.min(images.length - 1, nextIndex)));
  }

  return (
    <div className="min-w-0">
      <div className="relative overflow-hidden rounded-[1.8rem] bg-zinc-950">
        <div ref={trackRef} onScroll={handleScroll} className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto">
          {images.map((image, index) => (
            <figure key={`${image}-${index}`} className="relative min-h-[320px] min-w-full snap-center overflow-hidden sm:min-h-[410px] md:min-h-[600px]">
              <Image
                src={image}
                alt=""
                fill
                sizes="(min-width: 1024px) 56vw, 100vw"
                className="scale-110 object-cover opacity-35 blur-2xl"
              />
              <Image
                src={image}
                alt={index === 0 ? primaryAlt : `${productName} kullanım görseli ${index + 1}`}
                fill
                preload={index === 0}
                sizes="(min-width: 1024px) 56vw, 100vw"
                className="object-contain p-3"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/48 via-zinc-950/5 to-transparent" />
              <button
                type="button"
                onClick={() => {
                  setActiveIndex(index);
                  setIsLightboxOpen(true);
                }}
                className="absolute inset-0"
                aria-label={`${productName} görselini büyüt`}
              />
            </figure>
          ))}
        </div>

        <div className="absolute left-4 top-4 rounded-full bg-white/94 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-zinc-950 shadow-lg backdrop-blur">
          {activeIndex + 1} / {images.length}
        </div>
        <div className="absolute bottom-4 left-4 rounded-full bg-white/94 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-zinc-950 shadow-lg backdrop-blur">
          Kaydırarak incele
        </div>
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          className="absolute left-4 top-16 rounded-full bg-amber-300 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-zinc-950 shadow-lg transition hover:-translate-y-0.5"
        >
          Büyüt
        </button>
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            type="button"
            onClick={() => scrollTo(activeIndex - 1)}
            className="grid h-11 w-11 place-items-center rounded-full bg-white/94 text-zinc-950 shadow-lg backdrop-blur transition hover:-translate-y-0.5"
            aria-label="Önceki görsel"
          >
            <ArrowIcon className="h-5 w-5 rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => scrollTo(activeIndex + 1)}
            className="grid h-11 w-11 place-items-center rounded-full bg-white/94 text-zinc-950 shadow-lg backdrop-blur transition hover:-translate-y-0.5"
            aria-label="Sonraki görsel"
          >
            <ArrowIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
        {images.map((image, index) => (
          <button
            key={`thumb-${image}-${index}`}
            type="button"
            onClick={() => scrollTo(index)}
            className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-[1rem] border bg-zinc-100 transition ${
              activeIndex === index ? "border-zinc-950 ring-2 ring-zinc-950/10" : "border-zinc-200 opacity-70 hover:opacity-100"
            }`}
            aria-label={`${productName} görsel ${index + 1}`}
          >
            <Image src={image} alt={`${productName} küçük görsel ${index + 1}`} fill sizes="80px" className="object-contain p-1" />
          </button>
        ))}
      </div>

      {isLightboxOpen ? (
        <div className="fixed inset-0 z-[80] bg-zinc-950/94 p-3 text-white backdrop-blur" role="dialog" aria-modal="true" aria-label={`${productName} büyük galeri`}>
          <button type="button" onClick={() => setIsLightboxOpen(false)} className="absolute inset-0 cursor-zoom-out" aria-label="Büyük görseli kapat" />
          <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col">
            <div className="flex items-center justify-between gap-3 py-2">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">Büyük galeri</p>
                <p className="mt-1 text-sm font-bold text-zinc-300">
                  {productName} · {activeIndex + 1} / {images.length}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="rounded-full bg-white px-4 py-2 text-sm font-black text-zinc-950"
              >
                Kapat
              </button>
            </div>
            <div className="relative min-h-0 flex-1 overflow-hidden rounded-[1.5rem] bg-white/5">
              <Image
                src={images[activeIndex]}
                alt={activeIndex === 0 ? primaryAlt : `${productName} büyük görsel ${activeIndex + 1}`}
                fill
                sizes="100vw"
                className="object-contain p-3 md:p-5"
              />
              <button
                type="button"
                onClick={() => scrollTo(activeIndex - 1)}
                className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/92 text-zinc-950 shadow-xl"
                aria-label="Önceki büyük görsel"
              >
                <ArrowIcon className="h-5 w-5 rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => scrollTo(activeIndex + 1)}
                className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/92 text-zinc-950 shadow-xl"
                aria-label="Sonraki büyük görsel"
              >
                <ArrowIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
