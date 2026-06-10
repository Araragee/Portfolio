# Phase 3 — Morph Engine Polish

**Status: ✅ done** (2026-06-11)

## Goal

Transitions feel designed. GPU stagger, camera continuity, real render pause.

## What was built

- **Per-particle stagger** (`src/shaders/particles.ts`): `hash(index)` → small `t` offset per particle; morph arrives staggered across the field rather than all at once
- **Per-chapter morph windows** (`src/data/journeyData.ts`): `morphStart: 0.55`, `morphEnd: 0.95` on all chapters (hold own formation through 55% of runway, transition across 55–95%); epilogue uses `0.3 / 0.7` (textMass→textMass no-op morph)
- **Camera dolly continuity** (`src/stores/journey.ts`): `fromZ = prevChapter.cameraZ; t = min(1, chapterProgress * 2); cameraZ = lerp(fromZ, chapter.cameraZ, t)` — eliminates snap at every chapter boundary; psa-map/psa-logo use `cameraZ: 7.2`
- **Real render pause** (`src/components/Journey/ParticleField.vue`): `useLoop().stop()` / `.start()` (TresJS v5 API) triggered only on `document.hidden` (visibilitychange); named handler removed in `onBeforeUnmount` to prevent leak

## Key decisions (design calls)

- **NO idle timeout** — original plan was 3s idle → stop. Removed during verification: stopping the ambient drift while visitors read looked broken. Loop stops only on hidden tab.
- **Camera lerp over 50%** — `min(1, progress * 2)` means camera always arrives at target Z by mid-chapter, never snaps
- **visibilitychange**: named handler (`_visHandler`), added once on mount, removed on unmount. Anonymous function was stacking per route visit.

## Files changed

- `src/shaders/particles.ts`
- `src/data/journeyData.ts`
- `src/stores/journey.ts`
- `src/components/Journey/ParticleField.vue`

## Verify

```bash
npm run type-check && npm run build
# /journey: scrub through all 7 chapters — no camera Z jump at any boundary
# Switch tab → loop pauses (check Vue devtools useLoop().isActive)
# Return to tab → loop resumes; ambient drift visible within 1 frame
# Stagger: morph transitions arrive as a ripple, not a wall
```
