import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { isAdmin } from "@/lib/admin-auth";

// بعد كل حفظ من الـ dashboard، الموقع بيتحدّث فوراً بدل ما يستنى الكاش
export async function POST(req) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  revalidateTag("site-content");
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
