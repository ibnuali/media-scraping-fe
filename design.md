# Design — KeyCrawl

A locked design system for this app. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

## Genre
modern-minimal (developer tool, utilitarian)

## Macrostructure family
- Marketing pages: Marquee Hero (dark, typographic, monospace accents)
- App pages: Sidebar shell + stat-card headers + list/table content
- Content pages: List-first, compact rows

## Theme (Bruno-inspired, dark-first)
- `--color-paper`     oklch(0.145 0.005 260)
- `--color-paper-2`   oklch(0.175 0.006 260)
- `--color-paper-3`   oklch(0.21 0.007 260)
- `--color-ink`       oklch(0.93 0.003 260)
- `--color-ink-2`     oklch(0.58 0.008 260)
- `--color-ink-3`     oklch(0.42 0.006 260)
- `--color-rule`      oklch(0.26 0.008 260)
- `--color-accent`    oklch(0.68 0.14 260)
- `--color-accent-ink` oklch(0.15 0.01 260)
- `--color-focus`     oklch(0.68 0.14 260 / 40%)
- `--color-success`   oklch(0.72 0.17 155)
- `--color-warning`   oklch(0.78 0.15 75)
- `--color-danger`    oklch(0.65 0.2 25)

## Typography
- Display: Inter Variable 600, tracking -0.02em, style normal
- Body: Inter Variable 400
- Mono: 'JetBrains Mono', 'Fira Code', monospace — for data, code, badges
- Display tracking: -0.02em
- Type scale anchor: --text-display = 1.75rem (compact)

## Spacing
4-point named scale. Values in tokens.css. Pages use named tokens, never raw values.
Tight rhythm: --space-xs = 0.5rem, --space-sm = 0.75rem, --space-md = 1rem, --space-lg = 1.5rem

## Motion
- Easings: cubic-bezier(0.16, 1, 0.3, 1) named --ease-out
- Reveal pattern: none — page is composed, not animated
- Reduced-motion fallback: opacity-only, ≤ 150 ms

## Microinteractions stance
- Silent success — no celebratory toasts
- Hover delay 800 ms · focus delay 0 ms
- No glassmorphism, no gradient backgrounds, no floating animations

## CTA voice
- Primary CTA: filled, 6px radius, compact padding, mono-labeled where appropriate
- Secondary CTA: ghost or outline, same radius

## Per-page allowances
- Marketing pages MAY use enrichment (Tier-A CSS art only).
- App pages MUST NOT use enrichment — function carries the page.
- Content pages: typography only.

## What pages MUST share
- The wordmark / logotype (KeyCrawl + icon).
- The accent colour and its placement (≤ 5 % per viewport).
- The display + body fonts.
- The CTA voice (button shape, border-radius, padding rhythm).
- Tight spacing rhythm throughout.

## What pages MAY differ on
- Macrostructure within the page-type family.
- Hero archetype (within the family's allowance).

## Exports

### tokens.css
(in project root — tokens.css)

### shadcn/ui CSS variables
(in src/index.css — :root and .dark blocks)
