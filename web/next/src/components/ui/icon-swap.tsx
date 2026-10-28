import * as React from "react"

import { cn } from "@/lib/utils"

// Both icons stay mounted and cross-fade (.icon-swap in globals.css), so the swap
// is interruptible and costs no JS animation runtime.
function IconSwap({
  on,
  off,
  onIcon,
  className,
}: {
  on: boolean
  off: React.ReactNode
  onIcon: React.ReactNode
  className?: string
}) {
  return (
    <span data-slot="icon-swap" className={cn("icon-swap", className)} aria-hidden="true">
      <span data-hidden={on}>{off}</span>
      <span data-hidden={!on}>{onIcon}</span>
    </span>
  )
}

export { IconSwap }
