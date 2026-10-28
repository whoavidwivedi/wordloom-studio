"use client"

import { useMotionTemplate, useReducedMotion, useScroll, useTransform, motion } from "motion/react"
import { useEffect, useRef, useState } from "react"

// Aceternity UI · Container Scroll Animation
// (ui.aceternity.com/components/container-scroll-animation), on Wordloom tokens.
// The frame starts tilted back and flattens as it scrolls into view. One composed
// `transform` string keeps the motion on the compositor; reduced motion shows it flat.
export function ContainerScroll({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const query = window.matchMedia("(max-width: 768px)")
    const update = () => setIsMobile(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] })
  const rotate = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [24, 0])
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [1, 1] : isMobile ? [0.86, 1] : [1.04, 1],
  )
  const transform = useMotionTemplate`perspective(1200px) rotateX(${rotate}deg) scale(${scale})`

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-5xl">
      <motion.div
        style={{ transform }}
        className="bg-muted/60 shadow-overlay origin-[50%_0%] rounded-[1.75rem] border p-2 will-change-transform sm:p-3"
      >
        <div className="bg-card overflow-hidden rounded-[1.25rem] border">{children}</div>
      </motion.div>
    </div>
  )
}
