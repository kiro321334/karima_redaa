import Image from "next/image";
export default function Hero() {
  return (
    <section className="relative flex h-svh min-h-[560px] items-end overflow-hidden bg-ink text-white">
      <Image
        src="/karima.jpg"
        alt="Karima Reda, UGC creator and influencer in Cairo"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="hero-img object-cover object-[50%_20%]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-wine via-wine/55 to-wine/10" />
      <div className="absolute inset-x-0 top-[72px] px-4 md:px-12">
        <p className="fade-up flex w-full items-center gap-2 rounded-2xl border border-white/40 bg-white/15 px-4 py-3 text-[8px] font-semibold tracking-[.18em] backdrop-blur md:inline-flex md:w-auto md:rounded-full mt-4">
          <span className="h-3 w-[3px] shrink-0 bg-gold" />
          UGC CREATOR · INFLUENCER · CONTENT CREATOR
        </p>
      </div>
      <div className="relative w-full px-5 pb-6 md:mx-auto md:max-w-6xl md:px-12">
        <h2 className="fade-up d1 max-w-2xl font-serif text-[1.5rem] font-medium leading-[1.2] md:text-6xl">
          Your brand deserves content that doesn’t just look good — it{" "}
          <em className="underline decoration-1 underline-offset-4 text-[#f9ff00]">
            sells.
          </em>
        </h2>
        <p className="fade-up d2 mt-4 text-sm">
          <b>Karima Reda</b> | UGC Creator, Influencer & Content Creator
        </p>
        <div className="fade-up d3 mt-5 flex gap-3">
          <a
            href="#portfolio"
            className="flex-1 rounded-full bg-wine px-6 py-3.5 text-center text-sm font-medium shadow-lg ring-1 ring-white/20 transition hover:scale-[1.03] md:flex-none"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="flex-1 rounded-full bg-cream px-6 py-3.5 text-center text-sm font-medium text-ink transition hover:scale-[1.03] md:flex-none"
          >
            Contact Me
          </a>
        </div>
        <div className="fade-up d4 mt-5 flex items-center justify-between border-t border-white/30 pt-3 text-[11px]">
          <span className="tracking-widest text-gold" aria-label="5 stars">
            ★★★★★
          </span>
          <span>30+ Brands · Skincare · Perfume · Fashion · Food</span>
        </div>
        <div className="bob mt-1 text-center text-lg" aria-hidden>
          ⌄
        </div>
      </div>
    </section>
  );
}
