# Tweak Pass — Post Phase 1–6 Audit Fixes

> Resume-from-cold tracker. Each step has its own file with status, file list,
> decisions, and verification commands. Update the status line in each file as
> you work — this folder is the source of truth if the session dies mid-task.
>
> Audit that produced these steps: see git history 2026-06-10 + `docs/CONCEPT.md`.

| Step | File | What | Status |
|------|------|------|--------|
| A | [A-field-offset.md](A-field-offset.md) | Particles slide opposite the text column | ✅ done |
| B | [B-loading-splash.md](B-loading-splash.md) | Splash screen, scroll locked until ready | ✅ done |
| C | [C-performance.md](C-performance.md) | Hidden-tab render pause, antialias off, camera fix, leaks | ✅ done |
| D | [D-pacing.md](D-pacing.md) | 200vh+ chapters, late morph windows, rail upgrade | ✅ done |
| E | [E-mobile-split.md](E-mobile-split.md) | Mobile: field/text split into alternating top/bottom halves | ✅ done |

Verify any step: `npm run type-check && npm run build`, then browser pass on
`/journey` (console clean, scroll full runway, check the step's accept list).

Audit bugs fixed by these steps: camera dolly pop (C), fake idle pause (C),
visibilitychange leak (C), formation/text desync (D), inline style + id-based
special-casing (A), 100ms stagger / 600ms reveals (C).
