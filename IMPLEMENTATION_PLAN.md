# NordWacht — Full Backend Implementation Plan

> **Status**: Ready to implement — all open questions resolved
> **Last updated**: 2026-04-23

---

## Table of Contents

1. [Existing Repo Audit](#1-existing-repo-audit)
2. [Branding Guide](#2-branding-guide)
3. [Final Architecture](#3-final-architecture)
4. [Database Schema](#4-database-schema)
5. [Page-by-Page Spec](#5-page-by-page-spec)
6. [Feature Specs](#6-feature-specs)
7. [Edge Functions Inventory](#7-edge-functions-inventory)
8. [Security Model](#8-security-model)
9. [Admin-via-Studio Playbook](#9-admin-via-studio-playbook)
10. [Documentation Structure](#10-documentation-structure)
11. [SEO / GEO Checklist](#11-seo--geo-checklist)
12. [Phase 1 vs. Deferred](#12-phase-1-vs-deferred)
13. [Resolved Decisions](#13-resolved-decisions)

---

## 1. Existing Repo Audit

### Framework & Runtime

| Item | Value |
|---|---|
| Framework | Next.js 15.3.1 (App Router) |
| React | 19.1.0 |
| Language | TypeScript 5.8.3, strict mode |
| Bundler | Turbopack (`next dev --turbopack`) |
| Path alias | `@/*` → `./*` |

### Styling

| Item | Value |
|---|---|
| CSS | Tailwind CSS **4.1.4** (v4 — uses `@theme inline` in `globals.css`, NOT `tailwind.config`) |
| PostCSS | `@tailwindcss/postcss` 4.1.4 |
| Design tokens | CSS custom properties inside `@theme inline {}` block |
| Utilities | `.glass` (backdrop-blur card), `.gradient-text`, `.magnetic-hover`, `.roi-slider` |

### Component Library

| Category | Details |
|---|---|
| Primitives | Radix UI: `@radix-ui/react-dialog` 1.1.14, `@radix-ui/react-collapsible` 1.1.11 |
| Variant system | `class-variance-authority` 0.7.1 + `clsx` + `tailwind-merge` (Shadcn pattern) |
| Icons | `lucide-react` 0.511.0 |
| Animation | `framer-motion` 12.10.0 |
| Custom Button | `components/ui/button.tsx` — CVA variants (default/secondary/outline/ghost/accent), sizes (sm/default/lg/xl), magnetic hover |
| Fonts | Geist Sans + Geist Mono (via `next/font/google`) |

### Existing Pages

| Route | File | Status |
|---|---|---|
| `/` | `app/page.tsx` | ✅ Complete |
| `/contact` | `app/contact/` | ✅ Exists |

### Existing Components (18 + 1 UI primitive)

hero, proven-impact, automation-section, pricing-section, pricing-card, faq-section, faq-item, nav-bar, footer, back-to-top, container, glass-card, scenario-card, terminal-simulator, cta-modal, services-modal, roi-modal, roi-calculator, ui/button

### What Does NOT Exist Yet

- No database, ORM, or data layer
- No backend API routes or Server Actions
- No tests, no CI/CD pipeline
- No sitemap, robots.txt, RSS feed
- No privacy/terms pages
- No blog, services detail, case studies, about, or booking flow
- No Supabase or email integration

---

## 2. Branding Guide

### 2.1 Color Palette

| Token | Hex | Usage |
|---|---|---|
| `background` | `#0F0F0F` | Page bg |
| `foreground` | `#FFFFFF` | Primary text |
| `primary` | `#3B82F6` | CTAs, links, focus rings |
| `secondary` | `#8B5CF6` | Gradient accents |
| `accent` | `#FFD700` | Gold highlight (sparingly) |
| `muted` | `#1A1A1A` | Card backgrounds |
| `muted-foreground` | `#A1A1A1` | Body text, labels |
| `card` | `rgba(255,255,255,0.05)` | Card fill |
| `border` | `rgba(255,255,255,0.1)` | Borders |
| Emerald | `#50C878` | ROI/impact only — not general CTAs |

### 2.2 Typography

- **Font stack**: Geist Sans (body), Geist Mono (code/terminal)
- **H1**: `text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight`
- **H2**: `text-3xl sm:text-4xl lg:text-5xl font-bold`
- **H3**: `text-lg font-semibold` or `text-xl font-bold`
- **Body**: `text-lg text-muted-foreground`
- **Labels**: `text-sm font-medium uppercase tracking-wider text-muted-foreground`
- **Gradient text**: `.gradient-text` — 135° from primary → secondary

### 2.3 Spacing & Components

- **Container**: `mx-auto max-w-7xl px-6`
- **Section padding**: `py-20 lg:py-28`, separated by `border-t border-white/[0.06]`
- **Glass card**: `.glass` — `backdrop-filter: blur(12px)`, semi-transparent bg + border
- **Buttons**: CVA variants (default=blue, outline, ghost, accent=gold). Sizes sm/default/lg/xl. Optional `magnetic` prop
- **Modals**: Radix Dialog + local `useState` + AnimatePresence. No global state
- **Animations**: Framer Motion `whileInView`, staggered delays (`delay: index * 0.1`)
- **Badge/pill**: `rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary`
- **Background glows**: Positioned `rounded-full bg-{color}/20 blur-3xl` divs

### 2.4 Tone of Voice

- Direct & confident ("Stop Wasting Human Capital")
- Technical but approachable
- Houston-local geographic anchoring
- Action-oriented CTAs
- Nordic/Shield motif (Shield icon as logo mark)

### 2.5 Rules for New Pages

1. Use `Container` for layout. Section bg: `bg-background` with optional glows
2. Cards: `.glass` or `border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm`
3. Entrance animations: Framer Motion `whileInView`, `initial={{ opacity: 0, y: 20 }}`, `viewport={{ once: true }}`
4. Emerald `#50C878` reserved for ROI/impact only
5. Primary blue for main CTAs; purple for gradients only
6. All interactive elements need `:focus-visible` ring
7. Toasts: top-left position

---

## 3. Final Architecture

### 3.1 Stack Diagram

```
Visitor Browser (anonymous, no auth)
        │
  Cloudflare (DNS, DDoS)
        │
  Vercel (Next.js 15 SSR/SSG)
  Server Components → Supabase (service_role key)
        │
  Supabase
  ├── Postgres (RLS: deny-all anon, service-role writes)
  ├── Edge Functions (Brevo SMTP, slot gen, booking, cron)
  ├── Storage (images, media, llms.txt)
  └── Studio (admin-only — no UI built)
        │
  Email routing:
  ├── OUTBOUND transactional (booking/contact/reminder) → Brevo SMTP
  └── INBOUND mail + OUTBOUND replies → Google Workspace
      (replies to transactional emails land in consultant's Gmail inbox)
```

### 3.2 Directory Structure (target)

```
nordwacht/
├── app/
│   ├── layout.tsx, page.tsx, globals.css     # Existing
│   ├── contact/page.tsx                       # Existing
│   ├── about/page.tsx
│   ├── services/page.tsx
│   ├── services/[slug]/page.tsx
│   ├── case-studies/page.tsx
│   ├── case-studies/[slug]/page.tsx
│   ├── blog/page.tsx
│   ├── blog/[slug]/page.tsx
│   ├── book/page.tsx                          # Multi-step wizard
│   ├── book/success/page.tsx
│   ├── book/confirm/[token]/page.tsx
│   ├── book/reschedule/[token]/page.tsx
│   ├── book/cancel/[token]/page.tsx
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   ├── not-found.tsx, global-error.tsx
│   ├── sitemap.ts, robots.ts
│   ├── rss.xml/route.ts
│   ├── llms.txt/route.ts, llms-full.txt/route.ts
│   └── api/                                   # Next.js API routes (proxy to Edge Fns)
│       ├── contact/route.ts
│       ├── booking/slots/route.ts
│       ├── booking/create/route.ts
│       ├── booking/confirm/route.ts
│       ├── booking/cancel/route.ts
│       ├── booking/reschedule/route.ts
│       └── revalidate/route.ts                # On-demand revalidation webhook
├── components/
│   ├── ui/          # Shadcn-pattern primitives (button exists, add input/textarea/select/calendar/toast/badge/card/skeleton/dialog)
│   ├── booking/     # step-call-type, step-pick-slot, step-enter-info, step-confirm, booking-wizard
│   ├── forms/       # contact-form
│   ├── content/     # service-card, case-study-card, blog-post-card, breadcrumbs
│   ├── seo/         # json-ld structured data components
│   └── (existing 18 components)
├── lib/
│   ├── utils.ts                  # Exists
│   ├── supabase/client.ts        # Server-side Supabase client
│   ├── supabase/types.ts         # Generated DB types
│   ├── supabase/queries/         # services.ts, case-studies.ts, blog.ts, booking.ts, contact.ts
│   ├── scheduling/slots.ts       # Shared slot computation types
│   ├── email/templates.ts
│   └── tokens.ts
├── supabase/
│   ├── config.toml, seed.sql
│   ├── migrations/00001_initial_schema.sql
│   └── functions/                # Edge Functions (8 total)
│       ├── get-available-slots/
│       ├── create-booking/
│       ├── confirm-booking/
│       ├── cancel-booking/
│       ├── reschedule-booking/
│       ├── submit-contact/
│       ├── send-reminder/        # Cron: 24h before
│       └── mark-no-shows/        # Cron: 30min after slot_end
├── docs/
│   ├── schema.md, edge-functions.md, email-templates.md
│   └── decisions/ (001-no-auth, 002-custom-scheduling, 003-smtp-edge-fn, 004-studio-admin, 005-workspace-plus-brevo)
├── .github/workflows/ci.yml
├── README.md, AGENTS.md
└── .env.example
```

### 3.3 Environment Variables

```bash
# .env.example
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=        # Server-only
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# --- SMTP (Brevo free tier — 300 emails/day) ---
# Brevo handles OUTBOUND transactional mail only.
# INBOUND mail + regular outbound replies are handled by Google Workspace (MX records).
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=                        # Brevo SMTP login
SMTP_PASS=                        # Brevo SMTP key (NOT the API key)
SMTP_FROM_EMAIL=alexander.dodson@zanderservices.org
SMTP_FROM_NAME=Zander Services
SMTP_REPLY_TO=alexander.dodson@zanderservices.org  # Replies land in Workspace inbox

ADMIN_EMAIL=alexander.dodson@zanderservices.org
NEXT_PUBLIC_SITE_URL=             # https://zanderservices.org

# --- Revalidation ---
REVALIDATE_SECRET=                # Shared secret for Supabase webhook → Next.js revalidation
```

Secrets live in **Vercel env vars** (per environment) and **Supabase Edge Function secrets** (`supabase secrets set`). Never in the repo.

### 3.3.1 Email Deliverability DNS Records

The domain `zanderservices.org` sends transactional email through **Brevo** AND receives/sends regular email through **Google Workspace**. Both services must be authorized in DNS. Add these records via Cloudflare:

**MX records — receive mail via Google Workspace** (Workspace setup provides these; typically one record is sufficient for newer Workspace tenants):

```
@  MX  1   smtp.google.com
```

(If your Workspace console shows the legacy 5-record set with `aspmx.l.google.com` etc., use those instead — both forms are valid.)

**SPF — combined, authorizes BOTH Google Workspace AND Brevo** (only ONE SPF record allowed per domain):

```
@  TXT  "v=spf1 include:_spf.google.com include:sendinblue.com ~all"
```

> ⚠️ **Critical**: RFC 7208 allows only one SPF record per domain. If Cloudflare already has an SPF record from Workspace setup, **edit it** to add `include:sendinblue.com` — do NOT add a second record. Multiple SPF records break email authentication entirely.

**DKIM — two separate selectors, one per service** (they do not conflict):

```
# Google Workspace DKIM
google._domainkey  TXT  "<value from Workspace Admin → Apps → Gmail → Authenticate email>"

# Brevo DKIM
mail._domainkey    TXT  "<value from Brevo → Senders & IP → Domains → Authenticate>"
# Brevo may also require a CNAME:
brevo-code.<domain>  CNAME  <value>.brevo.net
```

**DMARC — single policy covers all authorized senders above**:

```
_dmarc  TXT  "v=DMARC1; p=quarantine; rua=mailto:alexander.dodson@zanderservices.org; pct=100; adkim=s; aspf=s"
```

**Verification checklist** (run after DNS propagation, which can take up to an hour on Cloudflare):

1. Send a test email from Brevo to a Gmail address → open the email → "Show original" → SPF, DKIM, DMARC should all say **PASS**
2. Send a test email from your Workspace Gmail to a Gmail address → same check, same result
3. Score the setup at [mail-tester.com](https://www.mail-tester.com) — target ≥ 9/10 for both senders

If either sender fails authentication, booking confirmations will land in spam and leads will quietly bounce. Do not go to production before both senders verify clean.

### 3.4 Deploy Flow

1. Push to feature branch → PR
2. GitHub Actions CI: lint + typecheck + test (Vitest + Playwright)
3. Vercel auto-deploys preview per PR
4. Merge to `main` → Vercel production deploy
5. Supabase migrations: `supabase db push` (manual initially, CI later)
6. Edge Functions: `supabase functions deploy <name>`

---

## 4. Database Schema

> All timestamps stored as `timestamptz` in UTC. All UUIDs generated via `gen_random_uuid()`. Every table and column gets `COMMENT ON`. RLS: deny-all for anon key; all writes via Edge Functions using service_role.

### 4.1 Enums

```sql
CREATE TYPE lead_source AS ENUM ('contact-form', 'booking', 'referral', 'other');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost');
CREATE TYPE booking_status AS ENUM ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show', 'rescheduled');
CREATE TYPE comm_type AS ENUM ('email', 'call', 'note');
CREATE TYPE comm_direction AS ENUM ('inbound', 'outbound');
CREATE TYPE exception_type AS ENUM ('block', 'open');
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE audit_action AS ENUM ('INSERT', 'UPDATE', 'DELETE');
```

### 4.2 CMS Tables

**services** — service offerings displayed on `/services` and `/services/[slug]`

```sql
CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  subtitle text,
  description text NOT NULL,          -- Rich text / markdown
  icon_name text,                     -- Lucide icon name
  features jsonb DEFAULT '[]',        -- Array of feature strings
  display_order int DEFAULT 0,
  status content_status DEFAULT 'draft',
  og_image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**case_studies** — portfolio pieces on `/case-studies/[slug]`

```sql
CREATE TABLE case_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  client_name text,
  industry text,
  challenge text NOT NULL,
  solution text NOT NULL,
  results text NOT NULL,
  metrics jsonb DEFAULT '{}',         -- e.g. {"efficiency_gain": "96%", "cost_reduction": "20%"}
  cover_image_url text,
  gallery_urls jsonb DEFAULT '[]',
  testimonial_quote text,
  testimonial_author text,
  service_id uuid REFERENCES services(id),
  status content_status DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**blog_posts** — articles on `/blog/[slug]`

```sql
CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text,
  body text NOT NULL,                 -- Markdown
  cover_image_url text,
  author_name text DEFAULT 'Zander Services',
  tags text[] DEFAULT '{}',
  reading_time_min int,
  status content_status DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**call_types** — types of calls a visitor can book

```sql
CREATE TABLE call_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,                 -- e.g. "Discovery Call"
  description text,
  duration_min int NOT NULL DEFAULT 30,
  buffer_before_min int DEFAULT 5,
  buffer_after_min int DEFAULT 10,
  price_display text,                 -- Display only, e.g. "Free" or "$150"
  location text DEFAULT 'Remote - Zoom/Meet',
  active boolean DEFAULT true,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### 4.3 Scheduling Tables

**availability_rules** — recurring weekly availability

```sql
CREATE TABLE availability_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week int NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday
  start_time time NOT NULL,
  end_time time NOT NULL,
  timezone text NOT NULL DEFAULT 'America/Chicago',
  active_from date,                   -- NULL = always active
  active_to date,                     -- NULL = no end date
  created_at timestamptz DEFAULT now()
);
```

**availability_exceptions** — single-day overrides

```sql
CREATE TABLE availability_exceptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date_start date NOT NULL,
  date_end date NOT NULL,
  type exception_type NOT NULL,       -- 'block' or 'open'
  reason text,                        -- e.g. "Holiday", "Conference"
  start_time time,                    -- NULL = all day
  end_time time,
  created_at timestamptz DEFAULT now()
);
```

### 4.4 Lead & Booking Tables

**leads**

```sql
CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  source lead_source DEFAULT 'other',
  status lead_status DEFAULT 'new',
  notes text,
  tags text[] DEFAULT '{}',
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  first_contact_at timestamptz DEFAULT now(),
  last_contact_at timestamptz DEFAULT now(),
  converted_to_client_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);
```

**call_bookings**

```sql
CREATE TABLE call_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads(id),
  call_type_id uuid NOT NULL REFERENCES call_types(id),
  slot_start timestamptz NOT NULL,
  slot_end timestamptz NOT NULL,
  timezone text NOT NULL,             -- Visitor's timezone for display
  status booking_status DEFAULT 'scheduled',
  cancel_reason text,
  cancel_datetime timestamptz,
  meeting_link text,
  prep_notes text,
  outcome_notes text,
  confirmation_token text UNIQUE NOT NULL,
  reschedule_token text UNIQUE NOT NULL,
  cancel_token text UNIQUE NOT NULL,
  tokens_expired boolean DEFAULT false,
  original_booking_id uuid REFERENCES call_bookings(id),  -- For rescheduled bookings
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT no_double_book UNIQUE (call_type_id, slot_start)
);
CREATE INDEX idx_bookings_slot ON call_bookings(slot_start);
CREATE INDEX idx_bookings_status ON call_bookings(status);
CREATE INDEX idx_bookings_confirm_token ON call_bookings(confirmation_token);
CREATE INDEX idx_bookings_reschedule_token ON call_bookings(reschedule_token);
CREATE INDEX idx_bookings_cancel_token ON call_bookings(cancel_token);
```

**contact_submissions** — contact form entries (separate from leads to isolate spam)

```sql
CREATE TABLE contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  message text NOT NULL,
  promoted_to_lead_id uuid REFERENCES leads(id),
  ip_address inet,
  created_at timestamptz DEFAULT now()
);
```

### 4.5 Communication, Audit, & Config Tables

**communication_log**

```sql
CREATE TABLE communication_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads(id),
  type comm_type NOT NULL,
  direction comm_direction NOT NULL,
  subject text,
  body text,
  metadata jsonb DEFAULT '{}',        -- e.g. {"booking_id": "...", "template": "confirmation"}
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_comm_lead ON communication_log(lead_id);
```

**audit_log** — auto-populated by Postgres trigger

```sql
CREATE TABLE audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor text NOT NULL DEFAULT 'system', -- 'system' or 'admin_studio'
  entity text NOT NULL,                 -- Table name
  entity_id uuid NOT NULL,
  action audit_action NOT NULL,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_audit_entity ON audit_log(entity, entity_id);
```

**rate_limits** — IP-based rate limiting for Edge Functions

```sql
CREATE TABLE rate_limits (
  ip_address inet NOT NULL,
  endpoint text NOT NULL,
  request_count int DEFAULT 1,
  window_start timestamptz DEFAULT now(),
  PRIMARY KEY (ip_address, endpoint)
);
```

**site_settings** — key-value config table for global settings (meeting link, business info, etc.)

```sql
CREATE TABLE site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,           -- e.g. 'default_meeting_link', 'business_phone'
  value text NOT NULL,
  description text,                   -- Human-readable note for Studio users
  updated_at timestamptz DEFAULT now()
);
COMMENT ON TABLE site_settings IS 'Key-value config table. Editable in Studio. Used by Edge Functions for default meeting link, business contact info, etc.';

-- Seed with defaults:
-- INSERT INTO site_settings (key, value, description) VALUES
--   ('default_meeting_link', 'https://meet.google.com/xxx-yyyy-zzz', 'Default meeting URL included in all booking confirmations'),
--   ('business_phone', '(713) 555-1234', 'Displayed in emails and on site'),
--   ('business_email', 'alexander.dodson@zanderservices.org', 'Primary contact email');
```

### 4.6 Triggers

```sql
-- Audit trigger function
CREATE OR REPLACE FUNCTION fn_audit_trigger() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_log (actor, entity, entity_id, action, after_data)
    VALUES ('admin_studio', TG_TABLE_NAME, NEW.id, 'INSERT', to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_log (actor, entity, entity_id, action, before_data, after_data)
    VALUES ('admin_studio', TG_TABLE_NAME, NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_log (actor, entity, entity_id, action, before_data)
    VALUES ('admin_studio', TG_TABLE_NAME, OLD.id, 'DELETE', to_jsonb(OLD));
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Apply to leads and call_bookings
CREATE TRIGGER trg_leads_audit AFTER INSERT OR UPDATE OR DELETE ON leads
  FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger();
CREATE TRIGGER trg_bookings_audit AFTER INSERT OR UPDATE OR DELETE ON call_bookings
  FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION fn_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER trg_services_updated BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION fn_updated_at();
CREATE TRIGGER trg_case_studies_updated BEFORE UPDATE ON case_studies FOR EACH ROW EXECUTE FUNCTION fn_updated_at();
CREATE TRIGGER trg_blog_posts_updated BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION fn_updated_at();
CREATE TRIGGER trg_call_types_updated BEFORE UPDATE ON call_types FOR EACH ROW EXECUTE FUNCTION fn_updated_at();
CREATE TRIGGER trg_leads_updated BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION fn_updated_at();
CREATE TRIGGER trg_bookings_updated BEFORE UPDATE ON call_bookings FOR EACH ROW EXECUTE FUNCTION fn_updated_at();
CREATE TRIGGER trg_site_settings_updated BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION fn_updated_at();
```

### 4.7 RLS Policies

```sql
-- Enable RLS on all tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Deny all for anon by default (no policies = deny).
-- Narrow read-only policies for published content only:
CREATE POLICY "anon_read_published_services" ON services FOR SELECT USING (status = 'published');
CREATE POLICY "anon_read_published_case_studies" ON case_studies FOR SELECT USING (status = 'published');
CREATE POLICY "anon_read_published_blog_posts" ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "anon_read_active_call_types" ON call_types FOR SELECT USING (active = true);

-- All other tables: no anon policies = complete deny.
-- Edge Functions use service_role key which bypasses RLS entirely.
```

---

## 5. Page-by-Page Spec

### Existing Pages (modify)

| Route | Changes Needed |
|---|---|
| `/` (home) | Add JSON-LD (Organization, FAQ). Update nav links for new pages. Eventually pull Pricing/Services data from DB |
| `/contact` | Add honeypot field. Form submits to API route → Edge Function. Loading/success/error states |

### New Content Pages

| Route | Purpose | Data Source | Key Components |
|---|---|---|---|
| `/about` | Company story, team, values | Static (hardcoded initially) | Hero, timeline/story section, team card, CTA |
| `/services` | Services listing grid | `services` table (status=published) | ServiceCard grid, breadcrumbs, JSON-LD (Service) |
| `/services/[slug]` | Service detail | `services` table by slug | Full description, features list, related case studies, CTA, JSON-LD |
| `/case-studies` | Portfolio grid | `case_studies` table (status=published) | CaseStudyCard grid, filter by industry, breadcrumbs |
| `/case-studies/[slug]` | Case study detail | `case_studies` + related service | Challenge/Solution/Results layout, metrics cards, testimonial, gallery, JSON-LD (Article) |
| `/blog` | Blog listing | `blog_posts` (status=published, ordered by published_at DESC) | BlogPostCard grid, tag filter, breadcrumbs |
| `/blog/[slug]` | Blog post | `blog_posts` by slug | Markdown rendered, reading time, tags, related posts, JSON-LD (Article), OG image |
| `/privacy` | Privacy policy | Static markdown | Simple prose layout |
| `/terms` | Terms of service | Static markdown | Simple prose layout |

### Booking Flow Pages

| Route | Purpose | States |
|---|---|---|
| `/book` | Multi-step wizard: (1) pick call type → (2) pick date/slot → (3) enter info → (4) review & confirm | Loading (fetching call types/slots), empty (no available slots), form validation errors, submitting, API error |
| `/book/success` | Post-booking confirmation | Shows booking details, .ics download link, next-steps copy |
| `/book/confirm/[token]` | Email confirmation click | Valid → mark confirmed + show success. Invalid/expired → error message |
| `/book/reschedule/[token]` | Reschedule flow | Valid → show new slot picker → submit. Token expired → error. Already used → error |
| `/book/cancel/[token]` | Cancel flow | Valid → show confirmation modal with optional reason → submit. Expired/used → error |

### Error Pages

| Route | Notes |
|---|---|
| `not-found.tsx` | Custom 404 with nav, search suggestion, CTA |
| `global-error.tsx` | Custom 500 with apology copy and contact link |

### All Pages: Common States

Every page must handle: **loading** (skeleton shimmer), **empty** (friendly message + CTA), **error** (retry button + fallback), **success** (for forms). Use the `skeleton.tsx` UI component for loading states consistently.

---

## 6. Feature Specs

### 6.1 Scheduling

**Availability Model**: The consultant is available **24/7 by default**. Seed `availability_rules` with 7 rows (one per day, 00:00–23:59 America/Chicago). Availability is only restricted by existing bookings (with buffers) and manually-added `availability_exceptions` (e.g., blocking a vacation week in Studio).

**Slot Generation Algorithm** (runs in `get-available-slots` Edge Function):

1. Accept params: `call_type_id`, `date_from`, `date_to` (max **30-day** rolling window), `visitor_timezone`
2. Load `call_type` → get `duration_min`, `buffer_before_min`, `buffer_after_min`
3. For each date in range:
   a. Load `availability_rules` for that day_of_week where date is within `active_from`/`active_to`
   b. Apply `availability_exceptions`: remove `block` ranges, add `open` ranges
   c. Generate candidate slots at 15-min intervals within available windows
   d. For each candidate: check `call_bookings` for overlapping bookings (including buffers)
   e. Filter to only future slots (≥ **2 hours** from now to prevent last-minute bookings)
4. Return available slots in UTC; client converts to `visitor_timezone` for display

**Meeting Link**: On booking creation, `meeting_link` defaults to the value of `site_settings.key = 'default_meeting_link'` (a static personal meeting URL). The consultant can override per-booking in Studio. Auto-generated per-call Zoom/Meet links are deferred.

**Double-Book Prevention**: `UNIQUE (call_type_id, slot_start)` constraint. Edge Function also uses `SELECT ... FOR UPDATE` row-level lock during booking creation.

**Token Flow**:
- On booking creation: generate 3 cryptographically random tokens (48-char hex via `crypto.randomBytes(24).toString('hex')`)
- `confirmation_token`: single-use (sets status → confirmed)
- `reschedule_token`: single-use (creates new booking, cancels old)
- `cancel_token`: single-use (sets status → cancelled)
- All tokens expire when `slot_start` passes → `tokens_expired` set to `true` by cron

### 6.2 Lead Intake

**Contact Form Flow**:
1. Visitor fills form (name, email, phone, company, message) + honeypot field
2. Submit → API route → `submit-contact` Edge Function
3. Edge Function: check rate limit, reject if honeypot filled
4. Insert into `contact_submissions`
6. Send confirmation email to visitor
7. Send admin-alert email to consultant (delivered to Workspace inbox)
8. Consultant reviews in Studio, optionally promotes to `leads` table

**Booking Lead Flow**:
1. Booking wizard collects lead info at step 3
2. `create-booking` Edge Function: upsert into `leads` (by email) with `source: 'booking'`, then create `call_booking`
3. Lead status starts as `new`; consultant updates manually in Studio

### 6.3 Content Publishing

All CMS content managed directly in Supabase Studio:
1. Admin creates row in `services`/`case_studies`/`blog_posts` with `status: 'draft'`
2. Fills in all fields, uploads images to Supabase Storage (`public-media` bucket)
3. Sets `status: 'published'` and `published_at` timestamp
4. Next.js SSR pages query with `status = 'published'` filter
5. **On-demand revalidation** via Supabase database webhook → Next.js API route `/api/revalidate`:
   - Supabase webhook fires on INSERT/UPDATE to `services`, `case_studies`, `blog_posts`
   - Webhook calls `POST /api/revalidate?secret=REVALIDATE_SECRET&path=/blog/[slug]`
   - API route validates secret, calls `revalidatePath()` or `revalidateTag()`
   - Hourly ISR fallback (`revalidate: 3600`) on all content pages as safety net if webhook fails
   - Result: content updates appear on the live site within seconds of publishing

**Blog rendering**: `body` column stores plain Markdown, rendered via `react-markdown` with `remark-gfm` for GitHub-flavored Markdown support (tables, task lists, etc.) and `rehype-sanitize` for security.

**Image storage**:
- All runtime images live in Supabase Storage, **not** `/public/` in the repo
- Bucket: `public-media` (public-read, service-role-write) for covers, icons, OG images
- Bucket: `private-media` (deferred — reserved for future gated client portal content)
- Images optimized **before** upload (Squoosh/Figma): covers ≤ 150KB, icons ≤ 30KB, WebP format
- Rendered via Next.js `<Image>` with explicit `width`/`height` to prevent CLS
- Cache-busting: append `?v=<updated_at_timestamp>` to storage URLs
- Naming: `<entity>-<slug>-<variant>.<ext>` (e.g. `blog-rag-isnt-the-answer-cover.webp`)
- Exceptions in repo `/public/`: favicon, logo SVG, OG default image (site shell, not content)

### 6.4 Email Flow

All transactional emails sent from Edge Functions via **Brevo SMTP** (free tier, 300 emails/day). Templates are plain HTML with inline CSS for email client compatibility.

**Sender identity**:
- **From**: `"Zander Services" <alexander.dodson@zanderservices.org>`
- **Reply-To**: `alexander.dodson@zanderservices.org`

Because `alexander.dodson@zanderservices.org` is hosted on **Google Workspace**, replies to any transactional email route directly into the consultant's Gmail inbox with no additional configuration. Leads can simply hit "Reply" on a booking confirmation and reach the consultant at their normal working inbox — no separate support address or forwarding rule required. Brevo handles outbound programmatic sends; Workspace handles the inbox + manual replies.

| Email | Trigger | Recipient | Content |
|---|---|---|---|
| Booking confirmation | `create-booking` | Lead | Booking details, .ics attachment, confirm/reschedule/cancel token links |
| Admin alert (booking) | `create-booking` | Admin (Workspace inbox) | Lead info, booking details, direct link to Studio |
| Contact confirmation | `submit-contact` | Visitor | "We received your message" acknowledgment |
| Admin alert (contact) | `submit-contact` | Admin (Workspace inbox) | Contact form contents |
| 24h reminder | `send-reminder` cron | Lead | Upcoming call details, reschedule/cancel links |
| Cancellation confirmation | `cancel-booking` | Lead + Admin | Cancellation details, rebook CTA |
| Reschedule confirmation | `reschedule-booking` | Lead + Admin | New booking details, updated .ics |

Every sent email is logged in `communication_log` with `type: 'email'`, `direction: 'outbound'`.

**Deliverability monitoring**: Because admin alerts are the consultant's only awareness of new leads/bookings, silent SMTP failures are a launch risk. Mitigations:
- Edge Functions that send mail MUST log success/failure to `communication_log` with full error payload on failure
- A daily digest cron (`send-daily-digest`, deferred to Phase 1.5) summarizes the last 24h of bookings + leads as a safety net — if it arrives, the inbox flow is healthy; if it stops arriving, something is broken
- Brevo dashboard shows bounce rate — check weekly for the first month

### 6.5 Audit via Triggers

- Postgres trigger `fn_audit_trigger()` fires on INSERT/UPDATE/DELETE on `leads` and `call_bookings`
- Captures `before_data` and `after_data` as JSONB
- `actor` defaults to `'admin_studio'` — Edge Functions override to `'system'` by setting a session variable before writes: `SET LOCAL app.actor = 'system'`
- Trigger reads: `current_setting('app.actor', true)` — falls back to `'admin_studio'` if not set

---

## 7. Edge Functions Inventory

| Function | Trigger | Inputs | Outputs | Side Effects | Cron? |
|---|---|---|---|---|---|
| `get-available-slots` | API call from booking wizard | `call_type_id`, `date_from`, `date_to`, `visitor_timezone` | Array of `{slot_start, slot_end}` in UTC | None (read-only) | No |
| `create-booking` | API call from booking wizard | Lead info (name, email, phone, company), `call_type_id`, `slot_start`, `timezone`, UTM params | Booking confirmation + token URLs | Upserts lead, creates booking, sends confirmation email via Brevo + admin alert to Workspace inbox, logs to communication_log | No |
| `confirm-booking` | API call from `/book/confirm/[token]` | `confirmation_token` | Success/error status | Updates booking status → confirmed, logs to communication_log | No |
| `cancel-booking` | API call from `/book/cancel/[token]` | `cancel_token`, optional `cancel_reason` | Success/error status | Updates booking status → cancelled, sends cancellation emails via Brevo, logs to communication_log | No |
| `reschedule-booking` | API call from `/book/reschedule/[token]` | `reschedule_token`, new `slot_start`, `timezone` | New booking confirmation | Cancels old booking, creates new booking with reference to original, sends reschedule emails via Brevo, logs | No |
| `submit-contact` | API call from contact form | Form fields + honeypot | Success/error | Inserts contact_submission, sends confirmation + admin alert emails via Brevo (admin alert → Workspace inbox), logs | No |
| `send-reminder` | Scheduled cron | None (queries DB) | None | Finds bookings 24h away with status=scheduled/confirmed, sends reminder emails via Brevo, logs | **Yes — every 15 min** |
| `mark-no-shows` | Scheduled cron | None (queries DB) | None | Finds bookings where slot_end + 30min < now() AND status=scheduled, sets status=no_show, expires tokens | **Yes — every 30 min** |

**Edge Function Header Convention** — every function file starts with:
```ts
/**
 * Purpose: [one-line description]
 * Trigger: [HTTP POST / Cron / Webhook]
 * Inputs:  [list params]
 * Outputs: [response shape]
 * Side effects: [DB writes, emails sent via Brevo, logs created]
 * Secrets: [SMTP_*, etc.]
 */
```

---

## 8. Security Model

### 8.1 RLS Strategy

- **All tables**: RLS enabled, no default policies (= deny all for anon)
- **Published content tables** (`services`, `case_studies`, `blog_posts`, `call_types`): narrow SELECT policies for anon — only rows matching `status='published'` or `active=true`
- **All other tables** (`leads`, `call_bookings`, `contact_submissions`, `communication_log`, `audit_log`, `availability_*`, `rate_limits`, `site_settings`): zero anon policies = complete deny
- **Edge Functions**: use `service_role` key which bypasses RLS entirely
- **Next.js Server Components**: use `service_role` key server-side for unrestricted reads; never expose to client

### 8.2 Turnstile

- Cloudflare Turnstile widget on: contact form, booking wizard (step 3 — info entry)
- Client sends Turnstile token with form submission
- Edge Function verifies token via `POST https://challenges.cloudflare.com/turnstile/v0/siteverify` with `TURNSTILE_SECRET_KEY`
- Reject if verification fails before any DB write

### 8.3 Honeypot

- Hidden field (e.g. `website_url`) on all forms, visually hidden via CSS (`position: absolute; left: -9999px`)
- Edge Function rejects submission silently if honeypot field is filled (returns 200 to avoid tipping off bots)

### 8.3 Rate Limiting

Using the `rate_limits` table in Supabase:

1. Edge Function receives request with IP from headers (`x-forwarded-for` or `cf-connecting-ip`)
2. Query `rate_limits` for `(ip, endpoint)` — if `request_count >= threshold` AND `window_start > now() - interval`, reject with 429
3. Otherwise, upsert: increment count or reset window
4. Thresholds: contact form = 5/hour, booking creation = 3/hour, slot queries = 30/hour
5. Periodic cleanup: cron or inline `DELETE FROM rate_limits WHERE window_start < now() - interval '24 hours'`

### 8.4 Token Security

- Generated via `crypto.randomBytes(24).toString('hex')` → 48-char hex string
- Stored hashed? **No** — tokens are random and non-guessable; storing plain is acceptable for this scale. If paranoia is desired, store SHA-256 hash and compare on lookup
- Single-use: confirmation token consumed on first use (status changes); reschedule/cancel tokens consumed on use
- Auto-expired: `mark-no-shows` cron sets `tokens_expired = true` on past bookings
- Token lookup: indexed columns for fast retrieval

### 8.5 Secret Management

| Secret | Stored In | Used By |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel env vars | Next.js server components/API routes |
| `SMTP_HOST/PORT/USER/PASS` | Supabase secrets | Edge Functions only (Brevo) |
| `SMTP_FROM_EMAIL/NAME/REPLY_TO` | Supabase secrets | Edge Functions only |
| `ADMIN_EMAIL` | Supabase secrets | Edge Functions only (delivers to Workspace inbox) |
| `REVALIDATE_SECRET` | Vercel env vars + Supabase webhook config | Next.js `/api/revalidate` + Supabase webhooks |
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel env vars | Public (safe) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel env vars | Public (safe — RLS denies all) |

**Rule**: Any key prefixed `NEXT_PUBLIC_` is safe to expose. All others are server-only and must never appear in client bundles.

### 8.6 Email Authentication

All outbound mail from `zanderservices.org` (both Brevo-sent transactional and Workspace-sent personal) must pass SPF, DKIM, and DMARC. See §3.3.1 for exact DNS records. Verification procedure must be run before production launch — failed auth = confirmation emails land in spam = silently missed bookings.

---

## 9. Admin-via-Studio Playbook

### 9.1 Daily Workflow

The consultant opens Supabase Studio and uses these tables:

| Task | Table | Action |
|---|---|---|
| Check today's calls | `call_bookings` | Filter: `slot_start` = today, `status` IN (scheduled, confirmed) |
| Review new leads | `leads` | Filter: `status` = 'new', sort by `created_at` DESC |
| Check new contact submissions | `contact_submissions` | Filter: `promoted_to_lead_id` IS NULL, sort by `created_at` DESC |
| Update lead status | `leads` | Edit row: change `status`, add `notes` |
| Mark call completed | `call_bookings` | Edit row: set `status` = 'completed', add `outcome_notes` |
| Mark no-show (manual) | `call_bookings` | Edit row: set `status` = 'no_show' |
| Promote contact to lead | Create new row in `leads`, copy info, update `contact_submissions.promoted_to_lead_id` |
| Manage availability | `availability_rules` / `availability_exceptions` | Add/edit rules or block dates |
| Publish content | `services`/`case_studies`/`blog_posts` | Set `status` = 'published', set `published_at` |
| Update global settings | `site_settings` | Edit `value` column (e.g., change default_meeting_link) |

### 9.2 Saved SQL Snippets

Pin these in Supabase Studio SQL Editor for quick access:

**Today's Calls**
```sql
SELECT cb.slot_start, cb.slot_end, cb.status, cb.meeting_link,
       l.name, l.email, l.company, ct.name as call_type
FROM call_bookings cb
JOIN leads l ON l.id = cb.lead_id
JOIN call_types ct ON ct.id = cb.call_type_id
WHERE cb.slot_start::date = CURRENT_DATE
  AND cb.status IN ('scheduled', 'confirmed')
ORDER BY cb.slot_start;
```

**This Week's Upcoming Bookings**
```sql
SELECT cb.slot_start, cb.status, l.name, l.email, l.company, ct.name as call_type
FROM call_bookings cb
JOIN leads l ON l.id = cb.lead_id
JOIN call_types ct ON ct.id = cb.call_type_id
WHERE cb.slot_start BETWEEN now() AND now() + interval '7 days'
  AND cb.status IN ('scheduled', 'confirmed')
ORDER BY cb.slot_start;
```

**New Leads This Week**
```sql
SELECT name, email, company, source, status, created_at
FROM leads
WHERE created_at > now() - interval '7 days'
ORDER BY created_at DESC;
```

**Unreviewed Contact Submissions**
```sql
SELECT name, email, company, message, created_at
FROM contact_submissions
WHERE promoted_to_lead_id IS NULL
ORDER BY created_at DESC;
```

**Lead Pipeline Summary**
```sql
SELECT status, count(*) as total
FROM leads
GROUP BY status
ORDER BY array_position(ARRAY['new','contacted','qualified','proposal','won','lost']::lead_status[], status);
```

**Recent Audit Trail**
```sql
SELECT entity, action, actor, created_at,
       after_data->>'status' as new_status,
       before_data->>'status' as old_status
FROM audit_log
WHERE created_at > now() - interval '7 days'
ORDER BY created_at DESC
LIMIT 50;
```

**Email Send Failures (last 7 days)** — deliverability health check
```sql
SELECT created_at, subject, metadata
FROM communication_log
WHERE type = 'email'
  AND direction = 'outbound'
  AND metadata->>'status' = 'failed'
  AND created_at > now() - interval '7 days'
ORDER BY created_at DESC;
```

### 9.3 Calendar Sync (Manual)

1. Booking confirmation email includes `.ics` file as attachment
2. Consultant opens email in Google Workspace Gmail → Gmail auto-detects the `.ics` and offers an "Add to Calendar" button that drops the event directly into Google Calendar
3. Manual calendar sync is one click in the Workspace Gmail interface — no Google Calendar API integration required for Phase 1
4. Future phase: Google Calendar API two-way sync (see §12) — with Workspace already in place, OAuth scope and API enablement when we build this is simpler than a greenfield setup

---

## 10. Documentation Structure

### 10.1 README.md Outline

```
# NordWacht — AI Implementation Consultancy Website

## What is this?
Lead-gen site for Zander Services. Primary conversion: booking a discovery call.

## Stack & Rationale
- Next.js 15 (App Router) — SSR/SSG, React Server Components
- Supabase — Postgres, Edge Functions, Storage (no Auth)
- Vercel — hosting via GitHub OAuth
- Cloudflare — DNS, DDoS
- Brevo — transactional email (300/day free)
- Google Workspace — inbox + replies for alexander.dodson@zanderservices.org
- Why each piece was chosen (link to docs/decisions/)

## Quick Start
1. Clone repo
2. Copy .env.example → .env, fill values
3. npx supabase start (local Supabase)
4. npx supabase db reset (run migrations + seed)
5. npm install && npm run dev

## Directory Map
(abbreviated tree with descriptions)

## Scripts
- npm run dev — local dev server (Turbopack)
- npm run build — production build
- npm run lint — ESLint
- npm test — Vitest
- npm run test:e2e — Playwright
- npx supabase functions serve — local Edge Functions

## Deploy
- Push to main → Vercel auto-deploys
- supabase db push — apply migrations
- supabase functions deploy — deploy Edge Functions

## Contributing
See AGENTS.md for architectural constraints and conventions.
```

### 10.2 AGENTS.md Outline

```
# AGENTS.md — Rules of Engagement for AI Agents & Contributors
Last reviewed: [date — must be updated in the same PR as any schema migration]

## Architectural Constraints (MUST NOT be violated)
1. NO authentication system — no public signup, no client login, no admin login
2. ALL tables: deny-all RLS for anon key. ALL writes via Edge Functions with service_role
3. NO new third-party accounts without explicit approval
4. Admin workflows happen in Supabase Studio ONLY — no admin UI
5. ALL public form writes go through Edge Functions — never direct DB inserts from client
6. Transactional email sends via Brevo SMTP ONLY (not Workspace SMTP, not Gmail SMTP)
7. Reply-To on all outbound mail = alexander.dodson@zanderservices.org (Workspace inbox)

## Naming Conventions
- Tables: snake_case plural (e.g. blog_posts)
- Columns: snake_case (e.g. slot_start)
- Edge Functions: kebab-case directories (e.g. create-booking/)
- Components: kebab-case filenames (repo convention — e.g. booking-wizard.tsx)
- Pages: kebab-case directories matching URL slugs

## How to Add a New Edge Function
1. Create supabase/functions/<name>/index.ts with header comment
2. Add to docs/edge-functions.md
3. Set any new secrets via supabase secrets set
4. Test locally: supabase functions serve <name>
5. Deploy: supabase functions deploy <name>

## How to Add a New CMS Entity
1. Create migration in supabase/migrations/
2. Add COMMENT ON for table and columns
3. Enable RLS, add anon SELECT policy for published content
4. Add to lib/supabase/queries/
5. Create listing + detail pages in app/
6. Update docs/schema.md
7. Add seed data to supabase/seed.sql
8. Configure Supabase database webhook → /api/revalidate for on-demand cache refresh

## How to Add a New Email Template
1. Add template function to lib/email/templates.ts
2. Document in docs/email-templates.md
3. Ensure Edge Function logs to communication_log after sending
4. From address: SMTP_FROM_EMAIL env var (alexander.dodson@zanderservices.org)
5. Reply-To address: SMTP_REPLY_TO env var (same — lands in Workspace inbox)

## How to Add a New Email Sender (Future)
If a new service needs to send mail from the domain (e.g., Mailchimp for newsletter):
1. Add its DKIM record with a UNIQUE selector (e.g., mailchimp._domainkey)
   — DO NOT overwrite google._domainkey or mail._domainkey
2. Update the single SPF record to add the new include (e.g., include:servers.mcsv.net)
   — DO NOT add a second SPF record
3. DMARC policy already covers any authorized sender — no change needed
4. Document the addition in docs/decisions/

## Scheduling Math
- All times stored UTC in DB
- Availability rules defined in America/Chicago timezone
- Slot generation: rules - exceptions - existing bookings - buffers
- Display to visitor in their detected timezone (Intl.DateTimeFormat)
- Buffer = buffer_before + buffer_after wrapping each booking
- Minimum lead time: 2 hours (filter out slots < now + 2h)
- Booking window: 30 days rolling

## Branding Guide Reference
See §2 of IMPLEMENTATION_PLAN.md (to be extracted to docs/branding.md)

## Testing Expectations
- Vitest: unit tests for slot computation logic, email template rendering, token generation
- Playwright: E2E smoke tests for booking flow, contact form submission
- Both run in GitHub Actions CI on every PR
- Integration tests for Edge Functions: mock Brevo SMTP

## CI Guard
If any migration file in supabase/migrations/ is newer than AGENTS.md "last reviewed" date,
CI must fail the PR. This keeps agent documentation in lockstep with schema changes.
```

### 10.3 docs/ Folder

| File | Contents |
|---|---|
| `docs/schema.md` | Auto-generated table documentation (from `COMMENT ON` annotations). One section per table: purpose, columns, relationships, RLS policies, indexes |
| `docs/edge-functions.md` | One entry per function: name, purpose, trigger, HTTP method, inputs (with types), outputs (with types), side effects, secrets used, cron schedule if applicable |
| `docs/email-templates.md` | One entry per template: name, trigger, recipient, subject line, body structure, variables injected |
| `docs/decisions/001-no-auth.md` | Why no authentication: single consultant, Supabase Studio suffices, attack surface reduction |
| `docs/decisions/002-custom-scheduling.md` | Why build custom instead of Cal.com: portfolio piece, account minimization, full control |
| `docs/decisions/003-smtp-via-edge-function.md` | Why raw SMTP in Edge Functions vs. Resend/Postmark: cost, account count, simplicity |
| `docs/decisions/004-studio-admin.md` | Why no admin UI: single user, Supabase Studio is sufficient, avoids auth complexity |
| `docs/decisions/005-workspace-plus-brevo.md` | Why Google Workspace for inbox + Brevo for transactional: Workspace SMTP requires IP allowlisting (breaks with Supabase Edge Functions' dynamic IPs) or OAuth2 (refresh token complexity); Brevo handles programmatic sends cleanly while Workspace handles the mailbox the consultant actually checks. Both authenticated via separate DKIM selectors under shared SPF record |

### 10.4 Inline Code Conventions

- Every Edge Function file: header comment (purpose, trigger, inputs, outputs, side effects, secrets)
- Every table: `COMMENT ON TABLE` and `COMMENT ON COLUMN` in migration SQL
- Every non-trivial migration: comment block explaining the change and rationale
- Every component: brief JSDoc comment if purpose isn't obvious from the name

### 10.5 /llms.txt and /llms-full.txt

These are **public-facing files** for generative-engine crawlers (distinct from AGENTS.md which is for code contributors):

- `/llms.txt`: Concise summary — what Zander Services does, service offerings, contact info, location
- `/llms-full.txt`: Full detail — all services with descriptions, case study summaries, blog post summaries, FAQs, pricing tiers, booking link

Both served via Next.js route handlers (`app/llms.txt/route.ts`) pulling from Supabase CMS tables.

---

## 11. SEO / GEO Checklist

### 11.1 Technical SEO

| Item | Implementation |
|---|---|
| SSR/SSG | All public pages server-rendered via RSC or `generateStaticParams` for slug pages |
| `/sitemap.xml` | `app/sitemap.ts` — auto-generated from `services`, `case_studies`, `blog_posts` tables + static pages |
| `/robots.txt` | `app/robots.ts` — allow all crawlers, disallow `/api/`, `/book/confirm/`, `/book/cancel/`, `/book/reschedule/` |
| `/rss.xml` | `app/rss.xml/route.ts` — blog posts feed |
| Canonical URLs | Set via `metadata.alternates.canonical` on every page |
| Meta titles | Unique per page, 50-60 chars, keyword-front-loaded |
| Meta descriptions | Unique per page, 150-160 chars, action-oriented |
| Heading hierarchy | Single `<h1>` per page, proper `<h2>`-`<h6>` nesting |
| Image optimization | Next.js `<Image>` with `alt` text, AVIF/WebP, lazy loading, explicit `width`/`height` |
| Core Web Vitals | Target green on all metrics: LCP < 2.5s, FID < 100ms, CLS < 0.1 |

### 11.2 Structured Data (JSON-LD)

| Page | Schema Types |
|---|---|
| Home | `Organization`, `WebSite`, `FAQ` |
| Services listing | `BreadcrumbList` |
| Service detail | `Service`, `BreadcrumbList` |
| Case study detail | `Article`, `BreadcrumbList` |
| Blog listing | `BreadcrumbList` |
| Blog post | `Article`, `BreadcrumbList` |
| About | `Organization`, `BreadcrumbList` |
| Contact | `ContactPage`, `BreadcrumbList` |
| Book | `BreadcrumbList` |

Implement via reusable `<JsonLd>` component in `components/seo/json-ld.tsx`.

### 11.3 Open Graph & Twitter Cards

Every page sets via Next.js `metadata` export:
- `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- `twitter:card` (summary_large_image), `twitter:title`, `twitter:description`, `twitter:image`
- Dynamic OG images for blog posts (use `og_image_url` from DB or generate via `next/og`)

### 11.4 GEO (Generative Engine Optimization)

| Item | Implementation |
|---|---|
| `/llms.txt` | Concise machine-readable summary of the business, services, and contact info |
| `/llms-full.txt` | Extended version with all content, FAQs, pricing, case study summaries |
| Structured content | Clear heading hierarchy, FAQ sections with `<details>`/`<summary>` or JSON-LD FAQ |
| Entity consistency | Same business name, address, phone, email across all pages and structured data |
| Topical authority | Blog posts targeting AI implementation topics, interlinked with service pages |

### 11.5 Local SEO

| Item | Implementation |
|---|---|
| NAP consistency | Name, Address, Phone consistent across site and structured data |
| Houston geo-targeting | Location badges, neighborhood service areas in footer, local keywords |
| Schema `areaServed` | Include Houston metro area in Organization JSON-LD |

---

## 12. Phase 1 vs. Deferred

### Phase 1 (This Implementation)

- [x] Supabase project setup, schema migration, RLS, triggers
- [x] Edge Functions: all 8 listed in §7
- [x] Booking wizard (`/book` multi-step flow)
- [x] Token-based confirm/reschedule/cancel pages
- [x] Contact form with honeypot
- [x] CMS tables + content pages (services, case studies, blog)
- [x] About, privacy, terms pages
- [x] Email flow (Brevo SMTP via Edge Functions; Workspace handles inbound/replies)
- [x] DNS setup: MX (Workspace), combined SPF (Workspace + Brevo), dual DKIM, DMARC
- [x] Admin playbook with SQL snippets
- [x] SEO/GEO implementation (sitemap, robots, RSS, JSON-LD, llms.txt)
- [x] README.md, AGENTS.md, docs/ structure
- [x] GitHub Actions CI (lint, typecheck, Vitest, Playwright)
- [x] Vercel deploy pipeline
- [x] Cloudflare DNS setup
- [x] On-demand revalidation via Supabase webhook → `/api/revalidate`

### Deferred — Future Phases

| Feature | Phase | Notes |
|---|---|---|
| **Stripe integration** | 2 | Deposits for paid consultations, productized service packages. Data model already supports `price_display` on `call_types`; add `stripe_price_id` column and payment_status to bookings |
| **Google Calendar two-way sync** | 2 | OAuth2 integration, webhook for calendar changes. With Google Workspace already in place, API enablement is straightforward. Current `.ics` attachment + Gmail's "Add to Calendar" button is sufficient for phase 1 |
| **Daily digest email** | 1.5 | Email sent nightly summarizing bookings + leads from last 24h. Safety net for detecting silent SMTP failures — if digest stops arriving, something is broken |
| **Admin dashboard UI** | 3 | If Studio becomes cumbersome. Would require auth (NextAuth + Supabase Auth). Build on `/admin/*` routes with role-based access |
| **Client portal** | 3+ | Authenticated area for clients to view project status, documents, invoices. Requires full auth system |
| **Supabase Realtime** | 2 | Live slot updates during booking (show when a slot gets taken by another visitor). Nice-to-have for high-traffic periods |
| **Email marketing** | 2 | Newsletter signup, drip campaigns. Would likely bring in a dedicated email service (Mailchimp, Loops, etc.). When added, follow AGENTS.md "How to Add a New Email Sender" — unique DKIM selector, update shared SPF record |
| **Analytics dashboard** | 2 | Conversion funnel visualization, lead source tracking. Could use Supabase + a charting library, or integrate PostHog/Plausible |
| **Multi-language** | 3+ | i18n support if expanding beyond English-speaking markets |
| **Online payments** | 2 | Stripe Checkout for paid discovery calls or implementation deposits |

---

## 13. Resolved Decisions

All open questions have been answered. Decisions are recorded here and propagated into the relevant plan sections above.

| # | Question | Decision |
|---|---|---|
| 1 | SMTP Provider | **Brevo free tier** (300 emails/day) for OUTBOUND transactional only. SMTP creds in env vars. No Supabase built-in SMTP, no Gmail/Workspace SMTP (dynamic IPs + OAuth2 complexity) |
| 2 | Meeting Links | **Static personal URL** from `site_settings` table (§4.5). Per-row override in Studio. Auto-generated Zoom/Meet links deferred |
| 3 | Booking Lead Time | **2 hours minimum** |
| 4 | Booking Window | **30-day rolling window** |
| 5 | Availability | **24/7** — all day, every day. Only blocked by existing bookings + manual exceptions |
| 6 | Contact Form Fields | **Name, email, phone, company, message** — confirmed as-is |
| 7 | Blog Format | **Plain Markdown** rendered via `react-markdown` + `remark-gfm` + `rehype-sanitize` |
| 8 | Image Storage | **Supabase Storage** — `public-media` bucket (public-read). Images optimized before upload (≤150KB covers, ≤30KB icons, WebP). Naming: `<entity>-<slug>-<variant>.<ext>`. No runtime images in `/public/` |
| 9 | Domain Email | **alexander.dodson@zanderservices.org** hosted on **Google Workspace** (pre-existing). SPF/DKIM/DMARC configured per §3.3.1 |
| 10 | Revalidation | **On-demand** via Supabase database webhook → `POST /api/revalidate` with hourly ISR fallback |
| 11 | Toast Library | **Sonner**, `position="top-left"` |
| 12 | Testing | **Vitest** (unit) + **Playwright** (E2E), both in GitHub Actions CI |
| 13 | Domain email hosting | **Google Workspace** (pre-existing). Receives mail via MX to Google; sends transactional via Brevo; sends personal mail via Gmail. Both services authenticated via separate DKIM selectors (`google._domainkey` and `mail._domainkey`), combined SPF include, single DMARC policy. Workspace SMTP NOT used for transactional (dynamic IPs in Edge Functions + OAuth2 complexity) |

### Accounts Required (6 total)

1. **GitHub** — existing (source control, CI, OAuth for Vercel/Supabase)
2. **Google Workspace** — existing, already paying (inbox, replies, personal mail for zanderservices.org)
3. **Supabase** — new, free (DB, Edge Functions, Storage)
4. **Vercel** — new, free, OAuth via GitHub (hosting)
5. **Cloudflare** — new, free (DNS, DDoS)
6. **Brevo** — new, free (transactional SMTP, 300/day)

Total new ongoing cost: $0 (domain renewal ~$10-15/yr if applicable).

### New Dependencies to Add (Phase 1)

```bash
# Runtime
npm install @supabase/supabase-js sonner react-markdown remark-gfm rehype-sanitize

# Dev
npm install -D vitest @playwright/test supabase
```

### Launch Checklist (Pre-Production)

1. [ ] All 6 accounts set up (order: GitHub → Supabase → Vercel → Cloudflare → Brevo; Workspace already exists)
2. [ ] DNS records added via Cloudflare: MX, combined SPF, google DKIM, brevo DKIM, DMARC (§3.3.1)
3. [ ] Existing SPF record checked — if Workspace SPF already exists, EDIT to add Brevo, don't add second record
4. [ ] Brevo sender domain verified (green checkmark in Brevo dashboard)
5. [ ] Test email from Brevo → Gmail: SPF/DKIM/DMARC all PASS
6. [ ] Test email from Workspace Gmail → Gmail: SPF/DKIM/DMARC all PASS
7. [ ] mail-tester.com score ≥ 9/10 for both senders
8. [ ] All Supabase migrations applied to production project
9. [ ] All Edge Functions deployed
10. [ ] All secrets set in Vercel env vars + Supabase secrets
11. [ ] Supabase database webhooks configured for `services`, `case_studies`, `blog_posts` → `/api/revalidate`
12. [ ] Seed data loaded: at least one call_type (Discovery Call), 7 availability_rules (24/7), site_settings (default_meeting_link)
13. [ ] Full booking flow tested end-to-end: book → receive confirmation → click confirm link → reschedule → cancel
14. [ ] Contact form tested with honeypot
15. [ ] Cron jobs verified firing: `send-reminder`, `mark-no-shows`
16. [ ] AGENTS.md "Last reviewed" date set to launch date

---

> **Next step**: Begin implementing Phase 1 in the order: DNS records → schema migration → Edge Functions → API routes → pages (booking first, then content, then static).