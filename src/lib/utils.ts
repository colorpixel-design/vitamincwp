import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function getVitCTypeColor(type: string) {
  const colors: Record<string, string> = {
    LAA: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    EAA: "bg-green-500/20 text-green-400 border-green-500/30",
    SAP: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    MAP: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    AA2G: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  };
  return colors[type] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
}

export function getScoreColor(score: number) {
  if (score >= 90) return "#22c55e";
  if (score >= 80) return "#f5b800";
  if (score >= 70) return "#f97316";
  return "#ef4444";
}

export function getScoreLabel(score: number) {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Very Good";
  if (score >= 70) return "Good";
  return "Average";
}
