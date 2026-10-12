"use client";

import Image from "next/image";
import { useRef } from "react";

const products = [
  {
    src: "/products/product-01.webp",
    alt: "Women scarf design 1",
  },
  {
    src: "/products/product-02.webp",
    alt: "Women scarf design 2",
  },
  {
    src: "/products/product-03.webp",
    alt: "Women scarf design 3",
  },
  {
    src: "/products/product-04.webp",
    alt: "Women scarf design 4",
  },
  {
    src: "/products/product-05.webp",
    alt: "Women scarf design 5",
  },
  {
    src: "/products/product-06.webp",
    alt: "Women scarf design 6",
  },
  {
    src: "/products/product-07.webp",
    alt: "Women scarf design 7",
  },
  {
    src: "/products/product-08.webp",
    alt: "Women scarf design 8",
  },
  {
    src: "/products/product-09.webp",
    alt: "Women scarf design 9",
  },
  {
    src: "/products/product-10.webp",
    alt: "Women scarf design 10",
  },
  {
    src: "/products/product-11.webp",
    alt: "Women scarf design 11",
  },
  {
    src: "/products/product-12.webp",
    alt: "Women scarf design 12",
  },
  {
    src: "/products/product-13.webp",
    alt: "Women scarf design 13",
  },
  {
    src: "/products/product-14.webp",
    alt: "Women scarf design 14",
  },
  {
    src: "/products/product-15.webp",
    alt: "Women scarf design 15",
  },
  {
    src: "/products/product-16.webp",
    alt: "Women scarf design 16",
  },
  {
    src: "/products/product-17.webp",
    alt: "Women scarf design 17",
  },
  {
    src: "/products/product-18.webp",
    alt: "Women scarf design 18",
  },
  {
    src: "/products/product-19.webp",
    alt: "Women scarf design 19",
  },
  {
    src: "/products/product-20.webp",
    alt: "Women scarf design 20",
  },
  {
    src: "/products/product-21.webp",
    alt: "Women scarf design 21",
  },
  {
    src: "/products/product-22.webp",
    alt: "Women scarf design 22",
  },
  {
    src: "/products/product-23.webp",
    alt: "Women scarf design 23",
  },
  {
    src: "/products/product-24.webp",
    alt: "Women scarf design 24",
  },
  {
    src: "/products/product-25.webp",
    alt: "Women scarf design 25",
  },
  {
    src: "/products/product-26.webp",
    alt: "Women scarf design 26",
  },
  {
    src: "/products/product-27.webp",
    alt: "Women scarf design 27",
  },
  {
    src: "/products/product-28.webp",
    alt: "Women scarf design 28",
  },
  {
    src: "/products/product-29.webp",
    alt: "Women scarf design 29",
  },
  {
    src: "/products/product-30.webp",
    alt: "Women scarf design 30",
  },
  {
    src: "/products/product-31.webp",
    alt: "Women scarf design 31",
  },
  {
    src: "/products/product-32.webp",
    alt: "Women scarf design 32",
  },
];

export default function ProductShowcase() {
  const carouselRef = useRef(null);

  const scrollCarousel = (direction) => {
    if (!carouselRef.current) return;

    carouselRef.current.scrollBy({
      left: direction * carouselRef.current.clientWidth * 0.75,
      behavior: "smooth",
    });
  };

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
          {products.map((product, index) => (
            <div
              key={product.src}
              className="group w-[70%] shrink-0 snap-start sm:w-[46%] md:w-[31%] lg:w-[23%]"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-wine/10 bg-white shadow-sm transition duration-500 group-hover:-translate-y-1 group-hover:shadow-xl md:rounded-3xl">
                <Image
                  src={product.src}
                  alt={product.alt}
                  fill
                  sizes="(max-width: 640px) 76vw, (max-width: 768px) 46vw, (max-width: 1024px) 31vw, 23vw"
                  priority={index === 0}
                  className="object-contain p-4 transition-transform duration-500 group-hover:scale-105 md:p-5"
                />
              </div>
            </div>
          ))}
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
