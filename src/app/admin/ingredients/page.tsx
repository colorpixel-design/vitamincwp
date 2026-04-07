"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Plus, Search, Edit, Trash2, Droplets, X, Save, Loader2,
  ShieldAlert, Zap, FlaskConical, ChevronRight, AlertCircle,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
type Ingredient = {
  id: number;
  slug: string;
  name: string;
  alias: string;
  type: string;
  description: string;
  stability_rating: number;
  irritation_risk: "Low" | "Medium" | "High";
  bioavailability: number;
  ph_required: string;
  best_for: string[];
  avoid_if: string[];
  synergies: string[];
  conflicts: string[];
};

const EMPTY_FORM: Omit<Ingredient, "id"> = {
  slug: "", name: "", alias: "", type: "", description: "",
  stability_rating: 7, irritation_risk: "Low", bioavailability: 7,
  ph_required: "3.0–3.5",
  best_for: [], avoid_if: [], synergies: [], conflicts: [],
};

// ─── Shared Styles ───────────────────────────────────────────────────────────
const inputCls = "w-full px-3 py-2 rounded-lg border border-[#D6E0ED] text-sm text-[#0C1E30] bg-white placeholder:text-[#B0C0D0] focus:outline-none focus:border-[#1E5FA3] focus:ring-1 focus:ring-[#1E5FA3]/20 transition-all";
const labelCls = "block text-xs font-semibold text-[#3A5068] mb-1 uppercase tracking-wide";

// ─── Risk badge colours ───────────────────────────────────────────────────────
const riskColour = {
  Low: "bg-green-50 text-green-700 border-green-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  High: "bg-red-50 text-red-600 border-red-200",
} as const;

// ─── Rating bar ──────────────────────────────────────────────────────────────
function RatingBar({ value, max = 10 }: { value: number; max?: number }) {
  const pct = Math.round((value / max) * 100);
  const colour = pct >= 70 ? "bg-[#1E5FA3]" : pct >= 50 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-[#E4EAF3] rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${colour}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-[#3A5068] w-5 text-right">{value}</span>
    </div>
  );
}

// ─── Tag input ───────────────────────────────────────────────────────────────
function TagInput({
  label, values, onChange, placeholder,
}: { label: string; values: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState("");
  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !values.includes(trimmed)) onChange([...values, trimmed]);
    setInput("");
  };
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex gap-1.5 flex-wrap mb-1.5">
        {values.map((v) => (
          <span key={v} className="flex items-center gap-1 px-2 py-0.5 bg-[#EFF5FF] text-[#1E5FA3] rounded-full text-xs border border-[#BFDBFE]">
            {v}
            <button type="button" onClick={() => onChange(values.filter((x) => x !== v))} className="text-[#1E5FA3] hover:text-red-500">
              <X className="w-2.5 h-2.5" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-1.5">
        <input
          value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder={placeholder || "Type and press Enter"}
          className={inputCls}
        />
        <button type="button" onClick={add} className="px-3 py-2 rounded-lg bg-[#EFF5FF] text-[#1E5FA3] text-xs font-semibold hover:bg-[#DBEAFE] transition-colors whitespace-nowrap">
          Add
        </button>
      </div>
    </div>
  );
}

// ─── Slide-Over Form Panel ────────────────────────────────────────────────────
function SlideOverForm({
  open, editing, onClose, onSaved,
}: { open: boolean; editing: Ingredient | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<Omit<Ingredient, "id">>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setForm(editing ? { ...editing } : { ...EMPTY_FORM });
      setError("");
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [open, editing]);

  const set = (field: string, value: unknown) => setForm((f) => ({ ...f, [field]: value }));

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) { setError("Name and slug are required."); return; }
    setSaving(true);
    setError("");
    try {
      const url = editing ? `/api/ingredients/${editing.id}` : "/api/ingredients";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Save failed");
      } else {
        onSaved();
        onClose();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D6E0ED] bg-[#F7F9FC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1E5FA3] flex items-center justify-center">
              <Droplets className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-black text-[#0C1E30]">
                {editing ? "Edit Ingredient" : "Add New Ingredient"}
              </h2>
              <p className="text-xs text-[#7A93AD]">{editing ? editing.name : "Fill in all fields below"}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#E4EAF3] transition-colors">
            <X className="w-4 h-4 text-[#7A93AD]" />
          </button>
        </div>

        {/* Scrollable form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* ── Identity ── */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Name *</label>
              <input
                ref={firstInputRef}
                value={form.name}
                onChange={(e) => {
                  set("name", e.target.value);
                  if (!editing) set("slug", autoSlug(e.target.value));
                }}
                required className={inputCls} placeholder="e.g. L-Ascorbic Acid"
              />
            </div>
            <div>
              <label className={labelCls}>Slug *</label>
              <input value={form.slug} onChange={(e) => set("slug", e.target.value)} required className={inputCls} placeholder="l-ascorbic-acid" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Alias / INCI Name</label>
              <input value={form.alias} onChange={(e) => set("alias", e.target.value)} className={inputCls} placeholder="e.g. Ascorbic Acid" />
            </div>
            <div>
              <label className={labelCls}>Type / Category</label>
              <input value={form.type} onChange={(e) => set("type", e.target.value)} className={inputCls} placeholder="e.g. Antioxidant" />
            </div>
          </div>

          <div>
            <label className={labelCls}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              className={`${inputCls} resize-none`}
              placeholder="Scientific overview of this ingredient..."
            />
          </div>

          {/* ── Ratings ── */}
          <div className="bg-[#F7F9FC] rounded-xl border border-[#E4EAF3] p-4 space-y-4">
            <p className="text-xs font-bold text-[#3A5068] uppercase tracking-wide flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#1E5FA3]" /> Performance Ratings
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Stability Rating (1–10)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range" min={1} max={10} value={form.stability_rating}
                    onChange={(e) => set("stability_rating", Number(e.target.value))}
                    className="flex-1 accent-[#1E5FA3]"
                  />
                  <span className="text-sm font-bold text-[#1E5FA3] w-5 text-center">{form.stability_rating}</span>
                </div>
              </div>

              <div>
                <label className={labelCls}>Bioavailability (1–10)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range" min={1} max={10} value={form.bioavailability}
                    onChange={(e) => set("bioavailability", Number(e.target.value))}
                    className="flex-1 accent-[#1E5FA3]"
                  />
                  <span className="text-sm font-bold text-[#1E5FA3] w-5 text-center">{form.bioavailability}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Irritation Risk</label>
                <select
                  value={form.irritation_risk}
                  onChange={(e) => set("irritation_risk", e.target.value)}
                  className={inputCls}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>pH Required</label>
                <input value={form.ph_required} onChange={(e) => set("ph_required", e.target.value)} className={inputCls} placeholder="e.g. 3.0–3.5" />
              </div>
            </div>
          </div>

          {/* ── Arrays ── */}
          <div className="space-y-4">
            <TagInput label="Best For (skin concerns)" values={form.best_for} onChange={(v) => set("best_for", v)} placeholder="e.g. Hyperpigmentation" />
            <TagInput label="Avoid If (contraindications)" values={form.avoid_if} onChange={(v) => set("avoid_if", v)} placeholder="e.g. Sensitive skin" />
            <TagInput label="Synergies (works well with)" values={form.synergies} onChange={(v) => set("synergies", v)} placeholder="e.g. Vitamin E" />
            <TagInput label="Conflicts (avoid combining)" values={form.conflicts} onChange={(v) => set("conflicts", v)} placeholder="e.g. Niacinamide" />
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-[#D6E0ED] bg-[#F7F9FC]">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-[#3A5068] hover:bg-[#E4EAF3] transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit as any}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#1E5FA3] text-white text-sm font-semibold hover:bg-[#164D8A] disabled:opacity-60 transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : editing ? "Save Changes" : "Add Ingredient"}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function AdminIngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState<Ingredient | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchIngredients = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/ingredients");
    const data = await res.json();
    setIngredients(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchIngredients(); }, [fetchIngredients]);

  const filtered = ingredients.filter((i) => {
    const q = search.toLowerCase();
    return !q || i.name.toLowerCase().includes(q) || i.type.toLowerCase().includes(q) || i.alias.toLowerCase().includes(q);
  });

  const openAdd = () => { setEditing(null); setPanelOpen(true); };
  const openEdit = (ing: Ingredient) => { setEditing(ing); setPanelOpen(true); };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    await fetch(`/api/ingredients/${id}`, { method: "DELETE" });
    await fetchIngredients();
    setDeleting(null);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Slide-over */}
      <SlideOverForm
        open={panelOpen}
        editing={editing}
        onClose={() => setPanelOpen(false)}
        onSaved={fetchIngredients}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0C1E30]">Ingredients</h1>
          <p className="text-[#7A93AD] text-sm">{ingredients.length} active ingredients in database</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E5FA3] text-white text-sm font-semibold hover:bg-[#164D8A] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Ingredient
        </button>
      </div>

      {/* Search + stats bar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A93AD]" />
          <input
            type="text"
            placeholder="Search by name, type, or alias…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white rounded-xl border border-[#D6E0ED] text-sm text-[#0C1E30] placeholder:text-[#7A93AD] focus:outline-none focus:border-[#1E5FA3] focus:ring-1 focus:ring-[#1E5FA3]/20"
          />
        </div>
        {search && (
          <span className="text-xs text-[#7A93AD] whitespace-nowrap">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Card grid */}
      {loading ? (
        <div className="grid gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#D6E0ED] p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E4EAF3]" />
                <div className="flex-1">
                  <div className="h-4 bg-[#E4EAF3] rounded w-48 mb-2" />
                  <div className="h-3 bg-[#E4EAF3] rounded w-28" />
                </div>
                <div className="h-6 w-20 bg-[#E4EAF3] rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#D6E0ED] p-16 text-center">
          <Droplets className="w-12 h-12 text-[#D6E0ED] mx-auto mb-3" />
          <p className="text-[#7A93AD] text-sm font-medium">
            {search ? `No ingredients match "${search}"` : "No ingredients yet"}
          </p>
          {!search && (
            <button onClick={openAdd} className="mt-3 text-xs text-[#1E5FA3] hover:underline">
              Add your first ingredient →
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((ing) => {
            const expanded = expandedId === ing.id;
            return (
              <div key={ing.id} className="bg-white rounded-2xl border border-[#D6E0ED] overflow-hidden">
                {/* Row */}
                <div className="flex items-center gap-3 px-4 py-3.5">
                  {/* Icon */}
                  <button
                    onClick={() => setExpandedId(expanded ? null : ing.id)}
                    className="w-10 h-10 rounded-xl bg-[#EFF5FF] border border-[#BFDBFE] flex items-center justify-center flex-shrink-0 hover:bg-[#DBEAFE] transition-colors"
                  >
                    <Droplets className="w-5 h-5 text-[#1E5FA3]" />
                  </button>

                  {/* Name + meta */}
                  <button
                    className="flex-1 text-left min-w-0"
                    onClick={() => setExpandedId(expanded ? null : ing.id)}
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-[#0C1E30]">{ing.name}</span>
                      {ing.alias && <span className="text-xs text-[#7A93AD]">({ing.alias})</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      {ing.type && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#F4F7FB] text-[#3A5068] border border-[#E4EAF3]">
                          {ing.type}
                        </span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${riskColour[ing.irritation_risk] ?? ""}`}>
                        <ShieldAlert className="w-2.5 h-2.5 inline mr-0.5 -mt-px" />
                        {ing.irritation_risk} risk
                      </span>
                    </div>
                  </button>

                  {/* Ratings – hidden on mobile */}
                  <div className="hidden md:flex flex-col gap-1 w-32 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#7A93AD]">Stability</span>
                    </div>
                    <RatingBar value={ing.stability_rating} />
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[10px] text-[#7A93AD]">Bioavailability</span>
                    </div>
                    <RatingBar value={ing.bioavailability} />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => openEdit(ing)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#EFF5FF] text-[#1E5FA3] hover:bg-[#DBEAFE] text-xs font-medium transition-colors"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ing.id, ing.name)}
                      disabled={deleting === ing.id}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-3 h-3" />
                      {deleting === ing.id ? "…" : "Del"}
                    </button>
                    <button
                      onClick={() => setExpandedId(expanded ? null : ing.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F4F7FB] transition-colors"
                    >
                      <ChevronRight className={`w-4 h-4 text-[#7A93AD] transition-transform ${expanded ? "rotate-90" : ""}`} />
                    </button>
                  </div>
                </div>

                {/* Expanded detail */}
                {expanded && (
                  <div className="px-5 pb-5 pt-0 border-t border-[#F4F7FB] bg-[#FAFBFD]">
                    {ing.description && (
                      <p className="text-sm text-[#3A5068] mt-4 mb-4 leading-relaxed">{ing.description}</p>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div className="bg-white rounded-xl border border-[#E4EAF3] p-3 text-center">
                        <p className="text-[10px] text-[#7A93AD] uppercase tracking-wide mb-1">Stability</p>
                        <p className="text-xl font-black text-[#1E5FA3]">{ing.stability_rating}<span className="text-xs text-[#7A93AD]">/10</span></p>
                      </div>
                      <div className="bg-white rounded-xl border border-[#E4EAF3] p-3 text-center">
                        <p className="text-[10px] text-[#7A93AD] uppercase tracking-wide mb-1">Bioavailability</p>
                        <p className="text-xl font-black text-[#1E5FA3]">{ing.bioavailability}<span className="text-xs text-[#7A93AD]">/10</span></p>
                      </div>
                      <div className="bg-white rounded-xl border border-[#E4EAF3] p-3 text-center">
                        <p className="text-[10px] text-[#7A93AD] uppercase tracking-wide mb-1">Irritation</p>
                        <p className={`text-sm font-bold ${ing.irritation_risk === "Low" ? "text-green-600" : ing.irritation_risk === "Medium" ? "text-amber-600" : "text-red-600"}`}>{ing.irritation_risk}</p>
                      </div>
                      <div className="bg-white rounded-xl border border-[#E4EAF3] p-3 text-center">
                        <p className="text-[10px] text-[#7A93AD] uppercase tracking-wide mb-1">pH Range</p>
                        <p className="text-sm font-bold text-[#0C1E30]">{ing.ph_required || "—"}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {ing.best_for.length > 0 && (
                        <TagSection title="Best For" tags={ing.best_for} colour="bg-[#EFF5FF] text-[#1E5FA3] border-[#BFDBFE]" />
                      )}
                      {ing.avoid_if.length > 0 && (
                        <TagSection title="Avoid If" tags={ing.avoid_if} colour="bg-red-50 text-red-600 border-red-200" />
                      )}
                      {ing.synergies.length > 0 && (
                        <TagSection title="Synergies" tags={ing.synergies} colour="bg-green-50 text-green-700 border-green-200" />
                      )}
                      {ing.conflicts.length > 0 && (
                        <TagSection title="Conflicts" tags={ing.conflicts} colour="bg-amber-50 text-amber-700 border-amber-200" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TagSection({ title, tags, colour }: { title: string; tags: string[]; colour: string }) {
  return (
    <div className="bg-white rounded-xl border border-[#E4EAF3] p-3">
      <p className="text-[10px] font-bold text-[#7A93AD] uppercase tracking-wide mb-2">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span key={t} className={`text-xs px-2 py-0.5 rounded-full border font-medium ${colour}`}>{t}</span>
        ))}
      </div>
    </div>
  );
}
