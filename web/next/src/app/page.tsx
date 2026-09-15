"use client"

import { RiGithubFill } from "@remixicon/react"
import { ArrowRight, BookA, Globe2, Layers, Moon, Sun, Terminal } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/ui/copy-button"
import { Separator } from "@/components/ui/separator"
import { WordloomBrandLockup } from "@/components/WordloomLogo"

const SAMPLE_NAMES = [
  { name: "velor", meaning: "A sleek, aerodynamic phonotactic form", len: 5, realWord: false },
  { name: "strida", meaning: "To walk with long, decisive steps", len: 6, realWord: true },
  { name: "lumex", meaning: "From Latin lumen; light and visual clarity", len: 5, realWord: false },
  { name: "bront", meaning: "Resonant, bold phonetic cluster", len: 5, realWord: false },
  { name: "calix", meaning: "A protective cup-like exterior or vessel", len: 5, realWord: true },
  { name: "novis", meaning: "Fresh, contemporary root origin", len: 5, realWord: false },
]

export default function LandingPage() {
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [selectedSample, setSelectedSample] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "Enter" &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        router.push("/studio")
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [router])

  return (
    <div className="bg-background text-foreground selection:bg-primary selection:text-primary-foreground relative min-h-screen w-full">
      {/* Navigation Header */}
      <header className="border-border/80 bg-background/85 sticky top-0 z-50 w-full border-b shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] backdrop-blur-md dark:shadow-[0_1px_4px_0_rgba(0,0,0,0.35)]">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <div className="cursor-default select-none" aria-label="Wordloom Studio">
              <WordloomBrandLockup />
            </div>

            <nav className="text-muted-foreground hidden items-center gap-4 text-xs md:flex">
              <Link href="/studio" className="hover:text-foreground transition-colors">
                Studio
              </Link>
              <a
                href="https://github.com/nrjdalal/wordloom#readme"
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground transition-colors"
              >
                CLI Specs
              </a>
              <a
                href="https://github.com/nrjdalal/wordloom"
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground transition-colors"
              >
                GitHub
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {mounted && (
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

            <Button asChild size="sm" className="h-8 text-xs font-medium">
              <Link href="/studio">
                <span>Enter Studio</span>
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-6xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28">
        <div className="flex flex-col items-center text-center">
          {/* Top Status Pill */}
          <div className="border-border bg-muted/50 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="font-mono text-[11px]">CMU Phonotactic Model</span>
            <Separator orientation="vertical" className="h-3" />
            <span className="font-mono text-[11px]">100k+ Word Corpus</span>
          </div>

          {/* Headline */}
          <h1 className="text-foreground mt-8 max-w-3xl font-sans text-4xl font-extrabold tracking-tight text-balance sm:text-6xl sm:leading-[1.1]">
            Find short, pronounceable names that sound like real words.
          </h1>

          {/* Description */}
          <p className="text-muted-foreground mt-6 max-w-2xl font-sans text-base leading-relaxed text-pretty sm:text-lg">
            Built on English phonetic letter transitions and cross-referenced with WordNet
            definitions. Discover memorable brand and product names with immediate semantic and
            phonotactic clarity.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="h-11 px-5 text-sm font-medium">
              <Link href="/studio">
                <span>Open Studio Workbench</span>
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="h-11 px-5 text-sm font-medium">
              <a href="https://github.com/nrjdalal/wordloom" target="_blank" rel="noreferrer">
                <RiGithubFill className="mr-2 h-4 w-4" />
                <span>GitHub Repository</span>
              </a>
            </Button>
          </div>

          {/* Terminal Snippet */}
          <div className="border-border/80 bg-card mt-8 flex items-center gap-3 rounded-lg border px-3.5 py-2 shadow-sm dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_2px_8px_-2px_rgba(0,0,0,0.4)]">
            <Terminal className="text-muted-foreground h-4 w-4 shrink-0" />
            <code className="text-foreground font-mono text-xs select-all">
              bunx wordloom -l 5 -p vo
            </code>
            <CopyButton value="bunx wordloom -l 5 -p vo" className="ml-auto h-7 w-7 rounded-md" />
          </div>
        </div>

        {/* Interactive Workbench Preview */}
        <div className="mt-16 sm:mt-20">
          <div className="border-border/80 bg-card overflow-hidden rounded-xl border shadow-lg dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_12px_36px_-8px_rgba(0,0,0,0.7)]">
            <div className="border-border bg-muted/40 flex items-center justify-between border-b px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="text-foreground font-mono text-xs font-semibold">
                  Phonotactic Synthesis Preview
                </span>
                <Badge variant="outline" className="font-mono text-[10px]">
                  5-6 chars
                </Badge>
              </div>
              <Link
                href="/studio"
                className="text-muted-foreground hover:text-foreground flex items-center gap-1 font-sans text-xs transition-colors"
              >
                <span>Launch Full Studio</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="p-6 sm:p-8">
              <div className="border-border/60 flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center">
                <div>
                  <span className="text-muted-foreground font-mono text-[10px] tracking-wider uppercase">
                    Generated Word
                  </span>
                  <div className="mt-1 flex flex-wrap items-center gap-3">
                    <span className="text-foreground font-sans text-4xl font-extrabold tracking-tight lowercase sm:text-5xl">
                      {SAMPLE_NAMES[selectedSample].name}
                    </span>
                    <Badge variant={SAMPLE_NAMES[selectedSample].realWord ? "default" : "outline"}>
                      {SAMPLE_NAMES[selectedSample].realWord ? "WordNet def" : "Neologism"}
                    </Badge>
                    <CopyButton
                      value={SAMPLE_NAMES[selectedSample].name}
                      showLabel
                      label="Copy"
                      copiedLabel="Copied!"
                      className="ml-1 h-7 px-2.5 text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-mono text-xs">Length:</span>
                  <Badge variant="muted" className="tabular-nums">
                    {SAMPLE_NAMES[selectedSample].len} letters
                  </Badge>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-muted-foreground font-sans text-sm leading-relaxed">
                  {SAMPLE_NAMES[selectedSample].meaning}
                </p>
              </div>

              {/* Sample Selector Chips */}
              <div className="border-border/60 mt-8 flex flex-wrap items-center gap-2 border-t pt-6">
                <span className="text-muted-foreground mr-2 font-mono text-[11px]">
                  Explore presets:
                </span>
                {SAMPLE_NAMES.map((sample, idx) => (
                  <button
                    key={sample.name}
                    type="button"
                    onClick={() => setSelectedSample(idx)}
                    className={`focus-visible:ring-ring rounded-md border px-3 py-1 font-mono text-xs transition-[transform,background-color,border-color,color] duration-150 ease-out outline-none select-none focus-visible:ring-2 active:scale-[0.96] ${
                      selectedSample === idx
                        ? "border-foreground bg-foreground text-background font-bold shadow-xs"
                        : "border-border bg-muted/40 text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                    }`}
                  >
                    {sample.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-16 sm:mt-24">
          <div className="border-border mb-8 border-b pb-4">
            <h2 className="text-foreground font-sans text-lg font-bold tracking-tight">
              Engineered for Brand Founders & Product Designers
            </h2>
            <p className="text-muted-foreground mt-1 font-sans text-xs">
              A systematic naming tool that prioritizes pronounceability and phonetic fluency.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Card 1 */}
            <div className="border-border/80 bg-card rounded-xl border p-6 shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_2px_8px_-2px_rgba(0,0,0,0.4)] dark:hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_8px_24px_-4px_rgba(0,0,0,0.6)]">
              <div className="border-border bg-muted/50 text-foreground flex h-9 w-9 items-center justify-center rounded-lg border">
                <Layers className="h-4 w-4" />
              </div>
              <h3 className="text-foreground mt-4 font-sans text-sm font-bold">
                Phonotactic Constraints
              </h3>
              <p className="text-muted-foreground mt-2 font-sans text-xs leading-relaxed">
                Every word strictly follows authentic phonetic transitions derived from the CMU
                Pronouncing Dictionary, avoiding awkward or unpronounceable consonant clusters.
              </p>
            </div>

            {/* Card 2 */}
            <div className="border-border/80 bg-card rounded-xl border p-6 shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_2px_8px_-2px_rgba(0,0,0,0.4)] dark:hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_8px_24px_-4px_rgba(0,0,0,0.6)]">
              <div className="border-border bg-muted/50 text-foreground flex h-9 w-9 items-center justify-center rounded-lg border">
                <BookA className="h-4 w-4" />
              </div>
              <h3 className="text-foreground mt-4 font-sans text-sm font-bold">
                WordNet Definitions
              </h3>
              <p className="text-muted-foreground mt-2 font-sans text-xs leading-relaxed">
                If a word is an established English word, its definition appears alongside the card
                so you can immediately assess existing brand associations.
              </p>
            </div>

            {/* Card 3 */}
            <div className="border-border/80 bg-card rounded-xl border p-6 shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_2px_8px_-2px_rgba(0,0,0,0.4)] dark:hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_8px_24px_-4px_rgba(0,0,0,0.6)]">
              <div className="border-border bg-muted/50 text-foreground flex h-9 w-9 items-center justify-center rounded-lg border">
                <Globe2 className="h-4 w-4" />
              </div>
              <h3 className="text-foreground mt-4 font-sans text-sm font-bold">
                Multi-Platform Availability
              </h3>
              <p className="text-muted-foreground mt-2 font-sans text-xs leading-relaxed">
                Inspect availability across Domainr, GitHub, X (Twitter), Instagram, and YouTube
                with direct links in the studio inspector.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-border bg-background border-t py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:px-6 sm:text-left">
          <p className="text-muted-foreground font-sans text-xs">
            Wordloom algorithm by{" "}
            <a
              href="https://nrjdalal.com"
              target="_blank"
              rel="noreferrer"
              className="text-foreground font-medium underline underline-offset-4"
            >
              Neeraj Dalal
            </a>{" "}
            • Studio by{" "}
            <a
              href="https://whoavidwivedi.work"
              target="_blank"
              rel="noreferrer"
              className="text-foreground font-medium underline underline-offset-4"
            >
              Avi Dwivedi
            </a>
          </p>

          <div className="text-muted-foreground flex items-center gap-4 text-xs">
            <a
              href="https://github.com/nrjdalal/wordloom"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
            >
              <RiGithubFill className="h-4 w-4" />
              <span>GitHub</span>
            </a>
            <Separator orientation="vertical" className="h-3" />
            <Link href="/studio" className="hover:text-foreground font-medium transition-colors">
              Open Studio
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
