import { RiLoader4Line } from "@remixicon/react"

import { cn } from "@/lib/utils"

// Remix's Loader 4 glyph, spun. Fades in so a late-appearing loader doesn't pop.
function Spinner({ className, label = "Loading" }: { className?: string; label?: string }) {
  return (
    <span
      role="status"
      aria-label={label}
      data-slot="spinner"
      className={cn("spinner-enter inline-flex shrink-0", className)}
    >
      <RiLoader4Line aria-hidden="true" className="size-[1em] animate-spin" />
    </span>
  )
}

export { Spinner }
