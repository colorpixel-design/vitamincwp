"use client";

import { useEffect, useState } from "react";
import { Users, ShieldCheck, Edit2, ToggleLeft, ToggleRight } from "lucide-react";

type User = { id: string; name: string; email: string; role: string; isActive: boolean; createdAt: string };

const ROLES = ["MASTER_ADMIN", "CONTENT_CREATOR", "VISITOR"] as const;
const ROLE_LABELS: Record<string, string> = { MASTER_ADMIN: "Master Admin", CONTENT_CREATOR: "Content Creator", VISITOR: "Visitor" };
const ROLE_COLORS: Record<string, string> = {
  MASTER_ADMIN: "bg-[#EFF5FF] text-[#1E5FA3] border-[#BFDBFE]",
  CONTENT_CREATOR: "bg-[#FFF7EE] text-[#E07C1C] border-[#FDBA74]",
  VISITOR: "bg-[#ECFDF5] text-green-700 border-[#A7F3D0]",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const updateUser = async (id: string, changes: Partial<{ role: string; isActive: boolean }>) => {
    setSaving(true);
    await fetch("/api/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...changes }),
    });
    await fetchUsers();
    setSaving(false);
    setEditing(null);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#0C1E30]">Users</h1>
        <p className="text-[#7A93AD] text-sm">{users.length} registered users</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#D6E0ED] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E4EAF3] bg-[#F7F9FC]">
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#7A93AD] uppercase tracking-wide">User</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#7A93AD] uppercase tracking-wide hidden sm:table-cell">Role</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#7A93AD] uppercase tracking-wide hidden md:table-cell">Joined</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#7A93AD] uppercase tracking-wide">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-[#7A93AD] uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F7FB]">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4"><div className="flex gap-3"><div className="w-9 h-9 bg-[#E4EAF3] rounded-full" /><div><div className="h-3.5 bg-[#E4EAF3] rounded w-28 mb-1" /><div className="h-2.5 bg-[#E4EAF3] rounded w-36" /></div></div></td>
                    <td className="px-5 py-4 hidden sm:table-cell"><div className="h-5 w-24 bg-[#E4EAF3] rounded-full" /></td>
                    <td className="px-5 py-4 hidden md:table-cell"><div className="h-3 bg-[#E4EAF3] rounded w-20" /></td>
                    <td className="px-5 py-4"><div className="h-5 w-14 bg-[#E4EAF3] rounded" /></td>
                    <td className="px-5 py-4"><div className="h-7 w-24 bg-[#E4EAF3] rounded-lg ml-auto" /></td>
                  </tr>
                ))
              ) : users.map((u) => (
                <tr key={u.id} className="hover:bg-[#FAFBFD]">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#EFF5FF] border border-[#BFDBFE] flex items-center justify-center flex-shrink-0">
                        <span className="text-[#1E5FA3] text-sm font-bold">{u.name?.[0]?.toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0C1E30]">{u.name}</p>
                        <p className="text-xs text-[#7A93AD]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    {editing === u.id ? (
                      <select
                        defaultValue={u.role}
                        onChange={(e) => updateUser(u.id, { role: e.target.value })}
                        disabled={saving}
                        className="text-xs border border-[#D6E0ED] rounded-lg px-2 py-1 text-[#0C1E30] focus:outline-none focus:border-[#1E5FA3]"
                      >
                        {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                      </select>
                    ) : (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${ROLE_COLORS[u.role]}`}>
                        {ROLE_LABELS[u.role] || u.role}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-[#7A93AD] hidden md:table-cell">
                    {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-medium ${u.isActive ? "text-green-700" : "text-red-600"}`}>
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditing(editing === u.id ? null : u.id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#EFF5FF] text-[#1E5FA3] hover:bg-[#DBEAFE] text-xs font-medium"
                      >
                        <Edit2 className="w-3 h-3" />
                        {editing === u.id ? "Done" : "Edit"}
                      </button>
                      <button
                        onClick={() => updateUser(u.id, { isActive: !u.isActive })}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          u.isActive
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-green-50 text-green-700 hover:bg-green-100"
                        }`}
                      >
                        {u.isActive ? <ToggleRight className="w-3 h-3" /> : <ToggleLeft className="w-3 h-3" />}
                        {u.isActive ? "Disable" : "Enable"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
