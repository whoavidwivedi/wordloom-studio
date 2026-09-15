"use client"

import { cn } from "@/lib/utils"

interface WordloomLogoIconProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

/**
 * Clean, geometric "W" vector mark for Wordloom.
 * Rendered directly without enclosing boxes for a clean, modern aesthetic.
 */
export function WordloomLogoIcon({ className, size = "md" }: WordloomLogoIconProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }[size]

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeClasses, "shrink-0 text-foreground", className)}
      aria-hidden="true"
    >
      <path
        d="M3.5 6.5L8 18L12 9.5L16 18L20.5 6.5"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

interface WordloomBrandLockupProps {
  className?: string
  size?: "sm" | "md"
}

export function WordloomBrandLockup({ className, size = "md" }: WordloomBrandLockupProps) {
  return (
    <div className={cn("flex items-center gap-2 select-none cursor-default", className)}>
      {/* Unboxed vector mark */}
      <WordloomLogoIcon size={size} />

      {/* Unified typographic lockup without artificial container boxes */}
      <div className="flex items-baseline gap-1.5">
        <span
          className={cn(
            "font-sans font-bold tracking-tight text-foreground",
            size === "sm" ? "text-sm" : "text-sm sm:text-[15px]",
          )}
        >
          Wordloom
        </span>
        <span
          className={cn(
            "font-sans font-normal text-muted-foreground",
            size === "sm" ? "text-xs" : "text-xs sm:text-[13px]",
          )}
        >
          Studio
        </span>
      </div>
    </div>
  )
}
