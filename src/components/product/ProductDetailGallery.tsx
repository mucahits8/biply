"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowIcon } from "@/components/icons";

type ProductDetailGalleryProps = {
  images: string[];
  productName: string;
  primaryAlt: string;
};

export function ProductDetailGallery({ images, productName, primaryAlt }: ProductDetailGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);

  function scrollTo(index: number) {
    const safeIndex = Math.max(0, Math.min(images.length - 1, index));
    const track = trackRef.current;

    setActiveIndex(safeIndex);
    if (track) {
      track.scrollTo({ left: safeIndex * track.clientWidth, behavior: "smooth" });
    }
  }

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
            <figure key={`${image}-${index}`} className="relative min-h-[410px] min-w-full snap-center overflow-hidden md:min-h-[600px]">
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
            </figure>
          ))}
        </div>

        <div className="absolute left-4 top-4 rounded-full bg-white/94 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-zinc-950 shadow-lg backdrop-blur">
          {activeIndex + 1} / {images.length}
        </div>
        <div className="absolute bottom-4 left-4 rounded-full bg-white/94 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-zinc-950 shadow-lg backdrop-blur">
          Kaydırarak incele
        </div>
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
    </div>
  );
}
