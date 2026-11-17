"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { fb } from "@/lib/firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      await signInWithEmailAndPassword(fb().auth, email.trim(), pw);
    } catch {
      setErr("الإيميل أو الباسورد غلط.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main dir="rtl" className="grid min-h-screen place-items-center bg-cream px-5">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-3xl border border-wine/15 bg-white p-6 shadow-sm"
      >
        <h1 className="font-serif text-2xl text-wine">لوحة التحكم</h1>
        <p className="mt-1 text-xs text-neutral-500">سجّل دخول عشان تعدّل الموقع.</p>
        <label className="mt-5 block text-xs font-medium">الإيميل</label>
        <input
          type="email"
          dir="ltr"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-xl border border-wine/20 px-3 py-2 text-sm outline-none focus:border-wine"
        />
        <label className="mt-4 block text-xs font-medium">الباسورد</label>
        <input
          type="password"
          dir="ltr"
          required
          autoComplete="current-password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="mt-1 w-full rounded-xl border border-wine/20 px-3 py-2 text-sm outline-none focus:border-wine"
        />
        {err && <p className="mt-3 text-xs text-red-600">{err}</p>}
        <button
          type="submit"
          disabled={busy}
          className="mt-5 w-full rounded-full bg-wine py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {busy ? "جاري الدخول…" : "دخول"}
        </button>
      </form>
    </main>
  );
}
