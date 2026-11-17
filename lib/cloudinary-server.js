// أدوات Cloudinary اللي بتشتغل في السيرفر بس (فيها الـ secret)
import crypto from "node:crypto";
import { unstable_cache } from "next/cache";

export const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
export const API_KEY = process.env.CLOUDINARY_API_KEY;
const SECRET = process.env.CLOUDINARY_API_SECRET;

export const FOLDER = (process.env.CLOUDINARY_FOLDER || "karima").replace(/[^a-z0-9_-]/gi, "");
// الرفع بيقف أوتوماتيك لما الاستهلاك يوصل للنسبة دي من الحد الشهري
export const MAX_PERCENT = Number(process.env.CLOUDINARY_MAX_PERCENT) || 85;

export const configured = () => Boolean(CLOUD && API_KEY && SECRET);

// توقيع Cloudinary: المعاملات مرتبة أبجدياً + الـ secret ثم SHA-1
export function sign(params) {
  const s = Object.keys(params)
    .filter((k) => params[k] !== undefined && params[k] !== "")
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return crypto.createHash("sha1").update(s + SECRET).digest("hex");
}

async function fetchUsage() {
  const r = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/usage`, {
    headers: {
      Authorization: "Basic " + Buffer.from(`${API_KEY}:${SECRET}`).toString("base64"),
    },
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`Cloudinary usage ${r.status}`);
  const d = await r.json();
  const c = d.credits || {};
  const limit = Number(c.limit) || null;
  const used = Number(c.usage) || 0;
  const percent =
    c.used_percent != null ? Number(c.used_percent) : limit ? (used / limit) * 100 : null;
  return {
    plan: d.plan || null,
    used,
    limit,
    percent,
    storageBytes: d.storage?.usage ?? null,
  };
}

// الـ Admin API ليه حد 500 طلب في الساعة، فبنكاشها 10 دقايق
export const getUsage = unstable_cache(fetchUsage, ["cld-usage"], { revalidate: 600 });

export async function guard() {
  try {
    const usage = await getUsage();
    if (usage.percent != null && usage.percent >= MAX_PERCENT) return { ok: false, usage };
    return { ok: true, usage };
  } catch {
    return { ok: true, usage: null }; // لو القراءة فشلت منقفلش الرفع
  }
}

export async function destroy(publicId, resourceType) {
  const params = { public_id: publicId, timestamp: Math.floor(Date.now() / 1000) };
  const body = new URLSearchParams({
    ...params,
    api_key: API_KEY,
    signature: sign(params),
  });
  const r = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/${resourceType}/destroy`, {
    method: "POST",
    body,
  });
  const j = await r.json().catch(() => ({}));
  return {
    ok: r.ok && (j.result === "ok" || j.result === "not found"),
    result: j.result,
    error: j.error?.message,
  };
}
