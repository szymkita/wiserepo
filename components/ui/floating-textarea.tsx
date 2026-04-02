"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { stateStyles, variantStyles, FloatingHint } from "./floating-field.styles";
import type { FloatingFieldState, FloatingFieldVariant } from "./floating-field.types";

interface FloatingTextareaProps
  extends Omit<React.ComponentProps<"textarea">, "placeholder"> {
  label: string;
  state?: FloatingFieldState;
  hint?: string;
  variant?: FloatingFieldVariant;
}

const FloatingTextarea = React.forwardRef<HTMLTextAreaElement, FloatingTextareaProps>(
  ({ className, label, state = "default", hint, variant = "outlined", disabled, readOnly, id, ...props }, ref) => {
    const textareaId = id || React.useId();
    const s = stateStyles[state];
    const v = variantStyles[variant];

    const isOutlined = variant === "outlined";

    return (
      <div className="space-y-1.5">
        <div className="relative">
          <textarea
            ref={ref}
            id={textareaId}
            disabled={disabled}
            readOnly={readOnly}
            className={cn(
              "peer block w-full appearance-none px-3 pb-2.5 pt-4 text-sm text-foreground outline-none transition-all duration-200 resize-y min-h-[100px]",
              v.container,
              s.border,
              !disabled && !readOnly && s.focusBorder,
              !disabled && !readOnly && v.focus,
              !disabled && !readOnly && v.hover,
              !disabled && !readOnly && s.focusRing,
              disabled && v.disabled,
              readOnly && v.readOnly,
              readOnly && "text-foreground/70",
              className,
            )}
            placeholder=" "
            {...props}
          />
          <label
            htmlFor={textareaId}
            className={cn(
              "absolute start-3 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform px-2 text-sm transition-all duration-200",
              // Floated state background
              isOutlined
                ? "bg-[var(--floating-label-bg,var(--card))]"
                : "bg-transparent",
              // Resting state (textarea uses top-4 instead of top-1/2)
              "peer-placeholder-shown:top-4 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:bg-transparent",
              variant === "standard" && "peer-placeholder-shown:ps-0",
              // Focus state (back to floated)
              "peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75",
              isOutlined
                ? "peer-focus:bg-[var(--floating-label-bg,var(--card))]"
                : "peer-focus:bg-transparent",
              "pointer-events-none select-none",
              s.label,
              !readOnly && s.focusLabel,
              readOnly && "text-muted-foreground/50",
              disabled && "text-muted-foreground/40",
            )}
          >
            {label}
          </label>
        </div>

        <FloatingHint state={state} hint={hint} />
      </div>
    );
  }
);

FloatingTextarea.displayName = "FloatingTextarea";

export { FloatingTextarea };
