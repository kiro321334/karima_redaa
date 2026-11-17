"use client";
import { useEffect, useRef, useState } from "react";
import { imgUrl, isCld } from "@/lib/cld";
import {
  MAX_VIDEO_MB,
  compressImage,
  captureFrame,
  uploadToCloudinary,
  deleteCld,
  uid,
} from "@/lib/upload";

const input =
  "w-full rounded-xl border border-wine/20 bg-white px-3 py-2 text-sm outline-none focus:border-wine";
const card = "rounded-2xl border border-wine/15 bg-white p-4";
const small =
  "rounded-full border border-wine/30 px-3 py-1.5 text-xs text-wine transition hover:bg-wine hover:text-white disabled:opacity-40";

// الفيديو القديم متخزّن على Vercel (/videos/..)، والجديد على Cloudinary
const where = (p) => (isCld(p.video) ? "Cloudinary" : "Vercel");

// صورة مصغّرة صغيرة: الفيديو القديم بيتجاب من Vercel (أول فريم)، والجديد بنعرض غلافه بدون ما نحمّل الفيديو
function Thumb({ p, onPlay }) {
  const cld = isCld(p.video);
  const box = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    if (cld) return;
    const el = box.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVis(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [cld]);

  const poster = p.poster || "";
  return (
    <button
      ref={box}
      type="button"
      onClick={onPlay}
      aria-label={`تشغيل ${p.name}`}
      className="relative h-28 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-800 sm:h-32 sm:w-[4.5rem]"
    >
      {cld ? (
        poster && (
          <img
            src={isCld(poster) ? imgUrl(poster, 200) : poster}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        )
      ) : (
        vis && (
          <video
            src={`${p.video}#t=0.1`}
            muted
            playsInline
            preload="metadata"
            tabIndex={-1}
            className="h-full w-full object-cover"
          />
        )
      )}
      <span className="absolute inset-0 grid place-items-center bg-black/25">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-white/90 text-[10px] text-wine">▶</span>
      </span>
    </button>
  );
}

// مشغّل بحجم محدود (مش بيملا الشاشة)
function Player({ p, onClose }) {
  useEffect(() => {
    const k = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={p.name}
      onClick={onClose}
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"
    >
      <div onClick={(e) => e.stopPropagation()} className="flex max-h-full flex-col items-center gap-3">
        <div
          className="overflow-hidden rounded-2xl bg-black"
          style={{ height: "min(70dvh, 560px)", aspectRatio: "9 / 16", maxWidth: "calc(100vw - 2rem)" }}
        >
          <video
            src={p.video}
            poster={isCld(p.poster) ? imgUrl(p.poster, 480) : undefined}
            controls
            autoPlay
            playsInline
            preload="metadata"
            className="h-full w-full object-contain"
          />
        </div>
        <div className="flex items-center gap-3 text-xs text-white">
          <span dir="auto" className="max-w-[12rem] truncate">
            {p.name} · {where(p)}
          </span>
          <button type="button" onClick={onClose} className="rounded-full bg-white px-4 py-1.5 text-wine">
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VideosTab({ content, commit }) {
  const { projects, categories } = content;
  const cats = categories.filter((c) => c !== "All");

  const [editing, setEditing] = useState(null); // null | "new" | id
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [msg, setMsg] = useState("");
  const [newCat, setNewCat] = useState("");
  const [catMsg, setCatMsg] = useState("");
  const [preview, setPreview] = useState(null);

  const current = editing && editing !== "new" ? projects.find((p) => p.id === editing) : null;

  function move(i, d) {
    const j = i + d;
    if (j < 0 || j >= projects.length) return;
    commit((c) => {
      const a = [...c.projects];
      [a[i], a[j]] = [a[j], a[i]];
      return { ...c, projects: a };
    }).catch(() => {});
  }

  async function remove(p) {
    if (!window.confirm(`مسح "${p.name}"؟`)) return;
    try {
      await commit((c) => ({ ...c, projects: c.projects.filter((x) => x.id !== p.id) }));
      // الملفات الجديدة بتتمسح من Cloudinary عشان المساحة ترجع (القديمة على GitHub مبتتلمسش)
      await Promise.allSettled([deleteCld(p.video), deleteCld(p.poster)]);
    } catch {}
  }

  async function submit(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") || "").trim();
    const title = String(f.get("title") || "").trim() || name;
    const category = String(f.get("category") || "");
    const views = String(f.get("views") || "").trim();
    const vfile = f.get("video");
    const pfile = f.get("poster");
    const hasV = vfile && vfile.size > 0;
    const hasP = pfile && pfile.size > 0;

    setMsg("");
    if (!name) return setMsg("اكتب اسم المشروع.");
    if (!current && !hasV) return setMsg("اختار ملف الفيديو.");
    if (hasV && vfile.size > MAX_VIDEO_MB * 1024 * 1024) {
      return setMsg(`الفيديو أكبر من ${MAX_VIDEO_MB}MB. صدّره بجودة 720p وجرّب تاني.`);
    }

    setBusy(true);
    setProgress(0);
    const uploaded = []; // لو حصل خطأ نمسحهم عشان ميفضلوش ياكلوا مساحة
    try {
      let video = current?.video;
      let poster = current?.poster || "/profile.jpeg";
      const replaced = [];
      let frame = null;

      if (hasV) {
        frame = await captureFrame(vfile);
        if (
          !frame &&
          !window.confirm(
            "المتصفح مقدرش يقرا الفيديو ده، غالباً مش MP4 (H.264) وممكن ميشتغلش عند الزوار. ترفعه برضو؟"
          )
        ) {
          return;
        }
        const up = await uploadToCloudinary(vfile, "video", setProgress);
        uploaded.push(up.secure_url);
        replaced.push(current?.video);
        video = up.secure_url;
      }

      if (hasP || frame) {
        const blob = hasP ? await compressImage(pfile, 900) : frame;
        const up = await uploadToCloudinary(blob, "image");
        uploaded.push(up.secure_url);
        replaced.push(current?.poster);
        poster = up.secure_url;
      }

      const item = { id: current?.id || uid(), name, title, category, views, video, poster };
      await commit((c) => ({
        ...c,
        projects: current
          ? c.projects.map((p) => (p.id === current.id ? item : p))
          : [item, ...c.projects],
      }));

      await Promise.allSettled(replaced.filter(Boolean).map((u) => deleteCld(u)));
      setEditing(null);
    } catch (err) {
      await Promise.allSettled(uploaded.map((u) => deleteCld(u)));
      setMsg(err.message || "حصل خطأ");
    } finally {
      setBusy(false);
    }
  }

  function addCat() {
    const c = newCat.trim();
    setCatMsg("");
    if (!c || c.toLowerCase() === "all") return;
    if (categories.includes(c)) return setCatMsg("القسم ده موجود.");
    commit((x) => ({ ...x, categories: [...x.categories, c] })).catch(() => {});
    setNewCat("");
  }

  function removeCat(c) {
    setCatMsg("");
    if (projects.some((p) => p.category === c)) {
      return setCatMsg(`في فيديوهات جوه قسم "${c}"، انقلها لقسم تاني الأول.`);
    }
    commit((x) => ({ ...x, categories: x.categories.filter((k) => k !== c) })).catch(() => {});
  }

  return (
    <div className="grid grid-cols-1 gap-5">
      <section className={card}>
        <h2 className="text-sm font-bold text-wine">أقسام الفيديوهات</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {cats.map((c) => (
            <span key={c} className="flex items-center gap-1 rounded-full bg-wine/10 px-3 py-1 text-xs text-wine">
              {c}
              <button
                type="button"
                onClick={() => removeCat(c)}
                aria-label={`مسح قسم ${c}`}
                className="px-1 text-sm leading-none hover:text-red-600"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="قسم جديد (مثلاً Home)"
            className={`${input} min-w-0 flex-1`}
            dir="auto"
          />
          <button type="button" onClick={addCat} className={`${small} shrink-0`}>
            إضافة
          </button>
        </div>
        {catMsg && <p className="mt-2 text-xs text-red-600">{catMsg}</p>}
      </section>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-wine">الفيديوهات ({projects.length})</h2>
        {!editing && (
          <button
            type="button"
            onClick={() => {
              setMsg("");
              setEditing("new");
            }}
            className="rounded-full bg-wine px-5 py-2 text-sm text-white"
          >
            + إضافة فيديو
          </button>
        )}
      </div>

      {editing && (
        <form key={editing} onSubmit={submit} className={`${card} grid gap-3`}>
          <h3 className="text-sm font-bold">{current ? `تعديل: ${current.name}` : "فيديو جديد"}</h3>

          {current && (
            <div className="flex items-center gap-3 rounded-xl bg-blush p-3 text-xs">
              <Thumb p={current} onPlay={() => setPreview(current)} />
              <div>
                <p className="font-medium">الفيديو الحالي</p>
                <p className="mt-0.5 text-neutral-600">مخزّن على {where(current)}. اضغط على الصورة للتشغيل.</p>
              </div>
            </div>
          )}

          <label className="grid gap-1 text-xs">
            اسم المشروع / البراند
            <input name="name" defaultValue={current?.name || ""} className={input} dir="auto" />
          </label>
          <label className="grid gap-1 text-xs">
            العنوان الفرعي (اختياري)
            <input name="title" defaultValue={current?.title || ""} className={input} dir="auto" />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-xs">
              القسم
              <select name="category" defaultValue={current?.category || cats[0] || ""} className={input}>
                {current?.category && !cats.includes(current.category) && (
                  <option value={current.category}>{current.category}</option>
                )}
                {cats.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-xs">
              المشاهدات (مثلاً 25K)
              <input name="views" defaultValue={current?.views || ""} className={input} dir="ltr" />
            </label>
          </div>

          <label className="grid gap-1 text-xs">
            {current ? "استبدال الفيديو (اختياري)" : "ملف الفيديو"}
            <input
              type="file"
              name="video"
              accept="video/mp4,video/webm,video/quicktime"
              className={input}
            />
            <span className="text-neutral-500">
              MP4 أفضل صيغة، وبحد أقصى {MAX_VIDEO_MB}MB. صدّره بجودة 720p عشان يوفّر من الاستهلاك.
            </span>
          </label>
          <label className="grid gap-1 text-xs">
            صورة الغلاف (اختياري)
            <input type="file" name="poster" accept="image/*" className={input} />
            <span className="text-neutral-500">لو سبتها فاضية، بناخد لقطة من الفيديو تلقائياً.</span>
          </label>

          {busy && (
            <div>
              <div className="h-2 overflow-hidden rounded-full bg-neutral-200">
                <div
                  className="h-full rounded-full bg-wine transition-all"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-neutral-500">جاري الرفع… {Math.round(progress * 100)}%</p>
            </div>
          )}
          {msg && <p className="text-xs text-red-600">{msg}</p>}

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={busy}
              className="rounded-full bg-wine px-6 py-2 text-sm text-white disabled:opacity-60"
            >
              {busy ? "استنى…" : "حفظ"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => setEditing(null)}
              className="rounded-full border border-wine/30 px-6 py-2 text-sm text-wine disabled:opacity-60"
            >
              إلغاء
            </button>
          </div>
        </form>
      )}

      <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {projects.map((p, i) => (
          <li key={p.id} className={`${card} flex gap-3`}>
            <Thumb p={p} onPlay={() => setPreview(p)} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium" dir="auto">
                {p.name}
              </p>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500">
                <span>
                  {p.category} · {p.views}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] ${
                    isCld(p.video) ? "bg-emerald-100 text-emerald-700" : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {where(p)}
                </span>
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className={small} aria-label="لفوق">
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === projects.length - 1}
                  className={small}
                  aria-label="لتحت"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMsg("");
                    setEditing(p.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={small}
                >
                  تعديل
                </button>
                <button type="button" onClick={() => remove(p)} className={small}>
                  مسح
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {preview && <Player p={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}
