import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { CLOUD, API_KEY, FOLDER, configured, sign, guard } from "@/lib/cloudinary-server";

// الصيغ المسموحة بس (Cloudinary نفسه بيرفض أي حاجة غيرها لأنها جزء من التوقيع)
const FORMATS = { image: "jpg,jpeg,png,webp", video: "mp4,webm,mov" };

export async function POST(req) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  if (!configured()) {
    return NextResponse.json({ error: "إعدادات Cloudinary ناقصة في Vercel." }, { status: 503 });
  }

  let kind;
  try {
    ({ kind } = await req.json());
  } catch {}
  if (!FORMATS[kind]) return NextResponse.json({ error: "نوع الملف غير صحيح" }, { status: 400 });

  const g = await guard();
  if (!g.ok) {
    return NextResponse.json(
      {
        error: `استهلاك Cloudinary وصل ${Math.round(g.usage.percent)}% من الحد الشهري، فالرفع متوقف لحد ما يتجدد.`,
      },
      { status: 429 }
    );
  }

  const params = {
    allowed_formats: FORMATS[kind],
    folder: `${FOLDER}/${kind === "video" ? "videos" : "images"}`,
    timestamp: Math.floor(Date.now() / 1000),
  };
  return NextResponse.json({
    cloudName: CLOUD,
    apiKey: API_KEY,
    resourceType: kind,
    ...params,
    signature: sign(params),
  });
}
