import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { FOLDER, configured, destroy } from "@/lib/cloudinary-server";

export async function POST(req) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  if (!configured()) {
    return NextResponse.json({ error: "إعدادات Cloudinary ناقصة في Vercel." }, { status: 503 });
  }

  let body = {};
  try {
    body = await req.json();
  } catch {}
  const { publicId, resourceType } = body;

  // نمسح بس ملفات المشروع ده (جوه الفولدر بتاعه)
  if (
    !["image", "video"].includes(resourceType) ||
    typeof publicId !== "string" ||
    !publicId.startsWith(`${FOLDER}/`) ||
    publicId.includes("..")
  ) {
    return NextResponse.json({ error: "ملف غير صالح" }, { status: 400 });
  }

  const r = await destroy(publicId, resourceType);
  return NextResponse.json(r, { status: r.ok ? 200 : 502 });
}
