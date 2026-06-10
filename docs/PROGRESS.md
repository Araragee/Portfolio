# Journey Build Progress

Agent continuity file. Read this + `docs/PLAN.md` + root `CLAUDE.md` to resume.

## Current phase: 7 ✅

## Phase checklist

### Phase 0 ✅ Scaffold
### Phase 1 ✅ Hero & canvas hardening
### Phase 2 ✅ Scroll & story structure
### Phase 3 ✅ Morph engine polish
### Phase 4 ✅ Storytelling content
### Phase 5 ✅ Chapter interactions
### Phase 6 ✅ Real data formations

### Phase 7 ✅ Dither pass & performance
- [x] 1-bit ordered-dither in fragment shader (`src/shaders/particles.ts`)
      Bayer 4×4 via if/else float comparisons (no constant arrays — WebKit compat)
      Uniform `uDither` (1.0=on, 0.0=off); toggled by store's `ditherEnabled`
- [x] Adaptive degrade ladder (`src/stores/journey.ts` + `src/components/Journey/ParticleField.vue`)
      Tier 0→1: dither off | Tier 1→2: DPR drops to 1 (JourneyCanvas) | Tier 2→3: halve particles
      60 sustained slow frames (>34ms delta) advances one tier
- [x] Static dither texture for no-WebGL fallback (`src/assets/main.css`)
      Bayer 4×4 pattern at ~31% density as 4×4 SVG tile, `background-size: 4px 4px`
- [x] Bundle audit — both budgets green:
      `vendor-three`: 210.53 KB gz (budget ≤ 220 KB) ✅
      First-load JS: ~88 KB gz (budget ≤ 110 KB) ✅

### Phase 8 — next
- [ ] Route swap: journey → `/`; old HomePage demoted
- [ ] Navbar/footer restyle to journey idiom
- [ ] Case study pages particle echo (same canvas, static formation)
- [ ] Full a11y audit (keyboard, headings, contrast, reduced-motion)
- [ ] 12-principles audit on all DOM animations

### Phase 9 — QA & launch
- [ ] Cross-browser: Chrome, Safari (incl. iOS), Firefox
- [ ] Devices: mid Android, older iPhone, 4K desktop
- [ ] 404/SPA fallback config (gh-pages/netlify/vercel)
- [ ] Rollback plan: tag pre-launch commit

---

## Key files changed per phase

| Phase | Files |
|-------|-------|
| 7 | `src/shaders/particles.ts`, `src/stores/journey.ts`, `src/components/Journey/ParticleField.vue`, `src/components/Journey/JourneyCanvas.vue`, `src/assets/main.css` |

## Resuming from here

1. Check `git log --oneline -5` to see last commit
2. Read this file to find current phase
3. Read `docs/PLAN.md` phase checklist for remaining items
4. Run `npm run type-check` — must be green before any handoff
5. Verify `/journey` in real browser (preview tool headless — rAF doesn't fire)
