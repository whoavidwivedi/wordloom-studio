import * as React from "react"

import { cn } from "@/lib/utils"

function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "rise-in flex flex-col items-center justify-center gap-3 py-16 text-center",
        className,
      )}
    >
      <div className="bg-card text-muted-foreground shadow-card flex size-11 items-center justify-center rounded-xl border [&_svg]:size-4.5">
        {icon}
      </div>
      <div>
        <h3 className="text-small text-foreground">{title}</h3>
        {description && (
          <p className="text-caption text-muted-foreground mx-auto mt-1 max-w-xs">{description}</p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  )
}

export { EmptyState }
