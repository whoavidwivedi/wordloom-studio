"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"

// Transitions.dev "Number pop-in" (transitions.dev/detail.html?t=number-pop-in).
// The group is keyed by its text, so every change remounts the characters and the
// staggered pop-in replays.

/** Pops `text` in whenever it changes: letter by letter, or as one piece. */
export function PopInText({
  text,
  animate,
  direction = 1,
  stagger = true,
  className,
}: {
  text: string
  /** False on first render so the page doesn't animate on load. */
  animate: boolean
  /** 1 pops in from below, -1 from above. */
  direction?: 1 | -1
  /** False pops the whole text in at once instead of character by character. */
  stagger?: boolean
  className?: string
}) {
  const parts = stagger ? text.split("") : [text]
  return (
    <span
      key={text}
      className={cn("t-digit-group", animate && "is-animating", className)}
      style={{ "--digit-dir-y": direction } as React.CSSProperties}
    >
      {parts.map((part, i) => (
        <span key={i} className="t-digit" data-stagger={i > 0 ? i : undefined}>
          {part}
        </span>
      ))}
    </span>
  )
}

/** A count that pops in from below when it rises and from above when it falls. */
export function NumberPopIn({ value, className }: { value: number; className?: string }) {
  // Derive direction from the previous value during render (React's documented
  // pattern), which stays correct under Strict Mode's double render.
  const [previous, setPrevious] = useState(value)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [animate, setAnimate] = useState(false)
  if (value !== previous) {
    setPrevious(value)
    setDirection(value > previous ? 1 : -1)
    setAnimate(true)
  }

  return (
    <span aria-live="polite">
      <PopInText
        text={String(value)}
        animate={animate}
        direction={direction}
        className={className}
      />
    </span>
  )
}
