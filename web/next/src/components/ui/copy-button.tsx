"use client"

import { Check, Copy } from "lucide-react"
import * as React from "react"

import { IconSwap } from "@/components/ui/icon-swap"
import { cn } from "@/lib/utils"

export interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  label?: string
  copiedLabel?: string
  showLabel?: boolean
  onCopied?: () => void
}

export function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  showLabel = false,
  onCopied,
  className,
  onClick,
  ...props
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = React.useState(false)
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

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

      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setIsCopied(false), 1600)
    } catch {
      // Clipboard can be blocked (permissions, insecure context); the button stays as is.
    }
  }

  return (
    <button
      type="button"
      data-slot="copy-button"
      onClick={handleCopy}
      aria-label={isCopied ? copiedLabel : `${label} ${value}`}
      className={cn(
        "relative inline-flex items-center justify-center text-xs font-medium outline-none select-none",
        "transition-[scale,background-color,color] duration-(--duration-quick) ease-(--ease-out)",
        "focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.96]",
        // Extended hit area for touch
        "after:absolute after:-inset-1.5 after:content-['']",
        showLabel
          ? "surface surface-outline isolate h-8 gap-1.5 rounded-lg px-3"
          : "text-muted-foreground hover:bg-muted hover:text-foreground size-8 rounded-lg",
        isCopied && "text-success hover:text-success",
        className,
      )}
      {...props}
    >
      <IconSwap
        on={isCopied}
        off={<Copy className="size-3.5" />}
        onIcon={<Check className="size-3.5" />}
      />
      {showLabel && <span className="tabular-nums">{isCopied ? copiedLabel : label}</span>}
    </button>
  )
}
