import { cn } from "@/lib/utils"

/** Emerald gradient circle, the same mark as the favicon. */
export function WordloomMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block size-5 shrink-0 rounded-full",
        "bg-[radial-gradient(circle_at_36%_28%,rgb(255_255_255/0.45),transparent_55%),linear-gradient(135deg,#6ee7b7,#10b981_50%,#047857)]",
        "shadow-[inset_0_0_0_1px_rgb(255_255_255/0.18),0_1px_2px_rgb(4_120_87/0.35)]",
        className,
      )}
    />
  )
}

/** The emerald mark followed by the lowercase wordmark. */
export function WordloomBrandLockup({
  className,
  size = "md",
}: {
  className?: string
  size?: "sm" | "md"
}) {
  return (
    <span className={cn("flex items-center gap-2 select-none", className)}>
      <WordloomMark className={size === "sm" ? "size-4" : "size-5"} />
      <span
        className={cn(
          "text-foreground font-semibold tracking-[-0.04em]",
          size === "sm" ? "text-[15px]" : "text-[19px]",
        )}
      >
        wordloom
      </span>
    </span>
  )
}
