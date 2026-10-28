# Wordloom Studio design system

The live reference is the `/design` page in the web app. It renders every token and component below from the real code. This document records the decisions behind it.

Sources: Emil Kowalski's design-engineering rules for motion, shadcn/ui conventions for components (`cva` variants, `data-slot`, `cn`, Radix primitives), and the surface-button material shared with Better Space.

---

## 1. Principles

- **One accent.** Emerald is the only saturated hue. It marks the primary action, focus, selection and positive states. Everything else is a cool, barely tinted neutral.
- **Type does the hierarchy.** Size, weight and tracking separate levels before colour or boxes do.
- **Fast by default.** Motion finishes under 300ms and eases out. Keyboard-driven changes don't animate. Nothing on the page needs a JavaScript animation runtime.
- **Loaders earn their place.** A loader waits 150ms before appearing, so fast responses never flash one, and it stays at least 450ms once shown.

## 2. Tokens

All tokens live in `web/next/src/styles/globals.css`. They are exposed as Tailwind utilities through `@theme inline`.

### Colour

| Token                   | Role                                         |
| :---------------------- | :------------------------------------------- |
| `background`            | Page                                         |
| `card`                  | Raised surfaces: cards, inputs, inspector    |
| `sidebar`               | Studio configuration column                  |
| `muted`                 | Tracks, wells, hover fills                   |
| `foreground`            | Primary text                                 |
| `muted-foreground`      | Secondary text                               |
| `subtle-foreground`     | Hints, placeholders, tertiary metadata       |
| `border`                | Hairlines                                    |
| `border-strong`         | Hover borders, outline badges                |
| `action`                | Emerald, the single accent                   |
| `action-soft`           | Emerald tint for selection, focus and badges |
| `success`/`destructive` | Feedback states                              |

Values are OKLCH. Dark mode redefines the same names under `.dark`.

### Typography

- **Sans: Inter.** It is self-hosted through `next/font` with the `opsz` axis, so headings switch to Inter Display on their own. The features `cv11`, `ss03` and `cv05` are on.
- **Mono: JetBrains Mono.** It is used only for things people type or scan character by character: the prefix, suffix and contains fields, the A–Z dock, and keyboard keys.

| Class          | Size / line-height | Tracking | Use                       |
| :------------- | :----------------- | :------- | :------------------------ |
| `text-display` | 64 / 1.02          | -0.042em | Landing headline          |
| `text-title`   | 36 / 1.08          | -0.032em | Page and inspector titles |
| `text-heading` | 20 / 1.3           | -0.02em  | Section and card headings |
| `text-word`    | 24 / 1.12          | -0.028em | Generated names on cards  |
| `text-body`    | 15 / 1.6           | -0.006em | Paragraphs                |
| `text-small`   | 13 / 1.5           |          | UI text, descriptions     |
| `text-caption` | 12 / 1.45          |          | Metadata, controls        |
| `text-micro`   | 10 / 14 mono       |          | Badges, keys              |

`cn()` registers these sizes with `tailwind-merge`, so `text-caption` correctly overrides `text-sm`.

### Radius, elevation, motion

- **Radius:** `xs` 4, `sm` 6, `md` 8, `lg` 10, `xl` 14, `2xl` 18, `3xl` 24. A nested radius equals the outer radius minus the padding.
- **Elevation:** `shadow-card`, `shadow-thumb`, `shadow-raised` and `shadow-overlay`. Dark mode replaces most of the drop shadow with a lit top edge.
- **Durations:** `--duration-micro` 80ms, `quick` 150ms, `fast` 220ms, `sheet` 280ms.
- **Curves:** `--ease-out` `cubic-bezier(0.23, 1, 0.32, 1)`, `--ease-drawer` `cubic-bezier(0.32, 0.72, 0, 1)`, and `--ease-surface` for buttons.

## 3. Components (`web/next/src/components/ui`)

| Component                  | Notes                                                                                                                                                                                 |
| :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Button`                   | Surface material on `::before`. Variants: default (emerald), secondary, outline, ghost, destructive, link. Sizes from `xs` to `xl` plus icon sizes. `loading` shows the Remix loader. |
| `Spinner`                  | Remix `RiLoader4Line`, spun. Pair it with `useDelayedPending` (`src/hooks`).                                                                                                          |
| `SegmentedControl`         | Replaces tabs and radio groups. Works as `role="tablist"` or `radiogroup`. The selection thumb slides between options with `motion`'s `layoutId`; arrow-key changes jump instantly.   |
| `Field` / `ClearableInput` | A label with an optional mono hint, and an input with an inline clear button.                                                                                                         |
| `Input`                    | Card surface, emerald focus ring. 16px on phones to stop iOS zoom.                                                                                                                    |
| `Badge`                    | default, action, outline, muted (mono), destructive.                                                                                                                                  |
| `Card`                     | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.                                                                                                    |
| `Eyebrow`                  | Mono small-caps label.                                                                                                                                                                |
| `Kbd`                      | Keyboard key. It inverts inside a primary button.                                                                                                                                     |
| `BottomSheet`              | Always mounted, moves with `translate` only, `inert` while closed, closes on Escape and on a tap outside.                                                                             |
| `EmptyState`               | Icon tile, title, description and an optional action.                                                                                                                                 |
| `IconSwap`                 | Cross-fades two icons (opacity, scale, blur), so a re-click interrupts the transition.                                                                                                |
| `CopyButton`               | Copies to the clipboard with inline confirmation.                                                                                                                                     |
| `Separator`, `Label`       | Restyled Radix primitives.                                                                                                                                                            |
| `DropdownMenu`             | shadcn/ui on Radix. Panels scale in from their trigger and close faster than they open.                                                                                               |
| `NumberPopIn`              | Transitions.dev "Number pop-in" for counts. Rising values pop in from below, falling ones from above.                                                                                 |

Studio-specific pieces live in `components/studio`: `ResultCard` and `InspectorBody`.

### Aceternity UI (`components/aceternity`)

These are adapted from ui.aceternity.com to the tokens above and used only on the landing page:

- `Spotlight`: one sweep on load in dark mode, then still.
- `GridBackground`: a token-coloured grid that fades out toward the edges.
- `BentoGrid`: the feature grid.
- `FlipWords`: rotates the tagline's last word. It loads only `motion`'s DOM features through `LazyMotion`, animates full `transform` strings so it stays on the GPU, and holds still with reduced motion on.

### Brand

The logo is the wordmark alone: "wordloom", lowercase, semibold, tracked tight. The browser-tab favicon is a woven W, two V strands with the emerald one passing over the other.

### Avoiding the generated look

- Labels are sentence case, never uppercase-tracked eyebrows.
- Buttons say what happens ("Start naming") without a trailing arrow.
- There are no dot-separated meta strings and no single accented word in headlines.
- The landing page has one load moment: the spotlight sweep and the rotating word.

## 4. Motion rules

1. **Press:** `scale(0.97)` over 150ms. Never go below 0.95.
2. **Icon swaps:** opacity, scale from 0.25 and a 4px blur over 220ms ease-out. Both icons stay mounted.
3. **Sheets:** `translate` over 280ms on the drawer curve. The backdrop fades over 220ms.
4. **Inspector:** the panel mounts in the page flow at a fixed width, and only its contents slide in (16px, 220ms).
5. **Keyboard:** `⌘↵`, `/`, `1`, `2` and letter jumps respond instantly with no animation.
6. **Reduced motion:** fades that explain a change stay. Movement (translate, scale, blur and the sheet slide) is removed.

### Feedback without toasts

There are no toast notifications. An action reports its progress on the control that started it. Export, for example, shows "Preparing…", then "Downloading…", then "Downloaded", holding each step long enough to read.

## 5. Rendering budget

- Off-screen letter groups use `content-visibility: auto`.
- Edge fades are plain gradients. Nothing uses `backdrop-filter` over scrolling content.
- Result cards are memoized, take stable callbacks and look up bookmarks through a `Set`.
- The landing page is a server component with small client islands: the theme toggle, the sample preview and the Enter hotkey.
