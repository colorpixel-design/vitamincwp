import Link from "next/link";
import {
  ArrowRight,
  FlaskConical,
  Star,
  ArrowLeftRight,
  ShieldCheck,
  Microscope,
  Users,
  Sparkles,
  TrendingUp,
  Zap,
  ChevronRight,
} from "lucide-react";
import serums from "@/data/serums.json";
import ingredients from "@/data/ingredients.json";
import SerumCard from "@/components/SerumCard";
import IngredientBadge from "@/components/IngredientBadge";
import ScoreRing from "@/components/ScoreRing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "India's Most Trusted Vitamin C Serum Platform",
  description:
    "Science-backed Vitamin C serum rankings, side-by-side comparisons, and ingredient science guides — built for Indian skin.",
};

const featuredSerums = serums.filter((s) => s.is_featured).slice(0, 3);
const top10 = serums.slice(0, 10);

const stats = [
  { label: "Serums Reviewed", value: "100+", icon: Star },
  { label: "Dermatologists Consulted", value: "12", icon: Users },
  { label: "Ingredients Decoded", value: "50+", icon: FlaskConical },
  { label: "Indian Skin Profiles Tested", value: "500+", icon: ShieldCheck },
];

const whyTrustUs = [
  {
    icon: Microscope,
    title: "Science-First Approach",
    desc: "Every serum is evaluated against peer-reviewed dermatological research, not marketing claims.",
  },
  {
    icon: ShieldCheck,
    title: "Totally Unbiased",
    desc: "We accept zero sponsored reviews. Our scores are purely based on ingredient science and user data.",
  },
  {
    icon: Users,
    title: "India-Specific",
    desc: "Climate, skin tone, and budget considerations unique to Indian consumers are central to every review.",
  },
  {
    icon: Zap,
    title: "Real-Time Updates",
    desc: "Our database is updated quarterly with new launches, formula changes, and updated clinical evidence.",
  },
];

const typeMap: Record<string, string> = {
  "l-ascorbic-acid": "LAA",
  "ethyl-ascorbic-acid": "EAA",
  "sodium-ascorbyl-phosphate": "SAP",
  "magnesium-ascorbyl-phosphate": "MAP",
  "ascorbyl-glucoside": "AA2G",
};

export default function HomePage() {
  return (
    <div className="pt-[69px]">

      {/* ─── HERO ─────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#EEF4FB] via-[#F4F8FD] to-[#FDFCFA] border-b border-[#D6E0ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF5FF] border border-[#BFDBFE] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E5FA3] animate-pulse" />
              <span className="text-xs font-semibold text-[#1E5FA3] tracking-wide">
                India&apos;s #1 Vitamin C Serum Authority
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-[#0C1E30] leading-[1.08] mb-6">
              Find Your{" "}
              <span className="gradient-text">Perfect</span>{" "}
              Vitamin C Serum
            </h1>

            <p className="text-lg md:text-xl text-[#3A5068] leading-relaxed mb-10 max-w-2xl">
              Science-backed rankings, side-by-side comparisons, and ingredient deep-dives — built specifically for{" "}
              <span className="text-[#E07C1C] font-semibold">Indian skin</span>.
              No bias. Just data.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/quiz"
                id="hero-quiz-cta"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#1E5FA3] text-white font-semibold hover:bg-[#164D8A] transition-colors shadow-sm text-sm"
              >
                <Sparkles className="w-4 h-4" />
                Find My Serum (Free Quiz)
              </Link>
              <Link
                href="/serums"
                id="hero-browse-cta"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#0C1E30] font-semibold hover:border-[#1E5FA3] hover:text-[#1E5FA3] transition-colors text-sm border border-[#D6E0ED]"
              >
                Browse 100+ Serums
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Hero stats */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl p-4 flex flex-col gap-2 border border-[#D6E0ED] shadow-sm">
                <stat.icon className="w-5 h-5 text-[#1E5FA3]" />
                <span className="text-2xl font-black text-[#0C1E30]">{stat.value}</span>
                <span className="text-xs text-[#7A93AD]">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TOP PICKS ────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[#1E5FA3] text-sm font-semibold uppercase tracking-wider mb-2">
              Editor&apos;s Top Picks
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-[#0C1E30]">
              Best Serums for Indian Skin <br />
              <span className="gradient-text">2026 Edition</span>
            </h2>
          </div>
          <Link
            href="/serums"
            className="hidden md:flex items-center gap-2 text-sm text-[#3A5068] hover:text-[#1E5FA3] transition-colors font-medium"
          >
            View all 100+ serums <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredSerums.map((serum) => (
            <SerumCard key={serum.id} serum={serum} variant="featured" />
          ))}
        </div>

        <div className="mt-6 flex justify-center md:hidden">
          <Link
            href="/serums"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#D6E0ED] text-sm text-[#3A5068] hover:text-[#1E5FA3] hover:border-[#1E5FA3] transition-colors"
          >
            View all 100+ serums <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ─── TOP 10 LIST ──────────────────────────────── */}
      <section className="py-20 section-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[#1E5FA3] text-sm font-semibold uppercase tracking-wider mb-2">
                Ranked &amp; Scored
              </p>
              <h2 className="text-3xl font-black text-[#0C1E30]">
                Top 10 Vitamin C Serums in India
              </h2>
            </div>
            <Link
              href="/compare"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-sm text-[#3A5068] hover:text-[#1E5FA3] hover:border-[#1E5FA3] transition-colors border border-[#D6E0ED]"
            >
              <ArrowLeftRight className="w-4 h-4" />
              Compare Side-by-Side
            </Link>
          </div>

          <div className="space-y-2">
            {top10.map((serum, idx) => (
              <Link
                key={serum.id}
                href={`/serums/${serum.slug}`}
                className="bg-white card-hover rounded-xl p-4 flex items-center gap-4 border border-[#D6E0ED] hover:border-[#1E5FA3]/40 transition-all group"
              >
                {/* Rank */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${
                    idx === 0
                      ? "bg-[#1E5FA3] text-white"
                      : idx < 3
                      ? "bg-[#EFF5FF] text-[#1E5FA3] border border-[#BFDBFE]"
                      : "bg-[#F4F7FB] text-[#7A93AD] border border-[#D6E0ED]"
                  }`}
                >
                  #{serum.rank}
                </div>

                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-[#EFF5FF] flex items-center justify-center shrink-0 text-xl">
                  🧪
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#7A93AD] font-medium">{serum.brand}</p>
                  <h3 className="font-semibold text-[#0C1E30] text-sm truncate">{serum.name}</h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <IngredientBadge type={serum.vitamin_c_type} size="sm" />
                    {serum.badges.slice(0, 1).map((b) => (
                      <span key={b} className="text-[10px] text-[#E07C1C] font-medium">
                        ✦ {b}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="hidden sm:block text-right shrink-0">
                  <p className="font-bold text-[#0C1E30] text-sm">{formatPrice(serum.price)}</p>
                  <p className="text-xs text-[#7A93AD]">{serum.volume_ml}ml</p>
                </div>

                {/* Score */}
                <ScoreRing score={serum.scores.total} size={52} strokeWidth={4} />

                {/* Arrow */}
                <ChevronRight className="w-4 h-4 text-[#B0C4D8] group-hover:text-[#1E5FA3] group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INGREDIENT SCIENCE HUB ───────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-[#1E5FA3] text-sm font-semibold uppercase tracking-wider mb-2">
            Ingredient Science
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-[#0C1E30] mb-4">
            Not All Vitamin C is Equal
          </h2>
          <p className="text-[#3A5068] max-w-2xl mx-auto text-base leading-relaxed">
            LAA, EAA, SAP, MAP, AA2G — each form of Vitamin C behaves differently on your skin.
            Understanding the differences is the key to picking the right serum.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ingredients.map((ing) => (
            <Link
              key={ing.id}
              href={`/ingredients/${ing.slug}`}
              className="glass card-hover rounded-2xl p-6 hover:border-[#B0C4D8] group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <IngredientBadge type={typeMap[ing.slug] || "LAA"} />
                  <h3 className="font-bold text-[#0C1E30] mt-2 text-sm leading-tight">{ing.name}</h3>
                  <p className="text-xs text-[#7A93AD] mt-0.5">{ing.alias}</p>
                </div>
              </div>

              {/* Stability bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-[#7A93AD] mb-1">
                  <span>Stability</span>
                  <span className="text-[#0C1E30] font-semibold">{ing.stability_rating}/10</span>
                </div>
                <div className="h-1.5 bg-[#E4EAF3] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#1E5FA3] to-[#2B7FD4]"
                    style={{ width: `${ing.stability_rating * 10}%` }}
                  />
                </div>
              </div>

              {/* Irritation */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#7A93AD]">Irritation Risk:</span>
                <span
                  className={`font-semibold ${
                    ing.irritation_risk === "High"
                      ? "text-red-600"
                      : ing.irritation_risk === "Low"
                      ? "text-green-600"
                      : ing.irritation_risk === "None"
                      ? "text-emerald-600"
                      : "text-amber-600"
                  }`}
                >
                  {ing.irritation_risk}
                </span>
              </div>

              <p className="text-xs text-[#3A5068] mt-3 line-clamp-2 leading-relaxed">
                {ing.description}
              </p>

              <div className="mt-4 flex items-center gap-1 text-[#1E5FA3] text-xs font-semibold group-hover:gap-2 transition-all">
                Read full breakdown <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}

          {/* CTA card */}
          <Link
            href="/ingredients"
            className="glass card-hover rounded-2xl p-6 border-dashed border-[#D6E0ED] hover:border-[#1E5FA3]/40 flex flex-col items-center justify-center text-center gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-[#EFF5FF] flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-[#1E5FA3]" />
            </div>
            <div>
              <h3 className="font-bold text-[#0C1E30] text-sm">Full Ingredient Guide</h3>
              <p className="text-xs text-[#7A93AD] mt-1">
                50+ ingredients decoded with clinical citations
              </p>
            </div>
            <span className="text-[#1E5FA3] text-xs font-semibold">Explore All →</span>
          </Link>
        </div>
      </section>

      {/* ─── COMPARE CTA ──────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-[#EFF5FF] to-[#F0F7FF] border-t border-[#DBEAFE] border-b border-[#DBEAFE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-[#D6E0ED] shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#EFF5FF] rounded-full blur-3xl pointer-events-none opacity-60" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF5FF] border border-[#BFDBFE] mb-4">
                  <TrendingUp className="w-3 h-3 text-[#1E5FA3]" />
                  <span className="text-xs text-[#1E5FA3] font-semibold">Comparison Tool</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-[#0C1E30] mb-4 leading-tight">
                  Can&apos;t Decide?{" "}
                  <span className="gradient-text">Compare</span>{" "}
                  Any 2–5 Serums Head-to-Head
                </h2>
                <p className="text-[#3A5068] text-base leading-relaxed mb-6 max-w-lg">
                  Our comparison engine shows you ingredient quality, stability, value for money,
                  and packaging score — side by side. No more guesswork.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/compare"
                    id="compare-cta-button"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#1E5FA3] text-white font-semibold hover:bg-[#164D8A] transition-colors shadow-sm text-sm"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                    Open Comparison Tool
                  </Link>
                  <Link
                    href="/quiz"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#0C1E30] font-semibold hover:border-[#1E5FA3] hover:text-[#1E5FA3] transition-colors text-sm border border-[#D6E0ED]"
                  >
                    Or Take the Quiz
                  </Link>
                </div>
              </div>

              {/* Sample compare preview */}
              <div className="flex-shrink-0 flex gap-4 items-center">
                {serums.slice(0, 2).map((s) => (
                  <div key={s.id} className="bg-[#F4F7FB] border border-[#D6E0ED] rounded-2xl p-4 w-36 text-center">
                    <div className="text-4xl mb-3">🧪</div>
                    <p className="text-xs text-[#7A93AD] mb-1">{s.brand}</p>
                    <p className="text-xs font-semibold text-[#0C1E30] leading-tight mb-2 line-clamp-2">{s.name}</p>
                    <div className="flex justify-center">
                      <ScoreRing score={s.scores.total} size={44} strokeWidth={4} />
                    </div>
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full bg-[#EFF5FF] border border-[#BFDBFE] flex items-center justify-center text-[#1E5FA3] text-xs font-bold flex-shrink-0">
                  VS
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── QUIZ CTA ─────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#1E5FA3] flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#0C1E30] mb-4">
            Not Sure Where to Start?
          </h2>
          <p className="text-[#3A5068] text-base leading-relaxed mb-8">
            Tell us your skin type, concerns, and budget. Our personalization engine will recommend
            the ideal Vitamin C serum for you in under 2 minutes.
          </p>
          <Link
            href="/quiz"
            id="quiz-section-cta"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#E07C1C] text-white font-bold hover:bg-[#C96A10] transition-colors shadow-lg"
          >
            Start Free Skin Quiz
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-[#7A93AD] mt-4">
            5 questions · 2 minutes · No signup required
          </p>
        </div>
      </section>

      {/* ─── WHY TRUST US ─────────────────────────────── */}
      <section className="py-20 section-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-[#0C1E30] mb-3">Why Trust Us?</h2>
            <p className="text-[#3A5068] max-w-xl mx-auto text-sm leading-relaxed">
              We built the platform we wished existed when we were confused about Vitamin C serums.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyTrustUs.map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-[#D6E0ED]">
                <div className="w-10 h-10 rounded-xl bg-[#EFF5FF] flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-[#1E5FA3]" />
                </div>
                <h3 className="font-bold text-[#0C1E30] text-sm mb-2">{item.title}</h3>
                <p className="text-xs text-[#3A5068] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}
