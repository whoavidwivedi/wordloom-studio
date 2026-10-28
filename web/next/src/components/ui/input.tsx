import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "bg-card text-foreground h-9 w-full min-w-0 rounded-lg border border-input px-3 text-small shadow-card outline-none",
        "transition-[border-color,box-shadow] duration-(--duration-quick) ease-(--ease-out)",
        "placeholder:text-subtle-foreground hover:border-border-strong",
        "focus-visible:border-action focus-visible:ring-3 focus-visible:ring-action-soft",
        "disabled:pointer-events-none disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        "max-md:text-base",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
