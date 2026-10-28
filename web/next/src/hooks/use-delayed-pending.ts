"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Loader visibility for an async state. Fast responses never flash a loader
 * (it waits `delay` before showing), and once shown it stays for `minDuration`
 * so it reads as a deliberate state rather than a flicker.
 */
export function useDelayedPending(
  pending: boolean,
  { delay = 150, minDuration = 450 }: { delay?: number; minDuration?: number } = {},
) {
  const [visible, setVisible] = useState(false)
  const shownAt = useRef(0)

  useEffect(() => {
    if (pending && !visible) {
      const timer = setTimeout(() => {
        shownAt.current = Date.now()
        setVisible(true)
      }, delay)
      return () => clearTimeout(timer)
    }

    if (!pending && visible) {
      const remaining = Math.max(0, minDuration - (Date.now() - shownAt.current))
      const timer = setTimeout(() => setVisible(false), remaining)
      return () => clearTimeout(timer)
    }
  }, [pending, visible, delay, minDuration])

  return visible
}
