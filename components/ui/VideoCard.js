"use client";
import { useState } from "react";
import Image from "next/image";

export default function VideoCard({ p }) {
  const [on, setOn] = useState(false);

  return (
    <div>
      <div className="rounded-[26px] border-2 border-wine bg-cream p-[3px] shadow-sm">
        <div className="relative aspect-[10/18] overflow-hidden rounded-[22px] bg-ink">
          {on ? (
            <video
              src={p.video}
              poster={p.poster}
              controls
              autoPlay
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
            />
          ) : (
            <button
              type="button"
              onClick={() => setOn(true)}
              aria-label={`Play ${p.name} video`}
              className="group absolute inset-0 block h-full w-full text-left"
            >
              <Image
                src={p.poster}
                alt={`${p.name} ${p.category} UGC video by Karima Reda`}
                fill
                sizes="(min-width:768px) 33vw, 50vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-[#7a0f3a]/95 via-wine/40 to-wine/25" />

              <span className="absolute left-3 top-3 rounded-full bg-[#f6d9e0] px-3 py-1 text-[11px] font-bold tracking-[.12em] text-wine">
                {p.category.toUpperCase()}
              </span>

              <span className="ring absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-wine ring-4 ring-white/40 transition group-hover:scale-110">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="#fff"
                  aria-hidden="true"
                >
                  <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
                </svg>
              </span>

              <span className="absolute inset-x-4 bottom-4 block text-white">
                <span className="block font-serif text-lg font-bold">
                  {p.name}
                </span>
                <span className="block text-[13px] text-white/85">
                  {p.title}
                </span>
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between px-2 text-sm">
        <span className="font-medium">{p.name}</span>
        <span className="text-xs text-wine">{p.views}</span>
      </div>
    </div>
  );
}
