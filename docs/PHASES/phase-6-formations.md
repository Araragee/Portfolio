# Phase 6 — Real Data Formations

**Status: ✅ done** (2026-06-11)

## Goal

Formations look like data, not placeholders. PSA chapter earns the census field name.

## Formations (all in `src/utils/morphTargets.ts`)

| id | function | shape |
|----|----------|-------|
| `scatter` | `createScatter` | uniform random, gentle z-spread |
| `tree` | `createTree` | recursive binary tree, branch segments |
| `grid` | `createGrid` | flat pixel grid with z-wave |
| `archipelago` | `createArchipelago` | gaussian island clusters (PH silhouette approximation) |
| `psaLogo` | `createPsaLogo` | wireframe globe (lat/lon lines, R=1.3) + 3 sweeping arrows |
| `artifact` | `createArtifact` | tilted ring + dense core |
| `textMass` | `createTextMass(count, 'TALK')` | 2D canvas sampled glyph positions |

### psaLogo detail

- Lat lines: 9 parallels from −80° to +80°
- Lon lines: 12 meridians
- 3 arrows: sweeping arc shape, distributed rotationally

### archipelago

- Gaussian island clusters approximating PH lat/lon spread
- True point-in-polygon geo sampling deferred (current reads well at render scale)

### textMass note

- MUST be re-sampled after `document.fonts.ready` — uses 2D canvas text render
- `createTextMass` is exported for re-sampling: `JourneyPage.vue` calls it on `store.fontsLoaded`

## Same particle count rule

All formations use the same count (16k desktop / 7k mobile). Buffer swapped at chapter boundary, never resized. Seeded PRNG (mulberry32) ensures deterministic positions on rebuild.

## Files changed

- `src/utils/morphTargets.ts` — all 7 formation functions + `buildMorphTargets` + `particleCountForViewport`
- `src/data/journeyData.ts` — morphState assignments per chapter

## Verify

```bash
npm run type-check && npm run build
# /journey psa-map: archipelago looks like scattered islands
# /journey psa-logo: globe wireframe visible with arrows
# /journey epilogue: TALK text mass readable (correct font)
# Resize across 768px: formations rebuild, same shapes
```
