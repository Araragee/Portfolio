# C — Performance pass

**Status: ✅ done** (verified 2026-06-11 — with one design change: item 1's idle
timeout was REMOVED during verification. The field's drift is intentional
ambient motion; stopping after 3s froze it while visitors read. The loop now
stops only on `document.hidden` and restarts on visibility. Items 2–7 landed
as written.)

## Goal
Make the idle pause real, stop wasted GPU work, fix camera pop, plug leaks.

## Items
1. **Real render pause** — replace the early-return "pause" in ParticleField
   with `useLoop().stop()` / `.start()` (v5 API, verified in tres.d.ts).
   Idle >3s or `document.hidden` → stop; any pointer/scroll/visibility wake →
   start. First frame still marks the loader flag before any stop.
2. **Renderer flags** — `<TresCanvas :antialias="false"
   power-preference="high-performance">`: square points need zero MSAA;
   biggest mobile win.
3. **Camera dolly continuity** — store lerps `prevChapter.cameraZ →
   current.cameraZ` over the first 50% of each chapter (was: always from base 8,
   snapping back at every boundary).
4. **visibilitychange leak** — named handler + `removeEventListener` in
   `onBeforeUnmount` (was anonymous, stacked per route visit).
5. **Scroll math** — JourneyPage caches `offsetTop` + scrollable height
   (recomputed on resize) instead of `getBoundingClientRect()` per scroll tick.
6. **Reveal anims to spec** — stagger 100→40ms (≤50ms rule), duration
   600→450ms, easing unchanged (easeOutCubic entrances).
7. **Inline style removed** — no-WebGL noise fallback moved to `.bg-dither-noise`
   utility in `src/assets/main.css` (house rule: no `style=""`).

## Files
- `src/components/Journey/ParticleField.vue` (1, 4)
- `src/components/Journey/JourneyCanvas.vue` (2)
- `src/stores/journey.ts` (3)
- `src/views/JourneyPage.vue` (5, 7)
- `src/components/Journey/ChapterSection.vue` (6)
- `src/assets/main.css` (7)

## Accept
- Leave page idle 5s → `useLoop().isActive` false (check Vue devtools or log);
  move mouse → resumes
- Scroll through all 7 chapters: no camera Z jump at any boundary
- Revisit /journey several times: only one visibilitychange listener
- type-check + build green
