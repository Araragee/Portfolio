# Phase 4 — Storytelling Content

**Status: ✅ done** (2026-06-11)

## Goal

Real copy. Real projects. Story arc legible in one scroll.

## What was built

- **7 chapters with real copy** (`src/data/journeyData.ts`): voice first-person, concrete, no buzzwords. Arc: prologue → CS student → iPhitech internship → PSA map → PSA logo → side quests → epilogue
- **PSA split** (2 chapters): `psa-map` (300vh, archipelago formation, stat `110M+ Citizens`) + `psa-logo` (200vh, psaLogo formation, `isContinuation: true`, stat `Solid Responsive`)
- **`showProjects: true`** on projects chapter → `ChapterSection.vue` renders RouterLink list in text column
- **Stat callouts**: `stat: { value, label }` in chapter data, rendered as mono callout in text column

## Chapter map (final)

| index | id | era | heightVh | morphState | textSide |
|-------|----|-----|----------|-----------|----------|
| 000 | prologue | Prologue | 200 | scatter | left |
| 001 | student | CS student | 200 | tree | right |
| 002 | internship | iPhitech, Mar–May 2023 | 200 | grid | left |
| 003 | psa-map | PSA, Oct 2023 — now | 300 | archipelago | right |
| 003 | psa-logo | PSA, Oct 2023 — now | 200 | psaLogo | left (continuation) |
| 004 | projects | Freelance + personal | 200 | artifact | left |
| 005 | epilogue | Epilogue | 200 | textMass | center |

**Total runway: ~1500vh** (1509vh measured at 1023px viewport).

## Deferred

- SEO `@unhead/vue` meta for /journey — deferred to Phase 8

## Files changed

- `src/data/journeyData.ts` — all chapter content + fieldOffset on epilogue
- `src/types/journey.ts` — `isContinuation`, `stat`, `showProjects`, `TextSide`, `fieldOffset` fields
- `src/components/Journey/ChapterSection.vue` — stat block, projects list, continuation logic

## Verify

```bash
npm run type-check && npm run build
# /journey: scroll full runway — all 7 sections readable, copy matches arc
# psa-map: stat "110M+" visible; psa-logo: continuation (no index/era), stat "Solid"
# projects: RouterLink list renders in text column
```
