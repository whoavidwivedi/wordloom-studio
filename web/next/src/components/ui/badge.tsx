import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex h-5 shrink-0 items-center gap-1 rounded-md border px-1.5 text-micro font-medium whitespace-nowrap tabular-nums select-none [&_svg]:size-3",
  {
    variants: {
      variant: {
        default: "border-transparent bg-foreground text-background",
        action: "border-transparent bg-action-soft text-action",
        outline: "border-border-strong text-foreground",
        muted: "border-transparent bg-muted text-muted-foreground",
        destructive: "border-transparent bg-destructive/12 text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
