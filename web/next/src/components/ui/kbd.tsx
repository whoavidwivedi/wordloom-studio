import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const kbdVariants = cva(
  "inline-flex items-center justify-center font-mono font-medium select-none pointer-events-none transition-colors border",
  {
    variants: {
      variant: {
        default:
          "bg-muted/90 text-foreground border-border/80 shadow-[0_1px_0_1px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_0_1px_rgba(255,255,255,0.08)]",
        outline:
          "bg-background text-foreground border-border shadow-[0_1px_0_1px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_0_1px_rgba(255,255,255,0.05)]",
        inverse:
          "bg-primary-foreground/25 text-primary-foreground border-primary-foreground/40 shadow-[0_1px_0_0.5px_rgba(0,0,0,0.2)] font-semibold",
        subtle: "bg-muted/50 text-muted-foreground border-border/50",
      },
      size: {
        xs: "h-4 min-w-4 px-1 text-[10px] rounded",
        sm: "h-5 min-w-5 px-1.5 text-[11px] rounded",
        default: "h-5.5 min-w-5.5 px-2 text-xs rounded-md",
        lg: "h-6.5 min-w-6.5 px-2.5 text-xs rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  },
)

export interface KbdProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof kbdVariants> {}

export function Kbd({ className, variant, size, ...props }: KbdProps) {
  return <kbd className={cn(kbdVariants({ variant, size, className }))} {...props} />
}
