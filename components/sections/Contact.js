import { site } from "@/lib/site";

const msg = encodeURIComponent(
  "Hi Karima, I’d like to collaborate on a UGC / influencer campaign for my brand."
);
const wa = `${site.whatsapp}?text=${msg}`;

const links = [
  ["Follow", "@karima-redaa", site.instagram],
  ["Watch", "TikTok Reel", site.tiktok],
  ["Inquiries", "Email Karima", `mailto:${site.email}`],
  ["Browse", "View My Work", "#portfolio"],
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="mx-3 mb-10 rounded-3xl bg-gradient-to-br from-wine to-ink px-6 py-14 text-center text-white md:mx-auto md:max-w-4xl"
    >
      <p className="text-[11px] uppercase tracking-[.3em] opacity-80">
        Let’s Connect
      </p>
      <h2 className="reveal mt-3 font-serif text-3xl md:text-4xl">
        Let’s create content that makes your brand <em>stand out.</em>
      </h2>
      <p className="mx-auto mt-4 max-w-md text-sm opacity-80">
        Available for UGC campaigns, influencer partnerships, monthly retained
        creative assets, and brand ambassadorships.
      </p>

      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-block rounded-full bg-cream px-10 py-3 text-sm font-semibold text-wine transition hover:scale-105"
      >
        💬 BOOK A COLLABORATION
      </a>
      <p className="mt-2 text-[11px] opacity-70">
        Chat with me directly on WhatsApp
      </p>

      <div className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-3 text-left text-xs">
        {links.map(([a, b, h]) => (
          <a
            key={b}
            href={h}
            {...(h.startsWith("http")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 transition hover:bg-white/20"
          >
            <span className="block opacity-70">{a}</span>
            <b className="text-sm">{b}</b>
          </a>
        ))}
      </div>
    </section>
  );
}