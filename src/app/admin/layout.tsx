"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, FlaskConical, Droplets, Tag, Building2,
  Users, LogOut, ChevronRight, Menu, X, Shield,
} from "lucide-react";

type User = { id: string; name: string; email: string; role: string };

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/serums", label: "Serums", icon: FlaskConical },
  { href: "/admin/ingredients", label: "Ingredients", icon: Droplets },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/brands", label: "Brands", icon: Building2 },
  { href: "/admin/users", label: "Users", icon: Users, adminOnly: true },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.user) router.replace("/login?redirect=/admin");
        else if (d.user.role === "VISITOR") router.replace("/");
        else setUser(d.user);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  };

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#1E5FA3] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[#7A93AD] text-sm">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-[#D6E0ED]">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1E5FA3] flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-black text-[#0C1E30] text-sm">VitaminC Admin</p>
            <p className="text-[10px] text-[#7A93AD]">Content Management</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          if (item.adminOnly && user?.role !== "MASTER_ADMIN") return null;
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-[#EFF5FF] text-[#1E5FA3] border border-[#BFDBFE]"
                  : "text-[#3A5068] hover:bg-[#F4F7FB] hover:text-[#0C1E30]"
              }`}
            >
              <item.icon className={`w-4 h-4 ${active ? "text-[#1E5FA3]" : "text-[#7A93AD]"}`} />
              {item.label}
              {active && <ChevronRight className="w-3 h-3 ml-auto text-[#1E5FA3]" />}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="p-4 border-t border-[#D6E0ED]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-[#EFF5FF] border border-[#BFDBFE] flex items-center justify-center">
            <span className="text-[#1E5FA3] text-sm font-bold">{user?.name?.[0]?.toUpperCase()}</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#0C1E30] truncate">{user?.name}</p>
            <p className="text-[10px] text-[#7A93AD] truncate">
              {user?.role === "MASTER_ADMIN" ? "Master Admin" : user?.role === "CONTENT_CREATOR" ? "Content Creator" : "Visitor"}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-[#D6E0ED] fixed top-0 left-0 h-full z-30">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-60 bg-white h-full shadow-xl z-50">
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-60 flex flex-col">
        {/* Top bar */}
        <header className="bg-white border-b border-[#D6E0ED] sticky top-0 z-20 px-4 sm:px-6 py-3.5 flex items-center gap-4">
          <button
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-[#F4F7FB] border border-[#D6E0ED]"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-4 h-4 text-[#3A5068]" />
          </button>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#0C1E30]">Admin Panel</p>
            <p className="text-xs text-[#7A93AD] hidden sm:block">{pathname}</p>
          </div>
          <Link
            href="/"
            className="text-xs text-[#3A5068] hover:text-[#1E5FA3] flex items-center gap-1 transition-colors"
          >
            View Site →
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
