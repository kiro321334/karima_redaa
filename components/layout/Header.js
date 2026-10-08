const links = ['about', 'services', 'portfolio', 'process', 'contact'];
export default function Header() {
  return (<header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between bg-cream/85 px-5 py-3 backdrop-blur md:px-12">
    <a href="#top" className="leading-tight"><span className="block font-serif text-lg font-bold">Karima Reda</span><span className="text-[11px] font-medium tracking-wide text-wine">UGC CREATOR · INFLUENCER</span></a>
    <nav aria-label="Main" className="hidden gap-8 text-sm md:flex">{links.map((s) => <a key={s} href={`#${s}`} className="capitalize hover:text-wine">{s}</a>)}</nav>
    <details className="relative md:hidden"><summary aria-label="Menu" className="cursor-pointer list-none text-2xl">☰</summary>
      <div className="absolute right-0 mt-3 grid w-40 gap-3 rounded-xl bg-ink p-4 text-sm text-white">{links.map((s) => <a key={s} href={`#${s}`} className="capitalize">{s}</a>)}</div></details>
  </header>);
}
