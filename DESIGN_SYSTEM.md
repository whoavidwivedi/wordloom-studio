# Wordloom Studio — Design System & Micro-Interactions Specification

This document defines the comprehensive UI/UX architecture, typography, color tokens, and micro-interaction engineering for **Wordloom Studio**. It synthesizes principles from:

- **Emil Kowalski Design Engineering** (`emil-design-eng`, `prototype`, `animation-vocabulary`, `review-animations`)
- **Apple Fluid Interfaces** (`apple-design`)
- **Shadcn/UI Design System** (`shadcn`, `baseline-ui`)
- **Interface Polish & Craft** (`make-interfaces-feel-better`, `userinterface-wiki`, `impeccable`)
- **Modern Color Science** (`oklch-skill`)

---

## 1. Core Design Philosophy: Elimination of AI Tropes

### What We Avoid ("AI-Generated Aesthetics")

- ❌ **No Sparkles icons** (`Sparkles` / `✨`) used as decorative filler.
- ❌ **No saturated purple/indigo/pink gradient text** (`bg-gradient-to-r from-indigo-500 via-purple-500...`).
- ❌ **No floating colored gradient blur blobs** in the background.
- ❌ **No generic marketing buzzwords** or exaggerated copy.
- ❌ **No sluggish easing** (`ease-in`) or gratuitous high-frequency motion.

### What We Build ("Craft & Precision Engineering")

- **Monochromatic high-contrast typographic hierarchy**: Crisp black/zinc/white palette inspired by shadcn/ui, Linear, Vercel, and classic Swiss editorial design.
- **Optical precision**: Concentric border radii, optical icon centering, size-specific tracking, and balanced text wrapping.
- **Physics-grounded micro-interactions**: Tactile `scale(0.97)` on press, 1:1 pointer tracking, interruptible transitions, and zero animation on high-frequency keyboard operations.
- **Responsive parity**: Engineered to feel like a native desktop app on PC and an intentional, thumb-friendly mobile app on phone screens.

---

## 2. Color System: OKLCH & Semantic Tokens

Using OKLCH neutral scales to prevent hue drift and ensure predictable contrast ratios (WCAG AAA for body copy, AA for secondary text):

### Light Mode Palette

| Token                  | OKLCH Value             | Role                                       |
| :--------------------- | :---------------------- | :----------------------------------------- |
| `--background`         | `oklch(0.99 0.002 95)`  | Base background (warm, clean porcelain)    |
| `--card`               | `oklch(1.00 0 0)`       | Pure white surface for cards and panels    |
| `--foreground`         | `oklch(0.14 0.005 260)` | Primary high-contrast text                 |
| `--muted`              | `oklch(0.96 0.003 260)` | Secondary background & inactive buttons    |
| `--muted-foreground`   | `oklch(0.48 0.012 260)` | Supporting labels, descriptions, and hints |
| `--border`             | `oklch(0.90 0.005 260)` | Structural 1px boundary lines              |
| `--primary`            | `oklch(0.16 0.008 260)` | Solid black/charcoal primary accent        |
| `--primary-foreground` | `oklch(0.99 0 0)`       | Inverted text on primary surfaces          |

### Dark Mode Palette

| Token                  | OKLCH Value             | Role                                          |
| :--------------------- | :---------------------- | :-------------------------------------------- |
| `--background`         | `oklch(0.11 0.006 260)` | Deep midnight obsidian background             |
| `--card`               | `oklch(0.15 0.008 260)` | Slightly elevated card surface                |
| `--foreground`         | `oklch(0.96 0.003 260)` | Crisp white primary text                      |
| `--muted`              | `oklch(0.19 0.008 260)` | Subtle inactive surface                       |
| `--muted-foreground`   | `oklch(0.58 0.010 260)` | Secondary text with guaranteed 4.5:1 contrast |
| `--border`             | `oklch(0.23 0.008 260)` | Discrete 1px structural borders               |
| `--primary`            | `oklch(0.96 0.003 260)` | Crisp white primary accent                    |
| `--primary-foreground` | `oklch(0.12 0.006 260)` | Inverted text on primary surfaces             |

---

## 3. Typography & Layout Rules

### Font Stacks

1. **Sans-Serif (`--font-sans`)**: `Plus Jakarta Sans`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif`.
   - Optical font smoothing: `-webkit-font-smoothing: antialiased`.
   - Headings: `text-wrap: balance`, `letter-spacing: -0.025em`, `line-height: 1.15`.
   - Body & Descriptions: `text-wrap: pretty`, `line-height: 1.5`.
2. **Monospace (`--font-mono`)**: `JetBrains Mono`, `ui-monospace`, `Menlo`, `monospace`.
   - Numeric counters, character counts, status indicators: `font-variant-numeric: tabular-nums`.
   - Uppercase badges & code snippets: `letter-spacing: 0.08em`.

### Concentric Border Radius Formula

Nested elements must satisfy:
$$\text{Outer Radius} = \text{Inner Radius} + \text{Padding}$$

- Card (`p-4`, 16px padding) with `rounded-xl` (12px inner) $\to$ Outer card container: `rounded-2xl` (28px) or nested controls scaled proportionally (`rounded-lg` inner inside `rounded-xl` card).

---

## 4. Micro-Interactions & Animation Standards

### 1. Tactile Button Press

Every interactive button and card must provide immediate tactile confirmation upon pointer-down:

```css
.interactive-control {
  transition-property: transform, background-color, border-color, color;
  transition-duration: 140ms;
  transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
}
.interactive-control:active {
  transform: scale(0.97);
}
```

_Never use a scale smaller than 0.95 (which feels cartoonish) or larger than 0.98 (which feels imperceptible)._

### 2. Contextual Icon Morphing (Copy & Bookmark States)

Following `make-interfaces-feel-better` principle #7:

- When toggling copy or bookmark feedback, cross-fade with `opacity`, `scale` (0.25 to 1.0), and `filter: blur` (4px to 0px).
- Spring transition: `{ type: "spring", duration: 0.28, bounce: 0 }` (bounce must always be 0).

### 3. Modals, Drawers & Sheets

- **Desktop Side Inspector**: Slides smoothly from the right using an origin-aware spring (`{ type: "spring", stiffness: 260, damping: 28 }`).
- **Mobile Bottom Sheet**: Slides up from bottom (`translateY(100%)` to `translateY(0)`), supports tap-outside dismiss and drag-down dismiss.
- **Escape Key (`Esc`)**: Closes any open inspector or mobile sheet instantly without delay.

### 4. High-Frequency Interaction Rule (Zero Latency)

- Keyboard actions (`Enter` to generate, typing in prefix/suffix fields, letter jump hotkeys) must respond **instantly with 0ms artificial animation delay**.

---

## 5. Responsive UX Architecture

### Mobile Devices (< 768px)

- **Top Header**: Compact title bar with direct Return button and theme toggle.
- **Sticky Filter Status Bar**: Shows active length and constraints; tapping "Tune" opens a native-feeling bottom sheet with large 44px touch targets.
- **Feed**: Full-width single column cards with generous touch hit areas, 1-tap copy, 1-tap save, and tap-to-inspect.
- **A-Z Jump Dock**: Horizontal touch-scrolling letter bar with active letter highlight and available candidate counts.
- **Availability Inspector**: Renders as an iOS-style bottom sheet with drag handle and direct platform links.

### Desktop Devices (≥ 768px)

- **Workbench Layout**:
  - Left: Fixed 320px sidebar with length chips, slider, clearable input fields, real words toggle, and generate button.
  - Center: Responsive 2- to 3-column feed with infinite scroll and alphabetical grouping.
  - Right: Context-preserving slide-over inspector for deep-dive phonetics, WordNet definition, and live platform lookups (Domainr, GitHub, X, Instagram, YouTube).
