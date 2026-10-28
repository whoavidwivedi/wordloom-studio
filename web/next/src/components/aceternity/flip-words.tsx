"use client"

import { useEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"

import { cn } from "@/lib/utils"

// Rotating word using Transitions.dev "Text states swap" (React variant,
// transitions.dev/detail.html?t=text-states-swap). Three phases: exit old -> swap
// text -> enter new. It runs on its own timer, or follows an external `step` so a
// group of rotators can swap in lockstep. Screen readers get one stable word, and
// it holds still with reduced motion on.
export function FlipWords({
  words,
  duration = 2600,
  step,
  display = true,
  className,
}: {
  words: string[]
  duration?: number
  /** When set, the word advances whenever this changes instead of on its own timer. */
  step?: number
  /** Scale the swap distance and blur for headline sizes. */
  display?: boolean
  className?: string
}) {
  const [index, setIndex] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const swapTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const controlled = step !== undefined

  const swapTo = (next: (i: number) => number) => {
    const el = ref.current
    if (!el || words.length < 2) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const dur = readMs(el, "--text-swap-dur", 150)

    el.classList.add("is-exit")
    clearTimeout(swapTimer.current)
    swapTimer.current = setTimeout(() => {
      // Commit the new word before releasing it, so it never enters as the old one.
      flushSync(() => setIndex(next))

      // Jump below (no transition), then release so it animates back.
      el.classList.remove("is-exit")
      el.classList.add("is-enter-start")
      void el.offsetWidth // force reflow
      el.classList.remove("is-enter-start")
    }, dur)
  }

  // Own timer, ticking only while on screen.
  useEffect(() => {
    const el = ref.current
    if (controlled || !el) return

    let visible = false
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false
    })
    observer.observe(el)
    const interval = setInterval(() => {
      if (visible) swapTo((i) => (i + 1) % words.length)
    }, duration)

    return () => {
      observer.disconnect()
      clearInterval(interval)
    }
    // swapTo only reads refs and props listed here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlled, words, duration])

  // External step: advance whenever it changes (not on mount).
  const lastStep = useRef(step)
  useEffect(() => {
    if (!controlled || step === lastStep.current) return
    lastStep.current = step
    swapTo(() => (step ?? 0) % words.length)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlled, step, words.length])

  useEffect(() => () => clearTimeout(swapTimer.current), [])

  return (
    <span className="relative inline-block">
      <span className="sr-only">{words[0]}</span>
      <span
        ref={ref}
        aria-hidden="true"
        className={cn("t-text-swap whitespace-nowrap", display && "t-text-swap-display", className)}
      >
        {words[index]}
      </span>
    </span>
  )
}

function readMs(el: Element, name: string, fallback: number) {
  const n = parseFloat(getComputedStyle(el).getPropertyValue(name).trim())
  return Number.isFinite(n) ? n : fallback
}
