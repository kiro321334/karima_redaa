"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/upload";

const ID = process.env.NEXT_PUBLIC_CLARITY_ID;
const base = ID ? `https://clarity.microsoft.com/projects/view/${ID}` : "";
const LINKS = [
  ["Dashboard", "كل الأرقام والفلاتر والتواريخ", "dashboard"],
  ["Heatmaps", "الزوار بيضغطوا فين وبينزلوا لحد فين", "heatmaps"],
  ["Recordings", "شاهد جلسات الزوار الحقيقية", "impressions"],
  ["Settings", "إضافة أعضاء وحجب IP وإعدادات الكوكيز", "settings"],
];
const box = "rounded-2xl border border-wine/15 bg-white p-4";

function List({ title, rows }) {
  const max = Math.max(1, ...rows.map((r) => r.sessions));
  return (
    <div className={box}>
      <h3 className="mb-3 text-sm font-bold text-wine">{title}</h3>
      <ul className="grid gap-2.5">
        {rows.map((r) => (
          <li key={r.label} className="text-xs">
            <div className="flex justify-between gap-3">
              <span className="truncate" dir="auto">
                {r.label}
              </span>
              <span className="tabular-nums text-neutral-500">{r.sessions}</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-neutral-200">
              <div className="h-full rounded-full bg-wine" style={{ width: `${(r.sessions / max) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AnalyticsTab() {
  const [d, setD] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    api("/api/analytics", null, "GET")
      .then((j) => alive && setD(j))
      .catch((e) => alive && setErr(e.message || "فشل التحميل"));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="grid grid-cols-1 gap-5">
      <div>
        <h2 className="font-serif text-xl text-wine">الزوار: آخر 3 أيام</h2>
        <p className="mt-1 text-xs text-neutral-500">
          الأرقام بتتحدّث مرتين في اليوم (حد Microsoft Clarity)، وبتشمل بس الزوار اللي وافقوا على الكوكيز.
          للتواريخ الأقدم والـ Heatmaps والتسجيلات استخدم الأزرار تحت.
        </p>
      </div>

      {err && <div className={`${box} text-xs text-red-600`}>{err}</div>}
      {!d && !err && <p className="text-xs text-neutral-500">جاري التحميل…</p>}

      {d &&
        (d.totals.sessions === 0 ? (
          <div className={`${box} text-xs text-neutral-500`}>
            لسه مفيش زيارات متسجلة. الأرقام بتظهر هنا تلقائياً لما Clarity يخلص معالجة أول الزيارات.
          </div>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["الزيارات (Sessions)", d.totals.sessions],
                ["زوار فريدين", d.totals.users],
                ["زيارات بوتات (مستبعدة)", d.totals.bots],
              ].map(([t, v]) => (
                <div key={t} className={box}>
                  <p className="text-xs text-neutral-500">{t}</p>
                  <p className="mt-1 text-3xl font-bold tabular-nums" dir="ltr">
                    {v}
                  </p>
                </div>
              ))}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {d.country && <List title="الدول" rows={d.country} />}
              {d.device && <List title="الأجهزة" rows={d.device} />}
              {d.source && <List title="مصادر الزيارات" rows={d.source} />}
              {d.pages && <List title="أكتر الصفحات زيارة" rows={d.pages} />}
            </div>
            {[d.country, d.device, d.source, d.pages].some((x) => !x) && (
              <p className="text-[11px] text-neutral-500">
                بعض التفاصيل لسه بتتعالج في Clarity وهتظهر هنا تلقائياً. تقدر تشوفها دلوقتي من الأزرار تحت.
              </p>
            )}
          </>
        ))}

      <div>
        <h3 className="mb-3 text-sm font-bold text-wine">افتح في Microsoft Clarity</h3>
        {!ID ? (
          <p className="text-xs text-neutral-500">ضيف NEXT_PUBLIC_CLARITY_ID في إعدادات الاستضافة.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {LINKS.map(([t, desc, p]) => (
              <a
                key={p}
                href={`${base}/${p}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`${box} transition hover:border-wine`}
              >
                <p className="font-bold" dir="ltr">
                  {t} ↗
                </p>
                <p className="mt-1 text-xs text-neutral-500">{desc}</p>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
