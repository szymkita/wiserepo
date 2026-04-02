import { cn } from "@/lib/utils";
import { SPOLKA_CONFIG, type SpolkaId, hexToRgba } from "@/features/shared/model/spolki.types";

interface SpolkaBadgeProps {
  spolka: SpolkaId | string;
  className?: string;
  size?: "sm" | "md";
}

export function SpolkaBadge({ spolka, className, size = "sm" }: SpolkaBadgeProps) {
  const config = SPOLKA_CONFIG[spolka as SpolkaId];
  if (!config) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md font-medium whitespace-nowrap",
        size === "sm" && "px-2.5 py-0.5 text-sm",
        size === "md" && "px-2.5 py-1 text-sm",
        className
      )}
      style={{
        backgroundColor: hexToRgba(config.color, 0.08),
        color: config.color,
      }}
    >
      <span
        className="size-1.5 rounded-full shrink-0"
        style={{ backgroundColor: config.color }}
      />
      {config.name}
    </span>
  );
}
