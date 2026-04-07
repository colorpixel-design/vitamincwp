import { cn } from "@/lib/utils";

interface IngredientBadgeProps {
  type: string;
  className?: string;
  size?: "sm" | "md";
}

const typeConfig: Record<string, { label: string; className: string }> = {
  LAA: { label: "Pure Vit C (LAA)", className: "badge-laa" },
  EAA: { label: "Ethyl Ascorbic (EAA)", className: "badge-eaa" },
  SAP: { label: "Sodium Ascorbyl (SAP)", className: "badge-sap" },
  MAP: { label: "Magnesium Ascorbyl (MAP)", className: "badge-map" },
  AA2G: { label: "Ascorbyl Glucoside (AA2G)", className: "badge-aa2g" },
};

export default function IngredientBadge({
  type,
  className,
  size = "md",
}: IngredientBadgeProps) {
  const config = typeConfig[type] || {
    label: type,
    className: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold tracking-wide",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

export function VitCTypeDot({ type }: { type: string }) {
  const colors: Record<string, string> = {
    LAA: "bg-amber-400",
    EAA: "bg-green-400",
    SAP: "bg-blue-400",
    MAP: "bg-purple-400",
    AA2G: "bg-orange-400",
  };
  return (
    <span
      className={cn(
        "inline-block w-2 h-2 rounded-full flex-shrink-0",
        colors[type] || "bg-gray-400"
      )}
    />
  );
}
