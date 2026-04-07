"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FlaskConical, Droplets, Building2, Tag, Users, TrendingUp, Plus, Clock } from "lucide-react";

type Stats = {
  content: { serums: number; ingredients: number; brands: number; categories: number };
  users: { total: number; admin: number; creator: number; visitor: number };
  recentSerums: { id: number; name: string; brand: { name: string }; createdAt: string }[];
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  const contentCards = [
    { label: "Serums", value: stats?.content.serums ?? "—", icon: FlaskConical, href: "/admin/serums", color: "bg-[#EFF5FF] text-[#1E5FA3]", border: "border-[#BFDBFE]" },
    { label: "Ingredients", value: stats?.content.ingredients ?? "—", icon: Droplets, href: "/admin/ingredients", color: "bg-[#ECFDF5] text-green-700", border: "border-[#A7F3D0]" },
    { label: "Brands", value: stats?.content.brands ?? "—", icon: Building2, href: "/admin/brands", color: "bg-[#FFF7EE] text-[#E07C1C]", border: "border-[#FDBA74]" },
    { label: "Categories", value: stats?.content.categories ?? "—", icon: Tag, href: "/admin/categories", color: "bg-[#F5F3FF] text-violet-700", border: "border-[#DDD6FE]" },
  ];

  const userCards = [
    { label: "Total Users", value: stats?.users.total ?? "—", color: "text-[#0C1E30]" },
    { label: "Admins", value: stats?.users.admin ?? "—", color: "text-[#1E5FA3]" },
    { label: "Creators", value: stats?.users.creator ?? "—", color: "text-[#E07C1C]" },
    { label: "Visitors", value: stats?.users.visitor ?? "—", color: "text-green-700" },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0C1E30]">Dashboard</h1>
        <p className="text-[#7A93AD] text-sm mt-1">Manage all content for VitaminC India</p>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {contentCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-2xl p-5 border border-[#D6E0ED] hover:border-[#1E5FA3]/30 hover:shadow-sm transition-all group"
          >
            <div className={`w-10 h-10 rounded-xl ${card.color} border ${card.border} flex items-center justify-center mb-3`}>
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-[#0C1E30] tabular-nums">
              {loading ? <span className="animate-pulse">—</span> : card.value}
            </p>
            <p className="text-xs text-[#7A93AD] mt-0.5">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Serums */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#D6E0ED] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E4EAF3]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#1E5FA3]" />
              <h2 className="font-bold text-sm text-[#0C1E30]">Recently Added Serums</h2>
            </div>
            <Link href="/admin/serums/new" className="flex items-center gap-1 text-xs text-[#1E5FA3] hover:underline font-medium">
              <Plus className="w-3 h-3" /> Add Serum
            </Link>
          </div>
          <div className="divide-y divide-[#F4F7FB]">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-6 py-3 animate-pulse flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#E4EAF3] rounded-lg" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-[#E4EAF3] rounded w-48" />
                    <div className="h-2.5 bg-[#E4EAF3] rounded w-24" />
                  </div>
                </div>
              ))
            ) : stats?.recentSerums?.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <FlaskConical className="w-8 h-8 text-[#D6E0ED] mx-auto mb-2" />
                <p className="text-sm text-[#7A93AD]">No serums yet. Run the seed script to import data.</p>
                <Link href="/admin/serums/new" className="text-xs text-[#1E5FA3] hover:underline mt-1 inline-block">Add manually</Link>
              </div>
            ) : (
              stats?.recentSerums?.map((s) => (
                <div key={s.id} className="px-6 py-3 flex items-center gap-3 hover:bg-[#F7F9FC]">
                  <div className="w-8 h-8 rounded-lg bg-[#EFF5FF] border border-[#BFDBFE] flex items-center justify-center">
                    <FlaskConical className="w-4 h-4 text-[#1E5FA3]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0C1E30] truncate">{s.name}</p>
                    <p className="text-xs text-[#7A93AD]">{s.brand?.name}</p>
                  </div>
                  <Link href={`/admin/serums/${s.id}/edit`} className="text-xs text-[#1E5FA3] hover:underline">Edit</Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* User stats */}
          <div className="bg-white rounded-2xl border border-[#D6E0ED] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-[#1E5FA3]" />
              <h2 className="font-bold text-sm text-[#0C1E30]">Users</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {userCards.map((u) => (
                <div key={u.label} className="bg-[#F4F7FB] rounded-xl p-3 border border-[#E4EAF3]">
                  <p className={`text-xl font-black tabular-nums ${u.color}`}>
                    {loading ? "—" : u.value}
                  </p>
                  <p className="text-[11px] text-[#7A93AD]">{u.label}</p>
                </div>
              ))}
            </div>
            <Link href="/admin/users" className="mt-3 text-xs text-[#1E5FA3] hover:underline flex items-center gap-1">
              Manage Users →
            </Link>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-[#D6E0ED] p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-[#1E5FA3]" />
              <h2 className="font-bold text-sm text-[#0C1E30]">Quick Actions</h2>
            </div>
            <div className="space-y-2">
              {[
                { label: "Add New Serum", href: "/admin/serums/new", icon: FlaskConical },
                { label: "Add Ingredient", href: "/admin/ingredients/new", icon: Droplets },
                { label: "Add Brand", href: "/admin/brands", icon: Building2 },
                { label: "Manage Categories", href: "/admin/categories", icon: Tag },
              ].map((a) => (
                <Link
                  key={a.href}
                  href={a.href}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#EFF5FF] text-sm text-[#3A5068] hover:text-[#1E5FA3] transition-colors"
                >
                  <a.icon className="w-4 h-4" />
                  {a.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
