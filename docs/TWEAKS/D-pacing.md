# D — Pacing & scroll measurement

**Status: ✅ done** (verified 2026-06-11 — measured 1509vh total runway, rail shows % + 7 ticks)

## Baseline (measured 2026-06-10, 1023px viewport)
- Before: 1121vh total, 10,445px scrollable; chapters at 150vh (spec was ≥200vh)
- Morph windows 0.1–0.6 → next formation fully formed at 60% of the CURRENT
  chapter; last 40% of every chapter showed the wrong formation under the text

## Changes
- Heights: all story chapters 150→200vh, psa-map →300vh, epilogue stays 200vh
  → new total 1500vh (≈15.3k px at 1023px viewport)
- Morph windows: hold own formation through the first half — `morphStart: 0.55`,
  `morphEnd: 0.95` everywhere (epilogue keeps 0.3–0.7; its morph is a no-op,
  textMass→textMass). For chapters with `extraStages` (like `psa-map`), these
  fractions apply per-segment.
- Progress rail (JourneyPage): live percent + 7 chapter tick dots (active
  filled), `mix-blend-difference` dropped (extra compositing layer; plain
  `text-primary` now)

## Files
- `src/data/journeyData.ts` — heights + windows
- `src/views/JourneyPage.vue` — rail

## Accept
- Total runway measures ≈1500vh (`document.documentElement.scrollHeight /
  innerHeight` ≈ 15 + nav/footer)
- At any scroll position, the on-screen formation matches the on-screen
  chapter text until at least its 55% mark
- Rail shows % + dots; dot index matches visible chapter
