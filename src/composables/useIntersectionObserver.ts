import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export interface UseIntersectionObserverOptions {
  threshold?: number | number[]
  rootMargin?: string
  once?: boolean
  immediate?: boolean
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    once = true,
    immediate = false
  } = options

  const elementRef = ref<HTMLElement | null>(null)
  const isVisible = ref(immediate)
  const hasTriggered = ref(false)

  let observer: IntersectionObserver | null = null

  const observe = () => {
    if (!elementRef.value) return

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true
            hasTriggered.value = true

            if (once && observer) {
              observer.unobserve(entry.target)
            }
          } else if (!once) {
            isVisible.value = false
          }
        })
      },
      {
        threshold,
        rootMargin
      }
    )

    observer.observe(elementRef.value)
  }

  onMounted(() => {
    observe()
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return {
    elementRef,
    isVisible,
    hasTriggered
  }
}

// Multi-element observer
export function useMultiIntersectionObserver(
  count: number,
  options: UseIntersectionObserverOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    once = true
  } = options

  const elementRefs = ref<Array<HTMLElement | null>>([])
  const visibilityStates = ref<boolean[]>(Array(count).fill(false))

  let observer: IntersectionObserver | null = null

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = elementRefs.value.indexOf(entry.target as HTMLElement)
          if (index !== -1 && entry.isIntersecting) {
            visibilityStates.value[index] = true

            if (once && observer) {
              observer.unobserve(entry.target)
            }
          } else if (!once && index !== -1) {
            visibilityStates.value[index] = false
          }
        })
      },
      {
        threshold,
        rootMargin
      }
    )

    elementRefs.value.forEach((el) => {
      if (el && observer) {
        observer.observe(el)
      }
    })
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  const setRef = (index: number) => (el: HTMLElement | null) => {
    elementRefs.value[index] = el
  }

  return {
    setRef,
    visibilityStates,
    elementRefs
  }
}
