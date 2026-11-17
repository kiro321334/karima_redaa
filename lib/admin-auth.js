// التحقق من الأدمن في السيرفر (نفس فكرة مشروع wisam)
export async function isAdmin(req) {
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  const fbKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const admin = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  if (!token || !fbKey || !admin) return false;
  try {
    const r = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${fbKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
      }
    );
    const data = await r.json();
    return r.ok && (data?.users?.[0]?.email || "").toLowerCase() === admin;
  } catch {
    return false;
  }
}
