"use client"

import { ArrowUpRight, Bookmark, BookmarkCheck, Check, Copy } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/ui/eyebrow"
import { IconSwap } from "@/components/ui/icon-swap"
import { cn } from "@/lib/utils"

import type { NameResult } from "../../app/actions"

const platformDirectory = [
  {
    name: "Domainr",
    desc: "Live domain extensions (.com, .io, .ai)",
    getUrl: (q: string) => `https://domainr.com/?q=${encodeURIComponent(q)}`,
    badge: "Domains",
  },
  {
    name: "GitHub",
    desc: "Username or organization handle",
    getUrl: (q: string) => `https://github.com/${encodeURIComponent(q)}`,
    badge: "Org / User",
  },
  {
    name: "X",
    desc: "Profile handle",
    getUrl: (q: string) => `https://x.com/${encodeURIComponent(q)}`,
    badge: "Social",
  },
  {
    name: "Instagram",
    desc: "Account handle",
    getUrl: (q: string) => `https://instagram.com/${encodeURIComponent(q)}`,
    badge: "Social",
  },
  {
    name: "YouTube",
    desc: "Channel handle with @ prefix",
    getUrl: (q: string) => `https://www.youtube.com/@${encodeURIComponent(q)}`,
    badge: "Channel",
  },
]

export function InspectorBody({
  item,
  isSaved,
  isCopied,
  onCopy,
  onToggleBookmark,
}: {
  item: NameResult
  isSaved: boolean
  isCopied: boolean
  onCopy: (text: string) => void
  onToggleBookmark: (item: NameResult) => void
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="lg"
          onClick={() => onCopy(item.name)}
          className={cn(isCopied && "text-success")}
        >
          <IconSwap on={isCopied} off={<Copy />} onIcon={<Check />} />
          {isCopied ? "Copied" : "Copy name"}
        </Button>
        <Button
          variant={isSaved ? "secondary" : "outline"}
          size="lg"
          aria-pressed={isSaved}
          onClick={() => onToggleBookmark(item)}
          className={cn(isSaved && "text-action")}
        >
          <IconSwap
            on={isSaved}
            off={<Bookmark />}
            onIcon={<BookmarkCheck className="fill-current" />}
          />
          {isSaved ? "Saved" : "Save"}
        </Button>
      </div>

      {item.meaning && (
        <div className="bg-muted/60 mt-5 rounded-lg p-3.5">
          <Eyebrow className="text-foreground">WordNet meaning</Eyebrow>
          <p className="text-small text-muted-foreground mt-1">{item.meaning}</p>
        </div>
      )}

      <div className="mt-6">
        <Eyebrow>Availability</Eyebrow>
        <ul className="mt-2 divide-y overflow-hidden rounded-xl border">
          {platformDirectory.map((p) => (
            <li key={p.name}>
              <a
                href={p.getUrl(item.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="group hover:bg-muted/60 focus-visible:bg-muted flex items-center justify-between gap-3 px-3.5 py-3 transition-colors duration-(--duration-quick) outline-none"
              >
                <div className="flex min-w-0 flex-col">
                  <span className="text-small text-foreground font-medium">{p.name}</span>
                  <span className="text-caption text-muted-foreground truncate">{p.desc}</span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant="muted" className="hidden sm:inline-flex">
                    {p.badge}
                  </Badge>
                  <ArrowUpRight className="text-subtle-foreground group-hover:text-foreground size-4 transition-[color,translate] duration-(--duration-quick) ease-(--ease-out) group-hover:translate-x-px group-hover:-translate-y-px" />
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
