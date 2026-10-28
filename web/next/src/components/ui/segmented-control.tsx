"use client"

import { LayoutGroup, motion, MotionConfig } from "motion/react"
import * as React from "react"

import { cn } from "@/lib/utils"

type SegmentedItem<T extends string> = {
  value: T
  label: React.ReactNode
  icon?: React.ReactNode
  disabled?: boolean
}

// The selection thumb slides between options with motion's shared layout animation.
// A short, nearly critically damped spring keeps it quick; arrow-key changes jump
// instantly because keyboard actions shouldn't wait on animation.
const THUMB_SPRING = { type: "spring", duration: 0.32, bounce: 0.12 } as const
const INSTANT = { duration: 0 } as const

/**
 * A row of mutually exclusive options on a muted track; the selected one sits on a
 * card-coloured thumb. `role="tablist"` for view switching, `radiogroup` for
 * settings. Arrow keys move the selection.
 */
function SegmentedControl<T extends string>({
  value,
  onValueChange,
  items,
  size = "default",
  role = "radiogroup",
  fill = false,
  className,
  itemClassName,
  ...props
}: {
  value: T
  onValueChange: (value: T) => void
  items: SegmentedItem<T>[]
  size?: "sm" | "default"
  role?: "radiogroup" | "tablist"
  fill?: boolean
  className?: string
  itemClassName?: string
  "aria-label"?: string
}) {
  const refs = React.useRef<(HTMLButtonElement | null)[]>([])
  const groupId = React.useId()
  const [fromKeyboard, setFromKeyboard] = React.useState(false)
  const isTabs = role === "tablist"

  const select = (next: T, viaKeyboard: boolean) => {
    setFromKeyboard(viaKeyboard)
    onValueChange(next)
  }

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0
    if (!step) return
    event.preventDefault()
    for (let i = 1; i <= items.length; i++) {
      const next = items[(index + step * i + items.length) % items.length]
      if (next && !next.disabled) {
        select(next.value, true)
        refs.current[items.indexOf(next)]?.focus()
        return
      }
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup id={groupId}>
        <div
          role={role}
          data-slot="segmented-control"
          className={cn(
            "bg-muted inline-flex gap-0.5 rounded-lg p-0.5 select-none",
            fill && "grid w-full auto-cols-fr grid-flow-col",
            className,
          )}
          {...props}
        >
          {items.map((item, index) => {
            const selected = item.value === value
            return (
              <button
                key={item.value}
                ref={(el) => {
                  refs.current[index] = el
                }}
                type="button"
                role={isTabs ? "tab" : "radio"}
                aria-selected={isTabs ? selected : undefined}
                aria-checked={isTabs ? undefined : selected}
                tabIndex={selected ? 0 : -1}
                disabled={item.disabled}
                data-state={selected ? "on" : "off"}
                onClick={() => select(item.value, false)}
                onKeyDown={(e) => onKeyDown(e, index)}
                className={cn(
                  "relative inline-flex items-center justify-center rounded-md font-medium whitespace-nowrap outline-none",
                  "transition-[scale,color] duration-(--duration-quick) ease-(--ease-out)",
                  "focus-visible:ring-3 focus-visible:ring-ring active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40",
                  size === "sm" ? "h-7 px-2.5 text-caption" : "h-8 px-3 text-caption",
                  selected ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  itemClassName,
                )}
              >
                {selected && (
                  <motion.span
                    layoutId="segmented-thumb"
                    aria-hidden="true"
                    transition={fromKeyboard ? INSTANT : THUMB_SPRING}
                    className="bg-card shadow-thumb absolute inset-0 rounded-md dark:bg-[color-mix(in_oklab,var(--muted),white_8%)]"
                  />
                )}
                <span className="relative z-[1] inline-flex items-center gap-1.5 [&_svg]:size-3.5 [&_svg]:shrink-0">
                  {item.icon}
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </LayoutGroup>
    </MotionConfig>
  )
}

export { SegmentedControl, type SegmentedItem }
