# The Long Way Around — Concept & Technical Decisions

> Scrollytelling portfolio redesign. One continuous ~1400vh scroll journey through
> Dave's career, told by a single morphing particle field rendered in Three.js.
> Status: concept hardened, scaffold landed (see `docs/PLAN.md` for phases).

## 1. The pitch

The site is one road. A monochrome particle field (the "census field" — a nod to
PSA/statistics work) persists across the whole page and reorganizes itself into a
different formation per career chapter as you scroll. Display type and story copy
stay in the DOM (SEO, accessibility, selectable text); the WebGL layer is texture
and atmosphere, never the content itself.

The title is lifted from the site's own copy (`src/data/personalData.ts`):
*"I came into software the long way around."*

## 2. Chapter map

| # | Chapter | Era | Runway | Formation | Interaction (Phase 5) |
|---|---------|-----|--------|-----------|------------------------|
| 000 | Prologue | — | 200vh | `scatter` | cursor repels field |
| 001 | Recursion at 2am | CS student | 200vh | `tree` | hover branch → grows |
| 002 | First paid pixels | iPhitech, Clark 2023 | 200vh | `grid` | drag grid → springs back |
| 003 | The portal | PSA / CBMS, 2023–now | 300vh | `archipelago` | hover region → lift + stat |
| 004 | Side quests | Freelance + projects | 200vh | `artifact` | click → case study route |
| 005 | End of the road | Epilogue | 200vh | `textMass` ("TALK") | click → explode, reform |

Morph timing: each chapter **holds** its formation for the first 60% of its runway,
then **transitions** to the next formation across the final 40%. Entirely
scroll-scrubbed — no clocked tweens.

## 3. Decisions (ADR-style)

### D1 — TresJS (`@tresjs/core`) over raw Three.js
**Decision:** declarative canvas/camera via TresJS; imperative geometry/material via
`<primitive>`.
**Why:** matches house style (wrapper components over raw `init()`, same rule as
vue-echarts); lifecycle/resize/render-loop handled; agents get `useLoop` instead of
hand-rolled RAF.
**Consequence:** `vite.config.ts` MUST spread `templateCompilerOptions` from
`@tresjs/core` into the vue plugin, or every `Tres*`/`primitive` tag logs a
resolution warning. Already wired.

### D2 — One WebGL context, ever
One fixed full-viewport `<TresCanvas>` behind the DOM (`JourneyCanvas.vue`).
Per-chapter visuals are morph states of the SAME Points object — never additional
canvases. Multiple WebGL contexts on one page is the failure mode this rule
prevents.

### D3 — GPU morphing, CPU buffer swaps
`position` attribute = FROM state, `aPositionTo` = TO state, `uProgress` uniform
scrubs the mix in the vertex shader. JS only copies precomputed Float32Arrays into
the attributes at chapter boundaries. 16k particles morph at zero per-frame CPU
cost.

### D4 — GLSL as template strings (`src/shaders/particles.ts`)
No vite-plugin-glsl. Keeps toolchain stock, shaders type-importable, and diffs
reviewable.

### D5 — Lenis for scroll, Pinia for scroll state
Lenis (`useLenis.ts`) is the single scroll source on the journey page; the store
(`stores/journey.ts`) is the single derived-state owner (active chapter, chapter
progress, morph pair, morph t). One writer (JourneyPage) — everything else reads.
Pinia per house rules.

### D6 — Three.js loads lazily
`JourneyPage` imports `JourneyCanvas` via `defineAsyncComponent`; vite groups
`three` + `@tresjs/core` into the `vendor-three` async chunk (~210KB gz). First
paint never waits for WebGL. If WebGL2 is unsupported the chunk never downloads.

### D7 — Brutalist render style
Square gl points (no circular discard), `#111111` on `#F9F9F8`, opacity 0.7,
DPR clamped to 1.5. At distance the field reads as dither — Phase 7 adds a true
1-bit dither postprocess pass.

### D8 — Fixed camera, known world space
Camera fixed at z=8, fov 45. Formation samplers target x ±4.5, y ±2.5. Pointer →
world projection is constant math, no raycaster needed for repulsion (raycast
arrives in Phase 5 for object-level hovers).

### D9 — Deterministic formations
All samplers use a seeded PRNG (mulberry32) — same field every load, diffable
visual changes.

### D10 — Accessibility is structural, not bolted on
Copy lives in semantic DOM sections; canvas is `aria-hidden` + `pointer-events-none`.
`prefers-reduced-motion`: morphs snap (uProgress 0|1), drift and repulsion off
(`uDriftAmp = 0`). No-WebGL fallback renders flat surface (static dither texture in
Phase 7).

### D11 — Static Tailwind classes only
Chapter heights constrained to `200 | 300` vh and mapped through a computed lookup
(`ChapterSection.vue`) so Tailwind sees literal `h-[200vh]` / `h-[300vh]` strings.
No dynamic class interpolation, no inline styles.

## 4. Motion rules (12 principles, applied)

- Scroll-scrubbed canvas motion: exempt from duration limits (user controls time).
- DOM micro-animations (Phase 2+): ≤300ms, entrances ease-out, exits ease-in,
  stagger ≤50ms/item, active states scale 0.95–0.98.
- Springs only where overshoot is meaningful (grid drag snap-back, Phase 5).
- One focal point: when nav/menu overlays open, canvas opacity dims.
- Linear easing only for progress indicators.

## 5. Performance budget

| Metric | Budget |
|--------|--------|
| First-load JS (without three) | ≤ 110KB gz |
| vendor-three async chunk | ≤ 220KB gz |
| Particle count | 16k desktop / 7k mobile |
| DPR | clamp 1.5 |
| Frame budget | 60fps desktop, 30fps floor mobile (Phase 7 adaptive degrade) |
| LCP | unchanged from current site (type is DOM) |

## 6. Known issues / open items

- `textMass` samples canvas text before Space Grotesk may be loaded → falls back
  to sans-serif glyph shapes. Fix in Phase 3 (`document.fonts.ready` re-sample).
- Epilogue "TALK" formation overlaps chapter copy — layout offset pass in Phase 2.
- `archipelago` is a placeholder (gaussian clusters); real PH geo points in Phase 6.
- Old HomePage still owns `/`; journey lives at `/journey` until Phase 8 swap.
