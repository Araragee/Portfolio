# Tweak Pass — Post Phase 1–6 Audit Fixes

**Status: ✅ done** (2026-06-11)

> Full detail in `docs/TWEAKS/` — this is the summary pointer for cold-start agents.

## Four fixes applied after phases 1–6

| Step | File | What | Decision |
|------|------|------|---------|
| A | `docs/TWEAKS/A-field-offset.md` | Particles slide opposite text column | fieldOffsetFor() helper; epilogue [0,-1.7] tuned iteratively |
| B | `docs/TWEAKS/B-loading-splash.md` | Splash screen, scroll locked until ready | 3-milestone chain: chunk→frame→fonts; lenis.stop() until journeyReady |
| C | `docs/TWEAKS/C-performance.md` | Hidden-tab pause, antialias off, camera continuity, leak fix | NO idle timeout (drift is intentional); hidden-tab only |
| D | `docs/TWEAKS/D-pacing.md` | 200vh+ chapters, late morph windows, rail upgrade | morphStart 0.55, morphEnd 0.95; 1500vh total; plain text rail |

## New file

`src/components/Journey/JourneyLoader.vue` — brutalist splash: wordmark `DG—25`, mono progress counter,
wipe-up exit (translateY '-100%', easeInCubic, 280ms). Eagerly imported in JourneyPage.

## Verify

```bash
npm run type-check && npm run build
# Hard reload /journey: splash shows %, lenis locked, wipes on ready
# Scroll: field always on opposite side of text
# Switch tab: loop stops; return: resumes
# Camera: no snap at any chapter boundary
# Rail: % + 7 dots; active dot matches visible chapter
```
