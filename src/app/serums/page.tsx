"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, SlidersHorizontal, X, ArrowLeftRight } from "lucide-react";
import SerumCard from "@/components/SerumCard";
import { cn } from "@/lib/utils";

const vitCTypes = ["All", "LAA", "EAA", "SAP", "MAP", "AA2G"];
const skinTypes = ["All", "oily", "dry", "combination", "sensitive", "normal"];
const concerns = ["All", "brightening", "anti-aging", "acne", "hyperpigmentation", "hydration"];
const budgets = [
  { label: "All Budgets", max: Infinity },
  { label: "Under ₹500", max: 500 },
  { label: "₹500 – ₹1,000", max: 1000, min: 500 },
  { label: "₹1,000 – ₹3,000", max: 3000, min: 1000 },
  { label: "₹3,000+", min: 3000, max: Infinity },
];

type Serum = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  tagline: string;
  vitamin_c_type: string;
  concentration_percent: number;
  ph_level: number;
  price: number;
  volume_ml: number;
  rank: number;
  is_featured: boolean;
  image_url?: string;
  badges: string[];
  scores: { total: number; efficacy: number; stability: number; formulation: number; value: number };
  concerns: string[];
  skin_types: string[];
  pros: string[];
  cons: string[];
  key_ingredients: string[];
  buy_links: Record<string, string>;
  dermatologist_verdict: string;
};

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-xs font-semibold transition-all border",
        active
          ? "bg-[#1E5FA3] border-[#1E5FA3] text-white"
          : "bg-white border-[#D6E0ED] text-[#3A5068] hover:border-[#1E5FA3] hover:text-[#1E5FA3]"
      )}
    >
      {label}
    </button>
  );
}

function SerumsPageInner() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type")?.toUpperCase() ?? "All";
  const validType = ["LAA", "EAA", "SAP", "MAP", "AA2G"].includes(typeParam) ? typeParam : "All";

  const [allSerums, setAllSerums] = useState<Serum[]>([]);
  const [loadingSerums, setLoadingSerums] = useState(true);
  const [search, setSearch] = useState("");
  const [vitCFilter, setVitCFilter] = useState(validType);
  const [skinFilter, setSkinFilter] = useState("All");
  const [concernFilter, setConcernFilter] = useState("All");
  const [budgetIdx, setBudgetIdx] = useState(0);
  const [sortBy, setSortBy] = useState<"rank" | "price-asc" | "price-desc" | "score">("rank");
  const [compareList, setCompareList] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(validType !== "All");

  useEffect(() => {
    fetch("/api/serums")
      .then((r) => r.json())
      .then((data) => { setAllSerums(Array.isArray(data) ? data : []); })
      .catch(() => setAllSerums([]))
      .finally(() => setLoadingSerums(false));
  }, []);

  useEffect(() => {
    setVitCFilter(validType);
    if (validType !== "All") setShowFilters(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeParam]);

  const filtered = useMemo(() => {
    let result: Serum[] = [...allSerums];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) => s.name.toLowerCase().includes(q) || s.brand.toLowerCase().includes(q) || s.vitamin_c_type.toLowerCase().includes(q)
      );
    }
    if (vitCFilter !== "All") result = result.filter((s) => s.vitamin_c_type === vitCFilter);
    if (skinFilter !== "All") result = result.filter((s) => s.skin_types.includes(skinFilter) || s.skin_types.includes("all"));
    if (concernFilter !== "All") result = result.filter((s) => s.concerns.includes(concernFilter));
    const budget = budgets[budgetIdx];
    if (budget.max !== Infinity || (budget as { min?: number }).min) {
      result = result.filter((s) => {
        const min = (budget as { min?: number }).min ?? 0;
        return s.price >= min && s.price <= (budget.max ?? Infinity);
      });
    }
    if (sortBy === "rank") result.sort((a, b) => a.rank - b.rank);
    else if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "score") result.sort((a, b) => b.scores.total - a.scores.total);
    return result;
  }, [allSerums, search, vitCFilter, skinFilter, concernFilter, budgetIdx, sortBy]);

  const toggleCompare = (id: number) => {
    setCompareList((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= 5 ? prev : [...prev, id]
    );
  };

  const clearFilters = () => {
    setSearch(""); setVitCFilter("All"); setSkinFilter("All"); setConcernFilter("All"); setBudgetIdx(0); setSortBy("rank");
  };

  const hasActiveFilters = search || vitCFilter !== "All" || skinFilter !== "All" || concernFilter !== "All" || budgetIdx !== 0;

  return (
    <div className="pt-[69px] min-h-screen bg-[#F7F9FC]">
      {/* Page header */}
      <div className="bg-white border-b border-[#D6E0ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-[#1E5FA3] text-sm font-semibold uppercase tracking-wider mb-2">Complete Database</p>
          <h1 className="text-3xl md:text-4xl font-black text-[#0C1E30]">Vitamin C Serum Database</h1>
          <p className="text-[#3A5068] mt-2 text-sm">
            {loadingSerums ? "Loading serums…" : `${allSerums.length} serums reviewed and scored. Filter by skin type, concern, budget, and Vitamin C form.`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + Sort bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A93AD]" />
            <input
              id="serum-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, brand, or Vitamin C type..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#D6E0ED] text-sm text-[#0C1E30] placeholder:text-[#7A93AD] focus:outline-none focus:border-[#1E5FA3]"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A93AD] hover:text-[#0C1E30]">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <select
            id="serum-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-3 rounded-xl bg-white border border-[#D6E0ED] text-sm text-[#0C1E30] focus:outline-none focus:border-[#1E5FA3] cursor-pointer"
          >
            <option value="rank">Sort: Our Ranking</option>
            <option value="score">Sort: Highest Score</option>
            <option value="price-asc">Sort: Price ↑</option>
            <option value="price-desc">Sort: Price ↓</option>
          </select>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all border",
              showFilters
                ? "bg-[#EFF5FF] text-[#1E5FA3] border-[#BFDBFE]"
                : "bg-white border-[#D6E0ED] text-[#3A5068] hover:text-[#1E5FA3] hover:border-[#1E5FA3]"
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-[#1E5FA3]" />}
          </button>

          {hasActiveFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1.5 px-3 py-3 rounded-xl text-xs text-[#7A93AD] hover:text-red-500 bg-white border border-[#D6E0ED] transition-colors">
              <X className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl p-5 mb-4 space-y-4 border border-[#D6E0ED]">
            {[
              { label: "Vitamin C Type", options: vitCTypes, value: vitCFilter, setter: setVitCFilter },
              { label: "Skin Type", options: skinTypes, value: skinFilter, setter: setSkinFilter },
              { label: "Skin Concern", options: concerns, value: concernFilter, setter: setConcernFilter },
            ].map((group) => (
              <div key={group.label}>
                <p className="text-xs text-[#7A93AD] uppercase tracking-wider mb-2.5 font-semibold">{group.label}</p>
                <div className="flex flex-wrap gap-2">
                  {group.options.map((t) => (
                    <FilterChip key={t} label={t} active={group.value === t} onClick={() => group.setter(t)} />
                  ))}
                </div>
              </div>
            ))}
            <div>
              <p className="text-xs text-[#7A93AD] uppercase tracking-wider mb-2.5 font-semibold">Budget</p>
              <div className="flex flex-wrap gap-2">
                {budgets.map((b, i) => (
                  <FilterChip key={b.label} label={b.label} active={budgetIdx === i} onClick={() => setBudgetIdx(i)} />
                ))}
              </div>
            </div>
          </div>
        )}

        <p className="text-sm text-[#7A93AD] mb-6">
          Showing <span className="text-[#0C1E30] font-semibold">{filtered.length}</span> serums
        </p>

        {/* Grid */}
        {loadingSerums ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#D6E0ED] p-5 animate-pulse">
                <div className="h-40 bg-[#F4F7FB] rounded-xl mb-4" />
                <div className="h-4 bg-[#E4EAF3] rounded w-3/4 mb-2" />
                <div className="h-3 bg-[#E4EAF3] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-[#D6E0ED]">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-[#0C1E30] font-semibold mb-2">No serums found</p>
            <p className="text-[#7A93AD] text-sm">Try adjusting your filters or search term</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 rounded-lg bg-[#EFF5FF] text-[#1E5FA3] text-sm font-semibold hover:bg-[#DBEAFE] transition-colors border border-[#BFDBFE]"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((serum) => (
              <SerumCard key={serum.id} serum={serum as any} compareList={compareList} onCompareToggle={toggleCompare} />
            ))}
          </div>
        )}
      </div>

      {/* Compare bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white rounded-2xl px-5 py-3.5 flex items-center gap-4 border border-[#D6E0ED] shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#3A5068]">
              <span className="text-[#1E5FA3] font-bold">{compareList.length}</span> serums selected
            </span>
            <span className="text-[#7A93AD] text-xs">(max 5)</span>
          </div>
          <Link
            href={`/compare?ids=${compareList.join(",")}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1E5FA3] text-white text-sm font-semibold hover:bg-[#164D8A] transition-colors"
          >
            <ArrowLeftRight className="w-4 h-4" />
            Compare Now
          </Link>
          <button onClick={() => setCompareList([])} className="text-[#7A93AD] hover:text-[#0C1E30] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function SerumsPage() {
  return (
    <Suspense fallback={
      <div className="pt-24 min-h-screen flex items-center justify-center bg-[#F7F9FC]">
        <div className="text-[#7A93AD]">Loading serums...</div>
      </div>
    }>
      <SerumsPageInner />
    </Suspense>
  );
}
