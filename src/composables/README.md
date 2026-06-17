# Composables

Vue 3 Composition API utilities for the portfolio.

## Ownership & Lifecycle

| Composable | Owner | Constraint |
|---|---|---|
| `useLenis` | JourneyPage only | Singleton instance; no concurrent calls |
| `useReducedMotion` | Any | Reactive media query; lazy-loaded on first call |
| `useAnimatedReveal` | ChapterSection, PersonalPage | Uses anime.js; respects prefersReducedMotion |
| `useEventListener` | Any | Auto-cleanup on unmount; passive by default |
| `useIntersectionObserver` | Any | Returns visibility state; triggers once by default |
| `useScrollAnimation` | Scroll-triggered DOM animations | Entrance fade+slide; handles reduced motion |
| `useStaggerAnimation` | List item animations | Staggered entrance; respects reduced motion |

## Patterns

### Ref vs ShallowRef

- Use `shallowRef` for three.js objects (geometry, material, Points, cameras)
- Reason: Three objects are never reactive; shallow tracking saves memory and prevents unnecessary re-renders

### Return Types

- Always return refs/computed values, never functions that modify component state
- Example ❌: `return { updateX: (v) => x.value = v }`
- Example ✅: `const x = ref(); return { x, setX: (v) => { x.value = v } }`

### Event Listener Cleanup

Use `useEventListener` for all window/document addEventListener calls. It automatically removes listeners on unmount.

```ts
// ✅ Correct: auto-cleanup on unmount
useEventListener(window, 'scroll', onScroll, { passive: true })

// ❌ Avoid: manual cleanup needed
window.addEventListener('scroll', onScroll)
// ... onUnmounted must call removeEventListener
```

### Reduced Motion

Always respect `prefers-reduced-motion`. Use the `useReducedMotion` composable to check the preference reactively.

```ts
const { prefersReducedMotion } = useReducedMotion()

if (prefersReducedMotion.value) {
  // Snap to final state, no tween
} else {
  // Animate smoothly
}
```
