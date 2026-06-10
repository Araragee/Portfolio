# Phase 8 — Make It the Site

**Status: ✅ done (2026-06-11)**

## Goal

Journey becomes `/`. Old HomePage demoted. Navigation and footer match the journey idiom.

## Items

### 1. Route swap

- `/journey` → `/`
- Old `HomePage.vue` / home route → `/old` or `/classic` (do NOT delete until Phase 9 sign-off)
- Router: `{ path: '/', component: JourneyPage }`, `{ path: '/classic', component: HomePage }`
- Update any internal links pointing to `/journey`

### 2. Navbar/footer restyle

- Journey idiom: monochrome, brutalist, minimal — matches `#111` / `#F9F9F8` palette
- Navbar: sits above the canvas (`z` above TresCanvas which is `z-0` fixed); slim strip, name/logo left, links right
- Footer: folds into epilogue chapter — the "TALK" CTA IS the footer CTA; no separate footer div needed
- Kill or restyle any colored/gradient elements from old navbar

### 3. Case study particle echo (one context rule)

- Case study pages (`/case-study/:slug`) get a lightweight particle echo on their hero
- Same `JourneyCanvas.vue` + `ParticleField.vue`, single static formation (`artifact` state)
- One WebGL context per page — each case study page has its own canvas (different page = different context OK)
- No morph on case study page, just static drift + repel interaction

### 4. Full a11y audit

- Keyboard: tab order through the journey makes sense; scroll can be triggered by keyboard (Lenis supports programmatic scroll)
- Headings: each chapter section should have an `h2` (title) — verify in DOM outline
- Contrast: `#111` on `#F9F9F8` passes WCAG AA (it does — 16:1 ratio); verify any overlay text on canvas
- Focus styles: visible focus ring on all interactive elements (progress rail dots, project links, TALK click)
- `aria-hidden="true"` on JourneyCanvas (already set in scaffold)
- Announce route changes with live region or `@unhead/vue` title update

### 5. 12-principles audit

- Run `/12-principles-of-animation` skill on all DOM animations
- Check: ease curves, anticipation on chapter transitions, follow-through on text reveals
- Loader wipe: easeInCubic exit ✅ (already set); verify it doesn't feel abrupt
- Chapter text stagger: 40ms / 450ms easeOutCubic ✅ (verify still correct after Phase 7 changes)

## Files to modify

- `src/router/index.ts` — route swap
- `src/components/NavBar.vue` (or equivalent) — journey idiom restyle
- `src/views/JourneyPage.vue` — any /journey-specific routing guards removed
- `src/views/CaseStudy*.vue` — particle echo hero
- `src/components/Journey/JourneyCanvas.vue` — verify still correct for static case study use

## Accept

- [ ] `/` renders JourneyPage; `/classic` renders old HomePage
- [ ] Old routes (project pages, about, etc.) still resolve
- [ ] Navbar over canvas: no z-fight, legible on both light and dark field
- [ ] Case study pages: particle hero visible, ambient drift active, no morph
- [ ] Keyboard: can tab to all interactive elements; no keyboard trap
- [ ] Headings: browser outline shows logical h1/h2 structure
- [ ] 12-principles audit passes (or issues documented with deferred stubs)
- [ ] `npm run type-check && npm run build` green

## Gotchas

- Do NOT delete `HomePage.vue` in this phase — keep until Phase 9 sign-off
- Case study canvas: it's a NEW page → new WebGL context is allowed (one per PAGE, not one per site)
- `templateCompilerOptions` must stay in vite.config.ts for all TresCanvas usages
