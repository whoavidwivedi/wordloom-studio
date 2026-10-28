"use client"

import { X } from "lucide-react"
import * as React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

function Field({
  id,
  label,
  hint,
  className,
  children,
}: {
  id: string
  label: React.ReactNode
  hint?: React.ReactNode
  className?: string
  children: React.ReactNode
}) {
  return (
    <div data-slot="field" className={cn("space-y-1.5", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <Label htmlFor={id} className="text-caption text-muted-foreground font-medium">
          {label}
        </Label>
        {hint && <span className="text-micro text-subtle-foreground font-mono">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

/** Text input with an inline clear button that appears once there is a value. */
function ClearableInput({
  value,
  onValueChange,
  clearLabel = "Clear",
  className,
  ...props
}: Omit<React.ComponentProps<typeof Input>, "value" | "onChange"> & {
  value: string
  onValueChange: (value: string) => void
  clearLabel?: string
}) {
  return (
    <div className="relative">
      <Input
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className={cn("pr-8", className)}
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={() => onValueChange("")}
          aria-label={clearLabel}
          className="text-subtle-foreground hover:text-foreground hover:bg-muted absolute top-1/2 right-1.5 flex size-6 -translate-y-1/2 items-center justify-center rounded-md transition-colors duration-(--duration-quick)"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  )
}

export { Field, ClearableInput }
