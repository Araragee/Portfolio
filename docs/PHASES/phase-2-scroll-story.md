# Phase 2 — Scroll & Story Structure

**Status: ✅ done** (2026-06-11)

## Goal

Chapters read as a story. Copy animates in. Scroll position has a visible indicator.

## What was built

- **Text reveals** (`ChapterSection.vue`): `IntersectionObserver` on each text block; on first intersection → anime.js translateY entrance, `once: true`. Stagger 40ms, duration 450ms, `easeOutCubic`. `prefersReducedMotion` skips tween (opacity set instantly).
- **Layout offsets**: text column width + margin set by `textSide` computed lookup (`left` → `md:w-1/2`, `right` → `md:w-1/2 md:ml-auto`, `center` → `md:w-3/5 md:mx-auto md:text-center`). No id-based conditionals.
- **Progress rail** (`JourneyPage.vue`): fixed-position mono strip — live `{{ scrollPercent }}%` + 7 tick squares (filled = active chapter). No `mix-blend-difference` (removed: extra compositing layer).
- **`isContinuation` prop**: hides index/era/title for continuation chapters (psa-logo uses this).
- **`stat` block**: conditional inside text column — `{ value: string; label: string }` in chapter data.
- **`showProjects` flag**: renders a RouterLink list of projects in the chapter text column.

## Key decisions

- `once: true` on IntersectionObserver — reveals fire once, never re-animate on scroll-back
- Stagger capped at 40ms (≤50ms rule from 12-principles)
- Rail uses plain `text-primary` — `mix-blend-difference` dropped because it added a compositing layer with no visual benefit at this palette (monochrome)
- Text column uses computed lookup (Tailwind static classes), no inline style

## Files changed

- `src/components/Journey/ChapterSection.vue`
- `src/views/JourneyPage.vue`
- `src/types/journey.ts` — `isContinuation`, `stat`, `showProjects` fields

## Deferred (not blocking)

- Anchor deep-links `/journey#psa` → Lenis `scrollTo`
- Navbar auto-hide (journey has no visible navbar overlay — deferred to Phase 8)

## Verify

```bash
npm run type-check && npm run build
# /journey: scroll slowly — each chapter's text slides in once; rail percent + dots update
# prefers-reduced-motion: enable in OS → text visible immediately, no tween
# epilogue: center layout, no index/era on psa-logo chapter
```
