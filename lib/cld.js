// أدوات مشتركة (تشتغل في السيرفر والمتصفح)

export const isCld = (u) =>
  typeof u === "string" && u.startsWith("https://res.cloudinary.com/");

// الصور: تحويل رخيص (بيتحسب مرة واحدة لكل صورة) وبيوفّر bandwidth كتير.
// الفيديو: بيتسلّم زي ما اترفع بدون أي تحويل، لأن تحويلات الفيديو بتتحسب بالثواني وبتاكل credit.
export function imgUrl(url, w = 640) {
  if (!isCld(url) || !url.includes("/image/upload/")) return url;
  return url.replace(
    "/image/upload/",
    `/image/upload/f_auto,q_auto,w_${w},c_limit/`
  );
}

// بيطلّع نوع الملف والـ public_id من رابط Cloudinary الأصلي (من غير تحويلات)
export function cldRef(url) {
  const m =
    /^https:\/\/res\.cloudinary\.com\/[^/]+\/(image|video)\/upload\/(?:v\d+\/)?(.+)\.[A-Za-z0-9]+$/.exec(
      url || ""
    );
  return m ? { resourceType: m[1], publicId: m[2] } : null;
}
