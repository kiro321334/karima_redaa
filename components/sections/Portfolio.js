'use client';
import { useState } from 'react';
import SectionHeading from '@/components/ui/SectionHeading';
import VideoCard from '@/components/ui/VideoCard';
import { projects, categories } from '@/data/projects';
const LIMIT = 6;
export default function Portfolio() {
  const [tab, setTab] = useState('All');
  const [all, setAll] = useState(false);
  const list = projects.filter((p) => tab === 'All' || p.category === tab);
  const shown = all ? list : list.slice(0, LIMIT);
  return (<section id="portfolio" className="bg-blush px-6 py-16">
    <SectionHeading eyebrow="Portfolio" a="Selected" b="Work" sub="Tap any reel to play it and preview concept and engagement metrics" />
    <div className="mt-5 flex flex-wrap justify-center gap-2" role="tablist">
      {categories.map((c) => <button key={c} role="tab" aria-selected={tab === c} onClick={() => { setTab(c); setAll(false); }}
        className={`rounded-full px-5 py-2 text-sm transition ${tab === c ? 'bg-wine text-white' : 'bg-wine/10 text-wine hover:bg-wine/20'}`}>{c}</button>)}
    </div>
    <div className="mx-auto mt-8 grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-3">{shown.map((p) => <VideoCard key={p.id} p={p} />)}</div>
    {list.length > LIMIT && <div className="mt-8 text-center">
      <button type="button" aria-expanded={all} onClick={() => setAll(!all)} className="rounded-full border border-wine px-8 py-3 text-sm font-medium text-wine transition hover:bg-wine hover:text-white">
        {all ? 'Show less' : `Show more (${list.length - LIMIT})`}</button></div>}
  </section>);
}
