import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import ingredients from "@/data/ingredients.json";
import serums from "@/data/serums.json";
import IngredientBadge from "@/components/IngredientBadge";
import SerumCard from "@/components/SerumCard";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

const typeMap: Record<string, string> = {
  "l-ascorbic-acid": "LAA",
  "ethyl-ascorbic-acid": "EAA",
  "sodium-ascorbyl-phosphate": "SAP",
  "magnesium-ascorbyl-phosphate": "MAP",
  "ascorbyl-glucoside": "AA2G",
};

export async function generateStaticParams() {
  return ingredients.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ing = ingredients.find((i) => i.slug === slug);
  if (!ing) return {};
  return {
    title: `${ing.name} — Vitamin C Ingredient Science`,
    description: ing.description.slice(0, 160),
  };
}

const stabilityColors = (rating: number) => {
  if (rating >= 9) return "text-emerald-400";
  if (rating >= 7) return "text-green-400";
  if (rating >= 5) return "text-yellow-400";
  return "text-red-400";
};

export default async function IngredientDetailPage({ params }: Props) {
  const { slug } = await params;
  const ing = ingredients.find((i) => i.slug === slug);
  if (!ing) notFound();

  const vitCType = typeMap[ing.slug] || "LAA";
  const serumsWith = serums.filter((s) => s.vitamin_c_type === vitCType).slice(0, 3);

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-orange-400 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/ingredients" className="hover:text-orange-400 transition-colors">Ingredients</Link>
          <span>/</span>
          <span className="text-white">{ing.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main */}
          <div className="lg:col-span-2 space-y-8">

            {/* Hero */}
            <div className="glass rounded-3xl p-6 md:p-8">
              <IngredientBadge type={vitCType} className="mb-4" />
              <h1 className="text-3xl font-black text-white mb-1">{ing.name}</h1>
              <p className="text-gray-400 text-sm mb-1">{ing.alias}</p>
              <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-6">
                {ing.type === "pure" ? "Pure Vitamin C" : "Vitamin C Derivative"}
              </p>

              {/* Quick stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Stability", value: `${ing.stability_rating}/10`, sub: ing.stability_rating >= 8 ? "Excellent" : ing.stability_rating >= 6 ? "Good" : "Poor", color: stabilityColors(ing.stability_rating) },
                  { label: "Irritation Risk", value: ing.irritation_risk, sub: "for most skin types", color: ing.irritation_risk === "High" ? "text-red-400" : ing.irritation_risk === "None" ? "text-emerald-400" : "text-green-400" },
                  { label: "Bioavailability", value: `${ing.bioavailability}/10`, sub: "skin absorption", color: ing.bioavailability >= 8 ? "text-green-400" : ing.bioavailability >= 6 ? "text-yellow-400" : "text-orange-400" },
                  { label: "pH Needed", value: ing.ph_required, sub: "for efficacy", color: "text-blue-400" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/4 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                    <p className={`font-bold text-sm ${stat.color}`}>{stat.value}</p>
                    <p className="text-[10px] text-gray-600 mt-0.5">{stat.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* What is it */}
            <div className="glass rounded-3xl p-6 md:p-8">
              <h2 className="text-lg font-black text-white mb-4">What Is It?</h2>
              <p className="text-gray-300 text-sm leading-relaxed">{ing.description}</p>
            </div>

            {/* Science deep dive */}
            <div className="glass rounded-3xl p-6 md:p-8">
              <h2 className="text-lg font-black text-white mb-4">🔬 The Science</h2>
              <p className="text-gray-300 text-sm leading-relaxed">{ing.science_deep_dive}</p>
            </div>

            {/* Stability note */}
            <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-br from-amber-500/8 to-orange-500/5 border border-amber-500/20">
              <h2 className="text-lg font-black text-white mb-3">⚗️ Stability Note</h2>
              <p className="text-gray-300 text-sm leading-relaxed">{ing.stability_note}</p>
            </div>

            {/* Concentration range */}
            <div className="glass rounded-3xl p-6 md:p-8">
              <h2 className="text-lg font-black text-white mb-4">Optimal Concentration</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/4 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Available Range</p>
                  <p className="font-bold text-white">{ing.concentration_range}</p>
                </div>
                <div className="bg-orange-500/8 rounded-xl p-4 border border-orange-500/20">
                  <p className="text-xs text-orange-400 mb-1">Our Recommendation</p>
                  <p className="font-bold text-white">{ing.recommended_concentration}</p>
                </div>
              </div>
            </div>

            {/* Best for / Avoid if */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="glass rounded-3xl p-6">
                <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  Best For
                </h3>
                <ul className="space-y-2">
                  {ing.best_for.map((bf) => (
                    <li key={bf} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{bf}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="glass rounded-3xl p-6">
                <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                  <X className="w-4 h-4 text-red-400" />
                  Avoid If
                </h3>
                {ing.avoid_if.length === 0 ? (
                  <p className="text-sm text-gray-400">Generally safe for all skin types.</p>
                ) : (
                  <ul className="space-y-2">
                    {ing.avoid_if.map((ai) => (
                      <li key={ai} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{ai}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Brands using */}
            <div className="glass rounded-3xl p-6 sticky top-24">
              <h3 className="font-bold text-white text-sm mb-4">
                Brands Using {vitCType}
              </h3>
              <div className="space-y-2">
                {ing.brands_using.map((brand) => (
                  <div key={brand} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/4">
                    <span className="text-sm">🧪</span>
                    <span className="text-sm text-gray-300">{brand}</span>
                  </div>
                ))}
              </div>
              <Link
                href={`/serums?type=${vitCType}`}
                className="mt-4 flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-orange-500/15 text-orange-400 text-xs font-semibold hover:bg-orange-500/25 transition-colors"
              >
                View all {vitCType} serums
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Compare with others */}
            <div className="glass rounded-3xl p-6">
              <h3 className="font-bold text-white text-sm mb-3">Compare Ingredients</h3>
              <div className="space-y-2">
                {ingredients
                  .filter((i) => i.slug !== ing.slug)
                  .map((other) => {
                    const otherType = typeMap[other.slug] || "LAA";
                    return (
                      <Link
                        key={other.id}
                        href={`/ingredients/${other.slug}`}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <IngredientBadge type={otherType} size="sm" />
                        <ArrowRight className="w-3 h-3 text-gray-600 ml-auto" />
                      </Link>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>

        {/* Serums using this ingredient */}
        {serumsWith.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-black text-white mb-6">
              Top-Rated {vitCType}-Based Serums
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {serumsWith.map((s) => (
                <SerumCard key={s.id} serum={s} />
              ))}
            </div>
          </div>
        )}

        {/* Back */}
        <div className="mt-12">
          <Link
            href="/ingredients"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-orange-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Ingredient Science Hub
          </Link>
        </div>
      </div>
    </div>
  );
}
