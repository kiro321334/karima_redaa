import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

// بيتأكد إن الحساب المسجّل هو حساب الأدمن (لوحة التحكم بتستخدمه عشان تمنع أي حساب تاني)
export async function GET(req) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  return NextResponse.json({ ok: true });
}
