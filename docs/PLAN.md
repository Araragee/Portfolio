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

## Phase 1 — Hero & canvas hardening ✅ (done 2026-06-11)

**Goal:** prologue feels intentional; canvas behaves under stress.

- [x] Prologue layout: hero branch in `ChapterSection.vue` (layout='hero')
- [x] `document.fonts.ready` → re-sample `textMass` + re-upload buffer (JourneyPage.vue)
- [x] Pointer repel: `repelRadius`/`repelStrength` props on `ParticleField`
- [x] Resize: rebuild targets when crossing 768px count breakpoint
- [x] FPS guard: halve particle count once after 60 frames >33ms
- [x] No-WebGL fallback: `bg-dither-noise` CSS utility (src/assets/main.css)

**Verified:** /journey hero renders; fonts.ready re-samples; console clean.

## Phase 2 — Scroll & story structure ✅ (done 2026-06-11)

**Goal:** chapters read as a story, not stacked sections.

- [x] Text reveal: IntersectionObserver + anime.js (stagger 40ms, duration 450ms, easeOutCubic, once:true)
- [x] Layout offsets: field slides opposite text column (see also TWEAKS/A)
- [x] Progress rail: live `{{ scrollPercent }}%` + 7 chapter tick squares
- [ ] Anchor deep-links: `/journey#psa` → Lenis scrollTo _(deferred — not blocking)_
- [ ] Navbar coexistence: dim/auto-hide on scroll _(deferred — journey has no navbar overlay)_

**Verified:** reveals fire once per chapter; rail tracks scroll; reduced-motion snaps.

## Phase 3 — Morph engine polish ✅ (done 2026-06-11)

**Goal:** transitions feel designed, not interpolated.

- [x] Per-particle stagger: hash(index) → t offset in vertex shader
- [x] Per-chapter hold/transition: `morphStart: 0.55`, `morphEnd: 0.95` in journeyData
- [x] Camera dolly: store lerps `prevChapter.cameraZ → chapter.cameraZ` over first 50% (TWEAKS/C)
- [x] Render pause: `useLoop().stop()/start()` on `document.hidden` only (design call: no idle timeout — drift is intentional)
- [x] Formation silhouettes tuned; `formationScaleForViewport()` in ParticleField

**Verified:** no camera snap at chapter boundaries; hidden tab stops loop; scrub clean.

## Phase 4 — Storytelling content ✅ (done 2026-06-11)

**Goal:** real copy, real projects.

- [x] Copy on all 7 chapters — voice: first person, concrete (src/data/journeyData.ts)
- [x] Side quests chapter: `showProjects: true` → RouterLink list in ChapterSection
- [x] PSA chapter: 2 chapters (psa-map 300vh + psa-logo 200vh), stat callouts
- [ ] SEO meta for /journey _(deferred)_

**Verified:** arc readable in one scroll; projects list renders.

## Phase 5 — Chapter interactions ✅ (done 2026-06-11)

**Goal:** each chapter has ONE earned interaction.

- [x] Prologue (ch 0): cursor repel — `uChapterIndex==0` in shader
- [x] Tree (ch 1): branch grow on hover — `uChapterIndex==1`
- [x] Grid (ch 2): pointer drag displaces, springs back — `uChapterIndex==2`
- [x] Archipelago (ch 3): hover → particles lift z — `uChapterIndex==3`
- [x] PSA logo (ch 4): globe spin on scrub — `uChapterIndex==4`
- [x] Artifact (ch 5): converge on click — `uChapterIndex==5`
- [x] TALK (ch 6): radial impulse, reforms — `uChapterIndex==6`
- [x] All disabled under `prefersReducedMotion`

**Verified:** interaction hints match shader behavior; no fight with scroll.

## Phase 6 — Real data formations ✅ (done 2026-06-11)

**Goal:** PSA chapter earns the "census field" name.

- [x] Archipelago: gaussian island clusters approximating PH archipelago silhouette (morphTargets.ts `createArchipelago`)
- [x] PSA logo: wireframe globe (lat/lon lines R=1.3) + 3 sweeping arrows (`createPsaLogo`)
- [x] Artifact: tilted ring + dense core (`createArtifact`)
- [x] Stat labels in journeyData (not hardcoded in components)
- [ ] True PH geo sampling (point-in-polygon from geojson at build time) _(deferred — current gaussian reads well)_

**Verified:** PH silhouette readable; globe renders; stat values in data file.

## Phase 7 — Dither pass & performance ✅ (done)

**Goal:** the signature render style + production perf.

- [x] 1-bit ordered-dither in fragment shader (Bayer 4×4 via if/else floats,
      WebKit-compatible; `uDither` uniform toggleable — CONCEPT D7)
- [x] Adaptive degrade ladder: drop dither → drop DPR to 1 → halve particles
      (`degradeTier` in store; 60-frame FPS guard in ParticleField)
- [x] Static dither texture for the no-WebGL fallback (Bayer 4×4 SVG tile,
      4px × 4px repeat, same visual language as the particle field)
- [x] Bundle audit: vendor-three 210 KB gz ✅ (≤220); first-load ~88 KB gz ✅ (≤110)

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
