"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, FlaskConical, ArrowLeftRight, HelpCircle, Star, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/serums", label: "Serums DB", icon: Star },
  { href: "/compare", label: "Compare", icon: ArrowLeftRight },
  { href: "/ingredients", label: "Ingredient Science", icon: FlaskConical },
  { href: "/quiz", label: "Find Your Serum", icon: HelpCircle },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white",
        scrolled
          ? "border-b border-[#D6E0ED] shadow-sm"
          : "border-b border-transparent"
      )}
    >
      {/* Top accent bar */}
      <div className="h-0.5 bg-gradient-to-r from-[#1E5FA3] via-[#2B7FD4] to-[#E07C1C]" />

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[#1E5FA3] flex items-center justify-center shadow-sm group-hover:bg-[#164D8A] transition-colors">
              <FlaskConical className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-[15px] text-[#0C1E30] tracking-tight">VitaminC</span>
              <span className="text-[9px] text-[#1E5FA3] font-semibold tracking-[0.12em] uppercase">India</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-150",
                    isActive
                      ? "bg-[#EFF5FF] text-[#1E5FA3]"
                      : "text-[#3A5068] hover:text-[#1E5FA3] hover:bg-[#F5F8FC]"
                  )}
                >
                  <link.icon className="w-3.5 h-3.5" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/about"
              className="text-[13px] text-[#3A5068] hover:text-[#1E5FA3] font-medium transition-colors"
            >
              About
            </Link>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1E5FA3] text-white text-[13px] font-semibold hover:bg-[#164D8A] transition-colors shadow-sm"
            >
              Find My Serum →
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-[#3A5068] hover:text-[#1E5FA3] hover:bg-[#F5F8FC] transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-[#E4EAF3] pt-3 space-y-0.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-[#EFF5FF] text-[#1E5FA3]"
                      : "text-[#3A5068] hover:text-[#1E5FA3] hover:bg-[#F5F8FC]"
                  )}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-[#E4EAF3] mt-2">
              <Link
                href="/quiz"
                className="flex w-full items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#1E5FA3] text-white text-sm font-semibold"
              >
                Find My Serum →
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
