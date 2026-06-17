# Non-Negotiable Constraints

These rules enforce architectural integrity and prevent subtle bugs. Violations are reverted.

## WebGL

- **One context per route.** Each route owns 0 or 1 TresCanvas. Never add a second `<TresCanvas>` on the same page.
- **Lazy three chunk.** `three` and `@tresjs/core` must live in the lazy `vendor-three` chunk. Never import three from eagerly-loaded code (`main.ts`, `router`, `navbar`).
- **Shallow three objects.** All geometry, material, texture, camera refs use `shallowRef`. Three objects are never reactive; shallow tracking saves memory.
- **Disposal pattern.** Every geometry, material, and observer is disposed in `onBeforeUnmount`. Use the DISPOSAL PATTERN comment to mark the cleanup section.

## Scroll & State

- **Single scroll writer.** Only `JourneyPage` calls `store.setScrollProgress()`. Scroll state is the single source of truth.
- **Seeded PRNG.** All particle formations use `createRng(seed)` for deterministic, repeatable layout. No random() without seeding.
- **Reduced motion.** Every animation with motion (anime.js, Lenis, CSS transitions) has a `prefersReducedMotion` branch. Snap to final state instantly; don't tween.

## DOM & Styles

- **No inline styles.** `:style=""` forbidden. Use computed classes + Tailwind only. Exception: dynamic numeric values (opacity, transform) that vary per scroll position.
- **Static Tailwind.** Class strings must be literal strings. No template strings with `${}`. Use computed lookups for variant maps.
- **Dark mode.** Every styled element has dark-mode variants (`dark:bg-zinc-800`, `dark:text-zinc-200`, etc.).

## Composition API

- **Always `<script setup lang="ts">`.** No Options API, no class components. Named exports only (no default exports from composables).
- **`defineProps` with TypeScript generics.** Use `PropType<>` for union/complex types.
- **Props always have defaults.** No `required: true`; omit the default to signal required props.
- **Script order:** Imports → Types → defineProps/defineEmits → Refs → Computed → Functions → Lifecycle → Watchers.

## Pinia

- **One store: `useJourneyStore`.** Scroll progress, morph state, degradation tier, readiness flags all live here.
- **Composition-style only.** `defineStore()` with function syntax. No options object.
- **Single writer rule applies.** Scroll progress written only by JourneyPage.

## Testing & Validation

- **No hard-coded secrets.** No API keys, tokens, or credentials in code.
- **Input validation at boundaries.** Validate user input, API responses. Don't validate internal function arguments.
- **Lazy code must have one check.** Any non-trivial logic (branch, loop, morph calculation) left one runnable self-check behind: `assert`, demo fn, or small unit test.

## File & Folder Structure

```
src/
  components/
    Core/              # App shell (navbar, footer, sidebar)
    Journey/           # Journey/home page features
    CaseStudy/         # Case study decorative + structure
    Manifest/          # Old portfolio (duck particles, etc.)
    Shared/            # Reusable UI (lazy-image, seo-head)
  composables/         # use*.ts utilities
  stores/              # Pinia stores
  types/               # TypeScript interfaces + types
  utils/               # Helper functions
  shaders/             # GLSL shader code
  assets/              # Static assets
  views/               # Page-level components
  data/                # Content + config
  constants/           # Global constants
```

## Git & CI

- `npm run type-check` must be green before any push.
- `npm run build` must succeed with no new warnings.
- Commit messages: verb tense (refactor, fix, feat, docs), clear scope, no ticket numbers in the message body (use PR description).

## Performance

- **Chunk sizes.** Verify `vendor-three` stays lazy; dev server chunk analysis.
- **Memory leaks.** Check DevTools heap snapshots after unmounting scenes. Geometry/material disposal must be visible in heap.
- **Frame time.** Canvas frame rate should sustain 60fps on modern hardware. Monitor with DevTools Performance tab.

## What NOT to Do

- ❌ No Vuex (use Pinia)
- ❌ No echarts.init() directly (use vue-echarts wrapper)
- ❌ No `<script lang="ts">` without setup (use `<script setup lang="ts">`)
- ❌ No default exports from composables (use named exports)
- ❌ No new Axios instances (reuse existing)
- ❌ No unrequested abstractions (YAGNI principle)
