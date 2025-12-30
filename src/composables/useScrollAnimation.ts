import { ref, onMounted, onUnmounted } from 'vue'
import anime from 'animejs'

export interface ScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

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
      translateY: [50, 0],
      duration: 800,
      easing: 'easeOutCubic'
    })
  }

  const animateOut = (element: HTMLElement) => {
    if (!once) {
      isVisible.value = false

      anime({
        targets: element,
        opacity: [1, 0],
        translateY: [0, 50],
        duration: 600,
        easing: 'easeInCubic'
      })
    }
  }

  onMounted(() => {
    if (!elementRef.value) return

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateIn(entry.target as HTMLElement)
            if (once) {
              observer?.unobserve(entry.target)
            }
          } else {
            animateOut(entry.target as HTMLElement)
          }
        })
      },
      {
        threshold,
        rootMargin
      }
    )

    observer.observe(elementRef.value)
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return {
    elementRef,
    isVisible
  }
}

// Staggered text animation
export function useTextStagger(delay: number = 50) {
  const animateText = (element: HTMLElement) => {
    const text = element.textContent || ''
    element.innerHTML = ''

    const chars = text.split('').map((char) => {
      const span = document.createElement('span')
      span.textContent = char === ' ' ? '\u00A0' : char
      span.style.display = 'inline-block'
      span.style.opacity = '0'
      return span
    })

    chars.forEach((span) => element.appendChild(span))

    anime({
      targets: chars,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 600,
      delay: anime.stagger(delay),
      easing: 'easeOutCubic'
    })
  }

  return {
    animateText
  }
}

// Scroll progress
export function useScrollProgress() {
  const scrollProgress = ref(0)

  const updateScrollProgress = () => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    scrollProgress.value = (scrollTop / docHeight) * 100
  }

  onMounted(() => {
    window.addEventListener('scroll', updateScrollProgress, { passive: true })
    updateScrollProgress()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', updateScrollProgress)
  })

  return {
    scrollProgress
  }
}
