"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { selectStateStyles, selectVariantStyles, FloatingHint } from "./floating-field.styles";
import type { FloatingFieldState, FloatingFieldVariant } from "./floating-field.types";

interface FloatingSelectProps {
  label: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  state?: FloatingFieldState;
  hint?: string;
  disabled?: boolean;
  className?: string;
  variant?: FloatingFieldVariant;
}

function FloatingSelect({
  label,
  value,
  onValueChange,
  children,
  state = "default",
  hint,
  disabled,
  className,
  variant = "outlined",
}: FloatingSelectProps) {
  const s = selectStateStyles[state];
  const v = selectVariantStyles[variant];
  const hasValue = !!value;
  const isOutlined = variant === "outlined";

  return (
    <div className="space-y-1.5">
      <div className={cn("group relative", className)}>
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
          <SelectTrigger
            className={cn(
              "w-full pb-2.5 pt-4 text-sm text-foreground transition-all duration-200 h-auto min-h-[theme(spacing.12)]",
              v.container,
              s.border,
              !disabled && v.hover,
              disabled && v.disabled,
            )}
          >
            <SelectValue placeholder=" " />
          </SelectTrigger>
          <SelectContent>
            {children}
          </SelectContent>
        </Select>
        <span
          className={cn(
            "absolute start-3 top-2 z-10 origin-[0] transform px-2 text-sm transition-all duration-200",
            "pointer-events-none select-none",
            hasValue
              ? cn(
                  "-translate-y-4 scale-75",
                  isOutlined
                    ? "bg-[var(--floating-label-bg,var(--card))]"
                    : "bg-transparent",
                  s.label,
                )
              : cn("top-1/2 -translate-y-1/2 scale-100 bg-transparent", "text-muted-foreground/70"),
            // Focus state
            "group-focus-within:top-2 group-focus-within:-translate-y-4 group-focus-within:scale-75",
            isOutlined
              ? "group-focus-within:bg-[var(--floating-label-bg,var(--card))]"
              : "group-focus-within:bg-transparent",
            variant === "standard" && !hasValue && "ps-0",
            s.label,
            disabled && "text-muted-foreground/40",
          )}
        >
          {label}
        </span>
      </div>

      <FloatingHint state={state} hint={hint} />
    </div>
  );
}

export { FloatingSelect };
