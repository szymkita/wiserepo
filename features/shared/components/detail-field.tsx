import { cn } from "@/lib/utils";
import type { FloatingDisplayVariant, FloatingFieldVariant } from "@/components/ui/floating-field.types";

type DetailFieldVariant = FloatingDisplayVariant;

interface DetailFieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
  variant?: DetailFieldVariant;
  empty?: boolean;
}

export function DetailField({
  label,
  children,
  className,
  variant = "default",
  empty,
}: DetailFieldProps) {
  const isEmpty = empty || children === "—" || children === null || children === undefined;

  return (
    <div className={cn("group relative", className)}>
      <dd
        className={cn(
          "flex min-h-12 items-center rounded-lg border bg-transparent px-3 pb-2.5 pt-4 text-sm transition-colors duration-150",
          "border-border/60 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]",
          variant === "link" &&
            "border-l-[2.5px] border-l-primary/40 hover:border-l-primary/70 hover:bg-accent/30 cursor-pointer",
          variant === "badge" && "bg-muted/20 border-dashed border-border/40 shadow-none",
          variant === "mono" && "[&>*]:font-mono [&>*]:tracking-wide [&>*]:tabular-nums",
          isEmpty &&
            "border-dashed border-border/40 bg-transparent shadow-none",
        )}
      >
        <span
          className={cn(
            "leading-snug",
            isEmpty
              ? "text-muted-foreground/40 select-none"
              : "font-medium text-foreground",
            variant === "mono" && "font-mono tracking-wide tabular-nums",
          )}
        >
          {isEmpty ? "—" : children}
        </span>
      </dd>
      <dt
        className={cn(
          "pointer-events-none absolute start-3 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform px-2 text-sm",
          "bg-[var(--floating-label-bg,var(--card))]",
          isEmpty
            ? "text-muted-foreground/40"
            : "text-muted-foreground/70",
          variant === "link" && !isEmpty && "text-primary/50",
        )}
      >
        {label}
      </dt>
    </div>
  );
}

interface DetailGridProps {
  children: React.ReactNode;
  columns?: 2 | 3;
  className?: string;
}

export function DetailGrid({ children, columns = 2, className }: DetailGridProps) {
  return (
    <dl
      className={cn(
        "grid gap-2.5",
        columns === 2 && "grid-cols-1 sm:grid-cols-2",
        columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {children}
    </dl>
  );
}
