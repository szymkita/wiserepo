import { cn } from "@/lib/utils";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import type { FloatingFieldState, FloatingFieldVariant } from "./floating-field.types";

// ── State styles (shared across all variants) ──────────────────────────

export interface StateStyle {
  border: string;
  focusBorder: string;
  focusRing: string;
  label: string;
  focusLabel: string;
  hint: string;
}

export const stateStyles: Record<FloatingFieldState, StateStyle> = {
  default: {
    border: "border-border/70",
    focusBorder: "focus:border-primary",
    focusRing: "focus:ring-[3px] focus:ring-primary/15",
    label: "text-muted-foreground/70",
    focusLabel: "peer-focus:text-primary",
    hint: "text-muted-foreground",
  },
  error: {
    border: "border-destructive",
    focusBorder: "focus:border-destructive",
    focusRing: "focus:ring-[3px] focus:ring-destructive/15",
    label: "text-destructive",
    focusLabel: "peer-focus:text-destructive",
    hint: "text-destructive",
  },
  success: {
    border: "border-emerald-500",
    focusBorder: "focus:border-emerald-500",
    focusRing: "focus:ring-[3px] focus:ring-emerald-500/15",
    label: "text-emerald-600",
    focusLabel: "peer-focus:text-emerald-600",
    hint: "text-emerald-600",
  },
  warning: {
    border: "border-amber-500",
    focusBorder: "focus:border-amber-500",
    focusRing: "focus:ring-[3px] focus:ring-amber-500/15",
    label: "text-amber-600",
    focusLabel: "peer-focus:text-amber-600",
    hint: "text-amber-600",
  },
};

// ── Select state styles (uses group-focus-within instead of peer-focus) ─

export interface SelectStateStyle {
  border: string;
  label: string;
  hint: string;
}

export const selectStateStyles: Record<FloatingFieldState, SelectStateStyle> = {
  default: {
    border: "border-border/70 focus-within:border-primary focus-within:ring-[3px] focus-within:ring-primary/15",
    label: "text-muted-foreground/70 group-focus-within:text-primary",
    hint: "text-muted-foreground",
  },
  error: {
    border: "border-destructive focus-within:ring-[3px] focus-within:ring-destructive/15",
    label: "text-destructive",
    hint: "text-destructive",
  },
  success: {
    border: "border-emerald-500 focus-within:ring-[3px] focus-within:ring-emerald-500/15",
    label: "text-emerald-600",
    hint: "text-emerald-600",
  },
  warning: {
    border: "border-amber-500 focus-within:ring-[3px] focus-within:ring-amber-500/15",
    label: "text-amber-600",
    hint: "text-amber-600",
  },
};

// ── Variant styles (visual shape) ──────────────────────────────────────

export interface VariantStyle {
  container: string;
  hover: string;
  focus: string;
  disabled: string;
  readOnly: string;
  labelFloated: string;
  labelResting: string;
  labelRestingExtra?: string;
}

export const variantStyles: Record<FloatingFieldVariant, VariantStyle> = {
  outlined: {
    container: "rounded-xl border bg-transparent shadow-[var(--shadow-xs)]",
    hover: "hover:border-foreground/40 hover:shadow-[var(--shadow-sm)]",
    focus: "focus:ring-[3px]",
    disabled: "opacity-50 cursor-not-allowed",
    readOnly: "border-border/50 bg-muted/5 shadow-none cursor-default pointer-events-none",
    labelFloated: "bg-[var(--floating-label-bg,var(--card))]",
    labelResting: "bg-transparent top-1/2 -translate-y-1/2 scale-100",
  },
  filled: {
    container: "rounded-t-lg border-0 border-b-2 bg-muted/30",
    hover: "hover:bg-muted/50",
    focus: "focus:ring-0",
    disabled: "opacity-50 cursor-not-allowed bg-muted/10",
    readOnly: "bg-muted/15 border-b-transparent cursor-default pointer-events-none",
    labelFloated: "bg-transparent",
    labelResting: "bg-transparent top-1/2 -translate-y-1/2 scale-100",
  },
  standard: {
    container: "rounded-none border-0 border-b-2 bg-transparent px-0",
    hover: "hover:border-foreground/50",
    focus: "focus:ring-0",
    disabled: "opacity-50 cursor-not-allowed",
    readOnly: "border-b-border/40 cursor-default pointer-events-none",
    labelFloated: "bg-transparent",
    labelResting: "bg-transparent top-1/2 -translate-y-1/2 scale-100",
    labelRestingExtra: "ps-0",
  },
};

// ── Select variant styles (uses group-focus-within) ────────────────────

export interface SelectVariantStyle {
  container: string;
  hover: string;
  focus: string;
  disabled: string;
  labelFloated: string;
  labelResting: string;
  labelRestingExtra?: string;
}

export const selectVariantStyles: Record<FloatingFieldVariant, SelectVariantStyle> = {
  outlined: {
    container: "rounded-xl border bg-transparent shadow-[var(--shadow-xs)]",
    hover: "hover:border-foreground/40 hover:shadow-[var(--shadow-sm)]",
    focus: "focus-within:ring-[3px]",
    disabled: "opacity-50 cursor-not-allowed",
    labelFloated: "bg-[var(--floating-label-bg,var(--card))]",
    labelResting: "bg-transparent top-1/2 -translate-y-1/2 scale-100",
  },
  filled: {
    container: "rounded-t-lg border-0 border-b-2 bg-muted/30",
    hover: "hover:bg-muted/50",
    focus: "focus-within:ring-0",
    disabled: "opacity-50 cursor-not-allowed bg-muted/10",
    labelFloated: "bg-transparent",
    labelResting: "bg-transparent top-1/2 -translate-y-1/2 scale-100",
  },
  standard: {
    container: "rounded-none border-0 border-b-2 bg-transparent px-0",
    hover: "hover:border-foreground/50",
    focus: "focus-within:ring-0",
    disabled: "opacity-50 cursor-not-allowed",
    labelFloated: "bg-transparent",
    labelResting: "bg-transparent top-1/2 -translate-y-1/2 scale-100",
    labelRestingExtra: "ps-0",
  },
};

// ── FloatingHint ────────────────────────────────────────────────────────

interface FloatingHintProps {
  state: FloatingFieldState;
  hint?: string;
}

export function FloatingHint({ state, hint }: FloatingHintProps) {
  if (!hint) return null;

  const s = stateStyles[state];

  return (
    <p className={cn("flex items-center gap-1 px-1 text-xs", s.hint)}>
      {state === "error" && <AlertCircleIcon className="size-3 shrink-0" />}
      {state === "success" && <CheckCircle2Icon className="size-3 shrink-0" />}
      {state === "warning" && <AlertCircleIcon className="size-3 shrink-0" />}
      {hint}
    </p>
  );
}
