# E — Mobile field/text vertical split

**Status: ✅ done** (verified in browser 2026-06-18, 390×844 mobile viewport,
all 7 chapters screenshotted)

## Problem
On phones (<768px) the counter-side field offset from tweak A is disabled
(`uOffsetScale.x = 0` — no room for a side column), so every formation lands
dead-center. The text column is also full-width and vertically centered there,
so the two stack on top of each other: particles render straight through the
copy. Classic mobile collision.

## Goal
On phones, push the field into one screen half and drop the text into the
other, **alternating per chapter** so neighbouring sections don't read the same
way:

- particles **top** → text **bottom**
- particles **bottom** → text **top**

…flipping each section. md+ is untouched (keeps the side-by-side layout).

## Design
Single source of truth for the alternation so the field offset and the text
alignment can never drift apart:

- `mobileParticlesOnTop(chapterIndex)` in `journeyData.ts` — `index % 2 === 0`.
  `true` → particles take the TOP half. Prologue (index 0, hero) opts out: its
  layout already reserves a band for the name particles.
- `MOBILE_FIELD_OFFSET_Y = 1.45` (world units) — lifts/drops the formation into
  its half. Rides the existing `uOffsetScale.y` (left live on mobile), so it
  needs no shader change.
- `stores/journey.ts`: `isMobile` ref (set by ParticleField on mount/resize via
  `setIsMobile`). New `offsetForChapter(chapter, index)` swaps the desktop
  horizontal slide for `[0, ±MOBILE_FIELD_OFFSET_Y]` on phones (index > 0). It
  replaces the three `fieldOffsetFor()` calls inside `morphInfo`, so the field
  interpolates between halves across a cross-chapter morph for free.
- `ChapterSection.vue`: `stickyAlignStyle` aligns the sticky text to the
  opposite half on mobile — `items-end pb-16` when particles are on top,
  `items-start pt-24` when on the bottom — and restores `md:items-center` from
  md up. Hero (prologue) stays centered.

## Files
- `src/data/journeyData.ts` — `mobileParticlesOnTop`, `MOBILE_FIELD_OFFSET_Y`
- `src/stores/journey.ts` — `isMobile` + `setIsMobile`, `offsetForChapter`
- `src/components/Journey/ParticleField.vue` — `store.setIsMobile()` on
  mount/resize
- `src/components/Journey/ChapterSection.vue` — alternating mobile text align

## Accept
- Phone (<768px): in every chapter the field and text occupy opposite halves;
  the half they occupy alternates section to section. No overlap.
- The projects chapter (tall deck) keeps its text top-aligned — its index lands
  on particles-bottom, so the existing top-align is preserved, not regressed.
- Epilogue: DAVXLOPER name sits in the top half, contact copy in the bottom
  (previously the name's `[0, -1.9]` offset drove it through the centered text).
- md+ unchanged: side-by-side counter-offset layout from tweak A still holds.
- Desktop offsets untouched (`isMobile` false → `fieldOffsetFor` as before).
