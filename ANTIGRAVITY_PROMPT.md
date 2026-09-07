# Handoff brief — paste this into Antigravity IDE

> Everything below the rule is the prompt. Copy from there down.

---

You are continuing an existing, working project. **Do not scaffold a new app and do not
restyle what is there.** Read the code first, match its conventions, extend it.

## The project

`Saiful Islam Portfolio` — the portfolio site of **Saiful Islam, Full Stack Web Developer**.
It runs, builds clean, ships an admin panel, and passes a WCAG AA contrast audit.

- **Stack:** Next.js 16 (App Router, RSC) · React 19 · TypeScript strict · Tailwind CSS v4
  (CSS-first, there is no `tailwind.config.js`) · Framer Motion · Lenis · sharp
- **Dev:** `npm run dev` → http://localhost:3200
- **Verify with:** `npx tsc --noEmit` and `npm run build`. Both pass. Keep them passing.
- **Admin:** `/admin` — credentials in `.env.local`, never in code.

## What already works — do not rebuild

```
src/app/
  layout.tsx                     Fonts, metadata, JSON-LD Person, skip link, cursor, Lenis
  page.tsx                       Home: preloader, hero, marquee, impact, 4 projects, services
  about|work|services|contact/   A real page per nav item
  work/[slug]/page.tsx           Case study + generateStaticParams + generateMetadata
  work/[slug]/opengraph-image.tsx  Per-project OG card
  opengraph-image.tsx            Site OG card
  sitemap.ts robots.ts not-found.tsx
  admin/login/                   Sign-in (server action)
  admin/(protected)/             Overview, projects CRUD, site & profile, services, messages
  admin/actions.ts               Every server action; each calls requireAdmin() first
  api/contact/route.ts           Validated, rate-limited, honeypot; saves to the store
  api/upload/route.ts            Admin-only; sharp resizes to 1600px and re-encodes to JPEG
src/lib/
  types.ts seed.ts seed-projects.ts   Shape and shipped defaults
  content.ts messages.ts              Read/write over the storage adapter
  storage.ts                          fs | Vercel Blob, chosen by STORAGE env
  auth.ts                             scrypt check + HMAC-signed httpOnly session
  site-url.ts nav.ts
src/components/
  Preloader Hero Nav ProjectCard Magnetic Cursor Reveal SmoothScroll
  sections.tsx  ContactForm  PageShell  PageHeader  HomeShell
  admin/  ActionForm + Field primitives, ProjectForm, SiteForm, ServicesForm
scripts/
  key-portrait.js   Regenerates the transparent hero cut-out
  hash-password.js  Generates a new ADMIN_PASSWORD_HASH
```

## Design system — obey it

- **Colours** are Tailwind v4 theme tokens in `src/app/globals.css`.
  `--color-brand` `#d13a13` is the fill; `--color-brand-ink` `#a52208` is brand orange **as
  small text on a light ground** — the fill only reaches 4.4:1 and the ink value clears AA.
  Also `--color-ink`, `--color-paper`, `--color-smoke`. **Never hard-code a hex** outside
  `globals.css`, except each project's `tint` pair, which is user data.
- **Contrast is already audited.** The minimum safe values are `text-black/55` and
  `text-white/55` for small text, and `text-black/45` / `text-white/35` for display type
  (≥24px, where 3:1 applies). Do not reintroduce lighter greys for small text.
- **Type:** oversized headings use `.display`, sized in `vw`. Small labels use `.eyebrow`.
- **Motion:** scroll reveals go through `<Reveal>`. Easing `[0.22, 1, 0.36, 1]`, 0.8–1.2s.
  Everything respects `prefers-reduced-motion` — `SmoothScroll`, `Preloader` and `Cursor`
  already do, and anything new must.
- Sections alternate `bg-paper` → `bg-ink` → `bg-paper`.
- **Security rule:** a server action is a public endpoint. Every one starts with
  `await requireAdmin()`, and no `formData` value is trusted without validation.

## Tasks, in priority order

### 1. Deploy it

- Choose the host. On a VPS the default `STORAGE=fs` works as-is. On Vercel set
  `STORAGE=blob` and `BLOB_READ_WRITE_TOKEN` — the adapter in `src/lib/storage.ts` is
  written and typed but **has never been run against a real Blob store**. Exercise all three
  operations (read JSON, write JSON, upload an image) before declaring it done, and fix
  whatever the API actually returns.
- Set `NEXT_PUBLIC_SITE_URL` so metadata, sitemap and robots emit the real origin.
- Set `ADMIN_USER`, `ADMIN_PASSWORD_HASH` and `AUTH_SECRET` in the host's env.
- Optionally `RESEND_API_KEY` + `CONTACT_TO` to forward contact messages by email; they
  always land in the admin panel regardless.

### 2. The two projects with no screenshot

Eight of ten have one. `english-capsules` and `medical-queue` do not, and fall back to a
drawn gradient panel. Their source repos are sibling folders under `C:\Websites`.

- `LMS website` boots but renders an empty hero — find out why (Firebase config is the
  likely cause), then capture 1600×1000, save as `public/projects/english-capsules.jpg` at
  quality ~80 under 300 KB, and set `image` on that project.
- `Medical Appointment App/mobile` is Expo; `npm run web` serves it. Capture the patient
  booking screen or the live queue.
- `orbit.jpg` is currently the sign-in screen because local Supabase auth was not
  configured. If you can get it running, replace it with the projects table — that is the
  screen the case study talks about.
- The gradient fallback must keep working for any project with no image. Do not delete it.

### 3. Measure, then fix

- Run Lighthouse against the production build on `/`, `/work` and a case study. Report all
  four scores. The hero portrait is a 1664×1870 PNG and is the obvious LCP risk — if it
  costs you, generate an AVIF/WebP pair rather than reaching for `priority` again.
- Check the preloader against a cold cache on a throttled connection. It holds the page for
  ~3.3s; if that reads as slow rather than deliberate, shorten it or skip it on repeat
  visits with a `sessionStorage` flag.
- Test with a keyboard only, end to end, including the admin panel. The skip link and focus
  rings exist; confirm the tab order is sane and nothing traps focus.

### 4. Admin panel, second pass

- **Drag-and-drop ordering** for projects. Keep the ↑/↓ buttons as the keyboard-accessible
  path — do not simply delete them.
- **Draft flag** per project, so work in progress stays off the public site.
- **Delete unused uploads:** list files in the store that no project references and offer to
  remove them.
- **Change password from the UI**, writing a new hash and requiring the current password.
- **Confirm before destructive actions.** Deleting a project is currently one click.

### 5. Interaction polish

- **Page transitions** between routes that do not fight the preloader (home page only).
- **Case-study image gallery** — several of these projects deserve more than one screenshot.
- Consider a **prefers-reduced-data** path that skips the marquee animation and the sheen.

### 6. Content Saiful must supply — flag it, never invent it

Placeholders, marked `TODO` in `src/lib/seed.ts` and editable in the admin panel:

- Both stat cards. `10+ projects shipped` is defensible from the repos; `100% on-time
  delivery` is not verified.
- The testimonial — name, role and quote are all placeholder text.
- `upwork`, `github` and `linkedin` point at bare domains.
- Per-project `liveUrl` and `repoUrl` are empty, so the case-study sidebar shows no links.

If he has not given you real values, **leave them and say what is missing.** Do not invent a
client name, a quote, a rating, or a years-of-experience figure.

## Rules

- TypeScript strict. No `any`, no `!` to silence the compiler.
- Server Components by default; `"use client"` only where state, effects or Framer Motion
  require it.
- Comments explain *why*, and only where the reason is not obvious. Match the existing
  density — sparse.
- No UI library, no state manager, no CSS-in-JS runtime.
- **Do not touch `public/images/hero-portrait.png`.** The matte behind it is a chroma key
  with flood-fill, connected-component and hole-filling passes. If the photo changes, re-run
  `scripts/key-portrait.js` and inspect the result **at 1:1 over the brand orange** before
  accepting it — thumbnails hide exactly the defects that matter.
- Never commit `.env.local`. Never put a credential in source.
- After each task run `npx tsc --noEmit` and `npm run build`, and check the browser console.
  Report what you could not finish rather than stubbing it silently.
