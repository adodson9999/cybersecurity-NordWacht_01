# ROI Calculator — Implementation Plan

## Objective

Implement an interactive **Automation ROI Calculator** component and insert it immediately below the `<Hero />` section on the landing page (`app/page.tsx`). The widget lets visitors quantify the time and cost savings of automation in real-time using two slider inputs.

---

## 1. Visual Specifications

### Theme & Color

| Token | Value | Usage |
|---|---|---|
| Section background | `#0D0D0D` (deep charcoal) | Full-width `<section>` wrapper |
| Emerald accent | `#50C878` | Slider tracks, icon fills, highlight borders |
| Primary text | `#FFFFFF` | Calculated output values |
| Label text | `#A1A1A1` (muted-foreground) | Slider labels, card descriptors |
| Card surface | `rgba(255, 255, 255, 0.05)` | Output card backgrounds (matches existing `--color-card`) |
| Card border | `rgba(80, 200, 120, 0.2)` | Subtle emerald glow border on output cards |

### Layout

```
┌──────────────────────────────────────────────────────────┐
│                  ROI Calculator Section                   │
│  ┌────────────────────────┐  ┌────────────────────────┐  │
│  │     INPUT COLUMN       │  │     OUTPUT COLUMN      │  │
│  │                        │  │  ┌──────────────────┐  │  │
│  │  Team Size             │  │  │ Hours Reclaimed  │  │  │
│  │  ━━━━━━━●━━━━━━━  20   │  │  │    8,320 hrs     │  │  │
│  │                        │  │  └──────────────────┘  │  │
│  │                        │  │  ┌──────────────────┐  │  │
│  │  Manual Hrs/Person/Wk  │  │  │ Scaled Impact $  │  │  │
│  │  ━━━●━━━━━━━━━━━   8   │  │  │   $540,800       │  │  │
│  │                        │  │  └──────────────────┘  │  │
│  │                        │  │  ┌──────────────────┐  │  │
│  │                        │  │  │ Efficiency Gain  │  │  │
│  │                        │  │  │     20.0 %       │  │  │
│  └────────────────────────┘  │  └──────────────────┘  │  │
│                              └────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

- **Desktop** (`lg:` breakpoint, ≥ 1024 px): Two-column CSS grid (`grid-cols-2`).
- **Mobile** (< 1024 px): Single-column stack — inputs first, output cards second.

### Typography

- Use the project's existing `--font-sans` (Geist Sans).
- Output values: `text-4xl font-extrabold` (white).
- Labels: `text-sm text-muted-foreground`.
- Section heading: `text-3xl sm:text-4xl lg:text-5xl font-bold`, matching the style in `automation-section.tsx`.

### Section Separation

- Apply a subtle top border or a `box-shadow` (`shadow-lg shadow-black/30`) to visually separate the calculator from the Hero above.
- Optionally add a faint radial emerald gradient (`bg-[#50C878]/5 blur-3xl`) behind the section for depth, consistent with the Hero's background gradient approach.

---

## 2. Functional Logic & Variables

### Constants

```
WEEKS_PER_YEAR = 52
HOURLY_RATE    = 65   // USD
STANDARD_WEEK  = 40   // hours
```

### Inputs

| Input | Variable | Type | Range | Default | Step |
|---|---|---|---|---|---|
| Team Size | `T` | Slider (`<input type="range">`) | 1 – 100 | 20 | 1 |
| Manual Hours / Person / Week | `H` | Slider (`<input type="range">`) | 1 – 40 | 8 | 1 |

### Outputs (derived — recalculate on every slider change)

| Output | Formula | Format |
|---|---|---|
| Hours Reclaimed / Year | `T × H × 52` | Locale-formatted integer + " hrs" |
| Scaled Impact Value | `(T × H × 52) × 65` | USD via `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })` |
| Efficiency Gain | `(H / 40) × 100` | Number with one decimal + " %" |

### Reactivity

- Use React `useState` for `T` and `H`.
- Derive all outputs inline (no extra state needed since they are pure functions of T and H).
- Values update instantly as sliders move — no submit button required.

---

## 3. Component Integration

### New File

> **[NEW]** `components/roi-calculator.tsx`

A `"use client"` React component named `ROICalculator`.

### Placement in Page

#### [MODIFY] [page.tsx](file:///Users/alexdodson/cybersecurity-NordWacht_01/app/page.tsx)

Add the import and render the component between `<Hero />` and `<AutomationSection />`:

```diff
 import { Hero } from "@/components/hero";
+import { ROICalculator } from "@/components/roi-calculator";
 import { AutomationSection } from "@/components/automation-section";
 ...
       <Hero />
+      <ROICalculator />
       <AutomationSection />
```

### Styling Approach

- Use **Tailwind CSS v4** utility classes (consistent with the rest of the project).
- Custom slider styling via Tailwind's `accent-[#50C878]` on the native `<input type="range">`, **or** a custom-styled range using `appearance-none` with a WebKit/Moz pseudo-element override for the track and thumb in emerald green.
- Wrap content in the existing `<Container>` component for consistent horizontal padding.

### Animations

- Use **Framer Motion** `motion.div` with `whileInView` fade-in (matches `GlassCard` and other section patterns already in use).
- Output value transitions: use Framer Motion's `animate` or a `useSpring` hook to smoothly interpolate displayed numbers when slider values change (count-up effect).

---

## 4. Implementation Steps

> **Reminder: Do not write code in this phase.** These steps are for planning only.

### Step 1 — Scaffold the Component

- Create `components/roi-calculator.tsx`.
- Mark as `"use client"`.
- Import `motion` from `framer-motion`, `Container` from `@/components/container`, and icons from `lucide-react` (`Clock`, `DollarSign`, `TrendingUp` or similar).

### Step 2 — Build the Input Column

- Render a section heading: **"Calculate Your Automation ROI"** using `gradient-text` class for the accent word(s).
- Render two labeled sliders:
  - Each slider has a label (muted gray), the current numeric value displayed beside the slider (white, bold), and the `<input type="range">` element.
  - Style the slider track in emerald green (`#50C878`).
  - Make the slider thumb large enough for comfortable touch interaction (minimum 44 × 44 px hit area per WCAG).

### Step 3 — Build the Output Column

- Render three output cards stacked vertically inside a `space-y-4` wrapper.
- Each card:
  - Uses the existing `glass` CSS class (or equivalent Tailwind) for the frosted-glass look.
  - Contains an icon (lucide-react) tinted emerald, a muted label, and a large white value.
  - Has a subtle emerald-tinted left border (`border-l-2 border-[#50C878]`) for visual grouping.

### Step 4 — Wire Up Calculations

- `useState` for `teamSize` (default `20`) and `manualHours` (default `8`).
- Compute derived values inline in JSX.
- Format the Scaled Impact Value with `Intl.NumberFormat` for locale-aware USD formatting.

### Step 5 — Integrate into Page

- Import `ROICalculator` in `app/page.tsx`.
- Place `<ROICalculator />` between `<Hero />` and `<AutomationSection />`.

### Step 6 — Responsive & Accessibility

- Test at `375px`, `768px`, and `1440px` widths.
- Ensure output values (especially the dollar figure) use `text-2xl sm:text-3xl lg:text-4xl` scaling to prevent overflow.
- Add `aria-label` attributes to each slider and `aria-live="polite"` on the output region so screen readers announce value changes.
- Respect `prefers-reduced-motion` (already handled globally in `globals.css`).

### Step 7 — Visual Polish

- Add a subtle `box-shadow` or top `border-t border-border` to separate from Hero.
- Confirm emerald accent consistency with the agent instruction color (`#50C878`).
- Verify the count-up animation on output values feels smooth and not distracting.

---

## 5. File Summary

| Action | File | Description |
|---|---|---|
| **NEW** | `components/roi-calculator.tsx` | The ROI Calculator React component |
| **MODIFY** | `app/page.tsx` | Import and render `<ROICalculator />` between Hero and AutomationSection |

No changes to `globals.css`, `package.json`, or any other files are expected.

---

## 6. Verification Plan

### Automated

- `npm run build` — Confirm zero TypeScript / build errors.
- `npm run lint` — Confirm no lint warnings.

### Manual / Browser

- Open the dev server (`npm run dev`).
- Verify the calculator renders directly below the Hero section.
- Drag both sliders across their full range and confirm:
  - Output values update in real-time.
  - "Hours Reclaimed" with defaults (20, 8) = **8,320 hrs**.
  - "Scaled Impact Value" with defaults = **$540,800**.
  - "Efficiency Gain" with default H=8 = **20.0%**.
- Resize browser to mobile width (≤ 768 px) and confirm:
  - Layout stacks to single column.
  - Dollar value text does not overflow.
  - Sliders are usable via touch.
- Test with a screen reader to confirm `aria-live` announces value changes.
