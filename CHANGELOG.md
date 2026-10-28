# Changelog

Each `## x.y.z` section becomes the notes for the matching `vx.y.z` GitHub release.

## 1.1.0 (2026-10-28)

### Faster engine

- Jumping to a letter no longer walks every name before it. The generator skips whole branches using its counts, so at 8 letters a jump to "z" takes about 145ms instead of about 4.9 seconds.
- The first page of results and the A to Z offsets now arrive in one request, and recent searches are cached on the server.
- Lighter pages: three, vanta, the shadcn CLI, tw-animate-css and sonner are gone, and fonts are self-hosted with `next/font`.

### Studio

- Export saved names as CSV (opens in Sheets or Excel), a text file or JSON, or copy them. The Export button shows each step: Preparing, Downloading, Downloaded.
- Shareable searches: `/studio?prefix=ve&suffix=a&length=5` opens with those filters. Add `&def=1` for dictionary words only.
- The selection highlight slides between options, and the Saved count pops in as it changes.
- The length slider is gone; the number buttons set the length.
- No toast notifications. Every action reports its result on the control you used.

### Design system

- Inter, with its Display cut for large sizes, and JetBrains Mono.
- One emerald action colour on a cool neutral palette, in light and dark.
- Surface buttons shared with Better Space, plus a segmented control, dropdown menu, bottom sheet, field, spinner and empty state.
- Motion stays under 300ms where you interact, pauses off screen, and keeps only fades when reduced motion is on.

### Landing page

- New headline for founders: "Find a name for your startup", with the last word rotating.
- A floating navbar, a real Studio screenshot that tilts flat as you scroll, and a grid of names the generator produces, including Stripe, Notion and Slack.
- Every example on the page is real generator output with its real dictionary meaning.
- New Open Graph image, favicon and app icons, plus search metadata and structured data.

### Development

- `turbopack.root` is pinned, so hot reload works when the repo is checked out inside another folder, such as a git worktree.
- `bun run release <version>` prepares a release, and pushing the tag publishes it with these notes.

## 1.0.0 (2026-09-15)

- Wordloom Studio: a web workbench for the generator, with length, prefix, suffix and contains filters, an A to Z jump bar and infinite scroll.
- Availability inspector with links to Domainr, GitHub, X, Instagram and YouTube for any name.
- Saved names with search, sorting and plain-text export.
- Open Graph image and social metadata.
- CI across Ubuntu, macOS and Windows.

## 0.1.0 (2026-04-06)

- Created the initial `wordloom` CLI for generating source-backed lowercase names
- Replaced the placeholder syllable rules with a CMUdict-derived transition model and derivation script
- Added exact-length generation with optional `--starts-with` and `--ends-with` filters plus offline CLI tests
