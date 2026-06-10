# Phase 1 — Hero & Canvas Hardening

**Status: ✅ done** (2026-06-11)

## Goal

Prologue feels intentional. Canvas behaves under stress (resize, slow hardware, no WebGL).

## What was built

- **Hero layout** (`ChapterSection.vue`): `layout: 'hero'` branch — name + role over field
- **fonts.ready re-sample**: `JourneyPage.vue` awaits `document.fonts.ready` → `store.markFontsLoaded()` → `createTextMass` re-runs with correct glyphs, buffer re-uploaded to GPU
- **Pointer repel props**: `repelRadius` and `repelStrength` as props on `ParticleField.vue` with defaults
- **Resize handling**: `particleCountForViewport()` called on resize; if count changes across 768px breakpoint, rebuilds all morph targets and re-uploads
- **FPS guard**: 60-frame window in frame loop; if >33ms average (sustained <30fps) after 2s elapsed, halves particle count once (no thrash loop — fires at most once per session)
- **No-WebGL fallback**: `bg-dither-noise` utility in `src/assets/main.css` (Tailwind `@layer utilities`); `JourneyPage.vue` applies it when `useWebGLSupport()` returns false; no inline `style=""` on element

## Key decisions

- `textMass` sampled from 2D canvas text — **must be re-sampled after `document.fonts.ready`** or glyphs come from fallback font
- FPS guard: halves ONCE, not in a loop — prevents oscillation on borderline hardware
- No-WebGL: marks `assetsLoaded` + `firstFrameRendered` immediately so loader resolves

## Files changed

- `src/components/Journey/ChapterSection.vue`
- `src/components/Journey/ParticleField.vue`
- `src/views/JourneyPage.vue`
- `src/utils/morphTargets.ts`
- `src/assets/main.css`

## Verify

```bash
npm run type-check && npm run build
# /journey: hero text over field; scroll to epilogue: TALK glyphs correct
# DevTools throttle → 2x slowdown: particle count halves after ~2s
# No-WebGL: disable WebGL in flags, noise bg appears, loader still resolves
```
