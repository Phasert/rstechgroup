# Implementation checklist

Last updated: 24 Nov 2026 · Session 3 (design & motion pass)

## Session 3 — Distinct pages and flagship scenes ✅

### Repetition audit (before)
`WebsiteBuildDemo` ran on Home, Packages and Web Design · `NetworkDemo` on Home and Networking · `FinalCta` on Home,
Services and About · `WhyChoose` on Home and About · `ServiceCards` on Home and Services · About repeated the homepage
headline · all six service pages used one template (hero → covers → examples → FAQ → CTA → other services).

### After
- Both old demos deleted. `FinalCta`, `WhyChoose`, `ServiceCards` now appear on Home only.
- Shared scene engine: `src/components/scenes/useStepper.ts` (autoplay only in view, pauses offscreen, no autoplay and a
  result frame under reduced motion, replay/jump) + `SceneControls.tsx` (numbered steps, prev/next, play/pause, Replay,
  live caption) + `DemoBadge` labels on every illustrative scene.
- Heavy scenes are lazy-loaded (`scenes/lazy.tsx`, `next/dynamic`, `ssr:false`) with size-reserving, descriptive placeholders.

| Route | Composition and interaction |
| --- | --- |
| Home | Canvas hero kept · intro · service cards · **new** 3 still-frame previews linking to Networking, Web studio, Planner · why choose · projects · resources · final CTA. Full demos removed |
| /services | Need-led **ServiceExplorer** (8 customer problems → recommended service with mini animated preview, page link and quote link) + scannable numbered index of all six |
| /services/networking | **TechnicianScene** (flagship, layered SVG): drop → trace → swap with connector close-up → tester confirms and workstation reconnects. Two-bone IK arm, cable curve anchored to the hand so it flexes, seated cable stays in the port. Then **WifiCoverage** before/after floor plan, examples timeline, FAQ, dark CTA |
| /services/it-support | **Workbench**: tabs (Slow computer / Printer won't connect / New computer setup), arrow-key tabs, 4 clickable steps per case, Before/After toggle, bench illustration changes per step. Problem→fix rows, dark FAQ, split CTA |
| /services/website-development | **WebStudio**: brief/sketch → wireframe → visual design → finished demo site (fictional "Saltwater Bakery"), desktop/mobile switch, working nav + mobile menu + demo enquiry form ("nothing was sent"). Planner link card, example rows, light CTA |
| /services/social-media-setup | **SocialMakeover**: phone profile for a fictional florist, 4 stages (before, image & name, bio & contact, visual identity) + before/after summary |
| /services/google-business-profile | **ProfileDiscovery**: typed query → map pins → pin drop → profile card (hours, directions, call, photos) + completeness checklist. Labelled illustrative/fictional; explicit "no rankings promised" note |
| /services/technology-health-checks | **HealthWalkthrough**: Devices → Connectivity → Setup (scan, example finding, prioritised recommendation each) → ranked report |
| /packages | **PackagePlanner** replaces the reused demo and the six scope + three step cards: size, features, content, hosting, email, care → live site map, scope level (qualitative, no prices), summary, Copy summary, **Take this plan to a quote**. Mobile sticky scope bar |
| /quote | Reads planner params (whitelisted in `src/lib/planner.ts`), pre-fills project details and preselects website development, shows "From the planner" card. Form shows live progress (x of 7 details) and the selected service |
| /about | New copy; **ProcessStory** (Assess → Recommend → Implement → Verify): pinned illustration that changes as each stage scrolls into focus on desktop, inline illustrations on mobile, clickable stage rail. No service grid / why-choose / CTA band repeats |
| /contact | **ContactRoutes**: four channels with lines converging on RS that light up on hover/focus + short form |
| /work, /work/[slug] | Featured case + list when projects exist; case-study page (cover header, meta strip, numbered challenge/approach/result chapters, masonry photos, services, tech). Empty state shows a labelled layout preview. New optional fields: `result`, `location`, `serviceSlugs`, `completedOn` |
| /resources, /resources/[slug] | Editorial "RS Guide": lead story + numbered list; empty state shows topic shelves linking to service pages (no invented titles). Reading-progress bar on articles |

### Verification (session 3)
- `bun run typecheck` ✅ · `bun run lint` ✅ (0 problems) · `bun run build` ✅ (24 routes).
- Fixed during verification: React Compiler `refs` lint (scenes now own their ref), mobile step buttons stacking,
  technician cable following the hand after seating, old cable not removed, overlapping screen states, small tester,
  robe-like torso (foreground tool trolley added), mobile scene too small (4:3 crop on phones), avatar swap and blank
  report frames (`AnimatePresence mode="wait"` replaced by keyed crossfades).
- Browser (dev server on :3000). **The Browser pane was hidden all session, so animation frames only advanced when a
  screenshot was taken**; each scene was checked by jumping to a step and screenshotting before and after:
  - Technician scene, all four beats at 1440 and the swap close-up at 390 ✅
  - Workbench printer case Before→After at 390 ✅ · Web studio finished site at 1440; mobile menu → Order → empty submit error → demo success ✅
  - Social makeover final stage, Google profile stage 3, Health report at 390 ✅ · Service explorer at 1440 ✅ · About pinned stage tracking at 1440 ✅
  - **Package → quote:** planner choices → link carries plan → /quote preselects website development, pre-fills the plan, shows planner card, progress "3 of 7" ✅
  - **Service → quote:** crawler found all six `/quote?service=<slug>` links; 22 internal URLs, none 404 ✅
  - No horizontal overflow at 390 on /, /about, /packages, /services, /contact, /work, /resources, networking, web design ✅ · no console errors ✅
- **Not verified:** continuous real-time playback with the pane visible (smoothness, autoplay timing); reduced motion in a
  browser (pane can't emulate it — code paths set `reducedStart` result frames, zero-duration transitions, no SMIL packets);
  768px for the new pages; real touch devices; Wi-Fi coverage view and contact routes visually; Lighthouse/axe.

### Still pending
- Owner review of all new illustrative copy, the fictional sample businesses, and example findings.
- Admin dashboard, SMTP, attachments, App Check on `/api/quote` (unchanged from session 2).

## Phase 1 — Foundation ✅
- [x] Next.js App Router + TypeScript + Tailwind v4 config, ESLint, `.gitignore`, `.env.example`
- [x] Firebase client (with App Check hook) and Admin SDK modules (server-only)
- [x] Firestore rules, Storage rules, indexes, `firebase.json` (emulators configured)
- [x] TypeScript interfaces for all collections
- [x] `scripts/grant-admin.ts` for custom-claim admin access
- [x] Brand tokens from the logo; logo variants (light/dark, mark); favicon.ico, icon.png, apple-icon, PWA icons, manifest
- [x] `bun.lock` generated
- [x] Session 2: ESLint config moved to `eslint-config-next` 16's native flat config (FlatCompat crashed)
- [x] Session 2: Admin SDK runs against the Firestore emulator when `FIRESTORE_EMULATOR_HOST` is set (no credentials needed, `demo-` project)

## Phase 2 — Design system & homepage ✅
- [x] Header (animated active pill, mobile menu, Escape to close), Footer
- [x] Button (magnetic), Reveal, SectionHeading, EmptyState, **PageHero**, **DraftNotice** (session 2)
- [x] Cinematic hero (Canvas 2D, cursor parallax, reduced-motion static frame, offscreen pause)
- [x] Intro, six interactive service cards, scroll-driven network demo, Why choose, website-build showcase
- [x] Featured projects + resources preview from Firestore with honest empty states
- [x] Final CTA; 404 and error pages; metadata, OG/Twitter, JSON-LD, sitemap, robots
- [x] Session 2 polish: header uses RS mark + live-text wordmark (stacked logo was unreadable at 44px);
      desktop hero capped at `min(100svh − 72px − 7rem, 720px)` so the next section shows (~90px at 1440×800);
      entrance delays shortened (buttons visible by ~1.9s instead of ~2.9s); `light` button ring strengthened;
      subtitle now "IT support, Wi-Fi and networking, and website development for homes and businesses across Trinidad and Tobago."
- [x] Session 2: NetworkDemo reduced-motion path fixed (was a type error; links now drawn in full via the transform)

## Phase 3 — Interior pages ✅ (first pass)
- [x] /quote (service preselected from `?service=<slug>`), /contact (channels + same form, `source: contact-form`)
- [x] /services and all six detail pages (description, common problems, how we help, practical examples, benefits, FAQs,
      service-specific quote CTA, other services). Networking reuses NetworkDemo; website development reuses WebsiteBuildDemo
- [x] /packages: confirmed baseline + factors that shape scope + WebsiteBuildDemo + quote CTA. **No prices, package names,
      inclusions, hosting/maintenance fees or availability shown** (all unconfirmed)
- [x] /about: confirmed intro copy, service area, how we work, services. **Mission/vision/values not shown** (brief marks them proposed)
- [x] /work and /work/[slug], /resources and /resources/[slug] from Firestore (`status == published`) with empty states;
      article bodies rendered by a small escaped Markdown subset (headings, paragraphs, lists)
- [x] /privacy and /terms exist so footer/form links work, but are **owner-review drafts**: `noindex`, excluded from sitemap,
      visible "being finalised" notice. Privacy only states facts about the enquiry form; Terms has no terms yet
- [ ] Packages quiz · About approach animation (later phase)

## Phase 4 — Backend ⏳ (enquiry core done)
- [x] `POST /api/quote`: shared Zod schema (`src/lib/quote-schema.ts`) re-validated server-side, 16 KB body cap,
      phone required for phone/WhatsApp contact, honeypot (fake success, nothing stored),
      rate limit 5/hour per salted-hash client key in `rateLimits`, Admin SDK write to `quoteRequests`,
      success returned only after the write resolves; 503 `unavailable` when Firebase isn't configured
- [x] Form states: inline field errors + focus on first invalid field, sending (disabled button, spinner, aria-busy),
      error alert with WhatsApp/email fallback (details kept), success panel only after a 201. Not-configured: notice + disabled send
- [ ] App Check token verification on `/api/quote`
- [ ] File attachments (Storage) — deliberately out of this pass
- [ ] SMTP notification + optional customer confirmation (Nodemailer) — deliberately out of this pass

## Phase 5 — Admin dashboard ⏳ next
- [ ] Login, session verification, overview stats, enquiries, portfolio, articles, settings, audit log

## Phase 6 — Remaining animations ⏳
- [ ] IT support troubleshooting scene · Wi-Fi coverage floor plan (draggable APs) · About approach visual

## Phase 7 — QA ⏳
- [x] `bun run typecheck`, `bun run lint`, `bun run build` pass (session 2)
- [ ] Lighthouse · axe accessibility audit · real-device testing · reduced-motion check in a browser that can emulate it

## Verification — session 2 (what was actually run)
- **Checks:** typecheck ✅ · lint ✅ (0 problems) · `next build` ✅ (24 routes; services pre-rendered via `generateStaticParams`).
- **Emulator submission:** Firestore emulator (`firebase-tools`, project `demo-rstechgroup`) + production build on :3001.
  Real form submit at 390px created a `quoteRequests` doc (`status: new`, `source: quote-form`, server timestamps).
- **Privacy:** unauthenticated REST read and create of `quoteRequests` against the emulator with project rules → 403 both.
- **API:** invalid payload → 400 with field errors · honeypot → 201 and no document · 6th enquiry within an hour → 429.
- **Form UX:** empty submit shows 5 field errors, focus on Name · WhatsApp without phone → phone error and focus ·
  service preselected from detail-page CTA (`networking`, `website-development`) · error state shown on /contact (768px) with fallback links and
  data retained · not-configured state on :3000 shows notice + disabled send.
- **Links:** crawler followed every internal `href` from `/`: 23 URLs, all 200, none hit the 404. `/services/unknown` correctly 404s.
- **Layout:** no horizontal overflow on /, /services, 3 service details, /about, /quote, /work, /resources, /privacy at 390px; /contact at 768px;
  /, /services/networking, /quote at 1440px.
- **Mobile menu (390px):** opens, Escape closes, link navigates and closes, body scroll lock released.
- **Console:** only error seen was the intentional 429.
- **Not verified in a browser:** reduced motion (the pane can't emulate `prefers-reduced-motion`; code paths reviewed only),
  touch input on a real device, keyboard-only walk-through of the two interactive demos (they use native `<button>`s with focus handlers).

## Firebase setup still needed for live enquiries
1. Create the project and fill `FIREBASE_ADMIN_*` in `.env.local` (README §1, §6). Without it the form shows the not-connected notice.
2. Deploy rules and indexes (README §5) — a new `portfolioProjects (status, order)` index was added this session.
3. Optional: set `RATE_LIMIT_SALT` to a random string in production.
4. Note: `/contact` is statically rendered, so its form's enabled/disabled state is decided at **build** time — build with the
   production env vars present.

## Local emulator testing
```bash
bun x firebase-tools emulators:start --only firestore --project demo-rstechgroup
# in another terminal (stop any running `next dev` first; Next allows one per folder)
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 bun run build && FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 bun x next start -p 3001
```
Or put `FIRESTORE_EMULATOR_HOST=127.0.0.1:8080` in `.env.local` and use `bun run dev`. Remove it before building for production.

---

## Business details needing owner confirmation before launch
| Item | Current value / status |
| --- | --- |
| Phone / WhatsApp | +1 (868) 708-1349 |
| Email | rstechgroup25@gmail.com (consider a domain email) |
| Availability | Brief says "24/7 — confirm scope". **Not shown on the site** until confirmed |
| Tagline | Technology. Infrastructure. Support. (matches logo) |
| Facebook / TikTok URLs | Exist per brief but URLs unknown — **not linked** |
| CCTV | Mentioned only as background experience, not a service |
| Package prices | TT$5,000 / TT$7,500 / from TT$10,000 — provisional. **Removed from all customer copy** (incl. website FAQ) |
| Package names, inclusions, hosting & maintenance fees | Unknown — /packages describes scope factors only |
| Service detail copy (description, examples, problems, solutions, FAQs) | Drafted from brief scope — needs review |
| "Why choose us" copy | Based on brief's stated approach — needs review (also used on /about) |
| Mission, vision, values | Brief marks them proposed — **not shown** |
| Privacy notice / Terms | Drafts in owner review, `noindex`. Privacy describes the form's actual data handling only |
| Domain | Not decided |
| Original vector logo | Only a 1254px PNG supplied; header now uses the mark + text wordmark |
| Portfolio projects, photography | None supplied — empty states shown |
