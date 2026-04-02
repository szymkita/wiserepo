import { cn } from "@/lib/utils";

type StatusVariant = "default" | "success" | "warning" | "destructive" | "info" | "muted";

interface StatusBadgeProps {
  label: string;
  variant?: StatusVariant;
  className?: string;
  pulse?: boolean;
}

const variantStyles: Record<StatusVariant, { bg: string; text: string; dot: string }> = {
  default: {
    bg: "bg-slate-100/80 dark:bg-slate-800/50",
    text: "text-slate-600 dark:text-slate-300",
    dot: "bg-slate-400",
  },
  success: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  warning: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  destructive: {
    bg: "bg-red-50 dark:bg-red-950/40",
    text: "text-red-600 dark:text-red-400",
    dot: "bg-red-500",
  },
  info: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-400",
    dot: "bg-blue-500",
  },
  muted: {
    bg: "bg-muted/60",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground/40",
  },
};

export function StatusBadge({ label, variant = "default", className, pulse }: StatusBadgeProps) {
  const styles = variantStyles[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-sm font-medium whitespace-nowrap",
        styles.bg,
        styles.text,
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full shrink-0", styles.dot, pulse && "animate-pulse")} />
      {label}
    </span>
  );
}
