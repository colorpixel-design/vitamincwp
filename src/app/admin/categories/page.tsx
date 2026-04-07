"use client";

import { useEffect, useState } from "react";
import { Plus, Tag, X, Check, Loader2 } from "lucide-react";

type Category = { id: string; name: string; slug: string; description?: string; color: string };

export default function AdminCategoriesPage() {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", description: "", color: "#1E5FA3" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetch$ = async () => {
    setLoading(true);
    const data = await fetch("/api/categories").then((r) => r.json());
    setCats(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetch$(); }, []);

  const handleNameChange = (name: string) => setForm((p) => ({ ...p, name, slug: name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") }));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) setError(data.error || "Failed");
    else { setShowForm(false); setForm({ name: "", slug: "", description: "", color: "#1E5FA3" }); await fetch$(); }
    setSaving(false);
  };

  const inputCls = "w-full px-3 py-2 rounded-lg border border-[#D6E0ED] text-sm text-[#0C1E30] focus:outline-none focus:border-[#1E5FA3]";

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0C1E30]">Categories</h1>
          <p className="text-[#7A93AD] text-sm">{cats.length} categories</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E5FA3] text-white text-sm font-semibold hover:bg-[#164D8A]">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "Add Category"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-[#BFDBFE] p-5 mb-5 space-y-3">
          <h2 className="font-bold text-[#0C1E30] text-sm">New Category</h2>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-[#7A93AD] mb-1 block">Name *</label><input value={form.name} onChange={(e) => handleNameChange(e.target.value)} required className={inputCls} placeholder="Brightening" /></div>
            <div><label className="text-xs text-[#7A93AD] mb-1 block">Slug *</label><input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required className={inputCls} placeholder="brightening" /></div>
          </div>
          <div><label className="text-xs text-[#7A93AD] mb-1 block">Description</label><input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls} placeholder="For skin glow & radiance" /></div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-[#7A93AD]">Color</label>
            <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-8 h-8 rounded-lg border-0 cursor-pointer" />
            <span className="text-xs text-[#0C1E30] font-mono">{form.color}</span>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E5FA3] text-white text-sm font-semibold hover:bg-[#164D8A] disabled:opacity-60">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}Save
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-[#D6E0ED] overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-12 bg-[#F4F7FB] rounded-xl animate-pulse" />)}</div>
        ) : cats.length === 0 ? (
          <div className="py-16 text-center"><Tag className="w-10 h-10 text-[#D6E0ED] mx-auto mb-3" /><p className="text-[#7A93AD] text-sm">No categories yet.</p></div>
        ) : (
          <div className="divide-y divide-[#F4F7FB]">
            {cats.map((c) => (
              <div key={c.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#FAFBFD]">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#0C1E30]">{c.name}</p>
                  {c.description && <p className="text-xs text-[#7A93AD]">{c.description}</p>}
                </div>
                <span className="text-xs text-[#7A93AD] font-mono">/{c.slug}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
