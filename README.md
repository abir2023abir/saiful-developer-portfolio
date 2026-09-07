# Saiful Islam — Portfolio

A full-stack developer portfolio with an admin panel behind it. Orange hero with a cut-out
portrait breaking across a ghosted wordmark, an Apple-style `hello` entrance, animated
project cards, per-project case studies, and a contact form whose messages land in the admin.

Ten projects, eight with real screenshots. Full metadata, OG cards, sitemap, robots and
JSON-LD. Audited to WCAG AA.

**Live:** https://saiful-developer-portfolio.vercel.app
**Repo:** https://github.com/abir2023abir/saiful-developer-portfolio

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
Framer Motion · Lenis · sharp

Deployed from `main` — every push to that branch ships.

## Run it

```bash
npm install
npm run dev
```

http://localhost:3200 for the site, http://localhost:3200/admin for the panel.

## Admin panel

Credentials live in `.env.local`, which is gitignored — the password is stored as a scrypt
hash, never in plain text, and the session is an HMAC-signed httpOnly cookie.

To change the password:

```bash
node scripts/hash-password.js "your new password"
```

Paste the printed line over `ADMIN_PASSWORD_HASH` in `.env.local` and restart the dev server.
`ADMIN_USER` and `AUTH_SECRET` sit in the same file; `.env.example` documents all three.

From the panel you can edit everything the public site shows:

| Page | What it controls |
| --- | --- |
| **Projects** | Add, edit, reorder and delete projects — title, slug, category, year, summary, stack, preview image (upload or path), live and repo links, the problem/approach/result case study, and which one is featured in the hero. |
| **Site & profile** | Name, role, email, location, hero tagline, about heading and paragraph, the tech marquee, and the Upwork, GitHub and LinkedIn links. Also the two stat cards and the testimonial. |
| **Services** | The six service rows, add and remove. |
| **Messages** | Everything sent through the contact form, with read/unread and delete. |

Saving writes `content/site.json` and revalidates the site, so changes are live immediately.

## Where things live

| Path | What it is |
| --- | --- |
| `content/site.json` | The live content. The admin panel writes it; `src/lib/seed.ts` is the fallback. |
| `src/lib/content.ts` | Read/write/update over that file. |
| `src/lib/auth.ts` | scrypt password check and the signed session cookie. |
| `src/app/admin/actions.ts` | Every server action. Each one calls `requireAdmin()` first. |
| `src/components/Preloader.tsx` | The 0→100 counter and the cursive `hello`, drawn with `pathLength` + `strokeDashoffset`. |
| `src/components/ProjectCard.tsx` | The tilt, sheen and lift on the project cards. |
| `src/app/globals.css` | Brand tokens, the `.display` type style, the grid overlay. |

## The portrait

`public/images/hero-portrait.png` is a transparent cut-out generated from the studio JPEG
(`herosectionperson.png`), which has a flat orange background and a wordmark baked into it.

`scripts/key-portrait.js` does the work in five passes, and each one exists because the
pass before it was not enough:

1. **Key off a blurred copy.** The source is 4:2:0 JPEG, so its chroma is half-resolution and
   decodes in 8px blocks. Keying the sharp pixels stair-steps every hair edge.
2. **Soften then re-sharpen the alpha,** so the edge keeps its bite without the blocks.
3. **Flood the background inward from the border.** Interior soft spots — the lit ear, the
   jaw, the neck — are unreachable from outside, so they can never be keyed out.
4. **Keep only the largest connected component.** Neither a level threshold nor a high-pass
   can tell the ghosted wordmark from a fine hair strand; both are faint. Attachment can:
   every real strand connects to the subject, the residue does not.
5. **Fill enclosed holes, then despill.** A rim lit to the same orange as the background —
   the top of the ear — punches a hole clean through; anything enclosed by the subject is
   solid by definition. The despill removes the orange the background contributed to each
   semi-transparent strand, which is what otherwise leaves a dark fringe.

If you swap the photo, re-run the script and **inspect the result at 1:1 over the brand
orange** before accepting it. Thumbnails hide exactly the defects that matter. Shoot on a
flat, evenly-lit background with no shadow behind the head, 2000px+ on the long edge.

## Deploying

Content is read and written through `src/lib/storage.ts`, which picks a backend from env:

| `STORAGE` | Where content and uploads live | Use it for |
| --- | --- | --- |
| `fs` (default) | `./content` and `./public/projects` | local dev, a VPS, anything with a writable disk |
| `blob` | Vercel Blob, via `BLOB_READ_WRITE_TOKEN` | Vercel and other serverless hosts, whose filesystem is read-only at runtime |

`NEXT_PUBLIC_SITE_URL` is optional on Vercel — `src/lib/site-url.ts` falls back to the
platform's own production URL — but set it once a custom domain is attached.

**The three admin variables are not in the repo and do not deploy with it.** Until
`ADMIN_USER`, `ADMIN_PASSWORD_HASH` and `AUTH_SECRET` are set in the host's environment,
the sign-in form will simply reject every attempt. `.env.example` lists them.

Saving from the admin panel needs a writable store. On Vercel that means `STORAGE=blob`
plus `BLOB_READ_WRITE_TOKEN` from a Blob store; without it the filesystem adapter refuses
the write and the form says so rather than failing silently.

The Blob adapter is written and typed but has not been run against a live store — exercise
all three operations once before trusting it.

## Accessibility

Every colour pair in the design was measured against WCAG AA and the failures fixed:

- small secondary text bottoms out at `text-black/55` / `text-white/55` (4.66:1, 6.28:1)
- the greyed half of display headings is `text-black/45` (3.29:1, and it is ≥24px so 3:1 applies)
- brand orange as *small text* uses `--color-brand-ink` `#a52208` (6.69:1); the fill value
  only reaches 4.4:1
- the case-study header carries a scrim, because the gradient behind it is chosen in the
  admin panel and can be light — Luxe Lights is yellow
- focus rings are `:focus-visible` only, and there is a skip link

## Still to do

`ANTIGRAVITY_PROMPT.md` is the brief for the rest. The short version:

- Two of ten projects still need a screenshot (`english-capsules`, `medical-queue`), and
  Orbit's is its sign-in screen rather than the dashboard.
- Both stat figures and the whole testimonial are placeholders; the Upwork, GitHub and
  LinkedIn links point at bare domains; no project has a live or repo URL yet.
- Lighthouse has not been run, and the Blob storage path has not been exercised.
