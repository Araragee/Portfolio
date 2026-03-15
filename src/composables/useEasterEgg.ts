import { ref } from 'vue'
import anime from 'animejs'

export function useEasterEgg() {
  const isEasterEggActive = ref(false)
  const clickCount = ref(0)
  const lastClickTime = ref(0)

  // Confetti particles
  const createConfetti = () => {
    const colors = ['#0ea5e9', '#d946ef', '#06b6d4', '#8b5cf6', '#ec4899']
    const confettiCount = 50
    const container = document.createElement('div')
    container.className = 'confetti-container fixed inset-0 pointer-events-none z-[9998]'
    document.body.appendChild(container)

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div')
      confetti.className = 'confetti absolute w-3 h-3 rounded-full'
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      confetti.style.left = `${Math.random() * 100}%`
      confetti.style.top = '-10px'
      container.appendChild(confetti)

      anime({
        targets: confetti,
        translateY: window.innerHeight + 50,
        translateX: (Math.random() - 0.5) * 400,
        rotate: Math.random() * 720,
        opacity: [1, 0],
        duration: 2000 + Math.random() * 1000,
        easing: 'easeOutCubic',
        delay: Math.random() * 200,
        complete: () => {
          confetti.remove()
        }
      })
    }

    // Remove container after animations complete
    setTimeout(() => {
      container.remove()
    }, 4000)
  }

  // Shake animation
  const shakeElement = (element: HTMLElement) => {
    anime({
      targets: element,
      translateX: [
        { value: -10, duration: 50 },
        { value: 10, duration: 50 },
        { value: -10, duration: 50 },
        { value: 10, duration: 50 },
        { value: 0, duration: 50 }
      ],
      easing: 'easeInOutQuad'
    })
  }

  // Spin animation
  const spinElement = (element: HTMLElement) => {
    anime({
      targets: element,
      rotate: [0, 360],
      duration: 600,
      easing: 'easeInOutCubic'
    })
  }

  // Color flash animation
  const flashColors = (element: HTMLElement) => {
    const colors = ['#0ea5e9', '#d946ef', '#06b6d4', '#8b5cf6', '#ec4899']
    let currentIndex = 0

    const interval = setInterval(() => {
      element.style.filter = `hue-rotate(${currentIndex * 60}deg)`
      currentIndex++

      if (currentIndex >= 6) {
        clearInterval(interval)
        element.style.filter = ''
      }
    }, 100)
  }

  // Main easter egg trigger
  const triggerEasterEgg = (element: HTMLElement) => {
    const now = Date.now()

    // Reset counter if more than 2 seconds between clicks
    if (now - lastClickTime.value > 2000) {
      clickCount.value = 0
    }

    clickCount.value++
    lastClickTime.value = now

    // Trigger different effects based on click count
    if (clickCount.value === 3) {
      shakeElement(element)
    } else if (clickCount.value === 5) {
      spinElement(element)
      flashColors(element)
    } else if (clickCount.value >= 7) {
      // Full easter egg activation
      isEasterEggActive.value = true
      createConfetti()
      spinElement(element)

      // Play success sound (if you add audio)
      // const audio = new Audio('/sounds/success.mp3')
      // audio.play()

      // Show notification
      showEasterEggNotification()

      // Reset after 3 seconds
      setTimeout(() => {
        isEasterEggActive.value = false
        clickCount.value = 0
      }, 3000)
    }
  }

  const notification = ref<string | null>(null)

  // Show notification
  const showEasterEggNotification = () => {
    notification.value = '🎉 You found the easter egg! 🎉'

    setTimeout(() => {
      notification.value = null
    }, 3000)
  }

  // Konami code easter egg
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
  const konamiProgress = ref<string[]>([])

  const checkKonamiCode = (key: string) => {
    konamiProgress.value.push(key)

    if (konamiProgress.value.length > konamiCode.length) {
      konamiProgress.value.shift()
    }

    if (JSON.stringify(konamiProgress.value) === JSON.stringify(konamiCode)) {
      // Trigger special konami code effect
      createConfetti()
      createConfetti() // Double confetti!
      showEasterEggNotification()
      konamiProgress.value = []
    }
  }

  return {
    isEasterEggActive,
    triggerEasterEgg,
    checkKonamiCode,
    createConfetti,
    shakeElement,
    spinElement,
    notification
  }
}
