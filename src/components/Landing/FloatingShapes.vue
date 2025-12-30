<script setup lang="ts">
import { ref, onMounted } from 'vue'
import anime from 'animejs'

interface Shape {
  id: number
  type: 'circle' | 'square' | 'triangle' | 'hexagon'
  size: number
  x: number
  y: number
  rotation: number
  duration: number
  delay: number
}

const shapes = ref<Shape[]>([])
const containerRef = ref<HTMLElement | null>(null)

// Generate random shapes
const generateShapes = (count: number = 15) => {
  const shapeTypes: Shape['type'][] = ['circle', 'square', 'triangle', 'hexagon']

  for (let i = 0; i < count; i++) {
    shapes.value.push({
      id: i,
      type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
      size: Math.random() * 100 + 50, // 50-150px
      x: Math.random() * 100, // 0-100%
      y: Math.random() * 100, // 0-100%
      rotation: Math.random() * 360,
      duration: Math.random() * 10000 + 10000, // 10-20s
      delay: Math.random() * 2000
    })
  }
}

onMounted(() => {
  generateShapes()

  // Animate shapes
  shapes.value.forEach((shape, index) => {
    const element = document.getElementById(`shape-${shape.id}`)
    if (element) {
      anime({
        targets: element,
        translateY: [
          { value: -30, duration: shape.duration / 2 },
          { value: 0, duration: shape.duration / 2 }
        ],
        translateX: [
          { value: Math.random() * 40 - 20, duration: shape.duration / 2 },
          { value: 0, duration: shape.duration / 2 }
        ],
        rotate: [
          { value: shape.rotation + 360, duration: shape.duration }
        ],
        loop: true,
        easing: 'easeInOutSine',
        delay: shape.delay
      })
    }
  })
})

const getShapeClass = (type: Shape['type']) => {
  const baseClass = 'absolute opacity-20 dark:opacity-10'
  switch (type) {
    case 'circle':
      return `${baseClass} rounded-full bg-gradient-to-br from-primary-400 to-accent-400`
    case 'square':
      return `${baseClass} bg-gradient-to-br from-accent-400 to-primary-400`
    case 'triangle':
      return `${baseClass} bg-gradient-to-br from-primary-300 to-accent-300`
    case 'hexagon':
      return `${baseClass} bg-gradient-to-br from-accent-300 to-primary-300`
    default:
      return baseClass
  }
}

const getShapeStyle = (shape: Shape) => {
  return {
    width: `${shape.size}px`,
    height: `${shape.size}px`,
    left: `${shape.x}%`,
    top: `${shape.y}%`,
    transform: `rotate(${shape.rotation}deg)`
  }
}
</script>

<template>
  <div ref="containerRef" class="absolute inset-0 overflow-hidden pointer-events-none">
    <div
      v-for="shape in shapes"
      :id="`shape-${shape.id}`"
      :key="shape.id"
      :class="getShapeClass(shape.type)"
      :style="getShapeStyle(shape)"
    >
      <!-- Triangle shape using clip-path -->
      <div
        v-if="shape.type === 'triangle'"
        class="w-full h-full"
        style="clip-path: polygon(50% 0%, 0% 100%, 100% 100%)"
      ></div>

      <!-- Hexagon shape using clip-path -->
      <div
        v-if="shape.type === 'hexagon'"
        class="w-full h-full"
        style="clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)"
      ></div>
    </div>
  </div>
</template>

<style scoped>
/* Additional animations can be added here */
</style>
