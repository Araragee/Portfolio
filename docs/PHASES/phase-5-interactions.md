# Phase 5 — Chapter Interactions

**Status: ✅ done** (2026-06-11)

## Goal

Each chapter has one earned interaction. Shader handles all seven via `uChapterIndex`.

## Interaction map

| ch | id | `uChapterIndex` | interaction |
|----|----|----------------|------------|
| 0 | prologue | 0 | cursor repel — field gives way to pointer |
| 1 | student | 1 | branch grow — particles near tip extend one level |
| 2 | internship | 2 | grid drag — local region displaces, springs back |
| 3 | psa-map | 3 | lift — hover region particles rise on z |
| 4 | psa-logo | 4 | globe spin — scrub interaction drives rotation |
| 5 | projects | 5 | converge — click pulls particles toward cursor |
| 6 | epilogue | 6 | impulse — click radial burst, reforms to TALK |

## Implementation

All interaction logic lives in `src/shaders/particles.ts` (vertex shader, `uChapterIndex` branch).
`ParticleField.vue` sends:
- `uChapterIndex` — current chapter index (0–6)
- `uInteractState` — float 0–1 animation state for the current interaction
- `uInteractPos` — vec3 mouse/interaction world position

`prefersReducedMotion`: `uInteractState` held at 0 when reduced motion is active → interactions
become no-ops in the shader without a code branch.

## Files changed

- `src/shaders/particles.ts` — 7 `uChapterIndex` branches
- `src/components/Journey/ParticleField.vue` — interaction state management, mouse tracking

## Verify

```bash
npm run type-check && npm run build
# /journey prologue: move mouse → repel visible
# /journey student: hover near top of field → branch extends
# /journey internship: click + drag → particles drag, spring back on release
# /journey psa-map: hover right half → particles lift
# /journey epilogue: click → burst, particles reform to TALK
# prefers-reduced-motion enabled: all interactions muted
```
