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
 */
export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const { threshold = 0.1, rootMargin = '0px', once = true } = options

  const isVisible = ref(false)
  const elementRef = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null

  const animateIn = (element: HTMLElement) => {
    isVisible.value = true
    anime({
      targets: element,
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 700,
      easing: 'easeOutCubic',
    })
  }

  onMounted(() => {
    if (!elementRef.value) return

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
