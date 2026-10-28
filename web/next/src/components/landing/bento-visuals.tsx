"use client"

import { ArrowUpRight, Check } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { FlipWords } from "@/components/aceternity/flip-words"
import { Badge } from "@/components/ui/badge"

// Looping visuals for the landing bento. Every word is real generator output and
// every definition is the real WordNet entry. Loops are CSS (.loop in globals.css)
// and only run while the grid is on screen.

/** Marks its subtree in view so CSS loops inside it run only while visible. */
export function LoopZone({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      {
        rootMargin: "100px",
      },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} data-in-view={inView} className={className}>
      {children}
    </div>
  )
}

const ROW_A = ["lumex", "novis", "tessa", "bront", "calix", "vanta", "corvo", "kelso"]
const ROW_B = ["solva", "luma", "jovia", "kesta", "nolan", "melda", "ravia", "tilda"]

function MarqueeRow({ names, reverse }: { names: string[]; reverse?: boolean }) {
  return (
    <div className="flex overflow-hidden">
      {/* Two copies side by side; the track moves by exactly one copy and loops seamlessly. */}
      <div
        className={
          reverse ? "loop loop-marquee-reverse flex shrink-0" : "loop loop-marquee flex shrink-0"
        }
      >
        {[...names, ...names].map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="text-muted-foreground/80 px-3 text-2xl font-semibold tracking-[-0.03em] lowercase"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  )
}

export function NameMarquee() {
  return (
    <div className="bg-muted/50 flex min-h-32 flex-1 flex-col justify-center gap-3 overflow-hidden rounded-xl [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] py-5">
      <MarqueeRow names={ROW_A} />
      <MarqueeRow names={ROW_B} reverse />
    </div>
  )
}

const DEFINITIONS = [
  { name: "gusto", meaning: "noun: vigorous and enthusiastic enjoyment" },
  { name: "brisk", meaning: "adjective: quick and energetic" },
  { name: "lucid", meaning: "adjective: (of language) transparently clear" },
]

export function DefinitionCycle() {
  return (
    <div className="bg-muted/50 flex min-h-32 flex-1 items-center rounded-xl p-4">
      <div className="relative grid w-full">
        {DEFINITIONS.map((d, i) => (
          <div
            key={d.name}
            className="loop loop-def-cycle bg-card shadow-card rounded-lg border p-3 [grid-area:1/1]"
            style={{ animationDelay: `${i * 3 - 9}s` }}
          >
            <div className="flex items-center justify-between">
              <span className="text-word text-foreground font-semibold lowercase">{d.name}</span>
              <Badge variant="action">def</Badge>
            </div>
            <p className="text-caption text-muted-foreground mt-1">{d.meaning}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const CHECKS = ["novis.com", "github.com/novis", "x.com/novis", "instagram.com/novis"]

export function AvailabilityScan() {
  return (
    <div className="bg-muted/50 flex min-h-32 flex-1 flex-col justify-center gap-1.5 rounded-xl p-4">
      {CHECKS.map((row, i) => (
        <div
          key={row}
          className="loop loop-scan-row bg-card text-caption shadow-card flex items-center justify-between rounded-lg border px-3 py-1.5"
          style={{ animationDelay: `${i * 0.6}s` }}
        >
          <span className="text-foreground font-mono">{row}</span>
          <span className="relative flex size-4 items-center justify-center">
            <ArrowUpRight
              className="loop loop-scan-arrow text-subtle-foreground absolute size-3.5"
              style={{ animationDelay: `${i * 0.6}s` }}
            />
            <Check
              className="loop loop-scan-check text-action absolute size-3.5"
              style={{ animationDelay: `${i * 0.6}s` }}
            />
          </span>
        </div>
      ))}
    </div>
  )
}

const NO_IS = ["novis", "nobis", "nolis", "nomis", "nosis", "notis"]

export function ConstraintRoll() {
  return (
    <div className="bg-muted/50 flex min-h-32 flex-1 flex-wrap content-center items-center justify-center gap-2 rounded-xl p-4">
      {[
        ["Length", "5"],
        ["Starts with", "no"],
        ["Ends with", "is"],
      ].map(([label, value]) => (
        <span
          key={label}
          className="bg-card text-caption shadow-card inline-flex items-center gap-2 rounded-lg border py-1.5 pr-1.5 pl-3"
        >
          <span className="text-muted-foreground">{label}</span>
          <span className="bg-muted text-foreground rounded-md px-2 py-0.5 font-mono font-medium uppercase">
            {value}
          </span>
        </span>
      ))}
      <span className="text-subtle-foreground px-1">=</span>
      <span className="bg-card shadow-card inline-flex min-w-28 items-center justify-center rounded-lg border px-3 py-1">
        <FlipWords
          words={NO_IS}
          duration={1800}
          display={false}
          className="text-word text-foreground font-semibold lowercase"
        />
      </span>
      <span className="text-caption text-muted-foreground">6 matches</span>
    </div>
  )
}
