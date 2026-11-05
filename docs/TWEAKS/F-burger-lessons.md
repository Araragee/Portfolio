# F — Lessons from the Burger Rewind prototype

Reference: the standalone "Burger Rewind" scroll story (Three.js, 850vh: drop →
rewind → hold → teardown with labels). It solves several problems the journey
also has, so this file records what was ported and what is still open.

## Ported (this pass)

| Burger technique | Journey change | Where |
|---|---|---|
| Per-layer fly-in windows (`A0 + i * A_STEP`) | **Staggered morph**: each particle gets its own start window, swept left→right across the *target* formation (`uStagger`) | `shaders/particles.ts` |
| Mid-flight hop (`sin(PI * e) * lift`); also the scatter burst in CBSDoIt's `portrait.ts` | **Arc**: particles bow sideways and toward the camera mid-trip, zero at both ends (`uArc`, gated by `uDriftAmp` so reduced motion has no arc) | `shaders/particles.ts` |
| Frame-rate independent damping `1 - exp(-dt·k)` | Mouse, interaction and opacity smoothing no longer run 2× fast on 120 Hz screens | `ParticleField.vue` |

Both new uniforms live on the particle presets (`useParticleTestMode.ts`);
`Lockstep` (0/0) is the old behaviour and `Assemble` is a stronger variant.
Uncomment `<TestParticlePanel />` in `JourneyPage.vue` to compare.

Invariant kept: `uProgress` 0 → FROM exactly, 1 → TO exactly, for any stagger,
so reduced motion (which snaps `uProgress` to 0|1) still lands on formations.

## Open candidates

1. **Projected leader-line labels** (burger teardown): project each part's 3D
   anchor with `Vector3.project(camera)`, stack the DOM labels so none overlap,
   and draw SVG leaders with `stroke-dashoffset` reveal. This fits the exploded
   laptop in `Manifesto/MacbookStory.vue` and the PSA chart stages.
2. **Skip the intro on deep links** (burger: `target > 40 && introT < T_IMPACT`).
   The loader or hero should snap when the page opens mid-runway (`/#projects`).
3. **Phase-tick progress rail with a numeric readout**: the sidebar rail could
   tick at stage boundaries inside the 700vh PSA chapter, not just at chapter
   starts.
4. **Depth cue**: size and alpha attenuation by `z` (fog), so `zRelief`
   formations (the face) read as 3D during the new arc.
5. **Preset watch is not `immediate`**: `currentIndex` defaults to Vortex (4),
   but its drift and hover modes are only applied after a preset change, so the
   live site runs Default's scatter hover. Decide which one is intended.
