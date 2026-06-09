import { ref, onMounted, onUnmounted } from 'vue'
import anime from 'animejs'

export interface ScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

/**
 * Simple entrance animation using anime.js.
 * Fades + slides element up when it enters the viewport.
 * Respects prefers-reduced-motion automatically.
 */
export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const { threshold = 0.1, rootMargin = '0px', once = true } = options

  const isVisible = ref(false)
  const elementRef = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null

  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

  const animateIn = (element: HTMLElement) => {
    isVisible.value = true

    if (prefersReducedMotion) {
      element.style.opacity = '1'
      element.style.transform = 'none'
      return
    }

    anime({
      targets: element,
      opacity: [0, 1],
      translateY: [24, 0],
      duration: 700,
      easing: 'easeOutCubic',
    })
  }

  onMounted(() => {
    if (!elementRef.value) return

    // Set initial state
    if (!prefersReducedMotion) {
      elementRef.value.style.opacity = '0'
      elementRef.value.style.transform = 'translateY(24px)'
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateIn(entry.target as HTMLElement)
            if (once) observer?.unobserve(entry.target)
          }
        })
      },
      { threshold, rootMargin }
    )

    observer.observe(elementRef.value)
  })

  onUnmounted(() => observer?.disconnect())

  return { elementRef, isVisible }
}

/**
 * Staggered entrance animation for lists of elements.
 * Each child animates in sequence with a configurable delay.
 */
export function useStaggerAnimation(options: ScrollAnimationOptions & { staggerDelay?: number } = {}) {
  const { threshold = 0.1, rootMargin = '0px', once = true, staggerDelay = 80 } = options

  const isVisible = ref(false)
  const containerRef = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null

  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

  const animateIn = (container: HTMLElement) => {
    isVisible.value = true
    const children = container.querySelectorAll('[data-stagger]')

    if (prefersReducedMotion) {
      children.forEach((child) => {
        ;(child as HTMLElement).style.opacity = '1'
        ;(child as HTMLElement).style.transform = 'none'
      })
      return
    }

    anime({
      targets: children,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 600,
      delay: anime.stagger(staggerDelay),
      easing: 'easeOutCubic',
    })
  }

  onMounted(() => {
    if (!containerRef.value) return

    // Set initial state on children
    if (!prefersReducedMotion) {
      const children = containerRef.value.querySelectorAll('[data-stagger]')
      children.forEach((child) => {
        ;(child as HTMLElement).style.opacity = '0'
        ;(child as HTMLElement).style.transform = 'translateY(20px)'
      })
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateIn(entry.target as HTMLElement)
            if (once) observer?.unobserve(entry.target)
          }
        })
      },
      { threshold, rootMargin }
    )

    observer.observe(containerRef.value)
  })

  onUnmounted(() => observer?.disconnect())

  return { containerRef, isVisible }
}
