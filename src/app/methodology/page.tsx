import { FlaskConical, Thermometer, Package, Star, IndianRupee, CheckCircle, Info } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Scoring Methodology — VitaminC India",
  description:
    "Understand exactly how VitaminC India scores and ranks serums — our 5-category framework, the science behind each criterion, and how we ensure impartiality.",
};

const categories = [
  {
    icon: FlaskConical,
    key: "ingredient",
    label: "Ingredient Quality",
    max: 25,
    color: "orange",
    desc: "Evaluates the primary Vitamin C derivative used, its bioavailability, supporting actives (e.g., Ferulic Acid, Vitamin E, Hyaluronic Acid), and any potentially harmful additives.",
    criteria: [
      "Form of Vitamin C (LAA vs. derivatives) weighted by bioavailability",
      "Presence of absorption-enhancing actives (Ferulic, Vit E)",
      "Supporting brightening ingredients (Niacinamide, Alpha Arbutin)",
      "Absence of harmful additives (heavy fragrances, parabens, alcohol)",
      "Synergistic ingredient compatibility",
    ],
  },
  {
    icon: Thermometer,
    key: "stability",
    label: "Stability",
    max: 30,
    color: "blue",
    desc: "The highest-weighted category — because even the best formula is useless if it oxidizes before it reaches your skin. India's heat and humidity make this especially critical.",
    criteria: [
      "Vitamin C derivative's inherent oxidation resistance",
      "Packaging type (airless pump vs. dropper vs. open cap)",
      "UV-opaque vs. clear packaging",
      "pH of formula relative to active form's optimum",
      "Climate suitability for Indian consumers (25°C–38°C typical storage)",
    ],
  },
  {
    icon: Package,
    key: "packaging",
    label: "Packaging",
    max: 15,
    color: "purple",
    desc: "Good packaging isn't just aesthetics — it directly protects ingredient stability and user experience. We evaluate material safety and light/air protection.",
    criteria: [
      "Airtight pump or sealed dropper mechanisms",
      "Amber or opaque UV-blocking material",
      "Pump precision (dose control)",
      "Material inertness (no metal tip contamination for LAA)",
      "Practical ml per rupee value",
    ],
  },
  {
    icon: Star,
    key: "ux",
    label: "User Experience",
    max: 20,
    color: "amber",
    desc: "A serum that feels terrible to use won't be used consistently — and consistency is everything in skincare. We factor in texture, absorption, and finish.",
    criteria: [
      "Texture and spreadability",
      "Absorption speed (sticky vs. dry)",
      "Post-application skin feel (comfortable, not tight)",
      "Scent profile (fragrance-free preferred)",
      "Layerability with other products",
    ],
  },
  {
    icon: IndianRupee,
    key: "value",
    label: "Value for Money",
    max: 10,
    color: "green",
    desc: "Price per ml normalized against formulation quality. A ₹2,000 serum isn't automatically better — and a ₹500 serum can be excellent value.",
    criteria: [
      "Price per ml vs. category benchmark",
      "Ingredient quality per rupee",
      "Accessibility across Indian income segments",
      "Availability (online + offline distribution)",
    ],
  },
];

const colorMap: Record<string, string> = {
  orange: "bg-orange-500/10 text-orange-400",
  blue: "bg-blue-500/10 text-blue-400",
  purple: "bg-purple-500/10 text-purple-400",
  amber: "bg-amber-500/10 text-amber-400",
  green: "bg-green-500/10 text-green-400",
};

const borderColorMap: Record<string, string> = {
  orange: "border-orange-500/20",
  blue: "border-blue-500/20",
  purple: "border-purple-500/20",
  amber: "border-amber-500/20",
  green: "border-green-500/20",
};

export default function MethodologyPage() {
  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-14">
          <p className="text-orange-400 text-sm font-semibold uppercase tracking-wider mb-2">
            Transparency First
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            How We Score Serums
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
            Every score on this platform is derived from a structured, 100-point framework.
            No gut feel. No sponsorship influence. Here&apos;s exactly how it works.
          </p>
        </div>

        {/* Score overview card */}
        <div className="glass rounded-3xl p-6 mb-12">
          <h2 className="font-bold text-white mb-5 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-400" />
            Score Distribution (Total: 100 pts)
          </h2>
          <div className="space-y-3">
            {categories.map((cat) => (
              <div key={cat.key} className="flex items-center gap-4">
                <div className="w-36 text-sm text-gray-300 shrink-0">{cat.label}</div>
                <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
                    style={{ width: `${(cat.max / 100) * 100}%` }}
                  />
                </div>
                <div className="w-14 text-right">
                  <span className="text-sm font-bold text-white">{cat.max} pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category deep dives */}
        <div className="space-y-6 mb-14">
          {categories.map((cat) => (
            <div
              key={cat.key}
              className={`glass rounded-3xl p-6 md:p-8 border ${borderColorMap[cat.color]}`}
            >
              <div className="flex items-start gap-4 mb-5">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${colorMap[cat.color]}`}>
                  <cat.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="font-black text-white text-lg">{cat.label}</h2>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${colorMap[cat.color]}`}>
                      {cat.max} pts
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">{cat.desc}</p>
                </div>
              </div>
              <div className="pl-0 md:pl-15">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-3">
                  What we evaluate:
                </p>
                <ul className="space-y-2">
                  {cat.criteria.map((c) => (
                    <li key={c} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-300">{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Impartiality statement */}
        <div className="rounded-3xl p-8 bg-gradient-to-br from-blue-600/10 to-blue-900/10 border border-blue-500/20">
          <h2 className="font-black text-white text-xl mb-4">Our Commitment to Impartiality</h2>
          <ul className="space-y-3">
            {[
              "We do not accept payment, free products, or any form of compensation in exchange for favorable reviews or scores.",
              "Brands cannot appeal or change their score by contacting us. Scores update only when formulas or packaging materially change.",
              "We disclose affiliate relationships. Some buy links may generate small commissions — these never affect our independent scores.",
              "Our scoring team and our editorial team are separate. Writers do not know the final scores before publishing.",
              "Scores are reviewed quarterly against new published research and re-scored if significant new clinical data emerges.",
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 text-[10px] font-bold">{i + 1}</span>
                </div>
                <span className="text-sm text-gray-300 leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
