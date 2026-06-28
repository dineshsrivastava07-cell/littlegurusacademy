# Little Gurus Academy — PRD

## Original Problem Statement
Build a warm, modern, professional marketing website for **Little Gurus Academy** — a 100% online learning academy combining **Preschool & Early Learning (ages 2–6)** and **After-School Tutoring (ages 5–10)**. Tagline: "Where little minds grow big." Primary CTAs: *Book a Free Tour* and *Enroll Now*. Brand: friendly, nurturing, playful but trustworthy. Conversion-first on every page.

## User Choices (confirmed)
- Academy type: Online-only, combined preschool + after-school tutoring (ages 2–10)
- Color theme: delegated to design agent → warm tangerine orange + sky blue + emerald + amber-cream
- Content: placeholder content, user-editable later
- Pages: full separate pages (Home, About, Programs, Admissions, Gallery, Contact)
- Form submissions: stored in MongoDB (simple, no email integration)
- Hosting target: GitHub repo `dineshsrivastava07-cell/littlegurusacademy`

## User Personas
1. **Parent of a 2–6 year old** — looking for safe, warm online preschool while juggling WFH.
2. **Parent of a 6–10 year old** — needs reliable after-school tutoring + homework help.
3. **Mobile-first visitor** — most parents browse from Instagram links on phones.

## Architecture (built)
**Backend** (`/app/backend/server.py` · FastAPI + Motor + MongoDB)
- `GET  /api/health`
- `POST /api/enquiries` · `GET /api/enquiries` (lead capture)
- `POST /api/contact` (contact form)
- `POST /api/newsletter` (idempotent email signup)

**Frontend** (`/app/frontend` · React + React Router v7 + Tailwind + shadcn/ui + framer-motion + sonner)
- `Layout` (Navbar + Footer + Outlet) wraps all routes
- Routes: `/`, `/about`, `/programs`, `/admissions`, `/gallery`, `/contact`
- Shared: `Navbar`, `Footer`, `EnquiryForm` (RHF + zod), `CountUp`, `Bits` (FadeIn / SectionLabel / Blob)
- Static placeholder content in `/app/frontend/src/lib/data.js`
- API client in `/app/frontend/src/lib/api.js`

## Design System (from design_agent_full_stack)
- Heading font: **Fredoka** · Body font: **Nunito** (loaded via Google Fonts in `index.css`)
- Palette: amber-50 cream backgrounds, white surfaces, orange-500 primary CTAs, sky/emerald/rose/amber pastel accents
- Rounded-[2rem] cards, soft shadows, 2px crisp borders, full-pill buttons
- Subtle entrance fade/slide animations + floating decorative blobs
- All interactive elements have `data-testid` attributes

## What's Been Implemented (Dec 2025, iteration 3)
- **Home** — sticky glassy navbar, asymmetric hero with floating credibility cards, trust strip, "Why Little Gurus" bento cards, programs preview grid, "A Day at Little Gurus" timeline, animated stats counters, parents testimonial carousel, dark final CTA banner
- **About** — story split, mission/vision/philosophy trio, 4-teacher grid, safety pillars, CTA
- **Programs** — 4 alternating program sections (Tiny Tots / Early Learners / Primary Prep / After-School) with deep-link Enquire buttons
- **Admissions** — 3-step enrollment process, fees table, FAQ accordion (6 Qs), enquiry form with auto-pre-selected program from URL `?program=` and `#enquiry` smooth scroll
- **Gallery** — 9-image responsive grid + keyboard-navigable lightbox (←/→/Esc)
- **Contact** — info cards, social CTAs, embedded OpenStreetMap, validated contact form
- **Footer** — gradient CTA band, link columns, contact info, newsletter signup, social icons
- **SEO** — proper `<title>`, meta description, OG tags in `index.html`
- **Mobile menu** — full-overlay drawer with explicit height

## Testing Status
- Backend: 4/4 endpoints PASS (iteration 1)
- Frontend: all flows PASS (iteration 3) — enquiry submit, URL preselect, testimonials carousel, contact form, newsletter, mobile drawer, lightbox

## Prioritized Backlog
**P0 (next)**
- Replace placeholder team photos & testimonials with real ones
- Replace placeholder fee amounts and class timings
- Wire form submissions to email (Resend) so parents get auto-confirmations

**P1**
- Admin dashboard `/admin` to view enquiries / contact messages / newsletter subscribers
- Razorpay / Stripe integration for online payment of fees
- Blog or "Parent Resources" section for SEO

**P2**
- Multi-language (Hindi / English toggle)
- Free downloadable worksheets behind email gate
- WhatsApp click-to-chat floating bubble

## Next Tasks
- Get real content (teacher photos, bios, testimonials, exact fees) from founder
- Add email notification integration (Resend) for new enquiries
- Push to GitHub repo and set up CI for the marketing front-end
