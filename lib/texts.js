// النصوص الافتراضية (هي نفس النصوص الحالية في الموقع) + دمج اللي العميلة عدّلته من الـ dashboard
import { stats, brandRows, services, steps } from "@/data/content";

export const defaultTexts = {
  hero: {
    badge: "UGC CREATOR · INFLUENCER · CONTENT CREATOR",
    headline: "Your brand deserves content that doesn’t just look good — it",
    highlight: "sells.",
    name: "Karima Reda",
    role: "UGC Creator, Influencer & Content Creator",
    line: "30+ Brands · Skincare · Perfume · Fashion · Food",
    image: "", // فاضي = الصورة الأصلية /profile.jpeg
  },
  about: {
    intro: "Hi, I’m",
    name: "Karima",
    paragraph:
      "I’m a UGC Creator, Influencer & Content Creator passionate about authentic, engaging content that helps brands connect with their audience. I create relatable, aesthetic, conversion-focused content — from skincare and beauty to fashion, lifestyle, and products — that people want to watch, trust, and remember. As an influencer, I also bring my own audience and a trusted voice to every campaign, so your product reaches real people who care. Let’s make your brand stand out.",
    stats,
  },
  brands: brandRows,
  services,
  steps,
  // فاضي = القيمة الأصلية من lib/site.js
  contact: { whatsapp: "", instagram: "", tiktok: "", email: "" },
};

const isStr = (v) => typeof v === "string";
const rows = (v, n) =>
  Array.isArray(v) && v.every((r) => Array.isArray(r) && r.length >= n && r.slice(0, n).every(isStr));

function obj(saved, base) {
  const out = { ...base };
  if (saved && typeof saved === "object") {
    for (const k of Object.keys(base)) if (isStr(saved[k])) out[k] = saved[k];
  }
  return out;
}

export function mergeTexts(saved) {
  const s = saved && typeof saved === "object" ? saved : {};
  const d = defaultTexts;
  return {
    hero: obj(s.hero, d.hero),
    about: {
      ...obj(s.about, { intro: d.about.intro, name: d.about.name, paragraph: d.about.paragraph }),
      stats: rows(s.about?.stats, 2) ? s.about.stats : d.about.stats,
    },
    brands:
      Array.isArray(s.brands) && s.brands.every((r) => Array.isArray(r) && r.every(isStr))
        ? s.brands
        : d.brands,
    services: rows(s.services, 3) ? s.services : d.services,
    steps: rows(s.steps, 2) ? s.steps : d.steps,
    contact: obj(s.contact, d.contact),
  };
}
