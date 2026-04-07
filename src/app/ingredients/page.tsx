import Link from "next/link";
import { ArrowRight, Flame, Droplets, Zap } from "lucide-react";
import ingredients from "@/data/ingredients.json";
import serums from "@/data/serums.json";
import IngredientBadge from "@/components/IngredientBadge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vitamin C Ingredient Science Hub",
  description:
    "Deep dives into every form of Vitamin C: L-Ascorbic Acid, Ethyl Ascorbic Acid, SAP, MAP, and AA2G — stability, bioavailability, and which is right for your skin.",
};

const typeMap: Record<string, string> = {
  "l-ascorbic-acid": "LAA",
  "ethyl-ascorbic-acid": "EAA",
  "sodium-ascorbyl-phosphate": "SAP",
  "magnesium-ascorbyl-phosphate": "MAP",
  "ascorbyl-glucoside": "AA2G",
};

export default function IngredientsPage() {
  return (
    <div className="pt-[69px] min-h-screen bg-[#F7F9FC]">
      {/* Page header */}
      <div className="bg-white border-b border-[#D6E0ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-[#1E5FA3] text-sm font-semibold uppercase tracking-wider mb-2">
            Ingredient Science Hub
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-[#0C1E30] mb-4">
            Not All Vitamin C is the Same
          </h1>
          <p className="text-[#3A5068] leading-relaxed max-w-2xl text-sm">
            From the gold-standard L-Ascorbic Acid to the ultra-stable AA2G — each derivative has
            a different stability, pH requirement, bioavailability, and skin type suitability.
            Learn the science before you buy.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stability comparison chart */}
        <div className="bg-white rounded-2xl p-6 mb-10 border border-[#D6E0ED]">
          <h2 className="font-bold text-[#0C1E30] mb-6 text-sm">
            Stability Comparison <span className="text-[#7A93AD] font-normal">(higher = more stable on shelf)</span>
          </h2>
          <div className="space-y-4">
            {ingredients.map((ing) => {
              const vitCType = typeMap[ing.slug] || "LAA";
              return (
                <div key={ing.id} className="flex items-center gap-4">
                  <div className="w-48 shrink-0">
                    <IngredientBadge type={vitCType} size="sm" />
                    <p className="text-xs text-[#7A93AD] mt-1">{ing.alias}</p>
                  </div>
                  <div className="flex-1 h-2.5 bg-[#E4EAF3] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#1E5FA3] to-[#2B7FD4] transition-all"
                      style={{ width: `${ing.stability_rating * 10}%` }}
                    />
                  </div>
                  <div className="w-12 text-right">
                    <span className="text-sm font-bold text-[#0C1E30]">{ing.stability_rating}/10</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ingredient cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ingredients.map((ing) => {
            const vitCType = typeMap[ing.slug] || "LAA";
            const brandsUsing = serums.filter((s) => s.vitamin_c_type === vitCType);

            return (
              <Link
                key={ing.id}
                href={`/ingredients/${ing.slug}`}
                className="bg-white card-hover rounded-2xl p-6 md:p-8 border border-[#D6E0ED] hover:border-[#1E5FA3]/40 group block"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <IngredientBadge type={vitCType} />
                    <h2 className="text-xl font-black text-[#0C1E30] mt-2 leading-tight">{ing.name}</h2>
                    <p className="text-sm text-[#7A93AD]">{ing.alias}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-2xl font-black text-[#1E5FA3]">{ing.stability_rating}</p>
                    <p className="text-xs text-[#7A93AD]">Stability /10</p>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="bg-[#F7F9FC] rounded-xl p-3 text-center border border-[#E4EAF3]">
                    <Flame className="w-4 h-4 text-[#E07C1C] mx-auto mb-1" />
                    <p className="text-[10px] text-[#7A93AD]">Irritation</p>
                    <p className={`text-xs font-bold mt-0.5 ${
                      ing.irritation_risk === "High"   ? "text-red-600" :
                      ing.irritation_risk === "Low"    ? "text-green-600" :
                      ing.irritation_risk === "None"   ? "text-emerald-600" : "text-amber-600"
                    }`}>{ing.irritation_risk}</p>
                  </div>
                  <div className="bg-[#F7F9FC] rounded-xl p-3 text-center border border-[#E4EAF3]">
                    <Droplets className="w-4 h-4 text-[#1E5FA3] mx-auto mb-1" />
                    <p className="text-[10px] text-[#7A93AD]">Bioavail.</p>
                    <p className="text-xs font-bold text-[#0C1E30] mt-0.5">{ing.bioavailability}/10</p>
                  </div>
                  <div className="bg-[#F7F9FC] rounded-xl p-3 text-center border border-[#E4EAF3]">
                    <Zap className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                    <p className="text-[10px] text-[#7A93AD]">pH Needed</p>
                    <p className="text-xs font-bold text-[#0C1E30] mt-0.5 truncate">
                      {ing.ph_required.replace("Below ", "<").replace("pH ", "")}
                    </p>
                  </div>
                </div>

                {/* Best for */}
                <div className="mb-4">
                  <p className="text-xs text-[#7A93AD] mb-2 uppercase tracking-wide font-semibold">Best For</p>
                  <div className="flex flex-wrap gap-1.5">
                    {ing.best_for.slice(0, 4).map((bf) => (
                      <span key={bf} className="px-2 py-0.5 rounded-md bg-[#ECFDF5] text-xs text-[#065F46] border border-[#A7F3D0]">
                        {bf}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-[#3A5068] leading-relaxed line-clamp-2 mb-4">
                  {ing.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-[#E4EAF3] pt-4">
                  <p className="text-xs text-[#7A93AD]">
                    {brandsUsing.length} serums in our DB use this
                  </p>
                  <span className="text-[#1E5FA3] text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Deep Dive <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
