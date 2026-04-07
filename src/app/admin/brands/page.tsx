"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Building2, X, Check, Loader2 } from "lucide-react";

type Brand = { id: string; name: string; slug: string; website?: string };

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", website: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetch$ = async () => {
    setLoading(true);
    const data = await fetch("/api/brands").then((r) => r.json());
    setBrands(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetch$(); }, []);

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
    }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Failed"); }
    else { setShowForm(false); setForm({ name: "", slug: "", website: "" }); await fetch$(); }
    setSaving(false);
  };

  const inputCls = "w-full px-3 py-2 rounded-lg border border-[#D6E0ED] text-sm text-[#0C1E30] focus:outline-none focus:border-[#1E5FA3]";

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0C1E30]">Brands</h1>
          <p className="text-[#7A93AD] text-sm">{brands.length} brands</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E5FA3] text-white text-sm font-semibold hover:bg-[#164D8A]"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "Add Brand"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-[#BFDBFE] p-5 mb-5 space-y-3">
          <h2 className="font-bold text-[#0C1E30] text-sm">New Brand</h2>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-[#7A93AD] mb-1 block">Name *</label>
              <input value={form.name} onChange={(e) => handleNameChange(e.target.value)} required className={inputCls} placeholder="Minimalist" />
            </div>
            <div>
              <label className="text-xs text-[#7A93AD] mb-1 block">Slug *</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required className={inputCls} placeholder="minimalist" />
            </div>
            <div>
              <label className="text-xs text-[#7A93AD] mb-1 block">Website</label>
              <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className={inputCls} placeholder="https://..." />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E5FA3] text-white text-sm font-semibold hover:bg-[#164D8A] disabled:opacity-60">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Save Brand
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-[#D6E0ED] overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-[#F4F7FB] rounded-xl animate-pulse" />)}
          </div>
        ) : brands.length === 0 ? (
          <div className="py-16 text-center">
            <Building2 className="w-10 h-10 text-[#D6E0ED] mx-auto mb-3" />
            <p className="text-[#7A93AD] text-sm">No brands yet. Run the seed to import from JSON.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#F4F7FB]">
            {brands.map((b) => (
              <div key={b.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#FAFBFD]">
                <div className="w-9 h-9 rounded-xl bg-[#EFF5FF] border border-[#BFDBFE] flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-4 h-4 text-[#1E5FA3]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0C1E30]">{b.name}</p>
                  <p className="text-xs text-[#7A93AD]">/brands/{b.slug}</p>
                </div>
                {b.website && <a href={b.website} target="_blank" rel="noopener" className="text-xs text-[#1E5FA3] hover:underline hidden sm:block">Website ↗</a>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
