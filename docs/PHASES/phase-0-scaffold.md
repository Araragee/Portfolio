# Phase 0 — Scaffold

**Status: ✅ done** (2026-06-10)

## What was built

Full project scaffold so every future phase has a clean foundation to build on.

## Files created

- `src/types/journey.ts` — `MorphStateId`, `ChapterHeightVh`, `TextSide`, `JourneyChapter`, `MorphTargetMap`
- `src/data/journeyData.ts` — 7 chapters, `fieldOffsetFor()` helper
- `src/utils/morphTargets.ts` — deterministic formation samplers + `buildMorphTargets` + `particleCountForViewport` + `createTextMass`
- `src/shaders/particles.ts` — vertex (GPU morph + drift + repel) + fragment shaders as template strings
- `src/stores/journey.ts` — Pinia store: scroll → chapter/morph/offset/camera + loader flags
- `src/composables/useLenis.ts` — Lenis smooth scroll singleton
- `src/composables/useReducedMotion.ts` — `prefers-reduced-motion` media query
- `src/composables/useWebGLSupport.ts` — feature-detect WebGL
- `src/components/Journey/JourneyCanvas.vue` — single TresCanvas (fixed, behind DOM, aria-hidden)
- `src/components/Journey/ParticleField.vue` — Three.js particle mesh, shader uniforms, frame loop
- `src/components/Journey/ChapterSection.vue` — data-driven sticky chapter DOM layer
- `src/views/JourneyPage.vue` — scroll writer, mounts canvas + chapters
- `src/router/index.ts` — `/journey` route added
- `vite.config.ts` — `templateCompilerOptions` from @tresjs/core, `vendor-three` chunk
- `main.ts` — `createPinia()` registered
- `docs/CONCEPT.md` — design doc, decisions D1–D11
- `docs/PLAN.md` — phased build plan
- `CLAUDE.md` (root) — agent onboarding

## Key decisions

- **One WebGL context** — load-bearing. Never add a second TresCanvas.
- **vendor-three chunk** — three/@tresjs/core never imported from eagerly-loaded code.
- **templateCompilerOptions** must stay spread in vite.config.ts or `Tres*`/`primitive` break.
- **seeded PRNG** (mulberry32 in morphTargets.ts) — deterministic formations, same particle count across all states.
- **World bounds**: x ±4.5, y ±2.5.
- **Counts**: 16k desktop, 7k mobile (768px breakpoint).

## Verify

```bash
npm run type-check && npm run build
# browser: /journey — canvas renders, no console errors
```
