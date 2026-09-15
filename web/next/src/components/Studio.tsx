"use client"

import {
  ArrowDownAZ,
  ArrowLeft,
  BookA,
  Bookmark,
  BookmarkCheck,
  Check,
  ChevronRight,
  Clock,
  Compass,
  Copy,
  Download,
  ExternalLink,
  Globe2,
  Moon,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sun,
  X,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useTheme } from "next-themes"
import { memo, useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

import { generateNamesAction, getLetterOffsetsAction } from "../app/actions"

// Emil Kowalski spring configurations: bounce must always be 0 for UI stability, duration under 300ms
const criticallyDampedSpring = { type: "spring" as const, duration: 0.28, bounce: 0 }
const mobileSheetSpring = { type: "spring" as const, duration: 0.32, bounce: 0 }

const platformDirectory = [
  {
    name: "Domainr",
    desc: "Search live domain extensions (.com, .io, .ai)",
    getUrl: (q: string) => `https://domainr.com/?q=${encodeURIComponent(q)}`,
    badge: "WHOIS / DNS",
  },
  {
    name: "GitHub",
    desc: "Check available username or organization handle",
    getUrl: (q: string) => `https://github.com/${encodeURIComponent(q)}`,
    badge: "Org / User",
  },
  {
    name: "X (Twitter)",
    desc: "Verify profile handle availability",
    getUrl: (q: string) => `https://x.com/${encodeURIComponent(q)}`,
    badge: "Social",
  },
  {
    name: "Instagram",
    desc: "Check account handle status",
    getUrl: (q: string) => `https://instagram.com/${encodeURIComponent(q)}`,
    badge: "Social",
  },
  {
    name: "YouTube",
    desc: "Verify YouTube channel handle with @ prefix",
    getUrl: (q: string) => `https://www.youtube.com/@${encodeURIComponent(q)}`,
    badge: "Channel",
  },
]

// Result card with Emil Kowalski active:scale-[0.97] and concentric border radius
const ResultCard = memo(function ResultCard({
  item,
  isSaved,
  isActive,
  isCopied,
  onToggleBookmark,
  onCopy,
  onCheckAvailability,
}: {
  item: { name: string; meaning: string }
  isSaved: boolean
  isActive: boolean
  isCopied: boolean
  onToggleBookmark: (item: { name: string; meaning: string }) => void
  onCopy: (text: string) => void
  onCheckAvailability: (name: string) => void
}) {
  return (
    <article
      onClick={() => onCheckAvailability(item.name)}
      className={cn(
        "group relative flex flex-col justify-between rounded-xl border p-4 sm:p-5 text-left select-none cursor-default",
        "transition-[transform,border-color,background-color,box-shadow] duration-200 ease-out",
        isActive
          ? "border-foreground bg-accent/60 ring-2 ring-foreground/20 shadow-md dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_8px_20px_-4px_rgba(0,0,0,0.7)]"
          : "border-border/85 bg-card shadow-[0_1px_3px_0_rgba(0,0,0,0.04),0_1px_2px_-1px_rgba(0,0,0,0.02)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07),0_2px_8px_-2px_rgba(0,0,0,0.5)] hover:border-foreground/30 dark:hover:border-border hover:shadow-[0_6px_20px_-4px_rgba(0,0,0,0.08),0_2px_6px_-1px_rgba(0,0,0,0.03)] dark:hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.13),0_8px_24px_-4px_rgba(0,0,0,0.7)] hover:-translate-y-0.5",
      )}
    >
      <div>
        {/* Header row: Name & Quick Actions */}
        <div className="flex items-start justify-between gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onCheckAvailability(item.name)
            }}
            className="text-foreground hover:text-foreground/80 cursor-pointer text-left font-sans text-xl font-bold tracking-tight lowercase outline-none focus-visible:underline sm:text-2xl"
            title={`Inspect ${item.name}`}
          >
            {item.name}
          </button>

          <div
            className="flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Copy Button with Emil Kowalski popLayout blur/scale icon animation */}
            <button
              type="button"
              onClick={() => onCopy(item.name)}
              className={cn(
                "relative flex h-8 w-8 items-center justify-center rounded-lg outline-none select-none cursor-pointer",
                "transition-[transform,background-color,border-color,color] duration-150 ease-out active:scale-[0.96]",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
                "after:absolute after:-inset-1.5 after:content-['']",
                isCopied
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/15"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
              title={isCopied ? "Copied to clipboard" : "Copy name"}
              aria-label={isCopied ? `Copied ${item.name}` : `Copy ${item.name}`}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {isCopied ? (
                  <motion.span
                    key="copied"
                    initial={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
                    animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                    exit={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
                    transition={criticallyDampedSpring}
                    className="flex items-center justify-center text-emerald-600 dark:text-emerald-400"
                  >
                    <Check className="h-4 w-4" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
                    animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                    exit={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
                    transition={criticallyDampedSpring}
                    className="flex items-center justify-center"
                  >
                    <Copy className="h-4 w-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Bookmark Button with contextual blur/scale icon animation */}
            <button
              type="button"
              onClick={() => onToggleBookmark(item)}
              className={cn(
                "relative flex h-8 w-8 items-center justify-center rounded-lg outline-none select-none cursor-pointer",
                "transition-[transform,background-color,border-color,color] duration-150 ease-out active:scale-[0.96]",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
                "after:absolute after:-inset-1.5 after:content-['']",
                isSaved
                  ? "bg-muted text-foreground hover:bg-muted/80"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
              title={isSaved ? "Remove bookmark" : "Save bookmark"}
              aria-label={isSaved ? "Remove bookmark" : "Save bookmark"}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {isSaved ? (
                  <motion.span
                    key="saved"
                    initial={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
                    animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                    exit={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
                    transition={criticallyDampedSpring}
                    className="text-foreground flex items-center justify-center"
                  >
                    <BookmarkCheck className="h-4 w-4 fill-current" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="unsaved"
                    initial={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
                    animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                    exit={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
                    transition={criticallyDampedSpring}
                    className="flex items-center justify-center"
                  >
                    <Bookmark className="h-4 w-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* WordNet definition or Neologism note */}
        {item.meaning ? (
          <p className="text-muted-foreground mt-2.5 line-clamp-2 cursor-text font-sans text-xs leading-relaxed text-pretty select-text sm:text-[13px] dark:text-zinc-300/90">
            {item.meaning}
          </p>
        ) : (
          <p className="text-muted-foreground/70 mt-2.5 font-mono text-[11px] italic select-none dark:text-zinc-500">
            Phonotactic neologism
          </p>
        )}
      </div>

      {/* Footer Badges & Inspect indicator */}
      <div className="border-border/80 mt-4 flex items-center justify-between border-t pt-3 dark:border-white/10">
        <div className="flex items-center gap-1.5">
          {item.meaning && (
            <Badge
              variant="outline"
              className="border-border bg-muted/60 text-foreground h-4 px-1.5 py-0 text-[9px] font-semibold"
            >
              def
            </Badge>
          )}
          <Badge variant="muted" className="h-4 px-1.5 py-0 text-[10px] tabular-nums">
            {item.name.length} chars
          </Badge>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onCheckAvailability(item.name)
          }}
          className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1 font-sans text-[11px] font-medium transition-colors outline-none active:scale-[0.96]"
          title={`Inspect ${item.name} availability`}
        >
          <span>Inspect</span>
          <ChevronRight className="h-3.5 w-3.5 transition-transform duration-150 ease-out group-hover:translate-x-0.5" />
        </button>
      </div>
    </article>
  )
})

export function Studio({
  onBack,
  onAvailabilityOpenChange,
}: {
  onBack: () => void
  onAvailabilityOpenChange?: (isOpen: boolean) => void
}) {
  const { resolvedTheme, setTheme } = useTheme()
  const [themeMounted, setThemeMounted] = useState(false)

  const [mode, setMode] = useState<"ui" | "bookmarks">("ui")
  const [length, setLength] = useState([5])
  const [prefix, setPrefix] = useState("")
  const [suffix, setSuffix] = useState("")
  const [contains, setContains] = useState("")
  const [defOnly, setDefOnly] = useState(false)

  const [isPending, startTransition] = useTransition()
  const [results, setResults] = useState<{ name: string; meaning: string }[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [skip, setSkip] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [availabilityTarget, setAvailabilityTarget] = useState<string | null>(null)
  const [copiedName, setCopiedName] = useState<string | null>(null)

  const [letterOffsets, setLetterOffsets] = useState<Record<string, number>>({})
  const [activeLetter, setActiveLetter] = useState<string>("a")
  const [hasSearched, setHasSearched] = useState(false)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  const prefixInputRef = useRef<HTMLInputElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Bookmarks state
  const [bookmarks, setBookmarks] = useState<{ name: string; meaning: string }[]>([])
  const [bookmarkSearch, setBookmarkSearch] = useState("")
  const [bookmarkSort, setBookmarkSort] = useState<"latest" | "alpha">("latest")
  const [isExported, setIsExported] = useState(false)

  const resultsCache = useRef<
    Record<
      number,
      { results: { name: string; meaning: string }[]; hasMore: boolean; totalCount: number }
    >
  >({})

  useEffect(() => {
    setThemeMounted(true)
    const saved = localStorage.getItem("wordloom_bookmarks")
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse bookmarks", e)
      }
    }
  }, [])

  useEffect(() => {
    onAvailabilityOpenChange?.(availabilityTarget !== null)
  }, [availabilityTarget, onAvailabilityOpenChange])

  // ScrollSpy for A-Z Sections
  useEffect(() => {
    if (mode === "bookmarks" || results.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleLetters = entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target.getAttribute("data-letter") || "")

        if (visibleLetters.length > 0 && visibleLetters[0]) {
          setActiveLetter(visibleLetters[0].toLowerCase())
        }
      },
      { threshold: 0.1, rootMargin: "-10% 0px -75% 0px" },
    )

    const sections = document.querySelectorAll("[data-letter]")
    sections.forEach((s) => observer.observe(s))

    return () => observer.disconnect()
  }, [results, mode])

  const toggleBookmark = useCallback((item: { name: string; meaning: string }) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.name === item.name)
      const updated = exists ? prev.filter((b) => b.name !== item.name) : [...prev, item]
      localStorage.setItem("wordloom_bookmarks", JSON.stringify(updated))
      return updated
    })
  }, [])

  const handleCopy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedName(text)
      setTimeout(() => setCopiedName(null), 1800)
    } catch {
      toast.error(`Failed to copy "${text}" to clipboard`)
    }
  }, [])

  const handleGenerate = useCallback(() => {
    setResults([])
    setSkip(0)
    setTotalCount(0)
    setHasMore(false)
    setHasSearched(true)
    setLetterOffsets({})
    resultsCache.current = {}
    setIsMobileFiltersOpen(false)

    startTransition(async () => {
      const finalLength = length[0] ?? 5
      const finalPrefix = prefix.toLowerCase()
      const finalSuffix = suffix.toLowerCase()
      const finalContains = contains.toLowerCase()

      const offsets = await getLetterOffsetsAction(
        finalLength,
        finalPrefix,
        finalSuffix,
        finalContains,
      )
      setLetterOffsets(offsets)

      const res = await generateNamesAction(
        finalLength,
        finalPrefix,
        finalSuffix,
        finalContains,
        0,
        500,
      )

      setResults(res.results)
      setTotalCount(res.count)
      setSkip(res.results.length)
      setHasMore(res.results.length < res.count)

      resultsCache.current[0] = {
        results: res.results,
        hasMore: res.results.length < res.count,
        totalCount: res.count,
      }

      if (res.results.length > 0 && res.results[0]) {
        setActiveLetter(res.results[0].name[0]?.toLowerCase() || "a")
      }

      if (mode === "bookmarks") setMode("ui")
    })
  }, [length, prefix, suffix, contains, mode])

  // Initial auto-generation
  useEffect(() => {
    if (!hasSearched) {
      handleGenerate()
    }
  }, [hasSearched, handleGenerate])

  // Global hotkeys: ⌘+Enter, ?, 1, 2, /, Escape
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      // 1. Generation hotkey: works regardless of input focus
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault()
        handleGenerate()
        return
      }

      // 2. Escape: dismiss overlays
      if (e.key === "Escape") {
        if (availabilityTarget) {
          e.preventDefault()
          setAvailabilityTarget(null)
          return
        }
        if (isMobileFiltersOpen) {
          e.preventDefault()
          setIsMobileFiltersOpen(false)
          return
        }
      }

      // Hotkeys that only fire when NOT typing in an input or textarea
      const isTyping = (target: EventTarget | null) => {
        if (!target || !(target instanceof HTMLElement)) return false
        return (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable ||
          target.tagName === "SELECT"
        )
      }

      if (isTyping(e.target)) return

      if (e.key === "/" && !e.shiftKey) {
        e.preventDefault()
        prefixInputRef.current?.focus()
        return
      }

      if (e.key === "1") {
        e.preventDefault()
        setMode("ui")
        return
      }

      if (e.key === "2") {
        e.preventDefault()
        setMode("bookmarks")
        return
      }
    }
    window.addEventListener("keydown", handleGlobalKey)
    return () => window.removeEventListener("keydown", handleGlobalKey)
  }, [handleGenerate, availabilityTarget, isMobileFiltersOpen])

  const scrollToLetterSection = (letter: string) => {
    requestAnimationFrame(() => {
      const container = scrollContainerRef.current
      if (!container) return

      const element = container.querySelector(
        `[data-letter="${letter.toUpperCase()}"]`,
      ) as HTMLElement
      if (element) {
        container.scrollTop = element.offsetTop - 12
      }
    })
  }

  const jumpToLetter = (letter: string) => {
    const offset = letterOffsets[letter]
    if (offset === undefined || offset === -1) return

    scrollToLetterSection(letter)
    setActiveLetter(letter)

    const cached = resultsCache.current[offset]
    if (cached) {
      setResults((prev) => {
        const map = new Map(prev.map((i) => [i.name, i]))
        cached.results.forEach((i) => map.set(i.name, i))
        return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
      })
      setSkip(offset + cached.results.length)
      setHasMore(cached.hasMore)
      setTotalCount(cached.totalCount)
      setActiveLetter(letter)
      scrollToLetterSection(letter)
      return
    }

    setSkip(offset)
    setHasMore(true)
    setActiveLetter(letter)

    startTransition(async () => {
      const finalLength = length[0] ?? 5
      const finalPrefix = prefix.toLowerCase()
      const finalSuffix = suffix.toLowerCase()
      const finalContains = contains.toLowerCase()

      const res = await generateNamesAction(
        finalLength,
        finalPrefix,
        finalSuffix,
        finalContains,
        offset,
        500,
      )

      setResults((prev) => {
        const map = new Map(prev.map((i) => [i.name, i]))
        res.results.forEach((i) => map.set(i.name, i))
        return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
      })
      setSkip(offset + res.results.length)
      setHasMore(offset + res.results.length < totalCount)

      resultsCache.current[offset] = {
        results: res.results,
        hasMore: offset + res.results.length < totalCount,
        totalCount,
      }

      scrollToLetterSection(letter)
    })
  }

  const loadMore = useCallback(() => {
    if (isPending || !hasMore) return

    startTransition(async () => {
      const finalLength = length[0] ?? 5
      const finalPrefix = prefix.toLowerCase()
      const finalSuffix = suffix.toLowerCase()
      const finalContains = contains.toLowerCase()

      const res = await generateNamesAction(
        finalLength,
        finalPrefix,
        finalSuffix,
        finalContains,
        skip,
        500,
      )

      setResults((prev) => {
        const map = new Map(prev.map((i) => [i.name, i]))
        res.results.forEach((i) => map.set(i.name, i))
        return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
      })
      setSkip((prev) => prev + res.results.length)
      setHasMore(results.length + res.results.length < res.count)
    })
  }, [isPending, hasMore, length, prefix, suffix, contains, skip, results.length])

  useEffect(() => {
    if (!hasMore || isPending) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore()
        }
      },
      { threshold: 0.8 },
    )

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current)
    }

    return () => observer.disconnect()
  }, [hasMore, isPending, loadMore])

  const filteredResults = useMemo(() => {
    if (!defOnly) return results
    return results.filter((item) => item.meaning && item.meaning.length > 0)
  }, [results, defOnly])

  const sortedBookmarks = useMemo(() => {
    let list = [...bookmarks]
    if (bookmarkSearch.trim()) {
      const q = bookmarkSearch.toLowerCase()
      list = list.filter((b) => b.name.includes(q) || b.meaning.toLowerCase().includes(q))
    }
    if (bookmarkSort === "alpha") {
      list.sort((a, b) => a.name.localeCompare(b.name))
    }
    return list
  }, [bookmarks, bookmarkSearch, bookmarkSort])

  const displayedList = mode === "bookmarks" ? sortedBookmarks : filteredResults

  const groupedResults = useMemo(() => {
    if (!displayedList || displayedList.length <= 8) return null
    return displayedList.reduce(
      (acc, item) => {
        const char = item.name.charAt(0).toUpperCase()
        if (!acc[char]) acc[char] = []
        acc[char].push(item)
        return acc
      },
      {} as Record<string, { name: string; meaning: string }[]>,
    )
  }, [displayedList])

  const exportBookmarks = () => {
    if (bookmarks.length === 0) return
    const text = bookmarks.map((b) => (b.meaning ? `${b.name} : ${b.meaning}` : b.name)).join("\n")
    navigator.clipboard.writeText(text)
    setIsExported(true)
    setTimeout(() => setIsExported(false), 1800)
  }

  const selectedTargetItem = useMemo(() => {
    if (!availabilityTarget) return null
    return (
      results.find((r) => r.name === availabilityTarget) ||
      bookmarks.find((b) => b.name === availabilityTarget) || {
        name: availabilityTarget,
        meaning: "",
      }
    )
  }, [availabilityTarget, results, bookmarks])

  const resetFilters = () => {
    setPrefix("")
    setSuffix("")
    setContains("")
    setDefOnly(false)
  }

  // Common Controls Panel Content (Used in Desktop Sidebar and Mobile Bottom Sheet)
  const renderControls = () => (
    <div className="flex flex-col gap-6">
      {/* Length Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-muted-foreground font-sans text-xs font-semibold tracking-wider uppercase">
            Target Length
          </Label>
          <Badge variant="muted" className="tabular-nums">
            {length[0]} letters
          </Badge>
        </div>

        {/* Quick length chips */}
        <div className="grid grid-cols-7 gap-1">
          {[2, 3, 4, 5, 6, 7, 8].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setLength([val])}
              className={`focus-visible:ring-ring flex h-8 items-center justify-center rounded-md font-mono text-xs font-medium transition-[transform,background-color,border-color,color] duration-150 ease-out outline-none select-none focus-visible:ring-2 active:scale-[0.95] ${
                length[0] === val
                  ? "border-foreground bg-foreground text-background border font-bold shadow-xs"
                  : "border-border bg-muted/30 text-muted-foreground hover:border-foreground/30 hover:text-foreground border"
              }`}
            >
              {val}
            </button>
          ))}
        </div>

        <Slider
          value={length}
          onValueChange={setLength}
          max={8}
          min={2}
          step={1}
          className="cursor-pointer py-2"
        />
      </div>

      <Separator />

      {/* Constraint Inputs */}
      <div className="space-y-3.5">
        {/* Prefix */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Label
                htmlFor="prefix-input"
                className="text-muted-foreground font-sans text-xs font-medium"
              >
                Starts with (Prefix)
              </Label>
            </div>
            {prefix && (
              <button
                type="button"
                onClick={() => setPrefix("")}
                className="text-muted-foreground hover:text-foreground font-mono text-[10px] transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <div className="relative">
            <Input
              ref={prefixInputRef}
              id="prefix-input"
              placeholder="e.g. str, vel, vo"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value.replace(/[^a-zA-Z]/g, ""))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleGenerate()
                }
              }}
              maxLength={length[0]}
              className="h-9 pr-8 font-mono text-xs tracking-wider uppercase"
            />
            {prefix && (
              <button
                type="button"
                onClick={() => setPrefix("")}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Suffix */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="suffix-input"
              className="text-muted-foreground font-sans text-xs font-medium"
            >
              Ends with (Suffix)
            </Label>
            {suffix && (
              <button
                type="button"
                onClick={() => setSuffix("")}
                className="text-muted-foreground hover:text-foreground font-mono text-[10px] transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <div className="relative">
            <Input
              id="suffix-input"
              placeholder="e.g. io, ex, on"
              value={suffix}
              onChange={(e) => setSuffix(e.target.value.replace(/[^a-zA-Z]/g, ""))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleGenerate()
                }
              }}
              maxLength={length[0]}
              className="h-9 pr-8 font-mono text-xs tracking-wider uppercase"
            />
            {suffix && (
              <button
                type="button"
                onClick={() => setSuffix("")}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Contains */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="contains-input"
              className="text-muted-foreground font-sans text-xs font-medium"
            >
              Must Contain
            </Label>
            {contains && (
              <button
                type="button"
                onClick={() => setContains("")}
                className="text-muted-foreground hover:text-foreground font-mono text-[10px] transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <div className="relative">
            <Input
              id="contains-input"
              placeholder="e.g. ar, lum, x"
              value={contains}
              onChange={(e) => setContains(e.target.value.replace(/[^a-zA-Z]/g, ""))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleGenerate()
                }
              }}
              maxLength={length[0]}
              className="h-9 pr-8 font-mono text-xs tracking-wider uppercase"
            />
            {contains && (
              <button
                type="button"
                onClick={() => setContains("")}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Vocabulary Scope: 2-Option Segmented Control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-foreground text-xs font-medium">Vocabulary Scope</Label>
          <span className="text-muted-foreground font-mono text-[10px]">
            {defOnly ? "Dictionary definitions" : "All synthesized names"}
          </span>
        </div>
        <div className="border-border/80 bg-muted/80 grid grid-cols-2 rounded-lg border p-0.5 text-xs shadow-xs select-none">
          <button
            type="button"
            onClick={() => setDefOnly(false)}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs outline-none transition-[color,background-color,box-shadow,transform] duration-150 ease-out active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring",
              !defOnly
                ? "bg-foreground text-background font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground font-medium",
            )}
          >
            <Globe2 className="h-3.5 w-3.5" />
            <span>All Names</span>
          </button>
          <button
            type="button"
            onClick={() => setDefOnly(true)}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs outline-none transition-[color,background-color,box-shadow,transform] duration-150 ease-out active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring",
              defOnly
                ? "bg-foreground text-background font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground font-medium",
            )}
          >
            <BookA className="h-3.5 w-3.5" />
            <span>WordNet Def</span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-auto space-y-2 pt-4">
        {(prefix || suffix || contains || defOnly) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-muted-foreground hover:text-foreground w-full text-xs"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            <span>Reset constraints</span>
          </Button>
        )}

        <Button
          type="button"
          onClick={handleGenerate}
          disabled={isPending}
          className="h-10 w-full text-xs font-semibold"
        >
          {isPending ? (
            <>
              <div className="mr-2 h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span>Weaving...</span>
            </>
          ) : (
            <span>Generate Names</span>
          )}
        </Button>
      </div>
    </div>
  )

  return (
    <div className="bg-background text-foreground selection:bg-primary selection:text-primary-foreground relative flex h-full w-full flex-col overflow-hidden">
      {/* Top Header */}
      <header className="border-border/80 bg-background/85 sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b px-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] backdrop-blur-md sm:px-6 dark:shadow-[0_1px_4px_0_rgba(0,0,0,0.35)]">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground h-8 gap-1 px-2 text-xs"
            title="Return to home"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Back</span>
          </Button>

          <Separator orientation="vertical" className="hidden h-4 sm:block" />

          {/* Shadcn Tabs for Mode Switcher */}
          <Tabs value={mode} onValueChange={(val) => setMode(val as any)}>
            <TabsList className="bg-muted/80 border-border/80 h-8.5 rounded-lg border p-1 shadow-xs">
              <TabsTrigger value="ui" className="h-6.5 gap-1.5 px-3 text-xs font-medium">
                <Compass className="h-3.5 w-3.5 shrink-0" />
                <span>Studio</span>
              </TabsTrigger>
              <TabsTrigger value="bookmarks" className="h-6.5 gap-1.5 px-3 text-xs font-medium">
                <Bookmark className="h-3.5 w-3.5 shrink-0" />
                <span>Saved</span>
                {bookmarks.length > 0 && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0 text-[10px] font-mono tabular-nums leading-none flex items-center justify-center h-4 transition-colors",
                      mode === "bookmarks"
                        ? "bg-background/25 text-background font-bold"
                        : "bg-muted-foreground/15 text-muted-foreground font-semibold",
                    )}
                  >
                    {bookmarks.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Right Nav Utilities */}
        <div className="flex items-center gap-2">
          {/* Mobile Filter Sheet Trigger */}
          {mode === "ui" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMobileFiltersOpen(true)}
              className="flex h-8 gap-1.5 text-xs md:hidden"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Filters</span>
              {(prefix || suffix || contains || defOnly) && (
                <span className="bg-foreground h-1.5 w-1.5 rounded-full" />
              )}
            </Button>
          )}

          {themeMounted && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="text-muted-foreground hover:text-foreground h-8 w-8 px-0"
              title="Toggle theme"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </header>

      {/* Main Studio Viewport */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Desktop Controls Sidebar */}
        {mode === "ui" && (
          <aside className="border-border/80 bg-sidebar/70 dark:bg-sidebar/40 hidden w-72 shrink-0 flex-col overflow-y-auto border-r p-5 shadow-[1px_0_4px_0_rgba(0,0,0,0.02)] backdrop-blur-md md:flex lg:w-80 dark:shadow-[1px_0_8px_0_rgba(0,0,0,0.25)]">
            <div className="border-border mb-4 flex items-center justify-between border-b pb-3">
              <span className="text-foreground font-sans text-xs font-semibold tracking-wider uppercase">
                Configuration
              </span>
              <span className="text-muted-foreground font-mono text-[11px] tabular-nums">
                {isPending ? "Weaving..." : "Ready"}
              </span>
            </div>
            {renderControls()}
          </aside>
        )}

        {/* Mobile Filter Drawer (iOS-style bottom sheet) */}
        <AnimatePresence initial={false}>
          {isMobileFiltersOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={() => setIsMobileFiltersOpen(false)}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs md:hidden"
              />
              <motion.div
                initial={{ transform: "translateY(100%)" }}
                animate={{ transform: "translateY(0%)" }}
                exit={{ transform: "translateY(100%)" }}
                transition={mobileSheetSpring}
                className="border-border/80 bg-card/98 fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl border-t p-5 shadow-2xl backdrop-blur-xl md:hidden dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_-12px_36px_rgba(0,0,0,0.8)]"
              >
                <div className="bg-muted-foreground/30 mx-auto mb-3 h-1 w-10 rounded-full" />
                <div className="border-border mb-4 flex items-center justify-between border-b pb-3">
                  <span className="text-foreground font-sans text-sm font-bold">
                    Filters & Constraints
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="text-muted-foreground hover:bg-muted rounded-md p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {renderControls()}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Center Main Feed Area */}
        <main className="flex min-h-0 min-w-0 flex-1 flex-col">
          {/* Top Info Bar */}
          <div className="border-border bg-muted/20 flex shrink-0 items-center justify-between border-b px-4 py-2.5 sm:px-6">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-sans text-xs font-semibold tracking-wider uppercase">
                {mode === "bookmarks" ? "Saved Directory" : "Results Feed"}
              </span>
              <Badge variant="muted" className="tabular-nums">
                {mode === "bookmarks"
                  ? `${sortedBookmarks.length} bookmarked`
                  : totalCount > 0
                    ? `${totalCount.toLocaleString()} words`
                    : "0 words"}
              </Badge>
              {defOnly && (
                <Badge variant="default" className="text-[10px]">
                  defined only
                </Badge>
              )}
            </div>

            {mode === "bookmarks" && bookmarks.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportBookmarks}
                  className={cn(
                    "h-7 text-xs gap-1.5 transition-[transform,background-color,border-color,color] duration-150 ease-out",
                    isExported &&
                      "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/15",
                  )}
                >
                  <span className="relative flex items-center justify-center">
                    <AnimatePresence mode="popLayout" initial={false}>
                      {isExported ? (
                        <motion.span
                          key="exported"
                          initial={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
                          animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                          exit={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
                          transition={criticallyDampedSpring}
                          className="flex items-center justify-center text-emerald-600 dark:text-emerald-400"
                        >
                          <Check className="h-3 w-3" />
                        </motion.span>
                      ) : (
                        <motion.span
                          key="download"
                          initial={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
                          animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                          exit={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
                          transition={criticallyDampedSpring}
                          className="flex items-center justify-center"
                        >
                          <Download className="h-3 w-3" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                  <span>{isExported ? "Exported!" : "Export"}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setBookmarks([])
                    localStorage.removeItem("wordloom_bookmarks")
                    toast.info("Cleared saved collection")
                  }}
                  className="text-destructive hover:text-destructive h-7 text-xs"
                >
                  Clear
                </Button>
              </div>
            )}
          </div>

          {/* Bookmarks Search Toolbar */}
          {mode === "bookmarks" && (
            <div className="border-border bg-card flex shrink-0 items-center justify-between gap-3 border-b px-4 py-2.5 sm:px-6">
              <div className="relative max-w-sm flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2" />
                <Input
                  placeholder="Filter saved names or definitions..."
                  value={bookmarkSearch}
                  onChange={(e) => setBookmarkSearch(e.target.value)}
                  className="h-8 pl-8 text-xs"
                />
              </div>

              <div className="border-border/80 bg-muted/80 flex items-center rounded-lg border p-0.5 text-xs shadow-xs select-none">
                <button
                  type="button"
                  onClick={() => setBookmarkSort("latest")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs outline-none transition-[color,background-color,box-shadow,transform] duration-150 ease-out active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring",
                    bookmarkSort === "latest"
                      ? "bg-foreground text-background font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground font-medium",
                  )}
                >
                  <Clock className="h-3.5 w-3.5" />
                  <span>Latest</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBookmarkSort("alpha")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs outline-none transition-[color,background-color,box-shadow,transform] duration-150 ease-out active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring",
                    bookmarkSort === "alpha"
                      ? "bg-foreground text-background font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground font-medium",
                  )}
                >
                  <ArrowDownAZ className="h-3.5 w-3.5" />
                  <span>A-Z</span>
                </button>
              </div>
            </div>
          )}

          {/* Feed Content Area with Progressive Blur & Fade */}
          <div className="bg-muted/15 relative min-h-0 flex-1 overflow-hidden dark:bg-black/25">
            {/* Top Progressive Blur & Fade */}
            <div
              aria-hidden="true"
              className="from-background via-background/70 pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b to-transparent [mask-image:linear-gradient(to_bottom,black,transparent)] backdrop-blur-[2px]"
            />

            {/* Feed Content Grid */}
            <div ref={scrollContainerRef} className="h-full overflow-y-auto px-4 py-6 sm:px-6">
              {isPending && skip === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center gap-3">
                  <div className="border-foreground h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
                  <span className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
                    Analyzing phonetic transitions...
                  </span>
                </div>
              ) : displayedList.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
                  <div className="border-border bg-muted/50 text-muted-foreground flex h-10 w-10 items-center justify-center rounded-lg border">
                    <Compass className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-foreground font-sans text-sm font-bold">
                      {mode === "bookmarks" ? "No bookmarks saved yet" : "No words found"}
                    </h3>
                    <p className="text-muted-foreground mt-1 max-w-sm font-sans text-xs">
                      {mode === "bookmarks"
                        ? "Bookmark names in Studio to store and review them here."
                        : "Try loosening your prefix, suffix, or contains constraints."}
                    </p>
                  </div>
                  {mode === "bookmarks" ? (
                    <Button size="sm" onClick={() => setMode("ui")} className="mt-2 text-xs">
                      Return to Studio
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetFilters}
                      className="mt-2 text-xs"
                    >
                      Reset constraints
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-8 pb-16">
                  {groupedResults ? (
                    Object.entries(groupedResults)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([letter, items]) => (
                        <section key={letter} data-letter={letter} className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="bg-foreground text-background flex h-6 w-6 items-center justify-center rounded font-mono text-xs font-bold">
                              {letter}
                            </span>
                            <Separator className="flex-1" />
                            <span className="text-muted-foreground font-mono text-[11px] tabular-nums">
                              {items.length} words
                            </span>
                          </div>

                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {items.map((item) => (
                              <ResultCard
                                key={item.name}
                                item={item}
                                isSaved={bookmarks.some((b) => b.name === item.name)}
                                isActive={availabilityTarget === item.name}
                                isCopied={copiedName === item.name}
                                onToggleBookmark={toggleBookmark}
                                onCopy={handleCopy}
                                onCheckAvailability={setAvailabilityTarget}
                              />
                            ))}
                          </div>
                        </section>
                      ))
                  ) : (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {displayedList.map((item) => (
                        <ResultCard
                          key={item.name}
                          item={item}
                          isSaved={bookmarks.some((b) => b.name === item.name)}
                          isActive={availabilityTarget === item.name}
                          isCopied={copiedName === item.name}
                          onToggleBookmark={toggleBookmark}
                          onCopy={handleCopy}
                          onCheckAvailability={setAvailabilityTarget}
                        />
                      ))}
                    </div>
                  )}

                  {/* Infinite Scroll Trigger */}
                  {mode !== "bookmarks" && hasMore && (
                    <div
                      ref={sentinelRef}
                      className="flex flex-col items-center justify-center py-6"
                    >
                      <div className="border-foreground h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
                      <span className="text-muted-foreground mt-2 font-mono text-[11px]">
                        Loading more words...
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Progressive Blur & Fade */}
            <div
              aria-hidden="true"
              className="from-background via-background/70 pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 bg-gradient-to-t to-transparent [mask-image:linear-gradient(to_top,black,transparent)] backdrop-blur-[2px]"
            />
          </div>

          {/* Bottom A-Z Alphabet Navigation Bar */}
          {mode !== "bookmarks" && Object.keys(letterOffsets).length > 0 && (
            <div className="border-border bg-card/90 shrink-0 border-t px-3 py-2 backdrop-blur-xs">
              <div className="no-scrollbar mx-auto flex max-w-4xl items-center justify-between gap-1 overflow-x-auto">
                {"abcdefghijklmnopqrstuvwxyz".split("").map((l) => {
                  const isAvailable = letterOffsets[l] !== undefined && letterOffsets[l] !== -1
                  const isActive = activeLetter === l
                  return (
                    <button
                      key={l}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => jumpToLetter(l)}
                      className={`flex h-7 min-w-6 items-center justify-center rounded font-mono text-xs uppercase transition-colors active:scale-[0.96] sm:flex-1 ${
                        isActive
                          ? "bg-foreground text-background font-bold shadow-xs"
                          : isAvailable
                            ? "text-muted-foreground hover:bg-muted hover:text-foreground"
                            : "text-muted-foreground cursor-not-allowed opacity-20"
                      }`}
                      title={
                        isAvailable
                          ? `Jump to ${l.toUpperCase()}`
                          : `No names for ${l.toUpperCase()}`
                      }
                    >
                      {l}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </main>

        {/* Desktop Availability Slide-over Inspector */}
        <AnimatePresence initial={false}>
          {availabilityTarget && selectedTargetItem && (
            <motion.aside
              key="desktop-inspector"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 360, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={criticallyDampedSpring}
              className="border-border/80 bg-card/95 hidden shrink-0 flex-col overflow-y-auto border-l shadow-2xl backdrop-blur-md lg:flex dark:shadow-[inset_1px_0_0_0_rgba(255,255,255,0.07),-8px_0_28px_-8px_rgba(0,0,0,0.7)]"
            >
              <div className="flex w-[360px] flex-col p-6">
                {/* Header */}
                <div className="border-border flex items-start justify-between border-b pb-4">
                  <div>
                    <span className="text-muted-foreground font-mono text-[10px] tracking-wider uppercase">
                      Availability Inspector
                    </span>
                    <h3 className="text-foreground mt-1 font-sans text-3xl font-extrabold tracking-tight lowercase">
                      {selectedTargetItem.name}
                    </h3>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setAvailabilityTarget(null)}
                    className="text-muted-foreground hover:text-foreground h-8 w-8"
                    aria-label="Close inspector"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Quick actions */}
                <div className="mt-4 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(selectedTargetItem.name)}
                    className={cn(
                      "flex-1 text-xs gap-1.5 transition-[transform,background-color,border-color,color] duration-150 ease-out",
                      copiedName === selectedTargetItem.name &&
                        "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/15",
                    )}
                  >
                    <span className="relative flex items-center justify-center">
                      <AnimatePresence mode="popLayout" initial={false}>
                        {copiedName === selectedTargetItem.name ? (
                          <motion.span
                            key="copied"
                            initial={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
                            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                            exit={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
                            transition={criticallyDampedSpring}
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
                            transition={criticallyDampedSpring}
                            className="flex items-center justify-center"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                    <span>{copiedName === selectedTargetItem.name ? "Copied!" : "Copy Name"}</span>
                  </Button>

                  <Button
                    variant={
                      bookmarks.some((b) => b.name === selectedTargetItem.name)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => toggleBookmark(selectedTargetItem)}
                    className="flex-1 gap-1.5 text-xs transition-[transform,background-color,border-color,color] duration-150 ease-out"
                  >
                    <span className="relative flex items-center justify-center">
                      <AnimatePresence mode="popLayout" initial={false}>
                        {bookmarks.some((b) => b.name === selectedTargetItem.name) ? (
                          <motion.span
                            key="saved"
                            initial={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
                            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                            exit={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
                            transition={criticallyDampedSpring}
                            className="flex items-center justify-center"
                          >
                            <BookmarkCheck className="h-3.5 w-3.5 fill-current" />
                          </motion.span>
                        ) : (
                          <motion.span
                            key="unsaved"
                            initial={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
                            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                            exit={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
                            transition={criticallyDampedSpring}
                            className="flex items-center justify-center"
                          >
                            <Bookmark className="h-3.5 w-3.5" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                    <span>
                      {bookmarks.some((b) => b.name === selectedTargetItem.name) ? "Saved" : "Save"}
                    </span>
                  </Button>
                </div>

                {/* Meaning section */}
                {selectedTargetItem.meaning && (
                  <div className="border-border bg-muted/30 mt-5 rounded-lg border p-3.5">
                    <span className="text-foreground font-mono text-[10px] font-semibold uppercase">
                      WordNet Meaning
                    </span>
                    <p className="text-muted-foreground mt-1 font-sans text-xs leading-relaxed text-pretty">
                      {selectedTargetItem.meaning}
                    </p>
                  </div>
                )}

                {/* Platform checks list */}
                <div className="mt-6 space-y-2">
                  <span className="text-muted-foreground font-mono text-[10px] tracking-wider uppercase">
                    Live Platform Checks
                  </span>

                  {platformDirectory.map((p) => (
                    <a
                      key={p.name}
                      href={p.getUrl(selectedTargetItem.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group border-border bg-card hover:border-foreground/30 hover:bg-muted/40 flex flex-col rounded-lg border p-3 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-foreground font-sans text-xs font-semibold">
                          {p.name}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <Badge variant="muted" className="h-4 px-1 py-0 text-[9px]">
                            {p.badge}
                          </Badge>
                          <ExternalLink className="text-muted-foreground group-hover:text-foreground h-3 w-3 transition-colors" />
                        </div>
                      </div>
                      <span className="text-muted-foreground mt-1 font-sans text-[11px]">
                        {p.desc}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Mobile Availability Bottom Sheet */}
        <AnimatePresence initial={false}>
          {availabilityTarget && selectedTargetItem && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={() => setAvailabilityTarget(null)}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs lg:hidden"
              />
              <motion.div
                initial={{ transform: "translateY(100%)" }}
                animate={{ transform: "translateY(0%)" }}
                exit={{ transform: "translateY(100%)" }}
                transition={mobileSheetSpring}
                className="border-border bg-card fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl border-t p-5 shadow-2xl lg:hidden"
              >
                <div className="bg-muted-foreground/30 mx-auto mb-3 h-1 w-10 rounded-full" />
                <div className="border-border flex items-start justify-between border-b pb-3">
                  <div>
                    <span className="text-muted-foreground font-mono text-[10px] tracking-wider uppercase">
                      Availability Check
                    </span>
                    <h3 className="text-foreground mt-0.5 font-sans text-2xl font-bold lowercase">
                      {selectedTargetItem.name}
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setAvailabilityTarget(null)}
                    className="text-muted-foreground hover:text-foreground h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(selectedTargetItem.name)}
                    className={cn(
                      "flex-1 text-xs gap-1.5 transition-[transform,background-color,border-color,color] duration-150 ease-out",
                      copiedName === selectedTargetItem.name &&
                        "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/15",
                    )}
                  >
                    <span className="relative flex items-center justify-center">
                      <AnimatePresence mode="popLayout" initial={false}>
                        {copiedName === selectedTargetItem.name ? (
                          <motion.span
                            key="copied"
                            initial={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
                            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                            exit={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
                            transition={criticallyDampedSpring}
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
                            transition={criticallyDampedSpring}
                            className="flex items-center justify-center"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                    <span>{copiedName === selectedTargetItem.name ? "Copied!" : "Copy Name"}</span>
                  </Button>

                  <Button
                    variant={
                      bookmarks.some((b) => b.name === selectedTargetItem.name)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => toggleBookmark(selectedTargetItem)}
                    className="flex-1 gap-1.5 text-xs transition-[transform,background-color,border-color,color] duration-150 ease-out"
                  >
                    <span className="relative flex items-center justify-center">
                      <AnimatePresence mode="popLayout" initial={false}>
                        {bookmarks.some((b) => b.name === selectedTargetItem.name) ? (
                          <motion.span
                            key="saved"
                            initial={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
                            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                            exit={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
                            transition={criticallyDampedSpring}
                            className="flex items-center justify-center"
                          >
                            <BookmarkCheck className="h-3.5 w-3.5 fill-current" />
                          </motion.span>
                        ) : (
                          <motion.span
                            key="unsaved"
                            initial={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
                            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                            exit={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
                            transition={criticallyDampedSpring}
                            className="flex items-center justify-center"
                          >
                            <Bookmark className="h-3.5 w-3.5" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                    <span>
                      {bookmarks.some((b) => b.name === selectedTargetItem.name) ? "Saved" : "Save"}
                    </span>
                  </Button>
                </div>

                {selectedTargetItem.meaning && (
                  <div className="border-border bg-muted/30 mt-4 rounded-lg border p-3">
                    <span className="text-foreground font-mono text-[10px] font-semibold uppercase">
                      WordNet Definition
                    </span>
                    <p className="text-muted-foreground mt-1 font-sans text-xs leading-relaxed">
                      {selectedTargetItem.meaning}
                    </p>
                  </div>
                )}

                <div className="mt-4 grid gap-2">
                  {platformDirectory.map((p) => (
                    <a
                      key={p.name}
                      href={p.getUrl(selectedTargetItem.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-border bg-card text-foreground hover:bg-muted/40 flex items-center justify-between rounded-lg border p-3 transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="font-sans text-xs font-semibold">{p.name}</span>
                        <span className="text-muted-foreground font-sans text-[10px]">
                          {p.desc}
                        </span>
                      </div>
                      <ExternalLink className="text-muted-foreground h-4 w-4" />
                    </a>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
