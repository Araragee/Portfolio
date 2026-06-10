# Build Plan — The Long Way Around

> Phased plan for the scrollytelling redesign. Each phase is independently
> shippable and written so an agent with no prior context can pick it up.
> Read `docs/CONCEPT.md` first (decisions D1–D11), then the root `CLAUDE.md`.
>
> Verify every phase with: `npm run type-check` && `npm run build`, then
> a browser pass on `/journey` (console clean, scroll the full runway).

## Phase 0 — Scaffold ✅ (done)

Everything below exists and is verified working:

- Deps: `three`, `@types/three`, `@tresjs/core`, `lenis`, `pinia`
- `src/types/journey.ts` — `MorphStateId`, `JourneyChapter`, `MorphTargetMap`
- `src/data/journeyData.ts` — 6 chapters, draft copy
- `src/utils/morphTargets.ts` — deterministic formation samplers (scatter, tree,
  grid, archipelago-placeholder, artifact, textMass)
- `src/shaders/particles.ts` — vertex (GPU morph + drift + cursor repel), fragment
- `src/stores/journey.ts` — scroll → chapter/morph state derivation
- `src/composables/` — `useLenis`, `useReducedMotion`, `useWebGLSupport`
- `src/components/Journey/` — `JourneyCanvas`, `ParticleField`, `ChapterSection`
- `src/views/JourneyPage.vue` + `/journey` route
- Pinia registered in `main.ts`; `templateCompilerOptions` + `vendor-three` chunk
  in `vite.config.ts`

## Phase 1 — Hero & canvas hardening ✅ (done)

**Goal:** prologue feels intentional; canvas behaves under stress.

- [ ] Prologue layout: name + role type treatment over the field (Clash Display,
      asymmetric grid, mono labels like the existing HeroSection)
- [ ] `document.fonts.ready` → re-sample `textMass` target and re-upload the
      buffer (fixes wrong-font TALK, CONCEPT §6)
- [ ] Pointer repel tuning: radius/strength props on `ParticleField`
- [ ] Resize handling: rebuild targets when crossing the 768px count breakpoint
- [ ] FPS guard: if sustained < 30fps, halve particle count once (no thrash loop)
- [ ] No-WebGL fallback: static dithered background (CSS or inline SVG noise)

**Accept:** /journey hero matches brand; rotate/resize doesn't break field;
fonts always correct after load; console clean.

## Phase 2 — Scroll & story structure

**Goal:** chapters read as a story, not stacked sections.

- [ ] Text reveal per chapter: IntersectionObserver (existing composable) +
      anime.js — entrance ease-out ≤300ms, stagger ≤50ms/item
- [ ] Layout offsets so formations and copy don't collide (epilogue TALK overlap)
- [ ] Journey progress rail: fixed mono indicator (000–005) with current chapter
- [ ] Anchor deep-links: `/journey#psa` scrolls (Lenis `scrollTo`) to chapter
- [ ] Navbar coexistence: dim/auto-hide on scroll-down, return on scroll-up

**Accept:** every chapter's copy animates in once, legible against the field;
rail tracks scroll; deep links land correctly; reduced-motion shows text instantly.

## Phase 3 — Morph engine polish

**Goal:** transitions feel designed, not interpolated.

- [ ] Per-particle stagger in the vertex shader (hash of index → small t offset,
      capped so the morph never lags scroll by more than ~5% of the window)
- [ ] Per-chapter hold/transition ratios in `journeyData` (replace global 60/40)
- [ ] Subtle camera dolly per chapter (z 8 → 7.2 on long chapters), scroll-driven
- [ ] On-demand rendering: pause the loop when tab hidden / scroll idle + no
      pointer movement for 3s
- [ ] Tune each formation's silhouette at real viewport sizes (mobile portrait!)

**Accept:** all 5 transitions reviewed at 3 viewport sizes; idle CPU near zero;
scrubbing back and forth never desyncs.

## Phase 4 — Storytelling content

**Goal:** real copy, real projects.

- [ ] Copy pass on all 6 chapters (source: `personalData.ts`, `projectsData.ts`;
      voice: first person, concrete, no buzzwords)
- [ ] Side quests chapter: stations generated from `projectsData.ts` (title, role,
      stack, link to `/case-study/:slug`)
- [ ] PSA chapter: 2–3 story beats with stat callouts (scale, CBMS scope) that
      sync to scroll position within the 300vh runway
- [ ] SEO: `@unhead/vue` meta for /journey (use existing `SEOHead.vue` pattern)

**Accept:** someone who knows nothing about Dave understands the arc in one
scroll; every project reachable; meta tags render.

## Phase 5 — Chapter interactions

**Goal:** each chapter has ONE earned interaction (staging: one focal point).

- [ ] Prologue: cursor repel (exists) — tune only
- [ ] Tree: raycast hover near branch tip → particles extend one branch level
- [ ] Grid: pointer drag displaces local region; release springs back
      (spring, stiffness ~500 damping ~30 — overshoot is the point)
- [ ] Archipelago: hover region cluster → particles lift +z, mono stat label in DOM
- [ ] Artifact: click → `router.push` to case study; particles converge during
      route transition (View Transition or manual morph on `beforeRouteLeave`)
- [ ] TALK: click → radial impulse, springs back to glyph positions
- [ ] All interactions disabled under `prefersReducedMotion`; touch equivalents
      for hover (tap) on mobile

**Accept:** every interaction discoverable from its hint line; no interaction
fights scroll; 60fps maintained during each.

## Phase 6 — Real data formations

**Goal:** the PSA chapter earns the "census field" name.

- [ ] Replace placeholder archipelago with sampled PH geo points (simplified
      geojson → point-in-polygon sampling at build time; commit the generated
      Float32Array as a static asset, do NOT ship a geo lib to the client)
- [ ] Sub-morphs inside PSA chapter: archipelago → bar terrain → sunburst-ish
      radial — chart shapes echoing actual CBMS portal charts
- [ ] Stat labels tied to regions (data file, not hardcoded in components)

**Accept:** PH silhouette recognizable at a glance; sub-morphs scrub cleanly
within the 300vh runway; bundle size budget still met.

## Phase 7 — Dither pass & performance

**Goal:** the signature render style + production perf.

- [ ] 1-bit ordered-dither postprocess (custom ShaderPass; monochrome enforced
      in-shader per CONCEPT D7) — toggleable for A/B
- [ ] Adaptive degrade ladder: drop dither → drop DPR to 1 → halve particles
- [ ] Static dither texture for the no-WebGL fallback (same visual language)
- [ ] Bundle audit vs CONCEPT §5 budgets; Lighthouse ≥ 90 perf on /journey

**Accept:** dither on = same fps tier as dither off on a mid mobile device;
budgets green; fallback visually coherent.

## Phase 8 — Make it the site

**Goal:** journey becomes `/`.

- [ ] Route swap: journey → `/`; old HomePage demoted (keep file until Phase 9
      sign-off; do not delete without explicit approval)
- [ ] Navbar/footer restyle to journey idiom; CTA section folds into epilogue
- [ ] Case study pages get a lightweight particle echo on their hero (same
      canvas component, single static formation — still one context per page)
- [ ] Full a11y audit (keyboard, headings, contrast, reduced-motion)
- [ ] 12-principles audit on all DOM animations (`/12-principles-of-animation`)

**Accept:** `/` is the journey; all old routes still resolve; audits clean.

## Phase 9 — QA & launch

- [ ] Cross-browser: Chrome, Safari (incl. iOS), Firefox
- [ ] Devices: mid Android, older iPhone, 4K desktop
- [ ] 404/SPA fallback works on the chosen host (gh-pages/netlify/vercel configs
      already in repo — pick one, document it)
- [ ] Rollback plan: tag pre-launch commit; `/` swap is one revert away

---

### Working agreements (all phases)

- One WebGL context. Always. (CONCEPT D2)
- Buffers/objects in `shallowRef`; dispose geometry/material on unmount.
- New formations = new sampler in `morphTargets.ts` + new `MorphStateId` —
  same particle count as everything else, seeded PRNG only.
- Scroll state flows one way: Lenis → JourneyPage → store → readers.
- Tailwind classes static; variant maps via computed lookups; no inline styles.
- Each phase lands as its own branch + PR with before/after screen recordings.
