import { cn } from "@/lib/utils";
import type { FloatingFieldVariant, FloatingDisplayVariant } from "./floating-field.types";

interface FloatingDisplayProps {
  label: string;
  children: React.ReactNode;
  variant?: FloatingFieldVariant;
  displayVariant?: FloatingDisplayVariant;
  empty?: boolean;
  className?: string;
}

function FloatingDisplay({
  label,
  children,
  variant = "outlined",
  displayVariant = "default",
  empty,
  className,
}: FloatingDisplayProps) {
  const isEmpty = empty || children === "—" || children === null || children === undefined;
  const isOutlined = variant === "outlined";

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "flex min-h-12 items-center px-3 pb-2.5 pt-4 text-sm transition-colors duration-150",
          // Variant container shape
          variant === "outlined" &&
            "rounded-lg border border-border/60 bg-transparent shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]",
          variant === "filled" &&
            "rounded-t-lg border-0 border-b-2 border-b-transparent bg-muted/15",
          variant === "standard" &&
            "rounded-none border-0 border-b-2 border-b-border/40 bg-transparent px-0",
          // Display variant styles
          displayVariant === "link" &&
            "border-l-[2.5px] border-l-primary/40 hover:border-l-primary/70 hover:bg-accent/30 cursor-pointer",
          displayVariant === "badge" &&
            "bg-muted/20 border-dashed border-border/40 shadow-none",
          displayVariant === "mono" &&
            "[&>*]:font-mono [&>*]:tracking-wide [&>*]:tabular-nums",
          // Empty state
          isEmpty && "border-dashed border-border/40 bg-transparent shadow-none",
        )}
      >
        <span
          className={cn(
            "leading-snug",
            isEmpty
              ? "text-muted-foreground/40 select-none"
              : "font-medium text-foreground",
            displayVariant === "mono" && "font-mono tracking-wide tabular-nums",
          )}
        >
          {isEmpty ? "—" : children}
        </span>
      </div>
      <span
        className={cn(
          "pointer-events-none absolute start-3 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform px-2 text-sm",
          isOutlined
            ? "bg-[var(--floating-label-bg,var(--card))]"
            : "bg-transparent",
          variant === "standard" && "ps-0",
          isEmpty
            ? "text-muted-foreground/40"
            : "text-muted-foreground/70",
          displayVariant === "link" && !isEmpty && "text-primary/50",
        )}
      >
        {label}
      </span>
    </div>
  );
}

export { FloatingDisplay };
export type { FloatingDisplayProps };
