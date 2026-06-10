# Portfolio — Agent Onboarding

Personal portfolio for Dave Gonzales (frontend, PSA). Currently mid-redesign:
**"The Long Way Around"** — a Three.js scrollytelling journey. Read these, in order:

1. `docs/CONCEPT.md` — the design + every architectural decision (D1–D11)
2. `docs/PLAN.md` — phased build plan; find the current phase, work its checklist
3. `docs/PHASES/` — per-phase cold-start files (status, decisions, files, verify commands)
4. `docs/TWEAKS/` — post phase 1–6 audit fixes (A–D; all ✅ done)

## Stack

Vue 3 (`<script setup lang="ts">` only) · TypeScript strict · Vite 5 · Tailwind 3
(zero border radius, monochrome `#111`/`#F9F9F8` "Monolith" palette — see
`tailwind.config.js`) · Pinia · TresJS (`@tresjs/core`) + three · Lenis ·
anime.js v3 (DOM micro-anims) · `@unhead/vue`.

## Commands

```bash
npm run dev          # vite dev server :5173
npm run type-check   # vue-tsc --noEmit  — must be green before any handoff
npm run build        # vue-tsc && vite build
```

## Architecture (journey redesign)

```
scroll (Lenis, useLenis.ts)
  └─> JourneyPage.vue            # ONLY writer of scroll progress
        └─> stores/journey.ts    # derives: active chapter, morph pair, morph t
              ├─> ChapterSection.vue   # DOM story layer (sticky 200/300vh)
              └─> ParticleField.vue    # reads store each frame → shader uniforms
                    ├─ utils/morphTargets.ts   # formation samplers (seeded PRNG)
                    └─ shaders/particles.ts    # GPU morph: mix(position, aPositionTo, uProgress)
JourneyCanvas.vue = the ONE TresCanvas (fixed, behind DOM, aria-hidden)
```

Old site (HomePage etc.) still owns `/`; journey is at `/journey` until Phase 8.

## Hard rules (violations get reverted)

- **One WebGL context per page.** New visuals = new morph state, not new canvas.
- `templateCompilerOptions` from `@tresjs/core` must stay spread into the vue
  plugin in `vite.config.ts` — removing it breaks `Tres*`/`primitive` resolution.
- three/@tresjs/core stay in the lazy `vendor-three` chunk; never import three
  from eagerly-loaded code (`main.ts`, router, navbar, etc.).
- Formations: same particle count across ALL states, seeded PRNG (mulberry32 in
  `morphTargets.ts`), world bounds x ±4.5 / y ±2.5.
- `shallowRef` for three objects; dispose geometry/material in `onBeforeUnmount`.
- Tailwind: static class strings only (variant maps via computed lookups);
  no inline `style=""`; chapter heights restricted to the `200 | 300` union.
- Reduced motion is not optional: every new animation needs its
  `prefersReducedMotion` branch (snap, don't tween).
- Composition API only, Pinia only, no new Axios instances, no default exports
  from composables. (Full conventions: user-level CLAUDE.md.)

## Gotchas

- `@types/three` is required (three ships no types) — already installed.
- `textMass` formation samples 2D canvas text; wrong glyphs if sampled before
  fonts load. Phase 1 adds `document.fonts.ready` re-sampling.
- Lenis owns window scroll while JourneyPage is mounted and is destroyed on
  unmount — don't add competing scroll listeners; subscribe via `useLenis().onScroll`.
- Missing images under `src/assets/projects/` cause build warnings — known,
  pre-existing, ignore.
- Verify in browser via `.claude/launch.json` ("portfolio") — check `/journey`
  console is clean and scroll the full runway after any canvas/store change.
