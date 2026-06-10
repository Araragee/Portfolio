# Phase 9 — QA & Launch

**Status: ⬜ pending** (start after Phase 8 verified)

## Goal

Ship it. Cross-browser, cross-device, one host chosen, rollback plan in place.

## Pre-launch checklist

### Browser matrix

- [ ] Chrome (latest) — primary dev browser; should be fully verified at this point
- [ ] Safari macOS (latest) — WebGL differences: check dither pass color math, check Lenis scroll
- [ ] Safari iOS (latest) — mobile: verify particle count breakpoint, touch interactions, no scroll jank
- [ ] Firefox (latest) — check GLSL precision, any shader warnings in console
- [ ] Mid Android Chrome — throttle test: adaptive degrade ladder fires at correct tier

### Device matrix

- [ ] 4K desktop — DPR=2, large viewport; verify formations don't look sparse
- [ ] 13" MacBook — standard target; all phases verified here
- [ ] Mid Android phone — throttle + touch; verify FPS guard + degrade
- [ ] Older iPhone (12 or earlier) — WebGL 1 fallback if WebGL 2 unavailable; check `useWebGLSupport`

### SPA fallback

Repo has both netlify and vercel configs. CLAUDE.md says GitHub Pages is the target.
**Choose one** before launch:

| Host | SPA fallback | Notes |
|------|-------------|-------|
| GitHub Pages | `404.html` redirect hack | Free; needs `404.html = index.html` |
| Netlify | `_redirects: /* /index.html 200` | Free tier, cleaner SPA support |
| Vercel | `vercel.json` rewrites | Free tier, fastest cold start |

**Recommended: Netlify** — cleaner SPA support than gh-pages hack, simpler than Vercel config.
Document chosen host in root `CLAUDE.md`.

### Rollback plan

- [ ] Tag pre-launch commit: `git tag v1.0.0-pre-launch`
- [ ] The `/` swap (Phase 8) is one revert away: `git revert <route-swap-commit>`
- [ ] Document rollback steps in root `CLAUDE.md`

### Final checks

- [ ] `npm run type-check` — green
- [ ] `npm run build` — green, no warnings about missing assets (known pre-existing: `src/assets/projects/` images — acceptable)
- [ ] Lighthouse /journey ≥ 90 perf (already enforced in Phase 7; re-run after Phase 8 changes)
- [ ] Console clean on all target browsers
- [ ] No `TODO` or placeholder copy remaining in journeyData.ts
- [ ] Old `HomePage.vue` — decide: keep at `/classic` or delete (get explicit approval from Dave before delete)
- [ ] `src/assets/projects/` missing images — either add or remove RouterLinks to missing case studies

## Launch

```bash
npm run build
# deploy dist/ to chosen host
```

## Accept

- [ ] `/` works on all 5 browser/device combinations
- [ ] No 404 on direct link to `/journey` (SPA fallback working)
- [ ] Tag exists: `git tag --list | grep pre-launch`
- [ ] Host documented in CLAUDE.md
- [ ] Dave reviewed and approved the live URL

## Gotchas

- iOS Safari: `lenis` scroll may compete with native rubber-band — test `touch-action: none` if needed
- Firefox GLSL: `hash()` function in shader uses bitwise ops — verify no precision errors
- GitHub Pages: custom domain needs CNAME file in `public/` or repo settings
