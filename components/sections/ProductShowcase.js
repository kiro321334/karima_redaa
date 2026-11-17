"use client";

import Image from "next/image";
import { useRef } from "react";
import { imgUrl, isCld } from "@/lib/cld";

export default function ProductShowcase({ products = [] }) {
  const carouselRef = useRef(null);

  const scrollCarousel = (direction) => {
    if (!carouselRef.current) return;

    carouselRef.current.scrollBy({
      left: direction * carouselRef.current.clientWidth * 0.75,
      behavior: "smooth",
    });
  };

  if (!products.length) return null;

  return (
    <section
      id="products"
      aria-labelledby="products-heading"
      className="overflow-hidden bg-cream py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-8 flex items-center justify-between px-5 md:mb-12 md:px-12">
          <div>
            <h2
              id="products-heading"
              className="font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl md:text-5xl"
            >
              The Product <em className="font-normal text-wine">on amazon</em>
            </h2>
          </div>
        </div>

        {/* Products Carousel */}
        <div
          ref={carouselRef}
          dir="ltr"
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-5 pb-4 md:gap-5 md:px-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product, index) => {
            const remote = isCld(product.src);
            return (
              <div
                key={product.id || product.src}
                className="group w-[70%] shrink-0 snap-start sm:w-[46%] md:w-[31%] lg:w-[23%]"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-wine/10 bg-white shadow-sm transition duration-500 group-hover:-translate-y-1 group-hover:shadow-xl md:rounded-3xl">
                  <Image
                    src={remote ? imgUrl(product.src, 640) : product.src}
                    alt={product.alt}
                    fill
                    unoptimized={remote}
                    sizes="(max-width: 640px) 76vw, (max-width: 768px) 46vw, (max-width: 1024px) 31vw, 23vw"
                    priority={index === 0}
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-105 md:p-5"
                  />
                </div>
              </div>
            );
          })}
        </div>
        {/* Carousel Controls */}
        <div className="flex shrink-0 gap-2 mx-auto mt-6 w-max items-center justify-center md:mt-8">
          <button
            type="button"
            onClick={() => scrollCarousel(-1)}
            aria-label="Previous products"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-wine/20 text-wine transition hover:border-wine hover:bg-wine hover:text-white md:h-12 md:w-12"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => scrollCarousel(1)}
            aria-label="Next products"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-wine/20 text-wine transition hover:border-wine hover:bg-wine hover:text-white md:h-12 md:w-12"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
