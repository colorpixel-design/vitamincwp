import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  X,
  ShoppingCart,
  Star,
  ArrowRight,
  FlaskConical,
  Droplets,
  ThumbsUp,
  AlertCircle,
} from "lucide-react";
import ScoreRing from "@/components/ScoreRing";
import IngredientBadge from "@/components/IngredientBadge";
import SerumCard from "@/components/SerumCard";
import { formatPrice, getScoreColor } from "@/lib/utils";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

type Serum = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  tagline: string;
  vitamin_c_type: string;
  concentration_percent: number;
  ph_level: number;
  price: number;
  volume_ml: number;
  rank: number;
  is_featured: boolean;
  image_url?: string;
  badges: string[];
  scores: { total: number; efficacy: number; stability: number; formulation: number; value: number };
  concerns: string[];
  skin_types: string[];
  pros: string[];
  cons: string[];
  key_ingredients: string[];
  buy_links: Record<string, string>;
  dermatologist_verdict: string;
};

async function getSerum(slug: string): Promise<Serum | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/serums/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getRelatedSerums(vitCType: string, slug: string): Promise<Serum[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/serums?type=${vitCType}&limit=4`, { cache: "no-store" });
    if (!res.ok) return [];
    const data: Serum[] = await res.json();
    return data.filter((s) => s.slug !== slug).slice(0, 3);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const serum = await getSerum(slug);
  if (!serum) return {};
  return {
    title: `${serum.name} Review — Score ${serum.scores.total}/100`,
    description: `Read our full science-backed review of ${serum.name} by ${serum.brand}. Score: ${serum.scores.total}/100. ${serum.dermatologist_verdict}`,
  };
}

const scoreCategories = [
  { key: "efficacy", label: "Ingredient Efficacy", max: 25 },
  { key: "stability", label: "Stability", max: 30 },
  { key: "formulation", label: "Formulation", max: 15 },
  { key: "value", label: "Value for Money", max: 10 },
];

export default async function SerumDetailPage({ params }: Props) {
  const { slug } = await params;
  const serum = await getSerum(slug);
  if (!serum) notFound();

  const related = await getRelatedSerums(serum.vitamin_c_type, slug);

  const imageUrl = serum.image_url || "/placeholder.png";

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/serums" className="hover:text-orange-500 transition-colors">Serums</Link>
          <span>/</span>
          <span style={{ color: "var(--text-primary)" }}>{serum.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── LEFT: Main Content ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Hero card */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#D6E0ED]">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-48 h-48 rounded-2xl bg-gradient-to-br from-[#EFF5FF] to-[#F4F7FB] border border-[#D6E0ED] overflow-hidden flex items-center justify-center flex-shrink-0">
                  <img
                    src={imageUrl}
                    alt={serum.name}
                    className="w-full h-full object-cover p-4"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded-md bg-[#EFF5FF] text-[#1E5FA3] text-xs font-semibold border border-[#BFDBFE]">
                      Rank #{serum.rank}
                    </span>
                    {serum.badges.map((b) => (
                      <span key={b} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFF7EE] text-[#E07C1C] border border-[#FDBA74] text-xs font-semibold">
                        <Star className="w-2.5 h-2.5" />
                        {b}
                      </span>
                    ))}
                  </div>

                  <p className="text-[#7A93AD] text-sm mb-1">{serum.brand}</p>
                  <h1 className="text-2xl md:text-3xl font-black text-[#0C1E30] mb-2 leading-tight">{serum.name}</h1>
                  <p className="text-[#3A5068] text-sm mb-4">{serum.tagline}</p>
                  <IngredientBadge type={serum.vitamin_c_type} className="mb-4" />

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Concentration", value: `${serum.concentration_percent}%` },
                      { label: "pH Level", value: serum.ph_level.toString() },
                      { label: "Price", value: formatPrice(serum.price) },
                      { label: "Volume", value: `${serum.volume_ml}ml` },
                    ].map((fact) => (
                      <div key={fact.label} className="bg-[#F4F7FB] rounded-xl p-3 border border-[#E4EAF3]">
                        <p className="text-xs text-[#7A93AD] mb-0.5">{fact.label}</p>
                        <p className="font-bold text-[#0C1E30] text-sm">{fact.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#D6E0ED]">
              <h2 className="text-xl font-black text-[#0C1E30] mb-6 flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-[#1E5FA3]" />
                Score Breakdown
              </h2>

              <div className="flex items-center gap-6 mb-8">
                <ScoreRing score={serum.scores.total} size={100} strokeWidth={8} />
                <div>
                  <p className="text-4xl font-black text-[#0C1E30]">{serum.scores.total}</p>
                  <p className="text-[#7A93AD] text-sm">out of 100</p>
                  <p className="text-sm font-semibold mt-1" style={{ color: getScoreColor(serum.scores.total) }}>
                    {serum.scores.total >= 90 ? "Excellent" : serum.scores.total >= 80 ? "Very Good" : serum.scores.total >= 70 ? "Good" : "Average"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {scoreCategories.map((cat) => {
                  const score = serum.scores[cat.key as keyof typeof serum.scores] as number;
                  const pct = (score / cat.max) * 100;
                  return (
                    <div key={cat.key}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-[#3A5068]">{cat.label}</span>
                        <span className="text-sm font-bold text-[#0C1E30]">
                          {score}<span className="text-[#7A93AD] font-normal">/{cat.max}</span>
                        </span>
                      </div>
                      <div className="h-2 bg-[#E4EAF3] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${getScoreColor(pct)}, ${getScoreColor(pct)}cc)` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pros & Cons */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#D6E0ED]">
              <h2 className="text-xl font-black text-[#0C1E30] mb-6 flex items-center gap-2">
                <ThumbsUp className="w-5 h-5 text-[#1E5FA3]" />
                Pros &amp; Cons
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Pros
                  </h3>
                  <ul className="space-y-2.5">
                    {serum.pros.map((pro) => (
                      <li key={pro} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 text-green-600" />
                        </div>
                        <span className="text-sm text-[#3A5068] leading-relaxed">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-1.5">
                    <X className="w-4 h-4" /> Cons
                  </h3>
                  <ul className="space-y-2.5">
                    {serum.cons.map((con) => (
                      <li key={con} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <X className="w-2.5 h-2.5 text-red-500" />
                        </div>
                        <span className="text-sm text-[#3A5068] leading-relaxed">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Key Ingredients */}
            {serum.key_ingredients.length > 0 && (
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#D6E0ED]">
                <h2 className="text-xl font-black text-[#0C1E30] mb-6 flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-[#1E5FA3]" />
                  Key Ingredients
                </h2>
                <div className="flex flex-wrap gap-2">
                  {serum.key_ingredients.map((ing) => (
                    <span key={ing} className="px-3 py-1.5 rounded-lg bg-[#F4F7FB] border border-[#D6E0ED] text-sm text-[#3A5068] font-medium">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Dermatologist verdict */}
            {serum.dermatologist_verdict && (
              <div className="rounded-2xl p-6 md:p-8 bg-[#EFF5FF] border border-[#BFDBFE]">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#DBEAFE] flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-[#1E5FA3]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1E5FA3] text-sm mb-1">Dermatologist&apos;s Verdict</h3>
                    <p className="text-[#3A5068] text-sm leading-relaxed">{serum.dermatologist_verdict}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <div className="space-y-5">

            {/* Buy card */}
            <div className="bg-white rounded-2xl p-6 sticky top-24 border border-[#D6E0ED] shadow-sm">
              <div className="text-center mb-5">
                <p className="text-[#7A93AD] text-xs mb-1">Starting at</p>
                <p className="text-3xl font-black text-[#0C1E30]">{formatPrice(serum.price)}</p>
                <p className="text-[#7A93AD] text-xs">{serum.volume_ml}ml · ₹{(serum.price / serum.volume_ml).toFixed(0)}/ml</p>
              </div>

              <div className="space-y-2.5">
                {Object.entries(serum.buy_links).filter(([, url]) => url).map(([store, url]) => (
                  <a
                    key={store}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-[#F4F7FB] hover:bg-[#EFF5FF] border border-[#D6E0ED] hover:border-[#1E5FA3]/40 transition-all group"
                  >
                    <span className="text-sm font-semibold text-[#0C1E30] capitalize">{store}</span>
                    <div className="flex items-center gap-1 text-[#1E5FA3] text-xs">
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span className="font-medium">Buy</span>
                    </div>
                  </a>
                ))}
                {Object.values(serum.buy_links).every((v) => !v) && (
                  <p className="text-xs text-center text-[#7A93AD] py-2">Buy links coming soon</p>
                )}
              </div>

              <p className="text-[10px] text-[#7A93AD] text-center mt-4">
                Prices may vary. We may earn a commission on purchases.
              </p>
            </div>

            {/* Skin Suitability */}
            <div className="bg-white rounded-2xl p-6 border border-[#D6E0ED]">
              <h3 className="font-bold text-[#0C1E30] text-sm mb-4">Best For</h3>
              <div className="space-y-3">
                {serum.skin_types.length > 0 && (
                  <div>
                    <p className="text-xs text-[#7A93AD] mb-2">Skin Types</p>
                    <div className="flex flex-wrap gap-1.5">
                      {serum.skin_types.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded-md bg-[#F4F7FB] border border-[#D6E0ED] text-xs text-[#3A5068] capitalize">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {serum.concerns.length > 0 && (
                  <div>
                    <p className="text-xs text-[#7A93AD] mb-2">Skin Concerns</p>
                    <div className="flex flex-wrap gap-1.5">
                      {serum.concerns.map((c) => (
                        <span key={c} className="px-2 py-0.5 rounded-md bg-[#FFF7EE] border border-[#FDBA74] text-xs text-[#E07C1C] capitalize">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Compare CTA */}
            <Link
              href={`/compare?ids=${serum.id}`}
              className="block bg-[#EFF5FF] rounded-2xl p-5 hover:bg-[#DBEAFE] transition-all group border border-[#BFDBFE]"
            >
              <p className="text-sm font-semibold text-[#0C1E30] mb-1">Compare this serum</p>
              <p className="text-xs text-[#3A5068]">Add to the comparison tool and see how it stacks up against others.</p>
              <span className="text-[#1E5FA3] text-xs font-semibold mt-3 flex items-center gap-1 group-hover:gap-2 transition-all">
                Compare now <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          </div>
        </div>

        {/* Related serums */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-black text-[#0C1E30] mb-6">
              Other {serum.vitamin_c_type}-Based Serums
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((s) => (
                <SerumCard key={s.id} serum={s as any} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-12">
          <Link
            href="/serums"
            className="inline-flex items-center gap-2 text-sm text-[#3A5068] hover:text-[#1E5FA3] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Serum Database
          </Link>
        </div>
      </div>
    </div>
  );
}
