import SectionHeading from '@/components/ui/SectionHeading';
export default function Services({ items = [] }) {
  return (<section id="services" className="mx-auto max-w-5xl px-6 py-16">
    <SectionHeading eyebrow="Capabilities" a="What I" b="Create" sub="High-performing UGC & influencer formats tailored to elevate conversions" />
    <div className="card reveal mt-6 border-wine/40 bg-blush"><p className="text-sm font-semibold">Influencer Collaborations & Ambassadorship</p><p className="text-xs text-ink/70">Audience reach, co-created reels, stories & brand representation</p></div>
    <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
      {items.map(([i, t, d], k) => <div key={`${t}-${k}`} className="card reveal"><span aria-hidden>{i}</span><h3 className="mt-2 text-sm font-semibold">{t}</h3><p className="text-xs text-ink/70">{d}</p></div>)}
      <div className="card reveal col-span-2 md:col-span-3"><span aria-hidden>💡</span> <b className="text-sm">Creative Concepts & Storytelling</b><p className="text-xs text-ink/70">Full campaign ideation, moodboarding & angles</p></div>
    </div>
  </section>);
}
