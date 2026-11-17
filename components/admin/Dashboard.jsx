"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { fb } from "@/lib/firebase";
import { api } from "@/lib/upload";
import { projects as defaultProjects, categories as defaultCategories } from "@/data/projects";
import { products as defaultProducts } from "@/data/products";
import { defaultTexts, mergeTexts } from "@/lib/texts";
import Login from "./Login";
import VideosTab from "./VideosTab";
import ProductsTab from "./ProductsTab";
import TextsTab from "./TextsTab";

const withAll = (cats) => ["All", ...cats.filter((c) => c !== "All")];

// نفس ترتيب الأقسام في الموقع
const SECTIONS = [
  ["hero", "الرئيسية"],
  ["about", "من أنا"],
  ["brands", "البراندات"],
  ["services", "الخدمات"],
  ["videos", "الفيديوهات"],
  ["products", "المنتجات"],
  ["steps", "خطوات العمل"],
  ["contact", "التواصل"],
];
const TEXT_SECTIONS = ["hero", "about", "brands", "services", "steps", "contact"];

export default function Dashboard() {
  const [user, setUser] = useState(undefined); // undefined = بيتحمّل
  const [content, setContent] = useState(null);
  const [seeded, setSeeded] = useState(true);
  const [loadErr, setLoadErr] = useState("");
  const [denied, setDenied] = useState(false);
  const [section, setSection] = useState("hero");
  const [status, setStatus] = useState("idle"); // idle | saving | saved | error
  const [saveErr, setSaveErr] = useState("");

  const ref = useRef(null); // آخر نسخة من المحتوى
  const queue = useRef(Promise.resolve()); // الحفظ بيتنفّذ بالترتيب

  useEffect(() => onAuthStateChanged(fb().auth, (u) => setUser(u)), []);

  useEffect(() => {
    if (!user) return;
    let alive = true;
    (async () => {
      try {
        await api("/api/admin-check", null, "GET");
      } catch (e) {
        if (alive && /غير مصرح/.test(e.message)) setDenied(true);
        return;
      }
      if (alive) setDenied(false);
    })();
    (async () => {
      try {
        const snap = await getDoc(doc(fb().db, "site", "content"));
        let data = null;
        if (snap.exists()) {
          try {
            data = JSON.parse(snap.data().json);
          } catch {}
        }
        const ok = data && Array.isArray(data.projects) && Array.isArray(data.products);
        const init = ok
          ? {
              categories: withAll(data.categories?.length ? data.categories : defaultCategories),
              projects: data.projects,
              products: data.products,
              texts: mergeTexts(data.texts),
            }
          : {
              categories: defaultCategories,
              projects: defaultProjects,
              products: defaultProducts,
              texts: defaultTexts,
            };
        if (!alive) return;
        ref.current = init;
        setContent(init);
        setSeeded(Boolean(ok));
      } catch (e) {
        if (alive) setLoadErr(e.message || "فشل تحميل المحتوى");
      }
    })();
    return () => {
      alive = false;
    };
  }, [user]);

  // أي تعديل بيتحفظ في Firestore وبعدها الموقع بيتحدّث. بيرجع Promise بيفشل لو الحفظ فشل.
  const commit = useCallback((updater) => {
    const next = updater(ref.current);
    ref.current = next;
    setContent(next);
    setStatus("saving");
    const write = async () => {
      await setDoc(doc(fb().db, "site", "content"), {
        json: JSON.stringify(ref.current),
        updatedAt: serverTimestamp(),
      });
      try {
        await api("/api/revalidate", {});
      } catch {}
    };
    const job = queue.current.then(write);
    queue.current = job.catch(() => {});
    job
      .then(() => {
        setStatus("saved");
        setSeeded(true);
      })
      .catch((e) => {
        setStatus("error");
        setSaveErr(e.message || "فشل الحفظ");
      });
    return job;
  }, []);

  if (user === undefined) {
    return (
      <main dir="rtl" className="grid min-h-screen place-items-center bg-cream text-sm text-neutral-500">
        جاري التحميل…
      </main>
    );
  }
  if (!user) return <Login />;

  if (denied) {
    return (
      <main dir="rtl" className="grid min-h-screen place-items-center bg-cream px-5 text-center">
        <div>
          <p className="text-sm text-red-600">الحساب ده مش مسموح له يدخل لوحة التحكم.</p>
          <button
            onClick={() => signOut(fb().auth)}
            className="mt-4 rounded-full border border-wine px-5 py-2 text-xs text-wine"
          >
            خروج
          </button>
        </div>
      </main>
    );
  }

  const statusText =
    status === "saving"
      ? "جاري الحفظ…"
      : status === "saved"
        ? "تم الحفظ ✓"
        : status === "error"
          ? `فشل الحفظ: ${saveErr}`
          : "";

  return (
    <main dir="rtl" className="min-h-screen bg-cream">
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-5 md:px-8">
        <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div className="min-w-0">
            <h1 className="font-serif text-xl text-wine sm:text-2xl">لوحة التحكم</h1>
            <p dir="ltr" className="truncate text-xs text-neutral-500">
              {user.email}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-xs ${status === "error" ? "text-red-600" : "text-neutral-500"}`}
              aria-live="polite"
            >
              {statusText}
            </span>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-wine/30 bg-white px-4 py-2 text-xs text-wine"
            >
              عرض الموقع
            </a>
            <button
              onClick={() => signOut(fb().auth)}
              className="rounded-full border border-wine/30 bg-white px-4 py-2 text-xs text-wine"
            >
              خروج
            </button>
          </div>
        </header>

        <div className="mt-3 md:mt-5 md:grid md:grid-cols-[12rem_minmax(0,1fr)] md:items-start md:gap-6">
          {/* النافبار: شريط أفقي بيتسحب على الموبايل، وقايمة جانبية على الشاشات الكبيرة */}
          <nav
            aria-label="أقسام الموقع"
            className="sticky top-0 z-20 -mx-4 bg-cream/95 px-4 py-2 backdrop-blur md:top-4 md:mx-0 md:bg-transparent md:p-0 md:backdrop-blur-none"
          >
            <ul className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] md:flex-col md:gap-1.5 md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden">
              {SECTIONS.map(([k, label]) => (
                <li key={k} className="shrink-0 md:shrink">
                  <button
                    type="button"
                    onClick={() => setSection(k)}
                    aria-current={section === k ? "page" : undefined}
                    className={`w-full whitespace-nowrap rounded-full px-4 py-2 text-sm transition md:rounded-xl md:px-4 md:py-2.5 md:text-right ${
                      section === k
                        ? "bg-wine text-white"
                        : "bg-wine/10 text-wine hover:bg-wine/20 md:bg-white md:hover:bg-wine/10"
                    }`}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-3 grid min-w-0 grid-cols-1 gap-5 md:mt-0">
            {!seeded && content && (
              <p className="rounded-2xl border border-wine/15 bg-blush p-4 text-xs text-wine">
                ده أول استخدام: أول تعديل هتعمله هيحفظ كل المحتوى الحالي في لوحة التحكم، والفيديوهات
                والصور القديمة هتفضل شغالة زي ما هي.
              </p>
            )}

            {loadErr && (
              <p className="rounded-2xl border border-red-200 bg-white p-4 text-xs text-red-600">
                {loadErr}
              </p>
            )}

            {!content && !loadErr && (
              <p className="text-xs text-neutral-500">جاري تحميل المحتوى…</p>
            )}

            {content && section === "videos" && <VideosTab content={content} commit={commit} />}
            {content && section === "products" && <ProductsTab content={content} commit={commit} />}

            {/* التعديلات اللي ما اتحفظتش بتفضل محفوظة وإنت بتتنقل بين الأقسام */}
            {content && (
              <TextsTab
                content={content}
                commit={commit}
                section={section}
                active={TEXT_SECTIONS.includes(section)}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
