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

const generateShapes = (count: number = 10) => {
  const shapeTypes: Shape['type'][] = ['circle', 'square', 'triangle', 'hexagon']
  for (let i = 0; i < count; i++) {
    shapes.value.push({
      id: i,
      type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
      size: Math.random() * 80 + 30,
      x: Math.random() * 100,
      y: Math.random() * 100,
      rotation: Math.random() * 360,
      duration: Math.random() * 10000 + 12000,
      delay: Math.random() * 2000
    })
  }
}

onMounted(() => {
  generateShapes()
  shapes.value.forEach((shape) => {
    const element = document.getElementById(`shape-${shape.id}`)
    if (element) {
      anime({
        targets: element,
        translateY: [{ value: -24, duration: shape.duration / 2 }, { value: 0, duration: shape.duration / 2 }],
        translateX: [{ value: Math.random() * 32 - 16, duration: shape.duration / 2 }, { value: 0, duration: shape.duration / 2 }],
        rotate: [{ value: shape.rotation + 360, duration: shape.duration }],
        loop: true,
        easing: 'easeInOutSine',
        delay: shape.delay
      })
    }
  })
})

const getShapeClass = (type: Shape['type']) => {
  const base = 'absolute'
  switch (type) {
    case 'circle':
      return `${base} rounded-full`
    case 'square':
      return `${base} rounded-sm`
    default:
      return base
  }
}

const getShapeStyle = (shape: Shape) => {
  const isOrange = shape.id % 3 !== 0
  const color = isOrange ? 'rgba(255, 107, 43,' : 'rgba(15, 118, 110,'
  const opacity = 0.06 + (shape.id % 4) * 0.02

  return {
    width: `${shape.size}px`,
    height: `${shape.size}px`,
    left: `${shape.x}%`,
    top: `${shape.y}%`,
    transform: `rotate(${shape.rotation}deg)`,
    border: `1px solid ${color}${opacity + 0.04})`,
    background: `${color}${opacity})`,
  }
}
</script>

<template>
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div
      v-for="shape in shapes"
      :id="`shape-${shape.id}`"
      :key="shape.id"
      :class="getShapeClass(shape.type)"
      :style="getShapeStyle(shape)"
    >
      <div
        v-if="shape.type === 'triangle'"
        class="w-full h-full"
        style="clip-path: polygon(50% 0%, 0% 100%, 100% 100%)"
      ></div>
      <div
        v-if="shape.type === 'hexagon'"
        class="w-full h-full"
        style="clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)"
      ></div>
    </div>
  </div>
</template>
