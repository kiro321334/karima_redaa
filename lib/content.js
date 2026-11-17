// بيقرا المحتوى من Firestore (السيرفر بس). لو مفيش داتا لسه، بيرجع المحتوى القديم الثابت.
import { projects as defaultProjects, categories as defaultCategories } from "@/data/projects";
import { products as defaultProducts } from "@/data/products";
import { defaultTexts, mergeTexts } from "@/lib/texts";

const PID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

export const defaults = {
  categories: defaultCategories,
  projects: defaultProjects,
  products: defaultProducts,
  texts: defaultTexts,
};

const withAll = (cats) => ["All", ...cats.filter((c) => c !== "All")];

export async function getContent() {
  if (!PID || !KEY) return defaults;
  try {
    const r = await fetch(
      `https://firestore.googleapis.com/v1/projects/${PID}/databases/(default)/documents/site/content?key=${KEY}`,
      { next: { revalidate: 300, tags: ["site-content"] } }
    );
    if (!r.ok) return defaults; // 404 = لسه محدش حفظ حاجة من الـ dashboard
    const j = await r.json();
    const data = JSON.parse(j?.fields?.json?.stringValue || "null");
    if (!data || !Array.isArray(data.projects) || !Array.isArray(data.products)) {
      return defaults;
    }
    return {
      categories: withAll(
        Array.isArray(data.categories) && data.categories.length
          ? data.categories
          : defaultCategories
      ),
      projects: data.projects,
      products: data.products,
      texts: mergeTexts(data.texts),
    };
  } catch {
    return defaults;
  }
}
