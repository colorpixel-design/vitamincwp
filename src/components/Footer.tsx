import Link from "next/link";
import { FlaskConical, Mail } from "lucide-react";

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.26 5.632 5.905-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

const footerLinks = {
  Tools: [
    { label: "Serum Database", href: "/serums" },
    { label: "Compare Serums", href: "/compare" },
    { label: "Find My Serum Quiz", href: "/quiz" },
  ],
  "Ingredient Science": [
    { label: "L-Ascorbic Acid", href: "/ingredients/l-ascorbic-acid" },
    { label: "Ethyl Ascorbic Acid", href: "/ingredients/ethyl-ascorbic-acid" },
    { label: "Sodium Ascorbyl Phosphate", href: "/ingredients/sodium-ascorbyl-phosphate" },
    { label: "All Ingredients", href: "/ingredients" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Our Methodology", href: "/methodology" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Contact", href: "/contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-[#D6E0ED] bg-white">
      {/* Top accent */}
      <div className="h-0.5 bg-gradient-to-r from-[#1E5FA3] via-[#2B7FD4] to-[#E07C1C]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer grid */}
        <div className="py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#1E5FA3] flex items-center justify-center">
                <FlaskConical className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-bold text-[15px] text-[#0C1E30]">VitaminC</span>
                <span className="text-[9px] text-[#1E5FA3] font-semibold tracking-[0.12em] uppercase">India</span>
              </div>
            </Link>
            <p className="text-sm text-[#3A5068] leading-relaxed mb-6">
              India&apos;s most trusted, science-backed platform for Vitamin C serum knowledge. No bias. Just science.
            </p>
            <div className="flex items-center gap-2.5">
              {[XIcon, InstagramIcon, YoutubeIcon].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg border border-[#D6E0ED] flex items-center justify-center text-[#7A93AD] hover:text-[#1E5FA3] hover:border-[#1E5FA3] transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-[11px] font-bold text-[#7A93AD] uppercase tracking-widest mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#3A5068] hover:text-[#1E5FA3] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="py-8 border-t border-[#E4EAF3]">
          <div className="bg-[#EFF5FF] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-[#0C1E30] mb-1">Stay updated with our science digest</h4>
              <p className="text-sm text-[#3A5068]">New serum reviews, ingredient breakdowns, and dermatologist tips.</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="you@email.com"
                className="flex-1 sm:w-56 px-4 py-2.5 rounded-lg bg-white border border-[#D6E0ED] text-sm text-[#0C1E30] placeholder:text-[#7A93AD] focus:outline-none focus:border-[#1E5FA3]"
              />
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1E5FA3] text-white text-sm font-semibold hover:bg-[#164D8A] transition-colors whitespace-nowrap">
                <Mail className="w-4 h-4" />
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-[#E4EAF3] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#7A93AD]">
            © {new Date().getFullYear()} VitaminC India. All rights reserved.
          </p>
          <p className="text-xs text-[#7A93AD]">
            Scores are editorial opinion. Consult a dermatologist before starting any new serum.
          </p>
        </div>
      </div>
    </footer>
  );
}
