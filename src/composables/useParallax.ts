import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export interface ParallaxOptions {
  speed?: number
  direction?: 'vertical' | 'horizontal' | 'both'
  offset?: number
}

export function useParallax(options: ParallaxOptions = {}) {
  const { speed = 0.5, direction = 'vertical', offset = 0 } = options

  const elementRef = ref<HTMLElement | null>(null)
  const transform = ref('')

  let ticking = false

  const updateParallax = () => {
    if (!elementRef.value) return

    const scrollY = window.scrollY
    const rect = elementRef.value.getBoundingClientRect()
    const elementTop = rect.top + scrollY
    const elementHeight = rect.height
    const viewportHeight = window.innerHeight

    // Calculate if element is in viewport
    const isInViewport = scrollY + viewportHeight > elementTop && scrollY < elementTop + elementHeight

    if (isInViewport) {
      const scrolled = scrollY - elementTop + viewportHeight
      const parallaxValue = (scrolled - offset) * speed

      if (direction === 'vertical') {
        transform.value = `translateY(${parallaxValue}px)`
      } else if (direction === 'horizontal') {
        transform.value = `translateX(${parallaxValue}px)`
      } else if (direction === 'both') {
        transform.value = `translate(${parallaxValue}px, ${parallaxValue}px)`
      }
    }

    ticking = false
  }

  const requestTick = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax)
      ticking = true
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', requestTick, { passive: true })
    updateParallax()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', requestTick)
  })

  return {
    elementRef,
    transform
  }
}

// Mouse parallax effect
export function useMouseParallax(intensity: number = 20) {
  const elementRef = ref<HTMLElement | null>(null)
  const transform = ref('')

  const handleMouseMove = (event: MouseEvent) => {
    if (!elementRef.value) return

    const rect = elementRef.value.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = (event.clientX - centerX) / rect.width
    const deltaY = (event.clientY - centerY) / rect.height

    const moveX = deltaX * intensity
    const moveY = deltaY * intensity

    transform.value = `translate(${moveX}px, ${moveY}px)`
  }

  onMounted(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove)
  })

  return {
    elementRef,
    transform
  }
}

// Multi-layer parallax
export function useMultiLayerParallax() {
  const layers: Ref<Array<{ ref: Ref<HTMLElement | null>; speed: number }>> = ref([])

  let ticking = false

  const updateLayers = () => {
    const scrollY = window.scrollY

    layers.value.forEach(({ ref: layerRef, speed }) => {
      if (layerRef.value) {
        const transform = scrollY * speed
        layerRef.value.style.transform = `translateY(${transform}px)`
      }
    })

    ticking = false
  }

  const requestTick = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateLayers)
      ticking = true
    }
  }

  const addLayer = (speed: number = 0.5) => {
    const layerRef = ref<HTMLElement | null>(null)
    layers.value.push({ ref: layerRef, speed })
    return layerRef
  }

  onMounted(() => {
    window.addEventListener('scroll', requestTick, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', requestTick)
  })

  return {
    addLayer,
    layers
  }
}
