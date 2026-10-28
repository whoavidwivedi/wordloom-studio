import * as React from "react"

import { cn } from "@/lib/utils"

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-5 min-w-5 items-center justify-center rounded-xs border border-b-2 px-1 font-mono text-micro font-medium",
        "in-data-[variant=default]:border-white/20 in-data-[variant=default]:bg-white/15 in-data-[variant=default]:text-current",
        className,
      )}
      {...props}
    />
  )
}

export { Kbd }
