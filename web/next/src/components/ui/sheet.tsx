"use client"

import { X } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Bottom sheet that stays mounted and slides with `translate` only, so opening
 * and closing never re-renders its contents. Inert while closed; Escape closes it.
 */
function BottomSheet({
  open,
  onClose,
  label,
  title,
  eyebrow,
  className,
  children,
}: {
  open: boolean
  onClose: () => void
  label: string
  title?: React.ReactNode
  eyebrow?: React.ReactNode
  className?: string
  children: React.ReactNode
}) {
  React.useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !e.defaultPrevented) onClose()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, onClose])

  return (
    <>
      <div
        data-open={open}
        onClick={onClose}
        aria-hidden="true"
        className={cn("sheet-backdrop fixed inset-0 z-50 bg-black/45", className)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        data-open={open}
        inert={!open}
        className={cn(
          "sheet bg-card fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto overscroll-contain rounded-t-3xl border-t px-5 pt-2.5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-overlay",
          className,
        )}
      >
        <div className="bg-border-strong mx-auto mb-3 h-1 w-9 rounded-full" />
        {(title || eyebrow) && (
          <div className="mb-4 flex items-start justify-between gap-3 border-b pb-3">
            <div className="min-w-0">
              {eyebrow}
              {title}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label={`Close ${label}`}>
              <X />
            </Button>
          </div>
        )}
        {children}
      </div>
    </>
  )
}

export { BottomSheet }
