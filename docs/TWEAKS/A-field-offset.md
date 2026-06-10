# A — Counter-side field offset

**Status: ✅ done** (verified in browser 2026-06-11; epilogue fieldOffset tuned to [0, -1.7])

## Goal
Formation slides to the OPPOSITE side of the chapter's text column so they never
collide (text right → field left). Data-driven; kills all `chapter.id` string
special-casing in `ChapterSection.vue`.

## Design
- `JourneyChapter` gains: `textSide: 'left' | 'right' | 'center'`,
  `fieldOffset?: [x, y]` (explicit override), `layout?: 'hero'`,
  `isContinuation?`, `showProjects?`, `stat?: { value, label }`
- `fieldOffsetFor(chapter)` in `journeyData.ts`: left text → `[+2.1, 0]`,
  right → `[-2.1, 0]`, center → `[0, 0]`, override wins (epilogue `[0, -1.1]`
  pushes TALK below the centered text)
- Store exposes `fieldOffsetFrom` / `fieldOffsetTo` (active chapter / next)
- Shader: `uniform vec2 uOffsetFrom, uOffsetTo` + `uOffsetScale`;
  `pos.xy += mix(uOffsetFrom, uOffsetTo, t) * uOffsetScale` with the SAME eased
  t as the formation morph → field slides while it morphs
- `uOffsetScale`: 0 below 768px (mobile keeps field centered), 1 otherwise;
  updated in the existing resize handler
- Side rhythm: prologue L / student R / internship L / psa-map R / psa-logo L /
  projects L / epilogue center

## Files
- `src/types/journey.ts` — new fields
- `src/data/journeyData.ts` — sides + `fieldOffsetFor`
- `src/stores/journey.ts` — offset computeds
- `src/shaders/particles.ts` — offset uniforms in vertex shader
- `src/components/Journey/ParticleField.vue` — uniform sync + scale on resize
- `src/components/Journey/ChapterSection.vue` — `textSide` lookup replaces id
  checks; stat block joins text column; hero layout via `layout: 'hero'`

## Accept
- psa-map: globe/map left, text right — no overlap at any scroll position
- Field visibly slides across during each chapter transition
- Mobile (<768px): field centered, no offset
- No `chapter.id ===` conditionals left in ChapterSection
