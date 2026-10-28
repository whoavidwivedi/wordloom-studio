"use client"

import {
  ArrowDownAZ,
  ArrowLeft,
  BookA,
  Bookmark,
  Check,
  Clock,
  Compass,
  Braces,
  ChevronDown,
  Copy,
  Download,
  FileSpreadsheet,
  FileText,
  Globe2,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react"

import { InspectorBody } from "@/components/studio/inspector-body"
import { ResultCard } from "@/components/studio/result-card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EmptyState } from "@/components/ui/empty-state"
import { Eyebrow } from "@/components/ui/eyebrow"
import { ClearableInput, Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NumberPopIn } from "@/components/ui/number-pop-in"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { Separator } from "@/components/ui/separator"
import { BottomSheet } from "@/components/ui/sheet"
import { Spinner } from "@/components/ui/spinner"
import { useDelayedPending } from "@/hooks/use-delayed-pending"
import { downloadNames, namesAsText, type ExportFormat } from "@/lib/export-names"
import { cn } from "@/lib/utils"

import { generateNamesAction, searchNamesAction, type NameResult } from "../app/actions"

const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("")
const LENGTHS = [2, 3, 4, 5, 6, 7, 8].map((n) => ({ value: String(n), label: n }))
const PAGE_SIZE = 500
const BOOKMARKS_KEY = "wordloom_bookmarks"

type Mode = "ui" | "bookmarks"

// Results arrive in alphabetical order from the generator; merging pages keeps that order.
const mergeResults = (prev: NameResult[], next: NameResult[]) => {
  const map = new Map(prev.map((i) => [i.name, i]))
  for (const item of next) map.set(item.name, item)
  return Array.from(map.values()).sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
}

const isTypingTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT" ||
    target.isContentEditable)

const lettersOnly = (value: string) => value.replace(/[^a-zA-Z]/g, "")

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

type ExportKind = ExportFormat | "copy"
type ExportStatus =
  | { phase: "idle" }
  | { phase: "preparing" }
  | { phase: "working" | "done" | "error"; kind: ExportKind }

function ExportButtonLabel({ status }: { status: ExportStatus }) {
  const copy = "kind" in status && status.kind === "copy"
  switch (status.phase) {
    case "preparing":
      return (
        <>
          <Spinner label="Preparing" />
          Preparing…
        </>
      )
    case "working":
      return (
        <>
          <Spinner label={copy ? "Copying" : "Downloading"} />
          {copy ? "Copying…" : "Downloading…"}
        </>
      )
    case "done":
      return (
        <>
          <Check />
          {copy ? "Copied" : "Downloaded"}
        </>
      )
    case "error":
      return (
        <>
          <X />
          {copy ? "Couldn't copy" : "Couldn't save"}
        </>
      )
    default:
      return (
        <>
          <Download />
          Export
          <ChevronDown className="text-subtle-foreground -mr-0.5 ml-auto" />
        </>
      )
  }
}

export type StudioQuery = {
  length: number
  prefix: string
  suffix: string
  contains: string
  defOnly: boolean
}

export function Studio({
  initialQuery,
  onBack,
  onAvailabilityOpenChange,
}: {
  /** Starting filters, e.g. from a shared /studio?prefix=ve&length=5 link. */
  initialQuery?: StudioQuery
  onBack: () => void
  onAvailabilityOpenChange?: (isOpen: boolean) => void
}) {
  const [mode, setMode] = useState<Mode>("ui")
  const [length, setLength] = useState([initialQuery?.length ?? 5])
  const [prefix, setPrefix] = useState(initialQuery?.prefix ?? "")
  const [suffix, setSuffix] = useState(initialQuery?.suffix ?? "")
  const [contains, setContains] = useState(initialQuery?.contains ?? "")
  const [defOnly, setDefOnly] = useState(initialQuery?.defOnly ?? false)

  const [isPending, startTransition] = useTransition()
  // Which request is in flight decides where the loader shows.
  const [pendingKind, setPendingKind] = useState<"search" | "page" | null>(null)
  const [results, setResults] = useState<NameResult[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [skip, setSkip] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [availabilityTarget, setAvailabilityTarget] = useState<string | null>(null)
  const [copiedName, setCopiedName] = useState<string | null>(null)

  const [letterOffsets, setLetterOffsets] = useState<Record<string, number>>({})
  const [activeLetter, setActiveLetter] = useState<string>("a")
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  const prefixInputRef = useRef<HTMLInputElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [bookmarks, setBookmarks] = useState<NameResult[]>([])
  const [bookmarkSearch, setBookmarkSearch] = useState("")
  const [bookmarkSort, setBookmarkSort] = useState<"latest" | "alpha">("latest")
  const [exportStatus, setExportStatus] = useState<ExportStatus>({ phase: "idle" })

  // Page cache keyed by stream offset, cleared on every new search.
  const resultsCache = useRef<Record<number, NameResult[]>>({})

  const searching = isPending && pendingKind === "search"
  const showSearchLoader = useDelayedPending(searching)
  const showPageLoader = useDelayedPending(isPending && pendingKind === "page")

  const savedNames = useMemo(() => new Set(bookmarks.map((b) => b.name)), [bookmarks])

  const query = useMemo(
    () => ({
      length: length[0] ?? 5,
      prefix: prefix.toLowerCase(),
      suffix: suffix.toLowerCase(),
      contains: contains.toLowerCase(),
    }),
    [length, prefix, suffix, contains],
  )

  useEffect(() => {
    try {
      const saved = localStorage.getItem(BOOKMARKS_KEY)
      if (saved) setBookmarks(JSON.parse(saved))
    } catch (e) {
      console.error("Failed to read bookmarks", e)
    }

    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
    }
  }, [])

  const persistBookmarks = useCallback((list: NameResult[]) => {
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(list))
    } catch {
      // Storage can be full or blocked; the in-memory list still works for this visit.
    }
  }, [])

  useEffect(() => {
    onAvailabilityOpenChange?.(availabilityTarget !== null)
  }, [availabilityTarget, onAvailabilityOpenChange])

  const toggleBookmark = useCallback(
    (item: NameResult) => {
      setBookmarks((prev) => {
        const exists = prev.some((b) => b.name === item.name)
        const updated = exists ? prev.filter((b) => b.name !== item.name) : [...prev, item]
        persistBookmarks(updated)
        return updated
      })
    },
    [persistBookmarks],
  )

  const handleCopy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedName(text)
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
      copyTimerRef.current = setTimeout(() => setCopiedName(null), 1600)
    } catch {
      // Clipboard can be blocked (permissions, insecure context); the button just stays as is.
    }
  }, [])

  const handleGenerate = useCallback(() => {
    setHasMore(false)
    resultsCache.current = {}
    setIsMobileFiltersOpen(false)
    setMode("ui")
    setPendingKind("search")

    startTransition(async () => {
      const res = await searchNamesAction(query.length, query.prefix, query.suffix, query.contains)

      setLetterOffsets(res.offsets)
      setResults(res.results)
      setTotalCount(res.count)
      setSkip(res.results.length)
      setHasMore(res.results.length < res.count)
      resultsCache.current[0] = res.results
      scrollContainerRef.current?.scrollTo({ top: 0 })

      const first = res.results[0]?.name[0]
      if (first) setActiveLetter(first)
    })
  }, [query])

  // First search on mount
  const didInitialSearch = useRef(false)
  useEffect(() => {
    if (didInitialSearch.current) return
    didInitialSearch.current = true
    handleGenerate()
  }, [handleGenerate])

  // Global hotkeys: ⌘+Enter, /, 1, 2, Escape
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault()
        handleGenerate()
        return
      }

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

      if (isTypingTarget(e.target) || e.metaKey || e.ctrlKey || e.altKey) return

      if (e.key === "/") {
        e.preventDefault()
        prefixInputRef.current?.focus()
      } else if (e.key === "1") {
        setMode("ui")
      } else if (e.key === "2") {
        setMode("bookmarks")
      }
    }
    window.addEventListener("keydown", handleGlobalKey)
    return () => window.removeEventListener("keydown", handleGlobalKey)
  }, [handleGenerate, availabilityTarget, isMobileFiltersOpen])

  // Letter jumps are keyboard-speed navigation, so they snap rather than smooth-scroll.
  const scrollToLetterSection = useCallback((letter: string) => {
    requestAnimationFrame(() => {
      const container = scrollContainerRef.current
      const element = container?.querySelector<HTMLElement>(
        `[data-letter="${letter.toUpperCase()}"]`,
      )
      if (container && element) container.scrollTop = element.offsetTop - 12
    })
  }, [])

  const jumpToLetter = (letter: string) => {
    const offset = letterOffsets[letter]
    if (offset === undefined || offset === -1) return

    setActiveLetter(letter)

    const cached = resultsCache.current[offset]
    if (cached) {
      setResults((prev) => mergeResults(prev, cached))
      setSkip(offset + cached.length)
      setHasMore(offset + cached.length < totalCount)
      scrollToLetterSection(letter)
      return
    }

    setPendingKind("page")
    startTransition(async () => {
      const res = await generateNamesAction(
        query.length,
        query.prefix,
        query.suffix,
        query.contains,
        offset,
        PAGE_SIZE,
      )

      resultsCache.current[offset] = res.results
      setResults((prev) => mergeResults(prev, res.results))
      setSkip(offset + res.results.length)
      setHasMore(offset + res.results.length < res.count)
      scrollToLetterSection(letter)
    })
  }

  const loadMore = useCallback(() => {
    if (isPending || !hasMore) return

    setPendingKind("page")
    startTransition(async () => {
      const res = await generateNamesAction(
        query.length,
        query.prefix,
        query.suffix,
        query.contains,
        skip,
        PAGE_SIZE,
      )

      resultsCache.current[skip] = res.results
      setResults((prev) => mergeResults(prev, res.results))
      setSkip(skip + res.results.length)
      setHasMore(res.results.length > 0 && skip + res.results.length < res.count)
    })
  }, [isPending, hasMore, query, skip])

  // Infinite scroll, fetched well before the bottom so it rarely needs a loader.
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!hasMore || isPending || !sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore()
      },
      { root: scrollContainerRef.current, rootMargin: "0px 0px 800px 0px" },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, isPending, loadMore])

  const filteredResults = useMemo(
    () => (defOnly ? results.filter((item) => item.meaning) : results),
    [results, defOnly],
  )

  const sortedBookmarks = useMemo(() => {
    const q = bookmarkSearch.trim().toLowerCase()
    const list = q
      ? bookmarks.filter((b) => b.name.includes(q) || b.meaning.toLowerCase().includes(q))
      : [...bookmarks]
    if (bookmarkSort === "alpha") list.sort((a, b) => a.name.localeCompare(b.name))
    return list
  }, [bookmarks, bookmarkSearch, bookmarkSort])

  const displayedList = mode === "bookmarks" ? sortedBookmarks : filteredResults

  const groupedResults = useMemo(() => {
    if (displayedList.length <= 8) return null
    const groups = new Map<string, NameResult[]>()
    for (const item of displayedList) {
      const char = item.name.charAt(0).toUpperCase()
      const group = groups.get(char)
      if (group) group.push(item)
      else groups.set(char, [item])
    }
    return [...groups.entries()].sort(([a], [b]) => (a < b ? -1 : 1))
  }, [displayedList])

  // Scroll spy for the A–Z dock
  useEffect(() => {
    const container = scrollContainerRef.current
    if (mode === "bookmarks" || !groupedResults || !container) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting)
        const letter = visible?.target.getAttribute("data-letter")
        if (letter) setActiveLetter(letter.toLowerCase())
      },
      { root: container, rootMargin: "-10% 0px -75% 0px" },
    )

    container.querySelectorAll("[data-letter]").forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [groupedResults, mode])

  // Exports every saved name in the current sort order (the search filter only narrows the view).
  const exportRows = useMemo(
    () =>
      bookmarkSort === "alpha"
        ? [...bookmarks].sort((a, b) => a.name.localeCompare(b.name))
        : bookmarks,
    [bookmarks, bookmarkSort],
  )

  // The Export button walks through each step itself (preparing, downloading, done),
  // holding each long enough to read, instead of flashing a toast.
  const exportRun = useRef(0)
  const runExport = async (kind: ExportFormat | "copy") => {
    if (
      exportRows.length === 0 ||
      exportStatus.phase === "preparing" ||
      exportStatus.phase === "working"
    )
      return
    const run = ++exportRun.current
    const current = () => run === exportRun.current

    setExportStatus({ phase: "preparing" })
    await wait(550)
    if (!current()) return

    try {
      setExportStatus({ phase: "working", kind })
      if (kind === "copy") await navigator.clipboard.writeText(namesAsText(exportRows))
      else downloadNames(exportRows, kind)
      await wait(650)
      if (!current()) return
      setExportStatus({ phase: "done", kind })
    } catch {
      if (!current()) return
      setExportStatus({ phase: "error", kind })
    }

    await wait(1800)
    if (current()) setExportStatus({ phase: "idle" })
  }

  const clearBookmarks = () => {
    setBookmarks([])
    persistBookmarks([])
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

  const hasConstraints = Boolean(prefix || suffix || contains || defOnly)

  const resetFilters = () => {
    setPrefix("")
    setSuffix("")
    setContains("")
    setDefOnly(false)
  }

  const closeInspector = useCallback(() => setAvailabilityTarget(null), [])
  const closeFilters = useCallback(() => setIsMobileFiltersOpen(false), [])

  // Shared by the desktop sidebar and the mobile sheet; idPrefix keeps input ids unique.
  const renderControls = (idPrefix: string, withShortcut: boolean) => (
    <div className="flex flex-1 flex-col gap-6">
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <Eyebrow>Length</Eyebrow>
          <span className="text-caption text-foreground font-mono font-medium tabular-nums">
            {length[0]} letters
          </span>
        </div>
        <SegmentedControl
          aria-label="Target length"
          value={String(length[0])}
          onValueChange={(v) => setLength([Number(v)])}
          items={LENGTHS}
          fill
          itemClassName="font-mono tabular-nums px-0"
        />
      </section>

      <Separator />

      <section className="space-y-3.5">
        <Eyebrow>Constraints</Eyebrow>
        {(
          [
            ["prefix", "Starts with", "str, vel, vo", prefix, setPrefix],
            ["suffix", "Ends with", "io, ex, on", suffix, setSuffix],
            ["contains", "Contains", "ar, lum, x", contains, setContains],
          ] as const
        ).map(([key, label, placeholder, value, setValue]) => (
          <Field
            key={key}
            id={`${idPrefix}-${key}`}
            label={label}
            hint={value ? `${value.length}/${query.length}` : undefined}
          >
            <ClearableInput
              ref={key === "prefix" && withShortcut ? prefixInputRef : undefined}
              id={`${idPrefix}-${key}`}
              placeholder={`e.g. ${placeholder}`}
              value={value}
              onValueChange={(v) => setValue(lettersOnly(v))}
              clearLabel={`Clear ${label.toLowerCase()}`}
              autoComplete="off"
              spellCheck={false}
              maxLength={query.length}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleGenerate()
                }
              }}
              className="font-mono tracking-wider uppercase placeholder:font-sans placeholder:tracking-normal placeholder:normal-case"
            />
          </Field>
        ))}
      </section>

      <Separator />

      <section className="space-y-3">
        <Eyebrow>Vocabulary</Eyebrow>
        <SegmentedControl
          aria-label="Vocabulary"
          value={defOnly ? "def" : "all"}
          onValueChange={(v) => setDefOnly(v === "def")}
          fill
          items={[
            { value: "all", label: "All names", icon: <Globe2 /> },
            { value: "def", label: "With definition", icon: <BookA /> },
          ]}
        />
      </section>

      <div className="mt-auto space-y-2 pt-2">
        {hasConstraints && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="w-full">
            <RotateCcw />
            Reset constraints
          </Button>
        )}
        <Button
          type="button"
          size="lg"
          onClick={handleGenerate}
          loading={showSearchLoader}
          disabled={searching}
          className="w-full font-semibold"
        >
          {showSearchLoader ? "Finding names" : "Generate names"}
        </Button>
      </div>
    </div>
  )

  const renderCard = (item: NameResult) => (
    <ResultCard
      key={item.name}
      item={item}
      isSaved={savedNames.has(item.name)}
      isActive={availabilityTarget === item.name}
      isCopied={copiedName === item.name}
      onToggleBookmark={toggleBookmark}
      onCopy={handleCopy}
      onInspect={setAvailabilityTarget}
    />
  )

  const inspectorTitle = selectedTargetItem && (
    <>
      <Eyebrow>Inspector</Eyebrow>
      <h2 className="text-title text-foreground mt-1 truncate font-semibold lowercase">
        {selectedTargetItem.name}
      </h2>
    </>
  )

  return (
    <div className="bg-background text-foreground relative flex h-full w-full flex-col overflow-hidden">
      <header className="bg-background/90 sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b px-3 sm:px-5">
        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} aria-label="Return to home">
            <ArrowLeft />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <Separator orientation="vertical" className="hidden h-4 sm:block" />
          <SegmentedControl
            role="tablist"
            aria-label="View"
            size="sm"
            value={mode}
            onValueChange={setMode}
            items={[
              { value: "ui", label: "Studio", icon: <Compass /> },
              {
                value: "bookmarks",
                icon: <Bookmark />,
                label: (
                  <>
                    Saved
                    {bookmarks.length > 0 && (
                      <span className="bg-action-soft text-action text-micro flex h-4 min-w-4 items-center justify-center overflow-hidden rounded-full px-1 font-mono font-semibold tabular-nums">
                        <NumberPopIn value={bookmarks.length} />
                      </span>
                    )}
                  </>
                ),
              },
            ]}
          />
        </div>

        <div className="flex items-center gap-1.5">
          {mode === "ui" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMobileFiltersOpen(true)}
              aria-expanded={isMobileFiltersOpen}
              className="md:hidden"
            >
              <SlidersHorizontal />
              Filters
              {hasConstraints && <span className="bg-action size-1.5 rounded-full" />}
            </Button>
          )}
          <ThemeToggle />
        </div>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {mode === "ui" && (
          <aside className="bg-sidebar hidden w-72 shrink-0 flex-col overflow-y-auto border-r p-5 md:flex lg:w-80">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-small text-foreground">Configure</h2>
              <span
                className={cn(
                  "text-caption flex items-center gap-1.5 font-mono",
                  showSearchLoader ? "text-action" : "text-muted-foreground",
                )}
              >
                {showSearchLoader ? (
                  <Spinner label="Finding names" />
                ) : (
                  <span className="bg-success size-1.5 rounded-full" />
                )}
                {showSearchLoader ? "Searching" : "Ready"}
              </span>
            </div>
            {renderControls("desktop", true)}
          </aside>
        )}

        <BottomSheet
          open={isMobileFiltersOpen}
          onClose={closeFilters}
          label="filters"
          title={<h2 className="text-heading text-foreground">Filters</h2>}
          className="md:hidden"
        >
          {renderControls("mobile", false)}
        </BottomSheet>

        <main className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="flex h-12 shrink-0 items-center justify-between gap-2 border-b px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-2">
              <Eyebrow>{mode === "bookmarks" ? "Saved" : "Results"}</Eyebrow>
              <Badge variant="muted">
                {mode === "bookmarks"
                  ? `${sortedBookmarks.length.toLocaleString()} saved`
                  : `${totalCount.toLocaleString()} words`}
              </Badge>
              {defOnly && mode === "ui" && <Badge variant="action">defined only</Badge>}
            </div>

            {mode === "ui" && showPageLoader && (
              <span className="text-caption text-muted-foreground flex items-center gap-1.5 font-mono">
                <Spinner />
                Loading
              </span>
            )}

            {mode === "bookmarks" && bookmarks.length > 0 && (
              <div className="flex items-center gap-1.5">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      aria-live="polite"
                      disabled={
                        exportStatus.phase === "preparing" || exportStatus.phase === "working"
                      }
                      className={cn(
                        "min-w-32 justify-start disabled:not-aria-busy:opacity-100",
                        exportStatus.phase === "done" && "text-success",
                        exportStatus.phase === "error" && "text-destructive",
                      )}
                    >
                      <ExportButtonLabel status={exportStatus} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-60">
                    <DropdownMenuLabel>
                      {exportRows.length} saved {exportRows.length === 1 ? "name" : "names"}
                    </DropdownMenuLabel>
                    <DropdownMenuItem onSelect={() => runExport("csv")}>
                      <FileSpreadsheet />
                      <span className="flex-1">Download CSV</span>
                      <span className="text-caption text-subtle-foreground">Sheets, Excel</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => runExport("txt")}>
                      <FileText />
                      <span className="flex-1">Download text file</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => runExport("json")}>
                      <Braces />
                      <span className="flex-1">Download JSON</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => runExport("copy")}>
                      <Copy />
                      <span className="flex-1">Copy to clipboard</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearBookmarks}
                  className="text-destructive hover:text-destructive"
                >
                  Clear
                </Button>
              </div>
            )}
          </div>

          {mode === "bookmarks" && (
            <div className="bg-card flex shrink-0 items-center justify-between gap-3 border-b px-4 py-2.5 sm:px-6">
              <div className="relative max-w-sm flex-1">
                <Search className="text-subtle-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
                <Input
                  placeholder="Filter saved names or definitions"
                  value={bookmarkSearch}
                  onChange={(e) => setBookmarkSearch(e.target.value)}
                  className="h-8 pl-8"
                  aria-label="Filter saved names"
                />
              </div>
              <SegmentedControl
                aria-label="Sort saved names"
                size="sm"
                value={bookmarkSort}
                onValueChange={setBookmarkSort}
                items={[
                  { value: "latest", label: "Latest", icon: <Clock /> },
                  { value: "alpha", label: "A–Z", icon: <ArrowDownAZ /> },
                ]}
              />
            </div>
          )}

          <div className="relative min-h-0 flex-1 overflow-hidden">
            <div
              ref={scrollContainerRef}
              className="h-full overflow-y-auto overscroll-contain px-4 py-5 sm:px-6"
            >
              {results.length === 0 && mode === "ui" && (searching || !didInitialSearch.current) ? (
                <div className="flex h-72 flex-col items-center justify-center gap-3">
                  {showSearchLoader && (
                    <>
                      <Spinner className="text-action text-2xl" label="Finding names" />
                      <Eyebrow>Finding names…</Eyebrow>
                    </>
                  )}
                </div>
              ) : displayedList.length === 0 ? (
                mode === "bookmarks" ? (
                  <EmptyState
                    icon={<Bookmark />}
                    title="Nothing saved yet"
                    description="Bookmark names in Studio to keep them here."
                    action={
                      <Button size="sm" onClick={() => setMode("ui")}>
                        Back to Studio
                      </Button>
                    }
                  />
                ) : (
                  <EmptyState
                    icon={<Compass />}
                    title="No words found"
                    description="Try loosening the prefix, suffix, or contains constraints."
                    action={
                      <Button variant="outline" size="sm" onClick={resetFilters}>
                        Reset constraints
                      </Button>
                    }
                  />
                )
              ) : (
                <div
                  className={cn(
                    "space-y-8 pb-16 transition-opacity duration-(--duration-fast)",
                    showSearchLoader && "opacity-50",
                  )}
                >
                  {groupedResults ? (
                    groupedResults.map(([letter, items]) => (
                      <section key={letter} data-letter={letter} className="lazy-section space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="bg-foreground text-background text-caption flex size-6 items-center justify-center rounded-md font-mono font-semibold">
                            {letter}
                          </span>
                          <Separator className="flex-1" />
                          <span className="text-caption text-subtle-foreground font-mono tabular-nums">
                            {items.length.toLocaleString()}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                          {items.map(renderCard)}
                        </div>
                      </section>
                    ))
                  ) : (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {displayedList.map(renderCard)}
                    </div>
                  )}

                  {mode !== "bookmarks" && hasMore && (
                    <div
                      ref={sentinelRef}
                      className="text-caption text-muted-foreground flex h-16 items-center justify-center gap-2 font-mono"
                    >
                      {showPageLoader && (
                        <>
                          <Spinner />
                          Loading more
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Edge fades: plain gradients, no backdrop blur over the scrolling grid */}
            <div
              aria-hidden="true"
              className="from-background pointer-events-none absolute inset-x-0 top-0 h-4 bg-linear-to-b to-transparent"
            />
            <div
              aria-hidden="true"
              className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-linear-to-t to-transparent"
            />
          </div>

          {mode !== "bookmarks" && Object.keys(letterOffsets).length > 0 && (
            <nav aria-label="Jump to letter" className="bg-card shrink-0 border-t px-2 py-1.5">
              <div className="no-scrollbar mx-auto flex max-w-4xl items-center justify-between gap-0.5 overflow-x-auto">
                {LETTERS.map((l) => {
                  const isAvailable = letterOffsets[l] !== undefined && letterOffsets[l] !== -1
                  const isActive = activeLetter === l
                  return (
                    <button
                      key={l}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => jumpToLetter(l)}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "text-caption flex h-8 min-w-7 items-center justify-center rounded-md font-mono uppercase outline-none focus-visible:ring-3 focus-visible:ring-ring",
                        "transition-[scale,color,background-color] duration-(--duration-micro) active:scale-[0.94] sm:flex-1",
                        isActive
                          ? "bg-foreground text-background font-semibold"
                          : isAvailable
                            ? "text-muted-foreground hover:bg-muted hover:text-foreground"
                            : "text-subtle-foreground/40 cursor-not-allowed",
                      )}
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
            </nav>
          )}
        </main>

        {/* Desktop inspector: mounts in-flow once; only its inner panel animates. */}
        {selectedTargetItem && (
          <aside className="bg-card hidden w-[360px] shrink-0 overflow-y-auto border-l lg:block">
            <div key={selectedTargetItem.name} className="inspector-enter p-6">
              <div className="mb-5 flex items-start justify-between gap-3">
                <div className="min-w-0">{inspectorTitle}</div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeInspector}
                  aria-label="Close inspector"
                >
                  <X />
                </Button>
              </div>
              <InspectorBody
                item={selectedTargetItem}
                isSaved={savedNames.has(selectedTargetItem.name)}
                isCopied={copiedName === selectedTargetItem.name}
                onCopy={handleCopy}
                onToggleBookmark={toggleBookmark}
              />
            </div>
          </aside>
        )}

        <BottomSheet
          open={selectedTargetItem !== null}
          onClose={closeInspector}
          label="inspector"
          title={inspectorTitle}
          className="lg:hidden"
        >
          {selectedTargetItem && (
            <InspectorBody
              item={selectedTargetItem}
              isSaved={savedNames.has(selectedTargetItem.name)}
              isCopied={copiedName === selectedTargetItem.name}
              onCopy={handleCopy}
              onToggleBookmark={toggleBookmark}
            />
          )}
        </BottomSheet>
      </div>
    </div>
  )
}
