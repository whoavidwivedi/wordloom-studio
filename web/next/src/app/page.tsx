import { AudioLines, BookA, Globe2, SlidersHorizontal } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { BentoGrid, BentoGridItem } from "@/components/aceternity/bento-grid"
import { ContainerScroll } from "@/components/aceternity/container-scroll"
import { FlipWords } from "@/components/aceternity/flip-words"
import { GridBackground } from "@/components/aceternity/grid-background"
import { Spotlight } from "@/components/aceternity/spotlight"
import { GithubIcon } from "@/components/icons"
import {
  AvailabilityScan,
  ConstraintRoll,
  DefinitionCycle,
  LoopZone,
  NameMarquee,
} from "@/components/landing/bento-visuals"
import { BrandGrid } from "@/components/landing/brand-grid"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { WordloomBrandLockup } from "@/components/WordloomLogo"

const REPO_URL = "https://github.com/nrjdalal/wordloom"

const FLIP_WORDS = ["startup", "company", "product", "brand", "side project"]

export default function LandingPage() {
  return (
    <div className="text-foreground relative min-h-screen w-full">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <GridBackground />
          <Spotlight
            className="-top-40 left-0 hidden md:-top-24 md:left-56 dark:block"
            fill="white"
          />

          <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-4 pt-32 pb-16 text-center sm:px-6 sm:pt-40 sm:pb-20">
            <Link
              href="/studio"
              className="group bg-card/80 text-caption hover:border-border-strong shadow-card inline-flex items-center gap-2.5 rounded-full border py-1 pr-3.5 pl-1 transition-colors duration-(--duration-quick)"
            >
              <span className="bg-foreground text-background text-micro rounded-full px-2 py-0.5 font-semibold">
                Free
              </span>
              <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                No sign-up, no credit card, open source
              </span>
            </Link>

            <h1 className="mt-8 max-w-4xl text-[2.6rem] leading-[1.04] font-semibold tracking-[-0.042em] sm:text-[4.25rem]">
              Find a name for your
              <br />
              <FlipWords words={FLIP_WORDS} className="text-foreground" />
            </h1>

            <p className="text-muted-foreground mt-6 max-w-xl text-[1.0625rem] leading-relaxed sm:text-lg">
              Starting something new is exciting. Naming it is not. Wordloom suggests short names
              that are easy to say and sound like real words, so you can pick one and get back to
              building.
            </p>

            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
              <Button asChild size="xl">
                <Link href="/studio">Start naming</Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <a href="#how-it-works">See how it works</a>
              </Button>
            </div>
          </div>

          {/* Real Studio screenshots (light and dark), tilting flat as they scroll in */}
          <div className="relative z-10 px-4 pb-20 sm:px-6 sm:pb-28">
            <ContainerScroll>
              <Image
                src="/screenshots/studio-light.png"
                alt="Wordloom Studio showing 33 five-letter names that start with ve and end with a, such as velda, venda and venza"
                width={2880}
                height={1800}
                sizes="(max-width: 1024px) 100vw, 1024px"
                priority
                className="block h-auto w-full dark:hidden"
              />
              <Image
                src="/screenshots/studio-dark.png"
                alt="Wordloom Studio showing 33 five-letter names that start with ve and end with a, such as velda, venda and venza"
                width={2880}
                height={1800}
                sizes="(max-width: 1024px) 100vw, 1024px"
                priority
                className="hidden h-auto w-full dark:block"
              />
            </ContainerScroll>
          </div>
        </section>

        {/* Famous names the generator can produce */}
        <section className="border-t">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:items-center">
              <div className="max-w-md">
                <h2 className="text-foreground text-[2rem] leading-tight font-semibold tracking-[-0.035em] sm:text-[2.5rem]">
                  Name your brand.
                </h2>
                <p className="text-body text-muted-foreground mt-4">
                  Every name here comes straight out of Wordloom. A few already belong to companies
                  you know, like Stripe and Notion. The rest are still waiting for someone to build
                  something with them.
                </p>
                <Button asChild variant="outline" size="lg" className="mt-6">
                  <Link href="/studio">Find yours</Link>
                </Button>
              </div>

              <BrandGrid />
            </div>
            <p className="text-caption text-subtle-foreground mt-6">
              Trademarks belong to their owners. Shown only to illustrate the kind of names Wordloom
              generates.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="scroll-mt-20 border-t">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <div className="mb-12 max-w-2xl">
              <h2 className="text-foreground text-[2rem] leading-tight font-semibold tracking-[-0.035em] sm:text-[2.5rem]">
                Good names are hard to find.
                <span className="text-muted-foreground"> This makes it easier.</span>
              </h2>
              <p className="text-body text-muted-foreground mt-4">
                Most name generators glue words together. Wordloom builds names letter by letter
                from how English is actually spoken, then shows you what they mean and where
                they&apos;re free.
              </p>
            </div>

            <LoopZone>
              <BentoGrid>
                <BentoGridItem
                  className="md:col-span-2"
                  header={<NameMarquee />}
                  icon={<AudioLines />}
                  title="Names you can actually say"
                  description="Every suggestion follows real sound patterns from 134,000 English pronunciations, so nobody has to ask how to spell it."
                />
                <BentoGridItem
                  header={<DefinitionCycle />}
                  icon={<BookA />}
                  title="Know what it already means"
                  description="If a name is a real word, you see its dictionary meaning before you fall for it."
                />
                <BentoGridItem
                  header={<AvailabilityScan />}
                  icon={<Globe2 />}
                  title="Check if it's taken"
                  description="One click to the domain, GitHub, X, Instagram and YouTube handle."
                />
                <BentoGridItem
                  className="md:col-span-2"
                  header={<ConstraintRoll />}
                  icon={<SlidersHorizontal />}
                  title="Shape it your way"
                  description="Pick the length, the first letters, the ending, or a sound it must contain. Thousands of matches appear instantly."
                />
              </BentoGrid>
            </LoopZone>
          </div>
        </section>

        {/* Closing call to action */}
        <section className="relative overflow-hidden border-t">
          <GridBackground className="rotate-180" />
          <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28">
            <h2 className="text-foreground max-w-2xl text-[2rem] leading-tight font-semibold tracking-[-0.035em] sm:text-[2.75rem]">
              Your next company deserves a name people remember.
            </h2>
            <p className="text-body text-muted-foreground mt-4 max-w-md">
              It takes a minute to find a shortlist. No account, nothing to install.
            </p>
            <Button asChild size="xl" className="mt-8">
              <Link href="/studio">Start naming</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-background relative z-10 border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <WordloomBrandLockup size="sm" />
            <p className="text-caption text-muted-foreground">
              Algorithm by{" "}
              <a
                href="https://nrjdalal.com"
                target="_blank"
                rel="noreferrer"
                className="text-foreground hover:decoration-foreground decoration-border-strong underline underline-offset-4"
              >
                Neeraj Dalal
              </a>
              . Studio by{" "}
              <a
                href="https://whoavidwivedi.work"
                target="_blank"
                rel="noreferrer"
                className="text-foreground hover:decoration-foreground decoration-border-strong underline underline-offset-4"
              >
                Avi Dwivedi
              </a>
              .
            </p>
          </div>

          <nav className="text-caption text-muted-foreground flex items-center gap-5">
            <Link href="/studio" className="hover:text-foreground transition-colors">
              Studio
            </Link>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
            >
              <GithubIcon className="size-3.5" />
              GitHub
            </a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
