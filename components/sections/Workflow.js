import SectionHeading from '@/components/ui/SectionHeading';
import { steps } from '@/data/content';
export default function Workflow() {
  return (<section id="process" className="mx-auto max-w-md px-5 py-16 md:max-w-2xl">
    <SectionHeading eyebrow="Collaboration Workflow" a="How We" b="Work" sub="A seamless, client-first approach from concept to delivered reel" />
    <ol className="relative mt-8 grid gap-5">
      <span aria-hidden className="absolute bottom-6 left-[13px] top-6 border-l-2 border-dotted border-wine/40" />
      {steps.map(([t, d], i) => (<li key={t} className="reveal relative pl-12">
        <span className="absolute left-0 top-5 z-10 grid h-7 w-7 place-items-center rounded-full bg-wine text-xs font-semibold text-white ring-4 ring-cream">{i + 1}</span>
        <div className="relative rounded-2xl border border-wine/10 bg-paper p-5 shadow-sm">
          <span aria-hidden className="absolute right-4 top-3 font-serif text-2xl text-wine/30">0{i + 1}</span>
          <h3 className="font-serif text-base font-bold">{t}</h3><p className="mt-2 text-sm leading-relaxed text-ink/80">{d}</p></div>
      </li>))}
    </ol>
  </section>);
}
