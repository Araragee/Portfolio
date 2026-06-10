# Phase Tracker — The Long Way Around

> Cold-start index. Each file documents status, decisions, files changed, and
> accept criteria for one phase. Read `docs/CONCEPT.md` + root `CLAUDE.md`
> before starting any phase.
>
> Verify any phase: `npm run type-check && npm run build`, then browser pass on
> `/journey` (console clean, scroll full runway).

| Phase | File | What | Status |
|-------|------|------|--------|
| 0 | [phase-0-scaffold.md](phase-0-scaffold.md) | Deps, types, store, composables, route | ✅ done |
| 1 | [phase-1-hero-canvas.md](phase-1-hero-canvas.md) | Hero layout, canvas hardening, FPS guard | ✅ done |
| 2 | [phase-2-scroll-story.md](phase-2-scroll-story.md) | Text reveals, progress rail | ✅ done |
| 3 | [phase-3-morph-polish.md](phase-3-morph-polish.md) | Stagger shader, camera dolly, render pause | ✅ done |
| 4 | [phase-4-content.md](phase-4-content.md) | Real copy, projects list, stat callouts | ✅ done |
| 5 | [phase-5-interactions.md](phase-5-interactions.md) | Per-chapter shader interactions | ✅ done |
| 6 | [phase-6-formations.md](phase-6-formations.md) | Archipelago, psaLogo, artifact formations | ✅ done |
| — | [tweak-pass.md](tweak-pass.md) | Post phase 1–6 audit fixes (A–D) | ✅ done |
| 7 | [phase-7-dither.md](phase-7-dither.md) | 1-bit dither postprocess, adaptive degrade, Lighthouse ≥90 | 🔜 next |
| 8 | [phase-8-make-it-site.md](phase-8-make-it-site.md) | Route swap, navbar restyle, a11y audit | ⬜ pending |
| 9 | [phase-9-qa-launch.md](phase-9-qa-launch.md) | Cross-browser, devices, host choice, rollback | ⬜ pending |
