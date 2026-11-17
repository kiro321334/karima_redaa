export default function About({ t }) {
  return (
    <section id="about" className="mx-auto max-w-3xl px-6 py-16 text-center">
      <h2 className="reveal font-serif text-3xl font-bold">
        {t.intro} <em className="font-normal text-wine">{t.name}</em>
      </h2>
      <p className="reveal mt-4 text-sm leading-relaxed text-ink/80">
        {t.paragraph}
      </p>
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {t.stats.map(([n, l], i) => (
          <div key={`${l}-${i}`} className="card reveal text-center">
            <p className="font-serif text-3xl text-wine">{n}</p>
            <p className="text-xs">{l}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
