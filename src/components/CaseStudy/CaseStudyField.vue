<script setup lang="ts">
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Points,
  ShaderMaterial,
  Vector2,
  Vector3,
} from 'three'
import { onBeforeUnmount, shallowRef } from 'vue'
import { useLoop } from '@tresjs/core'
import { buildMorphTargets, particleCountForViewport } from '@/utils/morphTargets'
import { particleFragmentShader, particleVertexShader } from '@/shaders/particles'
import { useReducedMotion } from '@/composables/useReducedMotion'

const { prefersReducedMotion } = useReducedMotion()

// Cap at 1500 — this is a decorative echo, not the main field
const count = Math.min(particleCountForViewport(window.innerWidth), 1500)
const targets = buildMorphTargets(count)

const geometry = new BufferGeometry()
geometry.setAttribute('position', new BufferAttribute(targets.scatter.slice(), 3))
geometry.setAttribute('aPositionTo', new BufferAttribute(targets.scatter.slice(), 3))

const uniforms = {
  uTime: { value: 0 },
  uProgress: { value: 0 },
  uMouse: { value: new Vector3(999, 999, 0) },
  uPointSize: { value: 2.5 },
  uDriftAmp: { value: 0.4 },
  uColor: { value: new Color('#111111') },
  uOpacity: { value: 0.35 },
  uDither: { value: 1.0 },
  uRepelRadius: { value: 0.6 },
  uRepelStrength: { value: 0.15 },
  uChapterIndex: { value: 0 },
  uInteractState: { value: 0 },
  uInteractPos: { value: new Vector3() },
  uOffsetFrom: { value: new Vector2() },
  uOffsetTo: { value: new Vector2() },
  uOffsetScale: { value: 0 },
  uFormationScale: { value: 0.85 },
}

const material = new ShaderMaterial({
  vertexShader: particleVertexShader,
  fragmentShader: particleFragmentShader,
  uniforms,
  transparent: true,
  depthWrite: false,
})

const points = shallowRef(new Points(geometry, material))
points.value.frustumCulled = false

const mouseTarget = new Vector3(999, 999, 0)
const HALF_HEIGHT = Math.tan((45 / 2) * (Math.PI / 180)) * 8

function onPointerMove(e: PointerEvent): void {
  const ndcX = (e.clientX / window.innerWidth) * 2 - 1
  const ndcY = -((e.clientY / window.innerHeight) * 2 - 1)
  const aspect = window.innerWidth / window.innerHeight
  mouseTarget.set(ndcX * HALF_HEIGHT * aspect, ndcY * HALF_HEIGHT, 0)
}

window.addEventListener('pointermove', onPointerMove, { passive: true })

const { onBeforeRender } = useLoop()

onBeforeRender(({ elapsed }) => {
  uniforms.uTime.value = elapsed
  uniforms.uDriftAmp.value = prefersReducedMotion.value ? 0 : 0.4
  uniforms.uMouse.value.lerp(mouseTarget, 0.06)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove)
  geometry.dispose()
  material.dispose()
})
</script>

<template>
  <primitive :object="points" />
</template>
