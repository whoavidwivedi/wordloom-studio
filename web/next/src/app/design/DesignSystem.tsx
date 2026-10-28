"use client"

import { ArrowLeft, ArrowRight, Bookmark, Compass, Copy, Globe2, BookA, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { ResultCard } from "@/components/studio/result-card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CopyButton } from "@/components/ui/copy-button"
import { EmptyState } from "@/components/ui/empty-state"
import { Eyebrow } from "@/components/ui/eyebrow"
import { ClearableInput, Field } from "@/components/ui/field"
import { Kbd } from "@/components/ui/kbd"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { Separator } from "@/components/ui/separator"
import { BottomSheet } from "@/components/ui/sheet"
import { Spinner } from "@/components/ui/spinner"
import { WordloomBrandLockup } from "@/components/WordloomLogo"

const COLORS = [
  ["background", "bg-background"],
  ["card", "bg-card"],
  ["muted", "bg-muted"],
  ["border", "bg-border"],
  ["border-strong", "bg-border-strong"],
  ["subtle-foreground", "bg-subtle-foreground"],
  ["muted-foreground", "bg-muted-foreground"],
  ["foreground", "bg-foreground"],
  ["action", "bg-action"],
  ["action-soft", "bg-action-soft"],
  ["success", "bg-success"],
  ["destructive", "bg-destructive"],
] as const

const TYPE = [
  ["display", "text-display", "64 / 1.02 · 600", "Short names"],
  ["title", "text-title", "36 / 1.08 · 600", "Workbench"],
  ["heading", "text-heading", "20 / 1.3 · 600", "Phonotactic constraints"],
  ["word", "text-word", "24 / 1.12 · 600", "velor"],
  [
    "body",
    "text-body",
    "15 / 1.6 · 400",
    "Every candidate is easy to say and you know what it already means.",
  ],
  ["small", "text-small", "13 / 1.5 · 400", "A protective cup-like exterior or vessel."],
  ["caption", "text-caption", "12 / 1.45 · 400", "Phonotactic neologism"],
  ["micro", "text-micro", "10 / 14", "5 chars"],
] as const

const RADII = [
  ["xs", "rounded-xs"],
  ["sm", "rounded-sm"],
  ["md", "rounded-md"],
  ["lg", "rounded-lg"],
  ["xl", "rounded-xl"],
  ["2xl", "rounded-2xl"],
  ["3xl", "rounded-3xl"],
] as const

const MOTION = [
  ["micro", "80ms", "Letter dock, hover tints"],
  ["quick", "150ms", "Button press, colour, border"],
  ["fast", "220ms", "Icon swap, inspector, rise-in"],
  ["sheet", "280ms", "Bottom sheets (drawer curve)"],
] as const

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-20 border-t py-12 first:border-t-0 first:pt-0">
      <div className="mb-6 max-w-xl">
        <h2 className="text-heading text-foreground">{title}</h2>
        <p className="text-small text-muted-foreground mt-1">{description}</p>
      </div>
      {children}
    </section>
  )
}

const NAV = [
  ["colour", "Colour"],
  ["type", "Typography"],
  ["buttons", "Buttons"],
  ["loading", "Loading"],
  ["inputs", "Inputs"],
  ["badges", "Badges"],
  ["cards", "Cards"],
  ["surfaces", "Radius & elevation"],
  ["motion", "Motion"],
] as const

export function DesignSystem() {
  const [segment, setSegment] = useState("all")
  const [text, setText] = useState("vel")
  const [loading, setLoading] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  const fakeLoad = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1400)
  }

  return (
    <div className="relative min-h-screen">
      <header className="bg-background/90 sticky top-0 z-40 border-b">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon" aria-label="Home">
              <Link href="/">
                <ArrowLeft />
              </Link>
            </Button>
            <WordloomBrandLockup />
            <Badge variant="muted">design system</Badge>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[180px_1fr]">
        <nav className="hidden lg:block">
          <ul className="sticky top-24 space-y-1">
            {NAV.map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="text-small text-muted-foreground hover:text-foreground hover:bg-muted block rounded-md px-2 py-1 transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <main>
          <div className="mb-12">
            <Eyebrow>Wordloom</Eyebrow>
            <h1 className="text-title text-foreground mt-2">Design system</h1>
            <p className="text-body text-muted-foreground mt-3 max-w-xl">
              Inter with its Display optical size for type, JetBrains Mono for data, one emerald
              action colour on a cool neutral ramp, and motion that stays under 300ms. Everything
              below is rendered from the live components.
            </p>
          </div>

          <Section
            id="colour"
            title="Colour"
            description="Semantic tokens in OKLCH. Switch themes to see the dark ramp; the action colour is the only saturated hue."
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {COLORS.map(([name, cls]) => (
                <div key={name} className="overflow-hidden rounded-xl border">
                  <div className={`${cls} h-16 border-b`} />
                  <div className="px-3 py-2">
                    <div className="text-caption text-foreground font-medium">{name}</div>
                    <div className="text-micro text-subtle-foreground font-mono">--{name}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section
            id="type"
            title="Typography"
            description="Each step carries its own line-height and tracking. Headings tighten as they grow."
          >
            <div className="divide-y rounded-xl border">
              {TYPE.map(([name, cls, spec, sample]) => (
                <div
                  key={name}
                  className="grid items-baseline gap-2 px-4 py-4 sm:grid-cols-[120px_1fr] sm:gap-6"
                >
                  <div>
                    <div className="text-caption text-foreground font-mono">{name}</div>
                    <div className="text-micro text-subtle-foreground font-mono">{spec}</div>
                  </div>
                  <div
                    className={`${cls} text-foreground truncate ${["display", "title", "heading", "word"].includes(name) ? "font-semibold" : ""}`}
                  >
                    {sample}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Card className="p-5">
                <Eyebrow>Inter</Eyebrow>
                <p className="text-word text-foreground mt-2 font-semibold">Aa Bb Gg 0123</p>
                <p className="text-caption text-muted-foreground mt-1">
                  Weights 400, 500 and 600, with the Display cut above 24px
                </p>
              </Card>
              <Card className="p-5">
                <Eyebrow>JetBrains Mono</Eyebrow>
                <p className="text-word text-foreground mt-2 font-mono">velor 44,839</p>
                <p className="text-caption text-muted-foreground mt-1">
                  For things people type and scan: prefixes, letters, counts
                </p>
              </Card>
            </div>
          </Section>

          <Section
            id="buttons"
            title="Buttons"
            description="The surface material shared with Better Space: sheen, lit edge and layered shadow painted on ::before, so press and hover never shift the label."
          >
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <Button>
                  Generate names
                  <Kbd>⌘↵</Kbd>
                </Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">
                  <Copy />
                  Outline
                </Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">
                  <Trash2 />
                  Destructive
                </Button>
                <Button variant="link">Link</Button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="xs">Extra small</Button>
                <Button size="sm">Small</Button>
                <Button>Default</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">
                  Extra large
                  <ArrowRight />
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="icon-xs" variant="outline" aria-label="Copy">
                  <Copy />
                </Button>
                <Button size="icon-sm" variant="outline" aria-label="Copy">
                  <Copy />
                </Button>
                <Button size="icon" variant="outline" aria-label="Copy">
                  <Copy />
                </Button>
                <Button size="icon-lg" aria-label="Copy">
                  <Copy />
                </Button>
                <CopyButton value="wordloom" />
                <CopyButton value="wordloom" showLabel />
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </Section>

          <Section
            id="loading"
            title="Loading"
            description="Remix's Loader 4 glyph. A loader waits 150ms before appearing and then stays at least 450ms, so fast responses never flash and slow ones read as deliberate."
          >
            <div className="flex flex-wrap items-center gap-4">
              <Button loading={loading} onClick={fakeLoad} size="lg">
                {loading ? "Finding names" : "Try the loader"}
              </Button>
              <Button variant="outline" loading>
                Saving
              </Button>
              <span className="text-caption text-muted-foreground flex items-center gap-1.5 font-mono">
                <Spinner />
                Loading more
              </span>
              <Spinner className="text-action text-2xl" />
            </div>
          </Section>

          <Section
            id="inputs"
            title="Inputs & controls"
            description="Inputs sit on the card surface and take an emerald focus ring. Segmented controls replace tabs and radio groups; arrow keys move the selection."
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <Field id="ds-prefix" label="Starts with" hint={`${text.length}/8`}>
                  <ClearableInput
                    id="ds-prefix"
                    value={text}
                    onValueChange={setText}
                    placeholder="e.g. str, vel, vo"
                    className="font-mono tracking-wider uppercase"
                  />
                </Field>
                <Field id="ds-plain" label="Plain input">
                  <ClearableInput
                    id="ds-plain"
                    value=""
                    onValueChange={() => {}}
                    placeholder="Filter saved names"
                  />
                </Field>
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Eyebrow>Segmented</Eyebrow>
                  <SegmentedControl
                    aria-label="Vocabulary"
                    value={segment}
                    onValueChange={setSegment}
                    fill
                    items={[
                      { value: "all", label: "All names", icon: <Globe2 /> },
                      { value: "def", label: "With definition", icon: <BookA /> },
                    ]}
                  />
                  <SegmentedControl
                    role="tablist"
                    aria-label="View"
                    size="sm"
                    value={segment === "def" ? "saved" : "studio"}
                    onValueChange={(v) => setSegment(v === "saved" ? "def" : "all")}
                    items={[
                      { value: "studio", label: "Studio", icon: <Compass /> },
                      { value: "saved", label: "Saved", icon: <Bookmark /> },
                    ]}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Eyebrow>Keys</Eyebrow>
                  <Kbd>⌘</Kbd>
                  <Kbd>↵</Kbd>
                  <Kbd>/</Kbd>
                </div>
              </div>
            </div>
          </Section>

          <Section
            id="badges"
            title="Badges"
            description="Compact metadata. The action tint marks a positive state, like a name with a definition."
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge>default</Badge>
              <Badge variant="action">def</Badge>
              <Badge variant="outline">Neologism</Badge>
              <Badge variant="muted">5 chars</Badge>
              <Badge variant="destructive">taken</Badge>
            </div>
          </Section>

          <Section
            id="cards"
            title="Cards, sheets & empty states"
            description="Cards hold one idea each. The result card is the studio's core unit; sheets slide on the compositor and stay mounted."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <ResultCard
                item={{
                  name: "calix",
                  meaning: "noun: a protective cup-like exterior or vessel",
                }}
                isSaved={saved}
                isActive={false}
                isCopied={copied}
                onToggleBookmark={() => setSaved((s) => !s)}
                onCopy={() => {
                  setCopied(true)
                  setTimeout(() => setCopied(false), 1600)
                }}
                onInspect={() => setSheetOpen(true)}
              />
              <ResultCard
                item={{ name: "velor", meaning: "" }}
                isSaved={false}
                isActive
                isCopied={false}
                onToggleBookmark={() => {}}
                onCopy={() => {}}
                onInspect={() => setSheetOpen(true)}
              />
              <Card>
                <CardHeader>
                  <CardTitle>Card title</CardTitle>
                  <Badge variant="muted">header</Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Body copy in muted foreground. Nested radius follows outer minus padding.
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" loading>
                    Preparing…
                  </Button>
                  <Button size="sm" onClick={() => setSheetOpen(true)}>
                    Open sheet
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <EmptyState
                  icon={<Bookmark />}
                  title="Nothing saved yet"
                  description="Bookmark names in Studio to keep them here."
                  action={<Button size="sm">Back to Studio</Button>}
                  className="py-10"
                />
              </Card>
            </div>
          </Section>

          <Section
            id="surfaces"
            title="Radius & elevation"
            description="A fixed radius ladder (nested radius = outer − padding) and four elevations. Dark mode swaps drop shadows for a lit top edge."
          >
            <div className="flex flex-wrap gap-3">
              {RADII.map(([name, cls]) => (
                <div key={name} className="text-center">
                  <div className={`${cls} bg-muted border-border-strong size-16 border`} />
                  <div className="text-micro text-subtle-foreground mt-1.5 font-mono">{name}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {(["shadow-card", "shadow-thumb", "shadow-raised", "shadow-overlay"] as const).map(
                (cls) => (
                  <div
                    key={cls}
                    className={`${cls} bg-card text-caption text-muted-foreground flex h-20 items-center justify-center rounded-xl font-mono`}
                  >
                    {cls.replace("shadow-", "")}
                  </div>
                ),
              )}
            </div>
          </Section>

          <Section
            id="motion"
            title="Motion"
            description="Everything eases out and finishes under 300ms. Keyboard-driven changes (letter jumps, ⌘↵, typing) don't animate at all."
          >
            <div className="divide-y rounded-xl border">
              {MOTION.map(([name, ms, use]) => (
                <div key={name} className="flex items-center justify-between gap-4 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <code className="text-caption text-foreground font-mono">
                      --duration-{name}
                    </code>
                    <Badge variant="muted">{ms}</Badge>
                  </div>
                  <span className="text-caption text-muted-foreground text-right">{use}</span>
                </div>
              ))}
            </div>
            <Separator className="my-6" />
            <ul className="text-caption text-muted-foreground space-y-1">
              <li>
                Entering and exiting use <code className="text-foreground">--ease-out</code>,
                cubic-bezier(0.23, 1, 0.32, 1).
              </li>
              <li>
                Sheets use <code className="text-foreground">--ease-drawer</code>,
                cubic-bezier(0.32, 0.72, 0, 1).
              </li>
              <li>Pressable elements scale to 0.97 while held.</li>
              <li>With reduced motion on, fades stay and movement is removed.</li>
            </ul>
          </Section>
        </main>
      </div>

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        label="example sheet"
        title={<h2 className="text-heading text-foreground">Bottom sheet</h2>}
      >
        <p className="text-small text-muted-foreground">
          Always mounted, inert while closed, and animated with translate only. Tap outside or press
          Escape to close.
        </p>
        <Button className="mt-5 w-full" size="lg" onClick={() => setSheetOpen(false)}>
          Done
        </Button>
      </BottomSheet>
    </div>
  )
}
