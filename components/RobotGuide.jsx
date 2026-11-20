"use client";
import { useEffect, useState } from "react";

const KEY = "robot-guide-closed";
const R = 96; // نصف قطر نص الدايرة
const ITEMS = [
  ["About", "about"],
  ["Videos", "projects"],
  ["Products", "products"],
  ["Services", "services"],
  ["Contact", "contact"],
];

function waLink(v) {
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  const d = String(v).replace(/\D/g, "");
  return d ? `https://wa.me/${d}` : "";
}

function Robot() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
      <line x1="32" y1="9" x2="32" y2="15" stroke="#a3174f" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32" cy="7" r="4" fill="#c9a24b" />
      <rect x="9" y="15" width="46" height="36" rx="14" fill="#a3174f" />
      <rect x="14" y="21" width="36" height="22" rx="9" fill="#fcf8f2" />
      <g className="rg-eyes">
        <ellipse cx="25" cy="32" rx="3.2" ry="4" fill="#2a1a1d" />
        <ellipse cx="39" cy="32" rx="3.2" ry="4" fill="#2a1a1d" />
      </g>
      <path d="M27 38.5c2.6 2.4 7.4 2.4 10 0" stroke="#a3174f" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="19" cy="38" r="2.6" fill="#f3e3e0" />
      <circle cx="45" cy="38" r="2.6" fill="#f3e3e0" />
      <rect x="3" y="28" width="6" height="12" rx="3" fill="#c9a24b" />
      <rect x="55" y="28" width="6" height="12" rx="3" fill="#c9a24b" />
    </svg>
  );
}

export default function RobotGuide({ whatsapp }) {
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [hello, setHello] = useState(true);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY)) return;
    } catch {}
    const t = setTimeout(() => setShow(true), 2500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const k = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);

  const close = () => {
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
    setShow(false);
    setOpen(false);
  };

  const go = (id) => {
    setOpen(false);
    if (id === "contact") {
      const w = waLink(whatsapp);
      if (w) {
        window.open(w, "_blank", "noopener,noreferrer");
        return;
      }
    }
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - 72,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  if (!show) return null;

  return (
    <div className="rg-root fixed bottom-36 right-3 z-40 print:hidden">
      <style>{`
        .rg-root{animation:rg-in .6s cubic-bezier(.2,1.3,.4,1) both}
        .rg-bot{animation:rg-float 3.2s ease-in-out infinite}
        .rg-eyes{transform-origin:32px 32px;animation:rg-blink 4s infinite}
        @keyframes rg-in{from{opacity:0;transform:translateX(80px)}to{opacity:1;transform:none}}
        @keyframes rg-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes rg-blink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
        @media (prefers-reduced-motion:reduce){.rg-root,.rg-bot,.rg-eyes{animation:none}}
      `}</style>

      <div className="relative h-16 w-16">
        {ITEMS.map(([label, id], i) => {
          const a = ((10 + i * 40) * Math.PI) / 180; // من فوق لتحت ناحية الشمال
          const x = -Math.sin(a) * R;
          const y = -Math.cos(a) * R;
          return (
            <button
              key={id}
              type="button"
              tabIndex={open ? 0 : -1}
              aria-hidden={!open}
              onClick={() => go(id)}
              style={{
                transform: open ? `translate(${x}px,${y}px) scale(1)` : "translate(0,0) scale(0)",
                transitionDelay: open ? `${i * 45}ms` : "0ms",
              }}
              className={`absolute left-1/2 top-1/2 -ml-[26px] -mt-[26px] grid h-[52px] w-[52px] place-items-center rounded-full border border-wine/25 bg-white text-[10px] font-semibold text-wine shadow-lg transition duration-300 ease-out hover:bg-wine hover:text-white ${
                open ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              {label}
            </button>
          );
        })}

        {hello && !open && (
          <div className="absolute bottom-full right-0 mb-3 w-52 rounded-2xl rounded-br-sm border border-wine/20 bg-white p-3 pr-7 text-[13px] leading-snug shadow-xl">
            Welcome! What would you like to know about me first?
            <button
              type="button"
              aria-label="Dismiss message"
              onClick={() => setHello(false)}
              className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full text-neutral-400 hover:text-wine"
            >
              ×
            </button>
          </div>
        )}

        <button
          type="button"
          aria-label={open ? "Close guide menu" : "Open guide menu"}
          aria-expanded={open}
          onClick={() => {
            setOpen((v) => !v);
            setHello(false);
          }}
          className="rg-bot relative h-16 w-16 rounded-full bg-white p-1.5 shadow-xl ring-2 ring-wine/30 transition hover:ring-wine"
        >
          <Robot />
        </button>
        <button
          type="button"
          aria-label="Hide guide"
          onClick={close}
          className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-ink text-[11px] leading-none text-white"
        >
          ×
        </button>
      </div>
    </div>
  );
}
