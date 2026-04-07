"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Plus, X } from "lucide-react";

type Brand = { id: string; name: string };

const VIT_C_TYPES = ["LAA", "EAA", "SAP", "MAP", "AA2G"];
const inputCls = "w-full px-3 py-2.5 rounded-xl border border-[#D6E0ED] text-sm text-[#0C1E30] bg-white focus:outline-none focus:border-[#1E5FA3] focus:ring-1 focus:ring-[#1E5FA3]/20";

function ArrayInput({ label, value, onChange, placeholder }: { label: string; value: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const [input, setInput] = useState("");
  const add = () => { const t = input.trim(); if (t && !value.includes(t)) { onChange([...value, t]); setInput(""); } };
  return (
    <div>
      <label className="block text-xs font-semibold text-[#3A5068] mb-1.5 uppercase tracking-wide">{label}</label>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {value.map((v) => (
          <span key={v} className="flex items-center gap-1 px-2 py-0.5 bg-[#EFF5FF] text-[#1E5FA3] text-xs rounded-full border border-[#BFDBFE]">
            {v}<button type="button" onClick={() => onChange(value.filter((x) => x !== v))}><X className="w-3 h-3" /></button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())} placeholder={placeholder} className="flex-1 px-3 py-2 rounded-lg border border-[#D6E0ED] text-sm focus:outline-none focus:border-[#1E5FA3]" />
        <button type="button" onClick={add} className="px-3 py-2 rounded-lg bg-[#EFF5FF] text-[#1E5FA3] hover:bg-[#DBEAFE] transition-colors"><Plus className="w-4 h-4" /></button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-xs font-semibold text-[#3A5068] mb-1.5 uppercase tracking-wide">{label}</label>{children}</div>;
}

export default function EditSerumPage() {
  const { id } = useParams();
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/serums/${id}`).then((r) => r.json()),
      fetch("/api/brands").then((r) => r.json()),
    ]).then(([serum, brands]) => {
      setForm(serum);
      setBrands(brands);
    }).finally(() => setLoading(false));
  }, [id]);

  const set = (field: string, value: any) => setForm((prev: any) => ({ ...prev, [field]: value }));
  const setScore = (field: string, value: number) => setForm((prev: any) => ({ ...prev, scores: { ...prev.scores, [field]: value } }));
  const setBuyLink = (field: string, value: string) => setForm((prev: any) => ({ ...prev, buy_links: { ...prev.buy_links, [field]: value } }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/serums/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to update"); return; }
      router.push("/admin/serums");
    } catch { setError("Network error"); } finally { setSaving(false); }
  };

  if (loading) return (
    <div className="max-w-3xl mx-auto animate-pulse space-y-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-[#D6E0ED] p-6 h-40" />
      ))}
    </div>
  );

  if (!form) return <div className="text-center py-20"><p className="text-[#7A93AD]">Serum not found.</p><Link href="/admin/serums" className="text-[#1E5FA3] hover:underline text-sm mt-2 inline-block">← Back</Link></div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/serums" className="w-8 h-8 rounded-xl bg-white border border-[#D6E0ED] flex items-center justify-center hover:bg-[#F4F7FB]">
          <ArrowLeft className="w-4 h-4 text-[#3A5068]" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-[#0C1E30]">Edit Serum</h1>
          <p className="text-xs text-[#7A93AD]">{form.name}</p>
        </div>
      </div>

      {error && <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-[#D6E0ED] p-6 space-y-4">
          <h2 className="font-bold text-[#0C1E30] text-sm border-b border-[#E4EAF3] pb-3">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Name *"><input value={form.name} onChange={(e) => set("name", e.target.value)} required className={inputCls} /></Field>
            <Field label="Slug *"><input value={form.slug} onChange={(e) => set("slug", e.target.value)} required className={inputCls} /></Field>
            <Field label="Brand *">
              <select value={form.brandId || ""} onChange={(e) => set("brandId", e.target.value)} required className={inputCls}>
                <option value="">Select brand...</option>
                {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </Field>
            <Field label="Vitamin C Type">
              <select value={form.vitamin_c_type} onChange={(e) => set("vitamin_c_type", e.target.value)} className={inputCls}>
                {VIT_C_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Tagline"><input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} className={inputCls} /></Field>
            <Field label="Rank"><input type="number" value={form.rank} onChange={(e) => set("rank", Number(e.target.value))} className={inputCls} /></Field>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="featured" checked={form.is_featured} onChange={(e) => set("is_featured", e.target.checked)} className="w-4 h-4 accent-[#1E5FA3]" />
            <label htmlFor="featured" className="text-sm text-[#0C1E30]">Editor's Pick / Featured</label>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#D6E0ED] p-6 space-y-4">
          <h2 className="font-bold text-[#0C1E30] text-sm border-b border-[#E4EAF3] pb-3">Specs</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Field label="Price ₹"><input type="number" value={form.price} onChange={(e) => set("price", Number(e.target.value))} className={inputCls} /></Field>
            <Field label="Volume ml"><input type="number" value={form.volume_ml} onChange={(e) => set("volume_ml", Number(e.target.value))} className={inputCls} /></Field>
            <Field label="Conc. %"><input type="number" step="0.1" value={form.concentration_percent} onChange={(e) => set("concentration_percent", Number(e.target.value))} className={inputCls} /></Field>
            <Field label="pH"><input type="number" step="0.1" value={form.ph_level} onChange={(e) => set("ph_level", Number(e.target.value))} className={inputCls} /></Field>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#D6E0ED] p-6 space-y-4">
          <h2 className="font-bold text-[#0C1E30] text-sm border-b border-[#E4EAF3] pb-3">Scores</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {(["total", "efficacy", "stability", "formulation", "value"] as const).map((key) => (
              <Field key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}>
                <input type="number" min="0" max="100" value={form.scores?.[key] ?? 0} onChange={(e) => setScore(key, Number(e.target.value))} className={inputCls} />
              </Field>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#D6E0ED] p-6 space-y-5">
          <h2 className="font-bold text-[#0C1E30] text-sm border-b border-[#E4EAF3] pb-3">Tags &amp; Content</h2>
          <ArrayInput label="Badges" value={form.badges || []} onChange={(v) => set("badges", v)} placeholder="e.g., Best Overall" />
          <ArrayInput label="Concerns" value={form.concerns || []} onChange={(v) => set("concerns", v)} placeholder="brightening..." />
          <ArrayInput label="Skin Types" value={form.skin_types || []} onChange={(v) => set("skin_types", v)} placeholder="oily / dry..." />
          <ArrayInput label="Key Ingredients" value={form.key_ingredients || []} onChange={(v) => set("key_ingredients", v)} placeholder="Niacinamide..." />
          <ArrayInput label="Pros" value={form.pros || []} onChange={(v) => set("pros", v)} placeholder="Stable formula..." />
          <ArrayInput label="Cons" value={form.cons || []} onChange={(v) => set("cons", v)} placeholder="Needs low pH..." />
        </div>

        <div className="bg-white rounded-2xl border border-[#D6E0ED] p-6">
          <h2 className="font-bold text-[#0C1E30] text-sm border-b border-[#E4EAF3] pb-3 mb-4">Expert Verdict</h2>
          <Field label="Dermatologist's Verdict">
            <textarea value={form.dermatologist_verdict} onChange={(e) => set("dermatologist_verdict", e.target.value)} rows={3} className={`${inputCls} resize-none`} />
          </Field>
        </div>

        <div className="bg-white rounded-2xl border border-[#D6E0ED] p-6 space-y-4">
          <h2 className="font-bold text-[#0C1E30] text-sm border-b border-[#E4EAF3] pb-3">Buy Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Amazon"><input value={form.buy_links?.amazon || ""} onChange={(e) => setBuyLink("amazon", e.target.value)} className={inputCls} placeholder="https://amazon.in/..." /></Field>
            <Field label="Nykaa"><input value={form.buy_links?.nykaa || ""} onChange={(e) => setBuyLink("nykaa", e.target.value)} className={inputCls} placeholder="https://nykaa.com/..." /></Field>
            <Field label="Flipkart"><input value={form.buy_links?.flipkart || ""} onChange={(e) => setBuyLink("flipkart", e.target.value)} className={inputCls} placeholder="https://flipkart.com/..." /></Field>
          </div>
        </div>

        <div className="flex gap-3 pb-4">
          <Link href="/admin/serums" className="px-5 py-2.5 rounded-xl border border-[#D6E0ED] text-sm text-[#3A5068] hover:bg-[#F4F7FB]">Cancel</Link>
          <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1E5FA3] text-white text-sm font-semibold hover:bg-[#164D8A] disabled:opacity-60">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : <><Save className="w-4 h-4" />Update Serum</>}
          </button>
        </div>
      </form>
    </div>
  );
}
