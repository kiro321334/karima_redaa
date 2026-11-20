// أدوات الرفع في المتصفح: ضغط الصور، لقطة من الفيديو، رفع مباشر على Cloudinary
import { fb } from "@/lib/firebase";
import { cldRef } from "@/lib/cld";

export const MAX_VIDEO_MB = 60; // أقصى حجم للفيديو الواحد (تقدر تغيّره)

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

async function token() {
  const u = fb().auth.currentUser;
  if (!u) throw new Error("سجّل دخول الأول");
  return u.getIdToken();
}

// بيكلّم الـ API routes بتاعتنا بتوكن الأدمن
export async function api(path, body, method = "POST") {
  const r = await fetch(path, {
    method,
    headers: {
      Authorization: `Bearer ${await token()}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || `خطأ ${r.status}`);
  return j;
}

// ضغط الصورة قبل الرفع: أقصى بُعد + WebP (أو JPEG لو المتصفح مبيدعمش WebP). بيوفّر مساحة وbandwidth.
export async function compressImage(file, maxSide = 1400) {
  if (!/^image\//.test(file.type)) throw new Error("الملف ده مش صورة");
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
  const w = Math.max(1, Math.round(bmp.width * scale));
  const h = Math.max(1, Math.round(bmp.height * scale));
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  ctx.drawImage(bmp, 0, 0, w, h);
  if (bmp.close) bmp.close();
  const toBlob = (type, q) => new Promise((res) => c.toBlob(res, type, q));
  let blob = await toBlob("image/webp", 0.82);
  if (!blob || blob.type !== "image/webp") {
    ctx.globalCompositeOperation = "destination-over"; // خلفية بيضا بدل الأسود في JPEG
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, h);
    blob = await toBlob("image/jpeg", 0.82);
  }
  if (!blob) throw new Error("فشل ضغط الصورة");
  return blob;
}

// بياخد لقطة صغيرة من الفيديو تتستخدم كغلاف (بدل تحويل على Cloudinary بيتحسب من الـ credit)
export function captureFrame(file, maxW = 540) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const v = document.createElement("video");
    v.muted = true;
    v.playsInline = true;
    v.preload = "auto";
    let done = false;
    const finish = (blob) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      URL.revokeObjectURL(url);
      resolve(blob);
    };
    const timer = setTimeout(() => finish(null), 10000);
    v.onerror = () => finish(null);
    v.onloadeddata = () => {
      v.currentTime = Math.min(1, (v.duration || 1) / 4);
    };
    v.onseeked = () => {
      try {
        if (!v.videoWidth) return finish(null);
        const s = Math.min(1, maxW / v.videoWidth);
        const c = document.createElement("canvas");
        c.width = Math.round(v.videoWidth * s);
        c.height = Math.round(v.videoHeight * s);
        c.getContext("2d").drawImage(v, 0, 0, c.width, c.height);
        c.toBlob((b) => finish(b), "image/jpeg", 0.8);
      } catch {
        finish(null);
      }
    };
    v.src = url;
  });
}

// رفع مباشر من المتصفح لـ Cloudinary بتوقيع من السيرفر (الـ secret مبيوصلش للمتصفح أبداً)
export async function uploadToCloudinary(blob, kind, onProgress) {
  const s = await api("/api/cloudinary/sign", { kind });
  const fd = new FormData();
  fd.append("file", blob);
  fd.append("api_key", s.apiKey);
  fd.append("timestamp", s.timestamp);
  fd.append("signature", s.signature);
  fd.append("folder", s.folder);
  fd.append("allowed_formats", s.allowed_formats);
  return new Promise((resolve, reject) => {
    const x = new XMLHttpRequest();
    x.open("POST", `https://api.cloudinary.com/v1_1/${s.cloudName}/${s.resourceType}/upload`);
    x.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(e.loaded / e.total);
    };
    x.onload = () => {
      let j = {};
      try {
        j = JSON.parse(x.responseText);
      } catch {}
      if (x.status >= 200 && x.status < 300 && j.secure_url) resolve(j);
      else reject(new Error(j.error?.message || "فشل الرفع"));
    };
    x.onerror = () => reject(new Error("مشكلة في الاتصال أثناء الرفع"));
    x.send(fd);
  });
}

// بيمسح الملف من Cloudinary (لو الرابط مش بتاع Cloudinary، مبيعملش حاجة) عشان المساحة ترجع
export async function deleteCld(url) {
  const ref = cldRef(url);
  if (!ref) return;
  await api("/api/cloudinary/delete", ref);
}
