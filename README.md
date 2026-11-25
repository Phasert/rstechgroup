# RS Technology Group — Website

Next.js (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion · Firebase · Bun

> Status: **in development — not approved for deployment.** See `docs/IMPLEMENTATION_CHECKLIST.md`.

## Quick start

```bash
bun install          # creates bun.lock
cp .env.example .env.local
bun run dev          # http://localhost:3000
```

The site runs **without any credentials**: Firebase-backed sections (projects, articles) show
their empty states, and the quote form will report that submissions are not configured yet.

Other scripts: `bun run build`, `bun run lint`, `bun run typecheck`, `bun run admin:grant <email>`.

## Structure

```
src/app/                 routes, metadata, sitemap, robots, manifest, favicons
src/components/layout/   Header, Footer
src/components/home/     homepage sections
src/components/animations/  Hero canvas, network demo, website build demo (more to come)
src/components/ui/       Button, Reveal, SectionHeading, EmptyState, ServiceIcon
src/lib/                 site details, services, types, motion tokens, Firebase client/admin
public/brand/            logo variants derived from the original logo
firestore.rules, storage.rules, firestore.indexes.json, firebase.json
scripts/grant-admin.ts   grant/revoke admin custom claim
```

## Brand

Colours were sampled from the original logo: navy **#021D52** and charcoal **#1F1F1F**.
The brief's RS blue **#1671D9** is used as the interactive accent; deep navy and light grey as surfaces.
Headings use Manrope, body text Inter. Eyebrow labels use wide letter-spacing to echo the logo wordmark.

Logo files in `public/brand/` were generated from the 1254×1254 PNG supplied. **Replace them with the
original vector (SVG/AI/EPS) when available** — the favicons in `src/app/` should then be regenerated.

## Animation approach

| Scene | Technique | Why |
| --- | --- | --- |
| Hero network | Canvas 2D | Dozens of moving elements at 60 fps; no WebGL cost |
| Network demo | SVG + Motion `useScroll` | Crisp, accessible device buttons and scroll-linked paths |
| Website build | DOM + Motion layout animations | Real layout morphing between desktop and mobile |

Three.js and GSAP were deliberately **not** added: every scene so far is lighter and more accessible
in Canvas/SVG/Motion. They will be added only if a later scene genuinely needs them.
All scenes respect `prefers-reduced-motion`, pause offscreen, and the hero is loaded client-side after the text.

---

## Manual setup you must complete

### 1. Firebase project
1. Go to https://console.firebase.google.com → **Add project** (e.g. `rs-technology-group`).
2. **Project settings → Your apps → Web app** → register. Copy the config values into the
   `NEXT_PUBLIC_FIREBASE_*` variables in `.env.local`.

### 2. Authentication
**Build → Authentication → Get started → Sign-in method → Email/Password → Enable.**
Add yourself under **Users → Add user**. Public sign-up is not used.

### 3. Firestore
**Build → Firestore Database → Create database** (production mode, region close to T&T, e.g. `us-east1`).

### 4. Storage
**Build → Storage → Get started** (same region).

### 5. Deploy rules and indexes
```bash
bun x firebase-tools login
bun x firebase-tools use --add          # pick your project
bun x firebase-tools deploy --only firestore:rules,firestore:indexes,storage
```

### 6. Admin SDK credentials (server only)
**Project settings → Service accounts → Generate new private key.** Copy `project_id`,
`client_email` and `private_key` into `FIREBASE_ADMIN_*` in `.env.local`. Never commit the JSON file.

### 7. Authorise administrators
After the user exists in Authentication:
```bash
bun run admin:grant you@example.com
```
This sets the `admin: true` custom claim the security rules check. Revoke with `--revoke`.

### 8. App Check (recommended)
**Build → App Check →** register the web app with **reCAPTCHA Enterprise**, put the site key in
`NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY`, then enforce for Firestore and Storage once verified.

### 9. SMTP
Fill `SMTP_*`. For Gmail (`rstechgroup25@gmail.com`): enable 2-Step Verification, create an
**App password** (Google Account → Security → App passwords), and use
`SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_SECURE=true`. A business domain mailbox or a
transactional provider (Brevo, Postmark, SES) is recommended for production deliverability.

### 10. Logo and media
Put the original vector logo in `public/brand/`, and real project photography into the admin
dashboard once it is built. Do not use stock photos presented as completed work.

### 11. Custom domain and deployment (only after approval)
Recommended: **Vercel** (native Next.js) or **Firebase App Hosting**. Add every variable from
`.env.local` to the host's environment settings, set `NEXT_PUBLIC_SITE_URL` to the final domain,
then point DNS (A/CNAME records) as the host instructs. Add the domain to
**Authentication → Settings → Authorized domains**.
