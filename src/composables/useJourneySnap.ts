import type Lenis from 'lenis'
import { onBeforeUnmount, onMounted, type ShallowRef } from 'vue'

interface SnapOptions {
  /** The Lenis instance owning window scroll (from useLenis). */
  lenis: ShallowRef<Lenis | null>
  /** Snap targets in absolute scrollY px, ascending. Re-read each settle. */
  getAnchors: () => number[]
  /** Active chapter's morph progress, 0–1. Drives the commit decision. */
  getMorphT: () => number
  /** Gate: snap only when true (ready + motion allowed). */
  enabled: () => boolean
}

/**
 * Section-snapping on top of Lenis. Stations are held-formation rests from the
 * store; between them sits the morph band (particles animating). While the
 * particles are NOT animating (a hold) the user is free to rest and read — no
 * snap. The moment they push into the morph (morphT > 0) and stop, we glide to
 * a station: past the band midpoint completes to the next pin, before it snaps
 * back — the "lock". The glide scrubs the morph it passes. No-op while disabled
 * (e.g. reduced motion), so manual scrubbing still works.
 */
export function useJourneySnap(opts: SnapOptions): void {
  const { lenis, getAnchors, getMorphT, enabled } = opts

  let settleTimer = 0
  let safetyTimer = 0
  let isSnapping = false

  function clearSnapping(): void {
    isSnapping = false
  }

  /** Station to glide to from current y, or null to stay put. */
  function decideTarget(y: number): number | null {
    const anchors = getAnchors()
    if (anchors.length < 2) return null

    let lo = anchors[0]
    let hi = anchors[anchors.length - 1]
    for (const a of anchors) {
      if (a <= y) lo = a
      if (a >= y) {
        hi = a
        break
      }
    }
    if (lo === hi) return null // past the last station

    const mt = getMorphT()
    if (mt <= 0.001) return null // resting in a hold (card centered) — leave it
    return mt >= 0.5 ? hi : lo // mid-morph/lead-out → complete; barely in → revert
  }

  function trySnap(): void {
    if (!enabled() || isSnapping) return
    const l = lenis.value
    if (!l) return
    const y = window.scrollY
    const target = decideTarget(y)
    if (target == null || Math.abs(target - y) < 6) return

    isSnapping = true
    const dist = Math.abs(target - y)
    const duration = Math.min(1.2, Math.max(0.5, dist / (window.innerHeight * 1.6)))
    l.scrollTo(target, {
      duration,
      easing: (t: number) => 1 - Math.pow(1 - t, 3), // easeOutCubic
      lock: true,
      onComplete: clearSnapping,
    })
    // Safety: clear the guard even if onComplete is missed (interrupted glide)
    window.clearTimeout(safetyTimer)
    safetyTimer = window.setTimeout(clearSnapping, duration * 1000 + 400)
  }

  function onScroll(): void {
    if (!enabled() || isSnapping) return
    window.clearTimeout(settleTimer)
    settleTimer = window.setTimeout(trySnap, 140)
  }

  onMounted(() => {
    lenis.value?.on('scroll', onScroll)
  })

  onBeforeUnmount(() => {
    lenis.value?.off('scroll', onScroll)
    window.clearTimeout(settleTimer)
    window.clearTimeout(safetyTimer)
  })
}
