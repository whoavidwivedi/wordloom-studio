"use client"

import { Check, Copy } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import * as React from "react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"

const iconSpring = { type: "spring" as const, duration: 0.28, bounce: 0 }

export interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  label?: string
  copiedLabel?: string
  showLabel?: boolean
  toastMessage?: string
  onCopied?: () => void
}

export function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied!",
  showLabel = false,
  toastMessage,
  onCopied,
  className,
  onClick,
  ...props
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = React.useState(false)
  const timerRef = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e)
    if (e.defaultPrevented) return

    try {
      await navigator.clipboard.writeText(value)
      setIsCopied(true)
      onCopied?.()

      // Only show a toast if explicitly requested via toastMessage (e.g. for detached actions).
      // Otherwise, the button provides immediate, elegant inline confirmation (Check icon + Copied! label).
      if (toastMessage) {
        toast.success(toastMessage)
      }

      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        setIsCopied(false)
      }, 1800)
    } catch (err) {
      console.error("Failed to copy text", err)
      toast.error("Failed to copy to clipboard")
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={isCopied ? copiedLabel : `${label} ${value}`}
      className={cn(
        "group relative inline-flex items-center justify-center font-sans text-xs font-medium outline-none select-none",
        "transition-[transform,background-color,border-color,color,box-shadow] duration-150 ease-out",
        "active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
        // Extended touch target for mobile (min 44px)
        "after:absolute after:-inset-1.5 after:content-['']",
        showLabel
          ? "h-8 gap-1.5 rounded-lg border border-border px-3 hover:border-foreground/30 hover:bg-muted"
          : "h-8 w-8 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground",
        isCopied &&
          (showLabel
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/15"
            : "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/15"),
        className,
      )}
      {...props}
    >
      <span className="relative flex items-center justify-center">
        <AnimatePresence mode="popLayout" initial={false}>
          {isCopied ? (
            <motion.span
              key="copied"
              initial={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              exit={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
              transition={iconSpring}
              className="flex items-center justify-center text-emerald-600 dark:text-emerald-400"
            >
              <Check className="h-3.5 w-3.5" />
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              exit={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
              transition={iconSpring}
              className="flex items-center justify-center"
            >
              <Copy className="h-3.5 w-3.5" />
            </motion.span>
          )}
        </AnimatePresence>
      </span>

      {showLabel && (
        <span className="relative flex items-center overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            {isCopied ? (
              <motion.span
                key="copied-text"
                initial={{ opacity: 0, y: 5, filter: "blur(2px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -5, filter: "blur(2px)" }}
                transition={iconSpring}
                className="font-medium"
              >
                {copiedLabel}
              </motion.span>
            ) : (
              <motion.span
                key="copy-text"
                initial={{ opacity: 0, y: 5, filter: "blur(2px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -5, filter: "blur(2px)" }}
                transition={iconSpring}
                className="font-medium"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      )}
    </button>
  )
}
