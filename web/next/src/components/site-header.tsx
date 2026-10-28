import Link from "next/link"

import { GithubIcon } from "@/components/icons"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { WordloomBrandLockup } from "@/components/WordloomLogo"

const REPO_URL = "https://github.com/nrjdalal/wordloom"

// A floating pill pinned near the top: brand on the left, one action on the right.
export function SiteHeader() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3 sm:top-4">
      <header className="bg-card/85 supports-[backdrop-filter]:bg-card/70 shadow-raised pointer-events-auto flex h-12 w-full max-w-3xl items-center justify-between gap-3 rounded-full border py-1.5 pr-1.5 pl-5 supports-[backdrop-filter]:backdrop-blur-md">
        <Link
          href="/"
          aria-label="Wordloom home"
          className="focus-visible:ring-ring rounded-md outline-none focus-visible:ring-3"
        >
          <WordloomBrandLockup />
        </Link>

        <div className="flex items-center gap-1">
          <Button asChild variant="ghost" size="icon">
            <a href={REPO_URL} target="_blank" rel="noreferrer" aria-label="GitHub repository">
              <GithubIcon className="size-4" />
            </a>
          </Button>
          <ThemeToggle />
          <Button asChild size="sm" className="ml-1 rounded-full px-3.5">
            <Link href="/studio">Start naming</Link>
          </Button>
        </div>
      </header>
    </div>
  )
}
