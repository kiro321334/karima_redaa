export default function SectionHeading({ eyebrow, a, b, sub }) {
  return (<div className="text-center">
    <p className="text-[11px] font-bold uppercase tracking-[.25em] text-wine">{eyebrow}</p>
    <h2 className="mt-3 font-serif text-3xl font-bold md:text-4xl">{a} <em className="font-normal text-wine">{b}</em></h2>
    {sub && <p className="mx-auto mt-2 max-w-md text-sm text-ink/70">{sub}</p>}
  </div>);
}
