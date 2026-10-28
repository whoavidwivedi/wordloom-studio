import * as React from "react"

import { cn } from "@/lib/utils"

// Quiet label that names a section or value.
function Eyebrow({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="eyebrow"
      className={cn("text-caption text-muted-foreground font-medium", className)}
      {...props}
    />
  )
}

export { Eyebrow }
