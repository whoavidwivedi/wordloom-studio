import { cn } from "@/lib/utils"

// Aceternity UI · Bento Grid (ui.aceternity.com/components/bento-grid), on Wordloom tokens.
export function BentoGrid({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "mx-auto grid grid-cols-1 gap-4 md:auto-rows-[19rem] md:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  )
}

export function BentoGridItem({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string
  title?: React.ReactNode
  description?: React.ReactNode
  header?: React.ReactNode
  icon?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "bg-card row-span-1 flex flex-col justify-between gap-4 overflow-hidden rounded-2xl border p-4 shadow-card",
        className,
      )}
    >
      {header}
      <div>
        <div className="text-muted-foreground [&_svg]:size-4">{icon}</div>
        <div className="text-small text-foreground mt-2 mb-1 font-semibold">{title}</div>
        <div className="text-caption text-muted-foreground">{description}</div>
      </div>
    </div>
  )
}
