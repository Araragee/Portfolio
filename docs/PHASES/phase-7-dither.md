# Phase 7 — Dither Pass & Performance

**Status: 🔜 next**

## Goal

The signature render look (1-bit ordered dither) + production performance. Lighthouse ≥90 on /journey.

## Context

- Design calls for a monochrome ordered-dither postprocess (CONCEPT §D7). This is the visual signature.
- The journey particle field renders in WebGL via TresJS. Postprocess means a ShaderPass on the EffectComposer.
- TresJS v4/v5 exposes postprocessing via `@tresjs/post-processing` or a manual EffectComposer setup.
- Check current @tresjs version before choosing approach: `cat package.json | grep tresjs`

## Items

### 1. 1-bit ordered dither ShaderPass

- Custom `OrderedDitherPass` — bayer matrix 8×8 or 4×4, threshold-based
- Input: scene render. Output: 1-bit (on-shader: compare luminance vs bayer value, output 0 or 1)
- Colors: `#F9F9F8` (light) and `#111111` (dark) — palette constants, not white/black
- Mount on `JourneyCanvas.vue`'s EffectComposer chain
- Toggleable: `uDitherEnabled` uniform or conditional pass.enabled — for A/B comparison
- Reduced motion: dither stays ON (it's visual style, not animation)

### 2. Adaptive degrade ladder

Three-step ladder, evaluated once after first 60 frames; also re-evaluated on resize:

| Tier | Condition | Action |
|------|-----------|--------|
| 0 (full) | fps ≥ 30, device memory ≥ 4GB OR fps ≥ 45 | dither on, full DPR, full particle count |
| 1 (no dither) | fps 20–30 sustained | disable dither pass (`pass.enabled = false`) |
| 2 (DPR 1) | fps 15–20 sustained | `renderer.setPixelRatio(1)` |
| 3 (half particles) | fps < 15 | rebuild morphTargets at half count |

- Tiers only go DOWN, never UP (prevents oscillation)
- FPS window: same 60-frame rolling average as Phase 1 FPS guard
- `navigator.deviceMemory` if available for tier 0 fast-path

### 3. Static dither texture for no-WebGL fallback

- Generate a 128×128 ordered-dither noise PNG (or inline SVG) at build time
- Use as `bg-dither-noise` background (already the CSS class in `src/assets/main.css`)
- Same visual language as the WebGL dither without canvas

### 4. Bundle audit

Current lazy `vendor-three` chunk is ~210KB gz. Check vs CONCEPT §5 budgets:
- three + @tresjs/core ≤ 220KB gz
- Total page weight ≤ 400KB gz
- Run: `npm run build -- --report` or check dist/ sizes

### 5. Lighthouse ≥90

- Run on `/journey` (not `/` — old site)
- Expected wins: antialias already off, vendor-three lazy, Lenis deferred
- Expected issues: large canvas texture, potential CLS from loader wipe
- Fix any failures before marking phase done

## Files to create/modify

- `src/shaders/ditherPass.ts` — new ShaderPass (GLSL + Three.js material boilerplate)
- `src/components/Journey/JourneyCanvas.vue` — mount EffectComposer + dither pass
- `src/components/Journey/ParticleField.vue` — tier detection, degrade ladder
- `src/assets/main.css` — update `bg-dither-noise` if replacing with real texture
- `vite.config.ts` — check if @tresjs/post-processing needs chunk split

## Accept

- [ ] Dither on: field has 1-bit grain over all particles
- [ ] Toggle off: clean render, same fps tier
- [ ] Mid mobile device (throttled 4x in DevTools): stays at ≥30fps (tier 0 or 1)
- [ ] 3x throttle: DPR drops to 1, no stutter
- [ ] 6x throttle: particle count halves
- [ ] No-WebGL: noise bg shows same dither texture language
- [ ] Lighthouse /journey: Performance ≥ 90
- [ ] `npm run type-check && npm run build` green

## Gotchas

- TresJS EffectComposer: check if `@tresjs/post-processing` is already installed before adding it
- Bayer matrix: 4×4 gives coarser grain (brutalist), 8×8 finer — try 4×4 first
- DPR change mid-session: call `renderer.setSize` + `renderer.setPixelRatio` together or canvas clips
- Particle count degrade: must rebuild Float32Array + re-upload all morph target buffers (see `buildMorphTargets`)
