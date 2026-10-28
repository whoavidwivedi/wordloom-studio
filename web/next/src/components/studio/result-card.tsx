"use client"

import { Bookmark, BookmarkCheck, Check, ChevronRight, Copy } from "lucide-react"
import { memo } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconSwap } from "@/components/ui/icon-swap"
import { cn } from "@/lib/utils"

import type { NameResult } from "../../app/actions"

export const ResultCard = memo(function ResultCard({
  item,
  isSaved,
  isActive,
  isCopied,
  onToggleBookmark,
  onCopy,
  onInspect,
}: {
  item: NameResult
  isSaved: boolean
  isActive: boolean
  isCopied: boolean
  onToggleBookmark: (item: NameResult) => void
  onCopy: (text: string) => void
  onInspect: (name: string) => void
}) {
  return (
    <article
      onClick={() => onInspect(item.name)}
      className={cn(
        "group bg-card relative flex cursor-default flex-col justify-between rounded-xl border p-4 text-left shadow-card select-none sm:p-5",
        "transition-[border-color,box-shadow] duration-(--duration-quick) ease-(--ease-out)",
        isActive ? "border-action ring-action-soft ring-4" : "hover:border-border-strong",
      )}
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onInspect(item.name)
            }}
            className="text-foreground text-word focus-visible:decoration-action cursor-pointer text-left font-semibold lowercase outline-none focus-visible:underline focus-visible:underline-offset-4"
            title={`Inspect ${item.name}`}
          >
            {item.name}
          </button>

          <div className="-mt-1 -mr-1.5 flex items-center" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onCopy(item.name)}
              className={cn(isCopied && "text-success hover:text-success")}
              title={isCopied ? "Copied to clipboard" : "Copy name"}
              aria-label={isCopied ? `Copied ${item.name}` : `Copy ${item.name}`}
            >
              <IconSwap on={isCopied} off={<Copy />} onIcon={<Check />} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleBookmark(item)}
              aria-pressed={isSaved}
              className={cn(isSaved && "text-action hover:text-action")}
              title={isSaved ? "Remove bookmark" : "Save bookmark"}
              aria-label={isSaved ? `Remove ${item.name} from saved` : `Save ${item.name}`}
            >
              <IconSwap
                on={isSaved}
                off={<Bookmark />}
                onIcon={<BookmarkCheck className="fill-current" />}
              />
            </Button>
          </div>
        </div>

        {item.meaning ? (
          <p className="text-small text-muted-foreground mt-2 line-clamp-2 cursor-text select-text">
            {item.meaning}
          </p>
        ) : (
          <p className="text-caption text-subtle-foreground mt-2">Phonotactic neologism</p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t pt-3">
        <div className="flex items-center gap-1.5">
          {item.meaning && <Badge variant="action">def</Badge>}
          <Badge variant="muted">{item.name.length} chars</Badge>
        </div>

        <span className="text-caption text-muted-foreground group-hover:text-foreground flex items-center gap-0.5 font-medium transition-colors duration-(--duration-quick)">
          Inspect
          <ChevronRight className="size-3.5 transition-transform duration-(--duration-quick) ease-(--ease-out) group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  )
})
