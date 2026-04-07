"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { X, Plus, ArrowRight, Check } from "lucide-react";
import serums from "@/data/serums.json";
import ScoreRing from "@/components/ScoreRing";
import IngredientBadge from "@/components/IngredientBadge";
import { formatPrice, getScoreColor } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Serum = typeof serums[0];

const scoreCategories = [
  { key: "ingredient", label: "Ingredient Quality", max: 25, icon: "🧪" },
  { key: "stability", label: "Stability", max: 30, icon: "🌡️" },
  { key: "packaging", label: "Packaging", max: 15, icon: "📦" },
  { key: "ux", label: "User Experience", max: 20, icon: "✨" },
  { key: "value", label: "Value for Money", max: 10, icon: "💰" },
];

function ComparePageInner() {
  const searchParams = useSearchParams();
  const initialIds = searchParams.get("ids")?.split(",").map(Number).filter(Boolean) ?? [];

  const [selected, setSelected] = useState<Serum[]>(() =>
    initialIds
      .map((id) => serums.find((s) => s.id === id))
      .filter(Boolean) as Serum[]
  );
  const [search, setSearch] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const addSerum = (s: Serum) => {
    if (!selected.find((x) => x.id === s.id) && selected.length < 5) {
      setSelected((prev) => [...prev, s]);
      setSearch("");
      setShowPicker(false);
    }
  };

  const removeSerum = (id: number) => {
    setSelected((prev) => prev.filter((s) => s.id !== id));
  };

  const filtered = search
    ? serums.filter(
        (s) =>
          !selected.find((x) => x.id === s.id) &&
          (s.name.toLowerCase().includes(search.toLowerCase()) ||
           s.brand.toLowerCase().includes(search.toLowerCase()))
      )
    : [];

  const getBest = (key: string): number | null => {
    if (selected.length < 2) return null;
    return Math.max(...selected.map((s) => s.scores[key as keyof typeof s.scores] as number));
  };

  return (
    <div className="pt-24 pb-20 min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <p className="text-orange-500 text-sm font-semibold uppercase tracking-wider mb-2">
            Comparison Tool
          </p>
          <h1 className="text-3xl md:text-4xl font-black mb-3" style={{ color: "var(--text-primary)" }}>
            Compare Serums Side-by-Side
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Add up to 5 serums to compare ingredient quality, stability, packaging, and value.
          </p>
        </div>

        {/* Selected serums header row */}
        <div className="overflow-x-auto">
          <div className="min-w-max">
            <div className="flex gap-4 mb-6">
              {/* Row label col */}
              <div className="w-40 shrink-0" />

              {/* Selected serum cols */}
              {selected.map((serum) => (
                <div key={serum.id} className="w-48 shrink-0">
                  <div className="glass rounded-2xl p-4 text-center relative">
                    <button
                      onClick={() => removeSerum(serum.id)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full hover:bg-red-50 transition-colors flex items-center justify-center"
                      style={{ background: "var(--bg-subtle)", color: "var(--text-muted)" }}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-20 h-20 mx-auto mb-2 rounded-xl bg-[#EFF5FF] overflow-hidden flex items-center justify-center">
                      <img src={serum.image} alt={serum.name} className="w-full h-full object-contain p-1" onError={(e) => { (e.target as HTMLImageElement).outerHTML = '<div class="text-3xl">🧪</div>'; }} />
                    </div>
                    <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>{serum.brand}</p>
                    <p className="text-xs font-bold leading-tight mb-2 line-clamp-2" style={{ color: "var(--text-primary)" }}>{serum.name}</p>
                    <IngredientBadge type={serum.vitamin_c_type} size="sm" />
                    <div className="mt-3 flex justify-center">
                      <ScoreRing score={serum.scores.total} size={60} strokeWidth={5} />
                    </div>
                    <p className="text-sm font-bold mt-2" style={{ color: "var(--text-primary)" }}>{formatPrice(serum.price)}</p>
                  </div>
                </div>
              ))}

              {/* Add serum col */}
              {selected.length < 5 && (
                <div className="w-48 shrink-0">
                  <div className="relative">
                    <button
                      onClick={() => setShowPicker(!showPicker)}
                      className="w-full h-full glass rounded-2xl p-4 border-dashed border-2 hover:border-orange-400 transition-colors flex flex-col items-center justify-center gap-2 min-h-full"
                      style={{ minHeight: "216px", borderColor: "var(--border)" }}
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "var(--bg-subtle)" }}>
                        <Plus className="w-5 h-5 text-orange-500" />
                      </div>
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>Add Serum</span>
                    </button>

                    {showPicker && (
                      <div className="absolute top-full left-0 mt-2 z-20 w-64 glass-strong rounded-2xl p-3 shadow-2xl">
                        <input
                          autoFocus
                          type="text"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Search serums..."
                          className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 mb-2"
                          style={{
                            background: "var(--bg-subtle)",
                            border: "1px solid var(--border)",
                            color: "var(--text-primary)",
                          }}
                        />
                        <div className="max-h-48 overflow-y-auto space-y-1">
                          {search.length > 0 && filtered.length === 0 && (
                            <p className="text-xs p-2" style={{ color: "var(--text-muted)" }}>No results found</p>
                          )}
                          {search.length === 0 &&
                            serums
                              .filter((s) => !selected.find((x) => x.id === s.id))
                              .slice(0, 8)
                              .map((s) => (
                                <button
                                  key={s.id}
                                  onClick={() => addSerum(s)}
                                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors"
                                >
                                  <p className="text-xs font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>{s.name}</p>
                                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{s.brand}</p>
                                </button>
                              ))}
                          {filtered.map((s) => (
                            <button
                              key={s.id}
                              onClick={() => addSerum(s)}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors"
                            >
                              <p className="text-xs font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>{s.name}</p>
                              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{s.brand}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Comparison rows */}
            {selected.length >= 1 && (
              <div className="space-y-3">
                {/* Score rows */}
                {scoreCategories.map((cat) => {
                  const best = getBest(cat.key);
                  return (
                    <div key={cat.key} className="flex gap-4 items-center">
                      <div className="w-40 shrink-0">
                        <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                          {cat.icon} {cat.label}
                        </p>
                        <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Max: {cat.max} pts</p>
                      </div>
                      {selected.map((serum) => {
                        const score = serum.scores[cat.key as keyof typeof serum.scores] as number;
                        const isBest = best !== null && score === best && selected.length > 1;
                        return (
                          <div key={serum.id} className="w-48 shrink-0">
                            <div
                              className={cn(
                                "glass rounded-xl p-3",
                                isBest ? "border-green-300 bg-green-50" : ""
                              )}
                            >
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{score}</span>
                                {isBest && (
                                  <span className="flex items-center gap-0.5 text-[10px] text-green-600 font-semibold">
                                    <Check className="w-3 h-3" />
                                    Best
                                  </span>
                                )}
                              </div>
                              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-muted)" }}>
                                <div
                                  className="h-full rounded-full transition-all"
                                  style={{
                                    width: `${(score / cat.max) * 100}%`,
                                    backgroundColor: getScoreColor((score / cat.max) * 100),
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}

                {/* Divider */}
                <div className="h-px my-4" style={{ background: "var(--border)" }} />

                {/* Extra attributes */}
                {[
                  {
                    label: "💊 Concentration",
                    getValue: (s: Serum) => `${s.concentration_percent}%`,
                    compare: (a: Serum, b: Serum) => a.concentration_percent > b.concentration_percent,
                  },
                  {
                    label: "⚗️ pH Level",
                    getValue: (s: Serum) => s.ph_level.toString(),
                    compare: () => false,
                  },
                  {
                    label: "💵 Price/ml",
                    getValue: (s: Serum) => `₹${(s.price / s.volume_ml).toFixed(0)}`,
                    compare: (a: Serum, b: Serum) => a.price / a.volume_ml < b.price / b.volume_ml,
                  },
                ].map((row) => (
                  <div key={row.label} className="flex gap-4 items-center">
                    <div className="w-40 shrink-0">
                      <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{row.label}</p>
                    </div>
                    {selected.map((serum) => (
                      <div key={serum.id} className="w-48 shrink-0">
                        <div className="glass rounded-xl p-3">
                          <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{row.getValue(serum)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}

                {/* Skin types row */}
                <div className="flex gap-4 items-start">
                  <div className="w-40 shrink-0 pt-2">
                    <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>🧴 Skin Types</p>
                  </div>
                  {selected.map((serum) => (
                    <div key={serum.id} className="w-48 shrink-0">
                      <div className="glass rounded-xl p-3 flex flex-wrap gap-1">
                        {serum.skin_types.map((t) => (
                          <span
                            key={t}
                            className="px-1.5 py-0.5 rounded text-[10px] capitalize"
                            style={{ background: "var(--bg-subtle)", color: "var(--text-secondary)" }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Buy row */}
                <div className="flex gap-4 items-center">
                  <div className="w-40 shrink-0">
                    <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>🛒 Buy Now</p>
                  </div>
                  {selected.map((serum) => (
                    <div key={serum.id} className="w-48 shrink-0">
                      <Link
                        href={`/serums/${serum.slug}`}
                        className="block text-center py-2 rounded-xl text-xs font-semibold hover:opacity-80 transition-opacity"
                        style={{ background: "var(--bg-subtle)", color: "var(--blue-600)", border: "1px solid var(--border)" }}
                      >
                        View Full Review
                        <ArrowRight className="inline w-3 h-3 ml-1" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {selected.length === 0 && (
              <div className="text-center py-20 glass rounded-3xl">
                <p className="text-5xl mb-4">⚖️</p>
                <h2 className="font-bold text-lg mb-2" style={{ color: "var(--text-primary)" }}>Start Comparing Serums</h2>
                <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
                  Click &quot;Add Serum&quot; to pick up to 5 serums to compare side-by-side.
                </p>
                <button
                  onClick={() => setShowPicker(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Serum
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="pt-24 min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div style={{ color: "var(--text-muted)" }}>Loading...</div>
      </div>
    }>
      <ComparePageInner />
    </Suspense>
  );
}
