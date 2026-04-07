"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, FlaskConical } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("Passwords don't match"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed"); return; }
      router.push("/");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-3 rounded-xl border border-[#D6E0ED] text-sm text-[#0C1E30] bg-white placeholder:text-[#7A93AD] focus:outline-none focus:border-[#1E5FA3] focus:ring-2 focus:ring-[#1E5FA3]/10 transition-all";

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#1E5FA3] flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FlaskConical className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-[#0C1E30]">Create Account</h1>
          <p className="text-[#7A93AD] text-sm mt-1">Join VitaminC India for free</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#D6E0ED] shadow-sm p-8">
          {error && <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#3A5068] mb-1.5 uppercase tracking-wide">Full Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className={inputCls} placeholder="Priya Sharma" autoComplete="name" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#3A5068] mb-1.5 uppercase tracking-wide">Email Address</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className={inputCls} placeholder="priya@example.com" autoComplete="email" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#3A5068] mb-1.5 uppercase tracking-wide">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} className={`${inputCls} pr-11`} placeholder="Min. 6 characters" autoComplete="new-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A93AD] hover:text-[#3A5068]">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#3A5068] mb-1.5 uppercase tracking-wide">Confirm Password</label>
              <input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} required className={inputCls} placeholder="Re-enter password" autoComplete="new-password" />
            </div>
            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1E5FA3] text-white font-semibold text-sm hover:bg-[#164D8A] disabled:opacity-60 transition-colors mt-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Creating account...</> : "Create Account"}
            </button>
          </form>
          <div className="mt-5 pt-5 border-t border-[#E4EAF3] text-center">
            <p className="text-sm text-[#7A93AD]">Already have an account? <Link href="/login" className="text-[#1E5FA3] font-semibold hover:underline">Sign in</Link></p>
          </div>
        </div>
        <p className="text-center text-xs text-[#7A93AD] mt-5"><Link href="/" className="hover:text-[#1E5FA3]">← Back to VitaminC India</Link></p>
      </div>
    </div>
  );
}
