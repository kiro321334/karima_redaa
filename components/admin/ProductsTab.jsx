"use client";
import { useState } from "react";
import { imgUrl, isCld } from "@/lib/cld";
import { compressImage, uploadToCloudinary, deleteCld, uid } from "@/lib/upload";

const card = "rounded-2xl border border-wine/15 bg-white p-4";
const small =
  "rounded-full border border-wine/30 px-2.5 py-1 text-xs text-wine transition hover:bg-wine hover:text-white disabled:opacity-40";

export default function ProductsTab({ content, commit }) {
  const { products } = content;
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  async function add(e) {
    const files = [...e.target.files];
    e.target.value = "";
    if (!files.length) return;

    setBusy(true);
    setNote("");
    const done = [];
    let errMsg = "";
    try {
      for (let i = 0; i < files.length; i++) {
        setNote(`جاري رفع ${i + 1} من ${files.length}…`);
        const blob = await compressImage(files[i], 1200);
        const up = await uploadToCloudinary(blob, "image");
        done.push({ id: uid(), src: up.secure_url, alt: "Women scarf design" });
      }
    } catch (err) {
      errMsg = err.message || "حصل خطأ";
    }

    // اللي اترفع بنحفظه حتى لو حصل خطأ في صورة بعدها، عشان مفيش صور تفضل مرفوعة ومش ظاهرة
    if (done.length) {
      try {
        await commit((c) => ({ ...c, products: [...done, ...c.products] }));
      } catch (err) {
        errMsg = err.message || "فشل الحفظ";
      }
    }
    setNote(
      errMsg
        ? `${done.length ? `اتضافت ${done.length} صورة، وبعدين ` : ""}حصل خطأ: ${errMsg}`
        : `تمت إضافة ${done.length} صورة ✓`
    );
    setBusy(false);
  }

  function move(i, d) {
    const j = i + d;
    if (j < 0 || j >= products.length) return;
    commit((c) => {
      const a = [...c.products];
      [a[i], a[j]] = [a[j], a[i]];
      return { ...c, products: a };
    }).catch(() => {});
  }

  async function remove(p) {
    if (!window.confirm("مسح الصورة دي؟")) return;
    try {
      await commit((c) => ({ ...c, products: c.products.filter((x) => x.id !== p.id) }));
      await deleteCld(p.src).catch(() => {});
    } catch {}
  }

  function setAlt(p, alt) {
    const v = alt.trim();
    if (!v || v === p.alt) return;
    commit((c) => ({
      ...c,
      products: c.products.map((x) => (x.id === p.id ? { ...x, alt: v } : x)),
    })).catch(() => {});
  }

  return (
    <div className="grid grid-cols-1 gap-5">
      <section className={card}>
        <h2 className="text-sm font-bold text-wine">إضافة صور</h2>
        <p className="mt-1 text-xs text-neutral-500">
          تقدر تختار كذا صورة مرة واحدة. الصور بتتصغّر وتتضغط أوتوماتيك قبل الرفع عشان توفّر المساحة.
          الصور الجديدة بتظهر في الأول.
        </p>
        <label
          className={`mt-3 inline-block cursor-pointer rounded-full bg-wine px-5 py-2 text-sm text-white ${
            busy ? "pointer-events-none opacity-60" : ""
          }`}
        >
          {busy ? "استنى…" : "+ اختار صور"}
          <input type="file" accept="image/*" multiple onChange={add} disabled={busy} className="hidden" />
        </label>
        {note && <p className="mt-3 text-xs text-neutral-600">{note}</p>}
      </section>

      <h2 className="text-sm font-bold text-wine">صور المنتجات ({products.length})</h2>
      <p className="-mt-3 text-xs text-neutral-500">
        مسح صورة قديمة بيشيلها من الموقع بس، ومبيأثرش على أي استهلاك.
      </p>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {products.map((p, i) => (
          <li key={p.id} className={`${card} grid gap-2 p-3`}>
            <img
              src={isCld(p.src) ? imgUrl(p.src, 320) : p.src}
              alt={p.alt}
              loading="lazy"
              className="aspect-[4/5] w-full rounded-lg bg-neutral-100 object-contain"
            />
            <input
              defaultValue={p.alt}
              onBlur={(e) => setAlt(p, e.target.value)}
              aria-label="وصف الصورة"
              dir="auto"
              className="w-full rounded-lg border border-wine/15 px-2 py-1 text-[11px] outline-none focus:border-wine"
            />
            <div className="flex items-center justify-between gap-1">
              <div className="flex gap-1">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className={small} aria-label="قدّم">
                  →
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === products.length - 1}
                  className={small}
                  aria-label="أخّر"
                >
                  ←
                </button>
              </div>
              <button type="button" onClick={() => remove(p)} className={small}>
                مسح
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
