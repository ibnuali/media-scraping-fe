# Design — KeyCrawl

A locked design system for this app. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

## Genre
modern-minimal (developer tool, utilitarian)

## Macrostructure family
- Marketing pages: Marquee Hero (dark, typographic, monospace accents)
- Keyword workspace: full-height two-panel shell; 256–288px keyword sidebar with search and account footer, one 56px feed toolbar, independently scrolling news list. On mobile the keyword sidebar opens as a modal drawer.
- Analytics and account pages: sidebar shell + compact headers + list/table content
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

Drop-in formats for re-using this design system. Sources of truth in-repo:

- `tokens.css` (project root) — the raw token set
- `src/index.css` — the Tailwind v4 `@theme inline` bridge + shadcn/ui variables

### tokens.css

`tokens.css` at the project root. Dark (primary) values shown; `.light` overrides
live in `src/index.css`.

```css
:root {
  --color-paper:      oklch(0.145 0.005 260);
  --color-paper-2:    oklch(0.175 0.006 260);
  --color-paper-3:    oklch(0.21 0.007 260);
  --color-ink:        oklch(0.93 0.003 260);
  --color-ink-2:      oklch(0.58 0.008 260);
  --color-ink-3:      oklch(0.42 0.006 260);
  --color-rule:       oklch(0.26 0.008 260);
  --color-accent:     oklch(0.68 0.14 260);
  --color-accent-ink: oklch(0.15 0.01 260);
  --color-focus:      oklch(0.68 0.14 260 / 40%);
  --color-success:    oklch(0.72 0.17 155);
  --color-warning:    oklch(0.78 0.15 75);
  --color-danger:     oklch(0.65 0.2 25);

  --font-display: 'Inter Variable', system-ui, sans-serif;
  --font-body:    'Inter Variable', system-ui, sans-serif;
  --font-mono:    'JetBrains Mono', 'Fira Code', ui-monospace, monospace;

  --space-3xs: 0.125rem; --space-2xs: 0.25rem; --space-xs: 0.5rem;
  --space-sm:  0.75rem;  --space-md:  1rem;    --space-lg: 1.5rem;
  --space-xl:  2rem;     --space-2xl: 3rem;    --space-3xl: 4rem;

  --text-xs: 0.75rem; --text-sm: 0.8125rem; --text-md: 0.875rem;
  --text-base: 0.9375rem; --text-lg: 1.125rem; --text-xl: 1.25rem;
  --text-2xl: 1.375rem; --text-3xl: 1.625rem; --text-display: 1.75rem;

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-fast: 120ms; --dur-normal: 200ms; --dur-slow: 350ms;

  --radius: 6px; --radius-sm: 4px; --radius-md: 6px; --radius-lg: 8px;
}
```

### Tailwind v4 `@theme`

`src/index.css` bridges the tokens into Tailwind utilities. Named surfaces from
`tokens.css` are mapped alongside the shadcn/ui names so pages can write
`bg-paper-2`, `text-ink-3`, `border-rule`, `text-success`.

```css
@theme inline {
  --font-sans: 'Inter Variable', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;

  --color-paper:   var(--background);
  --color-paper-2: var(--card);
  --color-paper-3: var(--secondary);
  --color-rule:    var(--border);
  --color-ink-2:   var(--muted-foreground);
  --color-ink-3:   var(--ink-3);
  --color-success: var(--success);
  --color-warning: var(--warning);

  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
}
```

### DTCG `tokens.json`

```json
{
  "color": {
    "paper":   { "$value": "oklch(0.145 0.005 260)", "$type": "color" },
    "paper-2": { "$value": "oklch(0.175 0.006 260)", "$type": "color" },
    "ink":     { "$value": "oklch(0.93 0.003 260)",  "$type": "color" },
    "ink-2":   { "$value": "oklch(0.58 0.008 260)",  "$type": "color" },
    "ink-3":   { "$value": "oklch(0.42 0.006 260)",  "$type": "color" },
    "rule":    { "$value": "oklch(0.26 0.008 260)",  "$type": "color" },
    "accent":  { "$value": "oklch(0.68 0.14 260)",   "$type": "color" },
    "success": { "$value": "oklch(0.72 0.17 155)",   "$type": "color" },
    "warning": { "$value": "oklch(0.78 0.15 75)",    "$type": "color" },
    "danger":  { "$value": "oklch(0.65 0.2 25)",     "$type": "color" }
  },
  "font": {
    "display": { "$value": "Inter Variable", "$type": "fontFamily" },
    "body":    { "$value": "Inter Variable", "$type": "fontFamily" },
    "mono":    { "$value": "JetBrains Mono", "$type": "fontFamily" }
  },
  "space": {
    "sm": { "$value": "0.75rem", "$type": "dimension" },
    "md": { "$value": "1rem",    "$type": "dimension" },
    "lg": { "$value": "1.5rem",  "$type": "dimension" }
  },
  "radius": {
    "control": { "$value": "6px", "$type": "dimension" },
    "card":    { "$value": "8px", "$type": "dimension" }
  }
}
```

### shadcn/ui CSS variables

`src/index.css`. Dark tokens on `:root, .dark`; light tokens on `.light` (the
theme provider toggles the `dark` / `light` class on `<html>`).
`--success`, `--warning` and `--ink-3` are additions beyond stock shadcn.

```css
:root, .dark {
  --background:         oklch(0.145 0.005 260);
  --foreground:         oklch(0.93 0.003 260);
  --card:               oklch(0.175 0.006 260);
  --primary:            oklch(0.68 0.14 260);
  --primary-foreground: oklch(0.15 0.01 260);
  --muted:              oklch(0.21 0.007 260);
  --muted-foreground:   oklch(0.58 0.008 260);
  --border:             oklch(0.26 0.008 260);
  --input:              oklch(0.26 0.008 260);
  --ring:               oklch(0.68 0.14 260);
  --destructive:        oklch(0.65 0.2 25);
  --success:            oklch(0.72 0.17 155);
  --warning:            oklch(0.78 0.15 75);
  --ink-3:              oklch(0.42 0.006 260);
  --radius:             6px;
}

.light {
  --background:         oklch(0.98 0.003 260);
  --foreground:         oklch(0.18 0.01 260);
  --card:               oklch(1 0.002 260);
  --primary:            oklch(0.52 0.16 260);
  --muted:              oklch(0.95 0.005 260);
  --muted-foreground:   oklch(0.48 0.01 260);
  --border:             oklch(0.9 0.006 260);
  --destructive:        oklch(0.58 0.22 25);
  --success:            oklch(0.6 0.16 155);
  --warning:            oklch(0.65 0.14 75);
  --ink-3:              oklch(0.62 0.01 260);
  --radius:             6px;
}
```

