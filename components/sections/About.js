import { stats } from "@/data/content";
export default function About() {
  return (
    <section id="about" className="mx-auto max-w-3xl px-6 py-16 text-center">
      <h2 className="reveal font-serif text-3xl font-bold">
        Hi, I’m <em className="font-normal text-wine">Karima</em>
      </h2>
      <p className="reveal mt-4 text-sm leading-relaxed text-ink/80">
        I’m a UGC Creator, Influencer & Content Creator passionate about
        authentic, engaging content that helps brands connect with their
        audience. I create relatable, aesthetic, conversion-focused content —
        from skincare and beauty to fashion, lifestyle, and products — that
        people want to watch, trust, and remember. As an influencer, I also
        bring my own audience and a trusted voice to every campaign, so your
        product reaches real people who care. Let’s make your brand stand out.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map(([n, l]) => (
          <div key={l} className="card reveal text-center">
            <p className="font-serif text-3xl text-wine">{n}</p>
            <p className="text-xs">{l}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
