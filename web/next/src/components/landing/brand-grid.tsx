"use client"

import { useEffect, useRef, useState } from "react"

import { PopInText } from "@/components/ui/number-pop-in"

// Three frames of 12 names, every one checked against bin/name-generator.ts. Most are
// fresh names the generator found; a few already belong to companies you know.
const FRAMES = [
  [
    "lumex",
    "stripe",
    "novis",
    "vanta",
    "corvo",
    "kelso",
    "notion",
    "solva",
    "jovia",
    "ravia",
    "slack",
    "velda",
  ],
  [
    "venza",
    "elio",
    "zapier",
    "kora",
    "mira",
    "orra",
    "rova",
    "dropbox",
    "valo",
    "xero",
    "spotify",
    "bento",
  ],
  [
    "ferro",
    "olan",
    "orla",
    "zillow",
    "sorel",
    "tessa",
    "reddit",
    "luma",
    "github",
    "kano",
    "nori",
    "ulla",
  ],
]
const CELLS = 12
const INTERVAL = 3200

// One shared clock advances every cell together, and each new name pops in as one
// piece (Transitions.dev Number pop-in), so the whole grid changes at once. It only
// ticks while the grid is on screen and holds still with reduced motion on.
export function BrandGrid() {
  const ref = useRef<HTMLUListElement>(null)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let visible = false
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false
    })
    observer.observe(el)
    const interval = setInterval(() => {
      if (visible) setStep((s) => s + 1)
    }, INTERVAL)

    return () => {
      observer.disconnect()
      clearInterval(interval)
    }
  }, [])

  return (
    <ul ref={ref} className="grid grid-cols-2 border-t border-l sm:grid-cols-4">
      {Array.from({ length: CELLS }, (_, i) => (
        <li key={i} className="flex h-20 items-center border-r border-b px-4 sm:h-24 sm:px-5">
          {/* Screen readers get the first frame once; the changing copy is visual only. */}
          <span className="sr-only">{FRAMES[0]![i]}</span>
          <span aria-hidden="true">
            <PopInText
              text={FRAMES[step % FRAMES.length]![i]!}
              animate={step > 0}
              stagger={false}
              className="text-foreground text-xl font-semibold tracking-[-0.03em] lowercase sm:text-2xl"
            />
          </span>
        </li>
      ))}
    </ul>
  )
}
