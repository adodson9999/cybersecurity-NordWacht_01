# IMPLEMENTATION KICKSTART
**AI Implementation Agency Landing Page — Houston TX**

---

## PROJECT OVERVIEW

**Goal:** Build a high-converting, single-page landing site showcasing AI automation services to Houston-area businesses.

**Tech Stack:**
- Next.js 15 (App Router)
- React 19.2
- Tailwind CSS 4
- Shadcn/ui (components)
- Lucide Icons (system icons)
- Framer Motion (animations)
- Geist font family

**Deployment:** Vercel

**Branch:** `landing-page-build` → PR to `main`

---

## DESIGN SYSTEM

### Color Palette (5 colors total)
| Token | Hex | Usage | Notes |
|-------|-----|-------|-------|
| `--background` | #0F0F0F | Page background | Near-black |
| `--foreground` | #FFFFFF | Primary text | White, high contrast |
| `--primary` | #3B82F6 | Electric Blue | CTAs, highlights, accents |
| `--secondary` | #8B5CF6 | Deep Purple | Secondary accents, cards |
| `--accent` | #FFD700 | Gold | Tertiary highlights, borders |

**Assumptions:** Gold chosen as accent over black for contrast & visual interest.

### Typography
| Element | Font | Weight | Size | Usage |
|---------|------|--------|------|-------|
| Headings | Geist | 700–800 | 32px–72px (responsive) | Hero, section titles |
| Body | Geist | 400–600 | 14px–18px | Paragraphs, cards, UI |
| Code/Terminal | Geist Mono | 500–600 | 12px–14px | Terminal simulation |

### Spacing Scale
Use Tailwind standard scale: `gap-4`, `p-6`, `my-8`, etc.

### Border Radius
- Subtle: `rounded-lg` (8px)
- Cards: `rounded-xl` (12px)
- Interactive: `rounded-full` (50%)

### Glass Effect
- Background: `rgba(255, 255, 255, 0.05)`
- Backdrop blur: `blur-md`
- Border: `1px solid rgba(255, 255, 255, 0.1)`
- Apply to: Cards, navbar, modals

---

## PAGE STRUCTURE

### Single Landing Page (`/`)

#### 1. **Navigation Bar** (Sticky)
- Logo left; nav links center; CTA button right
- Desktop: Full navbar; Mobile: Hamburger menu (Shadcn Sheet)
- Links: Home, Pricing, Services (anchor), FAQ (anchor), Contact
- CTA: "Stop Wasting Human Capital" (magnetic hover, triggers modal)

#### 2. **Hero Section**
- Headline: "Stop Wasting Human Capital" + subheadline
- Copy: Value proposition + free audit mention
- CTA: "Stop Wasting Human Capital" button (primary, magnetic hover)
- Visual: Generated hero image (tech-forward, AI-themed)
- Height: 100vh or min-h-screen

#### 3. **Automation Scenario Section**
- Headline: "From Manual Chaos to Seamless Automation"
- Before/After scenario cards (generated images)
- Example: Manual approval → AI-driven workflows
- Visual grid: 2–3 scenario cards (desktop), 1 column (mobile)
- Secondary CTA: "See How We Do It"

#### 4. **Pricing Section**
- 3-tier pricing table (Starter, Professional, Enterprise)
- Cards: Glass effect, icon, title, price, features, CTA per tier
- Enterprise: "Contact Us" CTA
- Mobile: Stackable cards or carousel

#### 5. **FAQ Section**
- 5–8 FAQs in accordion (Shadcn Collapsible)
- Topics: How it works, pricing, implementation, ROI, support
- Smooth expand/collapse animations

#### 6. **Footer**
- Left: Logo + copyright + contact info (Houston address/phone)
- Center: Live Terminal simulation (CSS animation, tech credibility)
- Right: Stack icons (Next.js, OpenAI, Anthropic, AWS)
- Bottom: Newsletter signup (optional, or secondary CTA)

#### 7. **Contact Page** (`/contact`)
- Form: Name, Email, Company, Message, Service interest (checkboxes)
- Copy: "Let's Discuss Your Automation Strategy"
- No email submission (static/local for now)
- Back-to-Top button (visible on scroll >50% down)

---

## COMPONENT LIBRARY

### Core Components (to build)

| Component | Purpose | File |
|-----------|---------|------|
| **NavBar** | Sticky header, mobile menu | `components/nav-bar.tsx` |
| **Hero** | Hero section | `components/hero.tsx` |
| **ScenarioCard** | Before/After card | `components/scenario-card.tsx` |
| **PricingCard** | Pricing tier card | `components/pricing-card.tsx` |
| **FAQItem** | FAQ accordion item | `components/faq-item.tsx` |
| **CTAModal** | Lead capture modal | `components/cta-modal.tsx` |
| **TerminalSimulator** | Animated terminal footer | `components/terminal-simulator.tsx` |
| **Footer** | Footer with terminal + stack | `components/footer.tsx` |
| **Button** | Base button (shadcn variant) | Shadcn |
| **Card** | Glass-effect card wrapper | `components/glass-card.tsx` |

### Layout Components

| Component | Purpose | File |
|-----------|---------|------|
| **Container** | Max-width wrapper (1280px) | `components/container.tsx` |
| **Section** | Padded section with background | `components/section.tsx` |

---

## CONTENT ASSUMPTIONS

| Section | Assumed Content | Notes |
|---------|-----------------|-------|
| **Hero Headline** | "Stop Wasting Human Capital" | Per brand brief |
| **Hero Subheadline** | "AI-Powered Automation for Houston Businesses" | Geo-targeted |
| **Pricing Tiers** | Starter ($X), Professional ($Y), Enterprise (Custom) | Needs actual pricing |
| **FAQs** | 6 FAQs covering ROI, timeline, support, security | Draft provided; finalize |
| **Automation Example** | HR approval workflow (Manual → AI) | Example; adjust as needed |
| **Contact Neighborhoods** | Heights, Uptown, Downtown, Midtown, Energy Corridor | Houston service areas |
| **CTA Modal** | "Get Your Free $2,500 AI Efficiency Audit" + email field | Minimal lead capture |

---

## ANIMATIONS & MICRO-INTERACTIONS

### Entrance Animations
- Hero: Fade-in + stagger text (0.5s delay per line)
- Sections: Fade-in on scroll (Intersection Observer)
- Cards: Stagger entrance (0.1s delay between cards)

### Hover Effects
- CTA Button: Magnetic hover (20px pull toward cursor)
- Pricing Cards: Lift (translateY -4px), glow (shadow-lg)
- Nav Links: Underline animation, color shift
- Icons: Rotate 180° on hover (smooth)

### Scroll Effects
- Navbar: Backdrop blur intensifies on scroll
- Hero: Parallax background (Y translation)
- Terminal: Infinite scroll animation

### Micro-Interactions
- Modal: Slide-up + fade-in (200ms)
- Accordion: Smooth height expand/collapse
- Form inputs: Focus state with gold border + glow

---

## RESPONSIVE BREAKPOINTS

| Device | Tailwind | Approach |
|--------|----------|----------|
| Mobile | <768px | 1-column layout, hamburger nav, full-width cards |
| Tablet | 768px–1024px | 2-column grids where applicable |
| Desktop | >1024px | Full layouts, 3+ columns, hover effects |

### Mobile Optimizations
- Reduce hero height to min-h-screen (not 100vh)
- Stack Bento/Pricing cards vertically
- Increase tap target sizes (min 48px)
- Simplify animations (reduce motion option via `prefers-reduced-motion`)

---

## FILE STRUCTURE

```
/vercel/share/v0-project/
├── app/
│   ├── layout.tsx           # Root layout + fonts
│   ├── page.tsx             # Landing page (/)
│   ├── contact/
│   │   └── page.tsx         # Contact page
│   ├── globals.css          # Design tokens + tailwind
│   └── api/                 # (Optional future)
├── components/
│   ├── nav-bar.tsx
│   ├── hero.tsx
│   ├── scenario-card.tsx
│   ├── pricing-card.tsx
│   ├── faq-item.tsx
│   ├── cta-modal.tsx
│   ├── terminal-simulator.tsx
│   ├── footer.tsx
│   ├── glass-card.tsx
│   ├── container.tsx
│   └── section.tsx
├── public/
│   ├── images/
│   │   ├── hero.jpg         # Generated
│   │   ├── scenario-1.jpg   # Generated
│   │   ├── scenario-2.jpg   # Generated
│   │   └── icons/           # Next.js, OpenAI, Anthropic, AWS logos
│   └── favicon.ico
├── styles/
│   └── (if custom CSS needed)
├── package.json
├── tailwind.config.ts
├── next.config.ts
└── IMPLEMENTATION_KICKSTART.md
```

---

## BUILD PHASES

### Phase 1: Foundation (2–3 hours)
- [ ] Set up Next.js 15, Tailwind, Shadcn
- [ ] Create design tokens (colors, fonts, spacing)
- [ ] Generate hero + scenario placeholder images
- [ ] Build layout components (Container, Section)

### Phase 2: Core Components (3–4 hours)
- [ ] NavBar + mobile menu
- [ ] Hero section
- [ ] ScenarioCard component
- [ ] PricingCard + pricing section
- [ ] FAQItem + FAQ section

### Phase 3: Lead & Engagement (2–3 hours)
- [ ] CTAModal component
- [ ] TerminalSimulator (footer)
- [ ] Footer with stack icons
- [ ] GlassCard wrapper

### Phase 4: Polish & Optimization (2–3 hours)
- [ ] Animations & micro-interactions
- [ ] Responsive design & mobile menu
- [ ] Contact page
- [ ] Back-to-Top button
- [ ] SEO optimization (metadata, Open Graph)
- [ ] Accessibility review (WCAG 2.1 AA)

### Phase 5: QA & Deployment (1–2 hours)
- [ ] Cross-browser testing
- [ ] Performance optimization (Lighthouse)
- [ ] Final review & adjustments
- [ ] Deploy to Vercel

---

## DEPENDENCIES

**Already installed (Shadcn/Next.js defaults):**
- `next@15`
- `react@19.2`
- `tailwindcss@4`

**To install:**
```bash
pnpm add framer-motion lucide-react @radix-ui/react-collapsible
pnpm add -D @types/node typescript
```

---

## ASSUMPTIONS & NOTES

1. **Secondary Font**: Using Geist for all text (no secondary font family)
2. **Accent Color**: Gold (#FFD700) selected for visual interest & contrast
3. **Pricing**: Using placeholder values ($X, $Y, "Custom") — **needs finalization**
4. **Modal**: "Get Your Free Audit" + email capture (no backend submission)
5. **Contact**: Static form, no email integration yet
6. **Neighborhoods**: 5 Houston service areas (Heights, Uptown, Downtown, Midtown, Energy Corridor)
7. **Images**: All generated via GenerateImage tool
8. **Terminal**: CSS-only animation (no real logs)
9. **SEO**: Houston TX geo-targeting + service keywords
10. **Back-to-Top**: Visible only after scrolling 50% down page

---

## SUCCESS CRITERIA

- [ ] Landing page loads in <2s (Lighthouse Green)
- [ ] Mobile responsiveness: All breakpoints functional
- [ ] Animations smooth: 60fps, no jank
- [ ] Accessibility: WCAG 2.1 AA compliant
- [ ] SEO: Meta tags, Open Graph, structured data
- [ ] CTAs: At least 3 working CTAs triggering modal
- [ ] Contact page: Form fields properly styled
- [ ] Houston geo-targeting: Neighborhoods visible + address/phone in footer

---

## NEXT STEPS

1. ✅ Review & approve this kickstart document
2. 🔲 Provide final content (pricing, FAQ specifics, automation example)
3. 🔲 Confirm secondary font choice (if any)
4. 🔲 Start Phase 1: Foundation setup
5. 🔲 Generate placeholder images
6. 🔲 Build component library
7. 🔲 Assemble full landing page
8. 🔲 Optimize & QA
9. 🔲 Deploy & celebrate 🚀

---

**Status:** Ready for approval & Phase 1 kickoff  
**Last Updated:** [Today's Date]  
**Prepared by:** v0
