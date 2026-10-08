import SectionHeading from "@/components/ui/SectionHeading";
import { brandRows } from "@/data/content";
const seps = [
  <span key="a" className="text-wine">
    ✦
  </span>,
  <span key="b" className="h-1.5 w-1.5 rounded-full bg-gold" />,
  <span key="c" className="h-4 w-[3px] bg-wine" />,
];
function Row({ names, rev, off }) {
  const items = [...names, ...names, ...names, ...names];
  return (
    <div className="mask-x overflow-hidden">
      <div
        className={`marquee flex w-max items-center gap-8 ${rev ? "rev" : ""}`}
      >
        {items.map((n, i) => (
          <span
            key={i}
            className="flex items-center gap-8 whitespace-nowrap font-serif text-lg font-medium"
          >
            {n}
            {seps[(i + off) % 3]}
          </span>
        ))}
      </div>
    </div>
  );
}
export default function Brands() {
  return (
    <section aria-label="Brand collaborations" className="px-5 py-14">
      <SectionHeading eyebrow="Collaborations" a="Brands That" b="Trust Me" />
      <div className="mx-auto mt-8 grid max-w-3xl gap-4 rounded-2xl border border-gold/20 bg-[#f1e8da] py-5">
        {brandRows.map((r, i) => (
          <Row key={i} names={r} rev={i % 2 === 1} off={i} />
        ))}
      </div>
    </section>
  );
}
