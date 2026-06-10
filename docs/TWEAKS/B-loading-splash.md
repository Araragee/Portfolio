# B — Loading splash

**Status: ✅ done** (verified 2026-06-11; revisit path skips splash via persisted store flags)

## Goal
Brutalist splash covers the journey until it can actually run; scroll locked
until ready. Real milestones, no fake timers.

## Design
- `src/components/Journey/JourneyLoader.vue` — EAGER import in JourneyPage
  (must paint before the three chunk arrives)
- Readiness flags in `stores/journey.ts`:
  - `assetsLoaded` — JourneyCanvas setup ran (= vendor-three chunk arrived)
  - `firstFrameRendered` — ParticleField's first `onBeforeRender`
  - `fontsLoaded` — `document.fonts.ready` (JourneyPage sets)
  - `loaderProgress` = flags/3 → 0/34/67/100; `journeyReady` = all true
  - No-WebGL path: JourneyPage marks assets + firstFrame immediately
- Scroll lock: `lenis.stop()` on mount + `overflow-hidden` on `<html>` while
  loader visible; `lenis.start()` + re-measure on ready
- Exit: translateY wipe, ease-in (easeInCubic), 280ms (12-principles exit rule);
  `prefersReducedMotion` → instant hide
- Layout: wordmark `DG—25`, title, mono percent counter — surface bg, z-[60]

## Files
- `src/components/Journey/JourneyLoader.vue` (new)
- `src/stores/journey.ts` — flags + progress
- `src/views/JourneyPage.vue` — loader mount, fonts flag, lenis gate
- `src/components/Journey/JourneyCanvas.vue` — marks `assetsLoaded`
- `src/components/Journey/ParticleField.vue` — marks `firstFrameRendered`

## Accept
- Hard reload /journey: splash shows %, page cannot scroll, splash wipes up
  when canvas is actually drawing, scroll works after
- Reduced motion: splash cuts instantly, no tween
- No-WebGL: splash still resolves (fonts only gate)
