"use client";

import Link from "next/link";
import { ExternalLink, Plus, Check, Star, Medal } from "lucide-react";
import { cn, formatPrice, getScoreLabel } from "@/lib/utils";
import ScoreRing from "@/components/ScoreRing";
import IngredientBadge from "@/components/IngredientBadge";
import { useState } from "react";

interface Serum {
  id: number;
  slug: string;
  name: string;
  brand: string;
  tagline: string;
  image?: string;       // legacy field name
  image_url?: string;   // API field name
  price: number;
  volume_ml: number;
  vitamin_c_type: string;
  concentration_percent: number;
  scores: { total: number;[key: string]: number };
  badges: string[];
  concerns: string[];
  skin_types: string[];
  rank: number;
  is_featured: boolean;
}

interface SerumCardProps {
  serum: Serum;
  compareList?: number[];
  onCompareToggle?: (id: number) => void;
  variant?: "default" | "compact" | "featured";
}

const concernColors: Record<string, string> = {
  brightening: "bg-amber-50 text-amber-700 border border-amber-200",
  "anti-aging": "bg-blue-50 text-blue-700 border border-blue-200",
  acne: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  hyperpigmentation: "bg-violet-50 text-violet-700 border border-violet-200",
  hydration: "bg-cyan-50 text-cyan-700 border border-cyan-200",
};

export default function SerumCard({
  serum,
  compareList = [],
  onCompareToggle,
  variant = "default",
}: SerumCardProps) {
  const isInCompare = compareList.includes(serum.id);
  const scoreLabel = getScoreLabel(serum.scores?.total ?? 0);
  // Support both 'image' and 'image_url' field names
  const imageUrl = serum.image || serum.image_url || "";

  if (variant === "compact") {
    return (
      <Link
        href={`/serums/${serum.slug}`}
        className="glass card-hover rounded-xl p-4 flex items-center gap-4 hover:border-[#B0C4D8] transition-all"
      >
        <div className="text-sm font-bold text-[#7A93AD] w-7 text-center shrink-0">
          #{serum.rank}
        </div>
        <div className="w-12 h-12 rounded-xl bg-[#EFF5FF] flex items-center justify-center shrink-0 overflow-hidden">
          <img src={imageUrl} alt={serum.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-[#7A93AD] mb-0.5">{serum.brand}</p>
          <h3 className="font-semibold text-sm text-[#0C1E30] leading-tight truncate">{serum.name}</h3>
          <IngredientBadge type={serum.vitamin_c_type} size="sm" className="mt-1" />
        </div>
        <ScoreRing score={serum.scores.total} size={48} strokeWidth={4} />
      </Link>
    );
  }

  return (
    <div
      className={cn(
        "glass card-hover rounded-2xl overflow-hidden group relative flex flex-col",
        "transition-all",
        variant === "featured" && "ring-2 ring-[#1E5FA3]/20"
      )}
    >
      {/* Featured label */}
      {variant === "featured" && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-[#1E5FA3] py-1.5 text-center">
          <span className="text-[10px] font-bold text-white tracking-widest uppercase">Editor&apos;s Pick</span>
        </div>
      )}

      {/* Rank badge */}
      <div
        className={cn(
          "absolute z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-sm",
          variant === "featured" ? "top-10 left-3" : "top-3 left-3",
          serum.rank === 1
            ? "bg-[#1E5FA3] text-white"
            : serum.rank <= 3
              ? "bg-[#EFF5FF] text-[#1E5FA3] border border-[#BFDBFE]"
              : "bg-[#F4F7FB] text-[#7A93AD] border border-[#D6E0ED]"
        )}
      >
        {serum.rank === 1 ? <Medal className="w-4 h-4" /> : `#${serum.rank}`}
      </div>

      {/* Compare toggle */}
      {onCompareToggle && (
        <button
          onClick={() => onCompareToggle(serum.id)}
          title={isInCompare ? "Remove from compare" : "Add to compare"}
          className={cn(
            "absolute z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all text-xs border",
            variant === "featured" ? "top-10 right-3" : "top-3 right-3",
            isInCompare
              ? "bg-[#1E5FA3] text-white border-[#1E5FA3]"
              : "bg-white text-[#7A93AD] border-[#D6E0ED] hover:border-[#1E5FA3] hover:text-[#1E5FA3]"
          )}
        >
          {isInCompare ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        </button>
      )}

      {/* Image area */}
      <div className={cn(
        "relative h-44 bg-gradient-to-br from-[#EFF5FF] to-[#F4F7FB] flex items-center justify-center overflow-hidden",
        variant === "featured" && "mt-8"
      )}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={serum.name}
            className="w-full h-full object-cover p-4 transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const el = e.target as HTMLImageElement;
              el.style.display = "none";
              el.parentElement!.innerHTML += '<div class="text-7xl">🧪</div>';
            }}
          />
        ) : (
          <div className="text-7xl">🧪</div>
        )}
        {/* Subtle bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Brand & score */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <p className="text-xs text-[#7A93AD] mb-0.5 font-medium">{serum.brand}</p>
            <h3 className="font-bold text-[#0C1E30] text-sm leading-tight line-clamp-2">{serum.name}</h3>
          </div>
          <ScoreRing score={serum.scores.total} size={56} strokeWidth={5} />
        </div>

        {/* Score label */}
        <p className="text-xs text-[#7A93AD] mb-3">{scoreLabel}</p>

        {/* Type badge */}
        <IngredientBadge type={serum.vitamin_c_type} size="sm" className="mb-3 self-start" />

        {/* Key badges */}
        {serum.badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {serum.badges.slice(0, 2).map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFF7EE] text-[#E07C1C] border border-[#FDBA74] text-[10px] font-semibold"
              >
                <Star className="w-2.5 h-2.5" />
                {badge}
              </span>
            ))}
          </div>
        )}

        {/* Concerns */}
        <div className="flex flex-wrap gap-1 mb-4">
          {serum.concerns.slice(0, 3).map((c) => (
            <span
              key={c}
              className={cn(
                "px-2 py-0.5 rounded-md text-[10px] font-medium capitalize",
                concernColors[c] || "bg-[#F4F7FB] text-[#3A5068] border border-[#D6E0ED]"
              )}
            >
              {c}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-[#E4EAF3]">
          <div>
            <span className="text-base font-bold text-[#0C1E30]">{formatPrice(serum.price)}</span>
            <span className="text-xs text-[#7A93AD] ml-1">/ {serum.volume_ml}ml</span>
          </div>
          <Link
            href={`/serums/${serum.slug}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#EFF5FF] text-[#1E5FA3] text-xs font-semibold hover:bg-[#DBEAFE] transition-colors border border-[#BFDBFE]"
          >
            Full Review
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
