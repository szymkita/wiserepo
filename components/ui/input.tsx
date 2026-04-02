import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground/60 selection:bg-primary/15 selection:text-foreground border-border/70 bg-card dark:bg-input/30 h-10 w-full min-w-0 rounded-lg border px-3.5 py-2 text-sm shadow-[var(--shadow-xs)] transition-all duration-150 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 read-only:bg-muted/50 read-only:border-transparent read-only:shadow-none",
        "focus-visible:border-primary/50 focus-visible:ring-primary/15 focus-visible:ring-[3px] focus-visible:shadow-[var(--shadow-sm)]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
