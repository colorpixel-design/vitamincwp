"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Star, FlaskConical, ChevronUp, ChevronDown } from "lucide-react";

type Serum = {
  id: number; slug: string; name: string; brand: string;
  vitamin_c_type: string; price: number; rank: number;
  scores: { total: number }; is_featured: boolean;
};

const TYPE_COLORS: Record<string, string> = {
  LAA: "bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]",
  EAA: "bg-[#ECFDF5] text-[#065F46] border-[#6EE7B7]",
  SAP: "bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]",
  MAP: "bg-[#F5F3FF] text-[#4C1D95] border-[#DDD6FE]",
  AA2G: "bg-[#FFF7EE] text-[#9A3412] border-[#FDBA74]",
};

export default function AdminSerumsPage() {
  const [serums, setSerums] = useState<Serum[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetchSerums = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/serums${search ? `?search=${encodeURIComponent(search)}` : ""}`);
    const data = await res.json();
    setSerums(data);
    setLoading(false);
  }, [search]);

  useEffect(() => { fetchSerums(); }, [fetchSerums]);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    await fetch(`/api/serums/${id}`, { method: "DELETE" });
    await fetchSerums();
    setDeleting(null);
  };

  const getScore = (score: number) => {
    if (score >= 90) return "text-green-700 bg-green-50";
    if (score >= 80) return "text-[#1E5FA3] bg-[#EFF5FF]";
    if (score >= 70) return "text-amber-700 bg-amber-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0C1E30]">Serums</h1>
          <p className="text-[#7A93AD] text-sm">{serums.length} serums in database</p>
        </div>
        <Link
          href="/admin/serums/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E5FA3] text-white text-sm font-semibold hover:bg-[#164D8A] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Serum
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A93AD]" />
        <input
          type="text"
          placeholder="Search serums..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white rounded-xl border border-[#D6E0ED] text-sm text-[#0C1E30] placeholder:text-[#7A93AD] focus:outline-none focus:border-[#1E5FA3] focus:ring-1 focus:ring-[#1E5FA3]/20"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#D6E0ED] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E4EAF3] bg-[#F7F9FC]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#7A93AD] uppercase tracking-wide w-12">Rank</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#7A93AD] uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#7A93AD] uppercase tracking-wide hidden sm:table-cell">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#7A93AD] uppercase tracking-wide hidden md:table-cell">Price</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#7A93AD] uppercase tracking-wide hidden lg:table-cell">Score</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#7A93AD] uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F7FB]">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-3"><div className="h-5 w-6 bg-[#E4EAF3] rounded" /></td>
                    <td className="px-4 py-3">
                      <div className="h-4 bg-[#E4EAF3] rounded w-48 mb-1" />
                      <div className="h-3 bg-[#E4EAF3] rounded w-24" />
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell"><div className="h-5 w-16 bg-[#E4EAF3] rounded-full" /></td>
                    <td className="px-4 py-3 hidden md:table-cell"><div className="h-4 w-16 bg-[#E4EAF3] rounded" /></td>
                    <td className="px-4 py-3 hidden lg:table-cell"><div className="h-5 w-10 bg-[#E4EAF3] rounded" /></td>
                    <td className="px-4 py-3"><div className="h-7 w-20 bg-[#E4EAF3] rounded-lg ml-auto" /></td>
                  </tr>
                ))
              ) : serums.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <FlaskConical className="w-10 h-10 text-[#D6E0ED] mx-auto mb-3" />
                    <p className="text-[#7A93AD] text-sm">No serums found. Run the seed script first.</p>
                    <Link href="/admin/serums/new" className="text-xs text-[#1E5FA3] hover:underline mt-1 inline-block">Add manually →</Link>
                  </td>
                </tr>
              ) : (
                serums.map((serum) => (
                  <tr key={serum.id} className="hover:bg-[#FAFBFD]">
                    <td className="px-4 py-3">
                      <span className="text-sm font-bold text-[#7A93AD]">#{serum.rank}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {serum.is_featured && <Star className="w-3 h-3 text-amber-400 fill-amber-400 flex-shrink-0" />}
                        <div>
                          <p className="text-sm font-semibold text-[#0C1E30]">{serum.name}</p>
                          <p className="text-xs text-[#7A93AD]">{serum.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${TYPE_COLORS[serum.vitamin_c_type] || ""}`}>
                        {serum.vitamin_c_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#3A5068] hidden md:table-cell">₹{serum.price}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${getScore(serum.scores?.total ?? 0)}`}>
                        {serum.scores?.total ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/serums/${serum.id}/edit`}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#EFF5FF] text-[#1E5FA3] hover:bg-[#DBEAFE] text-xs font-medium transition-colors"
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(serum.id, serum.name)}
                          disabled={deleting === serum.id}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-3 h-3" />
                          {deleting === serum.id ? "..." : "Del"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
