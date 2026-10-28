import { cn } from "@/lib/utils"

// Aceternity UI · Grid background (ui.aceternity.com/components/grid-and-dot-backgrounds),
// with a radial fade so the grid dissolves toward the edges.
export function GridBackground({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0", className)}>
      <div className="absolute inset-0 [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="bg-background absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,transparent_15%,black_70%)]" />
    </div>
  )
}
