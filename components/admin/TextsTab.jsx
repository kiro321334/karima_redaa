"use client";
import { useEffect, useState } from "react";
import { imgUrl, isCld } from "@/lib/cld";
import { compressImage, uploadToCloudinary, deleteCld } from "@/lib/upload";

const input =
  "w-full rounded-xl border border-wine/20 bg-white px-3 py-2 text-sm outline-none focus:border-wine";
const card = "rounded-2xl border border-wine/15 bg-white p-4";
const small =
  "rounded-full border border-wine/30 px-3 py-1.5 text-xs text-wine transition hover:bg-wine hover:text-white disabled:opacity-40";

function Field({ label, value, onChange, area, dir = "auto", hint }) {
  const P = area ? "textarea" : "input";
  return (
    <label className="grid gap-1 text-xs">
      {label}
      <P
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir={dir}
        rows={area ? 6 : undefined}
        className={input}
      />
      {hint && <span className="text-neutral-500">{hint}</span>}
    </label>
  );
}

// قايمة صفوف (كل صف فيه عمود أو أكتر) مع ترتيب ومسح وإضافة
function ListEditor({ title, hint, rows, cols, onChange }) {
  const set = (i, j, v) =>
    onChange(rows.map((r, k) => (k === i ? cols.map((_, m) => (m === j ? v : r[m] ?? "")) : r)));
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= rows.length) return;
    const a = [...rows];
    [a[i], a[j]] = [a[j], a[i]];
    onChange(a);
  };
  return (
    <section className={card}>
      <h2 className="text-sm font-bold text-wine">{title}</h2>
      {hint && <p className="mt-1 text-xs text-neutral-500">{hint}</p>}
      <ul className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {rows.map((r, i) => (
          <li key={i} className="grid content-start gap-2 rounded-xl border border-wine/10 p-3">
            {cols.map((c, j) =>
              c.area ? (
                <textarea
                  key={j}
                  value={r[j] ?? ""}
                  onChange={(e) => set(i, j, e.target.value)}
                  placeholder={c.label}
                  aria-label={c.label}
                  rows={3}
                  dir="auto"
                  className={input}
                />
              ) : (
                <input
                  key={j}
                  value={r[j] ?? ""}
                  onChange={(e) => set(i, j, e.target.value)}
                  placeholder={c.label}
                  aria-label={c.label}
                  dir="auto"
                  className={input}
                />
              )
            )}
            <div className="flex flex-wrap gap-1.5">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className={small} aria-label="لفوق">
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === rows.length - 1}
                className={small}
                aria-label="لتحت"
              >
                ↓
              </button>
              <button type="button" onClick={() => onChange(rows.filter((_, k) => k !== i))} className={small}>
                مسح
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => onChange([...rows, cols.map(() => "")])}
        className={`${small} mt-3`}
      >
        + إضافة
      </button>
    </section>
  );
}

// بيفضل شغال (مخفي) وإنت بتتنقل بين الأقسام، فالتعديلات اللي لسه ما اتحفظتش ما بتضيعش
function Panel({ show, children }) {
  return <div className={show ? "grid grid-cols-1 gap-5" : "hidden"}>{children}</div>;
}

export default function TextsTab({ content, commit, section, active }) {
  const init = content.texts;
  const [hero, setHero] = useState(init.hero);
  const [about, setAbout] = useState({
    intro: init.about.intro,
    name: init.about.name,
    paragraph: init.about.paragraph,
  });
  const [stats, setStats] = useState(init.about.stats);
  const [brands, setBrands] = useState(init.brands.map((r) => r.join("\n")));
  const [services, setServices] = useState(init.services);
  const [steps, setSteps] = useState(init.steps);
  const [contact, setContact] = useState(init.contact);
  const [heroFile, setHeroFile] = useState(null);
  const [heroPrev, setHeroPrev] = useState("");
  const [resetImg, setResetImg] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ ok: true, text: "" });

  useEffect(() => {
    if (!heroFile) return setHeroPrev("");
    const u = URL.createObjectURL(heroFile);
    setHeroPrev(u);
    return () => URL.revokeObjectURL(u);
  }, [heroFile]);

  const upH = (k) => (v) => setHero((x) => ({ ...x, [k]: v }));
  const upA = (k) => (v) => setAbout((x) => ({ ...x, [k]: v }));
  const upC = (k) => (v) => setContact((x) => ({ ...x, [k]: v }));

  const keep = (rows, n) =>
    rows
      .map((r) => r.map((c) => String(c ?? "").trim()))
      .filter((r) => r.slice(0, n).some(Boolean));
  const trimAll = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, String(v ?? "").trim()]));

  async function save() {
    setMsg({ ok: true, text: "" });

    const c = trimAll(contact);
    if (c.whatsapp && c.whatsapp.replace(/\D/g, "").length < 8) {
      return setMsg({ ok: false, text: "رقم الواتساب لازم يكون أرقام بس، مع كود الدولة (مثلاً 201001234567)." });
    }
    for (const k of ["instagram", "tiktok"]) {
      if (c[k] && !/^https?:\/\//i.test(c[k])) {
        return setMsg({ ok: false, text: "روابط إنستجرام وتيك توك لازم تبدأ بـ https://" });
      }
    }
    if (c.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)) {
      return setMsg({ ok: false, text: "الإيميل مش مكتوب صح." });
    }

    setBusy(true);
    let newImg = "";
    try {
      let image = resetImg ? "" : hero.image || "";
      if (heroFile) {
        const up = await uploadToCloudinary(await compressImage(heroFile, 1600), "image");
        newImg = up.secure_url;
        image = newImg;
      }
      const oldImg = init.hero.image;

      const texts = {
        hero: trimAll({ ...hero, image }),
        about: {
          ...trimAll(about),
          stats: keep(stats, 2).map((r) => [r[0] ?? "", r[1] ?? ""]),
        },
        brands: brands
          .map((b) => b.split("\n").map((x) => x.trim()).filter(Boolean))
          .filter((r) => r.length),
        services: keep(services, 3)
          .filter((r) => r[1])
          .map((r) => [r[0] ?? "", r[1], r[2] ?? ""]),
        steps: keep(steps, 2)
          .filter((r) => r[0])
          .map((r) => [r[0], r[1] ?? ""]),
        contact: c,
      };

      await commit((x) => ({ ...x, texts }));

      if (oldImg && oldImg !== image) await deleteCld(oldImg).catch(() => {});
      setHero(texts.hero);
      setHeroFile(null);
      setResetImg(false);
      setMsg({ ok: true, text: "تم الحفظ، والموقع اتحدّث ✓" });
    } catch (e) {
      if (newImg) await deleteCld(newImg).catch(() => {});
      setMsg({ ok: false, text: e.message || "حصل خطأ" });
    } finally {
      setBusy(false);
    }
  }

  const heroImg = resetImg ? "" : hero.image;
  const heroSrc = heroPrev || (isCld(heroImg) ? imgUrl(heroImg, 200) : "/profile.jpeg");

  return (
    <div className={active ? "grid grid-cols-1 gap-5" : "hidden"}>
      <Panel show={section === "hero"}>
        <section className={`${card} grid gap-3`}>
          <h2 className="text-sm font-bold text-wine">الصفحة الرئيسية</h2>
          <Field label="الشريط العلوي" value={hero.badge} onChange={upH("badge")} dir="ltr" />
          <Field label="العنوان الكبير" value={hero.headline} onChange={upH("headline")} dir="ltr" />
          <Field
            label="الكلمة المميزة آخر العنوان (باللون الأصفر)"
            value={hero.highlight}
            onChange={upH("highlight")}
            dir="ltr"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="الاسم" value={hero.name} onChange={upH("name")} dir="ltr" />
            <Field label="الوصف بجانب الاسم" value={hero.role} onChange={upH("role")} dir="ltr" />
          </div>
          <Field label="السطر اللي تحت الأزرار" value={hero.line} onChange={upH("line")} dir="ltr" />

          <div className="grid gap-2 text-xs">
            <span>الصورة الرئيسية</span>
            <div className="flex flex-wrap items-start gap-3">
              <img src={heroSrc} alt="" className="h-28 w-20 shrink-0 rounded-lg bg-neutral-200 object-cover" />
              <div className="grid min-w-0 flex-1 gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setHeroFile(e.target.files[0] || null);
                    setResetImg(false);
                  }}
                  className={input}
                />
                {(isCld(hero.image) || heroFile) && !resetImg && (
                  <button
                    type="button"
                    onClick={() => {
                      setHeroFile(null);
                      setResetImg(true);
                    }}
                    className={`${small} w-fit`}
                  >
                    رجّع الصورة الأصلية
                  </button>
                )}
                {resetImg && <span className="text-neutral-500">هترجع للصورة الأصلية بعد الحفظ.</span>}
              </div>
            </div>
          </div>
        </section>
      </Panel>

      <Panel show={section === "about"}>
        <section className={`${card} grid gap-3`}>
          <h2 className="text-sm font-bold text-wine">من أنا</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="الجملة الافتتاحية" value={about.intro} onChange={upA("intro")} dir="ltr" />
            <Field label="الاسم" value={about.name} onChange={upA("name")} dir="ltr" />
          </div>
          <Field label="النبذة" value={about.paragraph} onChange={upA("paragraph")} area dir="ltr" />
        </section>
        <ListEditor
          title="الأرقام"
          hint="الرقم، وبعده الوصف. مثلاً: 30+ ← Brands Partnered"
          rows={stats}
          cols={[{ label: "الرقم (مثلاً 30+)" }, { label: "الوصف" }]}
          onChange={setStats}
        />
      </Panel>

      <Panel show={section === "brands"}>
        <section className={card}>
          <h2 className="text-sm font-bold text-wine">البراندات اللي اشتغلت معاها</h2>
          <p className="mt-1 text-xs text-neutral-500">كل صف بيتحرك في شريط لوحده. اكتب براند في كل سطر.</p>
          <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
            {brands.map((b, i) => (
              <div key={i} className="grid content-start gap-2">
                <textarea
                  value={b}
                  onChange={(e) => setBrands((x) => x.map((v, k) => (k === i ? e.target.value : v)))}
                  rows={6}
                  dir="ltr"
                  aria-label={`صف ${i + 1}`}
                  className={input}
                />
                <button
                  type="button"
                  onClick={() => setBrands((x) => x.filter((_, k) => k !== i))}
                  className={`${small} w-fit`}
                >
                  مسح الصف {i + 1}
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setBrands((x) => [...x, ""])} className={`${small} mt-3`}>
            + إضافة صف
          </button>
        </section>
      </Panel>

      <Panel show={section === "services"}>
        <ListEditor
          title="الخدمات"
          hint="الأيقونة (إيموجي)، والعنوان، والوصف القصير."
          rows={services}
          cols={[{ label: "إيموجي (مثلاً 📹)" }, { label: "العنوان" }, { label: "الوصف" }]}
          onChange={setServices}
        />
      </Panel>

      <Panel show={section === "steps"}>
        <ListEditor
          title="خطوات العمل"
          rows={steps}
          cols={[{ label: "عنوان الخطوة" }, { label: "الشرح", area: true }]}
          onChange={setSteps}
        />
      </Panel>

      <Panel show={section === "contact"}>
        <section className={`${card} grid gap-3`}>
          <h2 className="text-sm font-bold text-wine">التواصل</h2>
          <p className="-mt-1 text-xs text-neutral-500">لو سبت خانة فاضية، بيتستخدم الرابط الأصلي بتاع الموقع.</p>
          <Field
            label="رقم الواتساب"
            value={contact.whatsapp}
            onChange={upC("whatsapp")}
            dir="ltr"
            hint="أرقام بس مع كود الدولة، مثلاً 201001234567"
          />
          <Field label="رابط إنستجرام" value={contact.instagram} onChange={upC("instagram")} dir="ltr" />
          <Field label="رابط تيك توك" value={contact.tiktok} onChange={upC("tiktok")} dir="ltr" />
          <Field label="الإيميل" value={contact.email} onChange={upC("email")} dir="ltr" />
        </section>
      </Panel>

      <div className="sticky bottom-3 z-10 flex flex-wrap items-center gap-3 rounded-2xl border border-wine/15 bg-white/95 p-3 shadow-lg backdrop-blur">
        <button
          type="button"
          onClick={save}
          disabled={busy}
          className="rounded-full bg-wine px-8 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {busy ? "جاري الحفظ…" : "حفظ التعديلات"}
        </button>
        <span className="text-[11px] text-neutral-500">بيحفظ كل أقسام النصوص مرة واحدة.</span>
        {msg.text && (
          <span className={`text-xs ${msg.ok ? "text-emerald-700" : "text-red-600"}`} aria-live="polite">
            {msg.text}
          </span>
        )}
      </div>
    </div>
  );
}
