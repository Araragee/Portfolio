<script setup lang="ts">
import { BufferAttribute, BufferGeometry, Points, ShaderMaterial, Vector3 } from 'three'
import { onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'
import { useLoop } from '@tresjs/core'
import { loadImageAndSample } from '@/utils/morphTargets'
import { useReducedMotion } from '@/composables/useReducedMotion'

const props = defineProps<{
  container: HTMLElement | null
}>()

const duckVertexShader = /* glsl */ `
attribute vec3 aColor;

uniform float uTime;
uniform vec3 uMouse;
uniform float uPointSize;
uniform float uDriftAmp;

varying float vAlpha;
varying vec3 vColor;

void main() {
  vec3 pos = position;
  vColor = aColor;
  
  // Idle drift
  pos.x += sin(uTime * 0.5 + position.y * 5.0) * 0.05 * uDriftAmp;
  pos.y += cos(uTime * 0.4 + position.x * 5.0) * 0.05 * uDriftAmp;

  // Hover scatter
  vec2 away = pos.xy - uMouse.xy;
  float dist = length(away);
  float force = smoothstep(1.5, 0.0, dist);
  
  pos.xy += normalize(away + vec2(0.0001)) * force * 0.3 * uDriftAmp;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = uPointSize * (3.0 / -mvPosition.z);

  vAlpha = 1.0 - force * 0.2;
}
`

const duckFragmentShader = /* glsl */ `
varying float vAlpha;
varying vec3 vColor;

void main() {
  gl_FragColor = vec4(vColor, vAlpha * 0.85);
}
`

const { prefersReducedMotion } = useReducedMotion()

const geometry = new BufferGeometry()
const uniforms = {
  uTime: { value: 0 },
  uMouse: { value: new Vector3(999, 999, 0) },
  uPointSize: { value: 3.0 },
  uDriftAmp: { value: 1.0 },
}

const material = new ShaderMaterial({
  vertexShader: duckVertexShader,
  fragmentShader: duckFragmentShader,
  uniforms,
  transparent: true,
  depthWrite: false,
})

const points = shallowRef<Points | null>(null)
let currentCount = 1500

function resolveAssetPath(path: string): string {
  const clean = path.startsWith('/') ? path.slice(1) : path
  return import.meta.env.BASE_URL + clean
}

onMounted(() => {
  loadImageAndSample(resolveAssetPath('/assets/duck.png'), currentCount, 2.5, {
    colorScale: true,
    maxDim: 64,
  }).then(({ positions, colors }) => {
    geometry.setAttribute('position', new BufferAttribute(positions, 3))
    geometry.setAttribute('aColor', new BufferAttribute(colors, 3))
    
    if (points.value) {
      points.value.geometry = geometry
    }
  })
})

const mouseTarget = new Vector3(999, 999, 0)

function onPointerMove(event: PointerEvent): void {
  if (!props.container) return
  const rect = props.container.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  const y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  mouseTarget.set(x * 2.0, y * 2.0, 0)
}

function onPointerLeave(): void {
  mouseTarget.set(999, 999, 0)
}

watch(() => props.container, (newContainer, oldContainer) => {
  if (oldContainer) {
    oldContainer.removeEventListener('pointermove', onPointerMove as EventListener)
    oldContainer.removeEventListener('pointerleave', onPointerLeave as EventListener)
  }
  if (newContainer) {
    newContainer.addEventListener('pointermove', onPointerMove as EventListener)
    newContainer.addEventListener('pointerleave', onPointerLeave as EventListener)
  }
}, { immediate: true })

const { onBeforeRender } = useLoop()

onBeforeRender(({ elapsed }) => {
  uniforms.uTime.value = elapsed
  uniforms.uDriftAmp.value = prefersReducedMotion.value ? 0.0 : 1.0
  uniforms.uMouse.value.lerp(mouseTarget, 0.1)
})

onBeforeUnmount(() => {
  if (props.container) {
    props.container.removeEventListener('pointermove', onPointerMove as EventListener)
    props.container.removeEventListener('pointerleave', onPointerLeave as EventListener)
  }
  geometry.dispose()
  material.dispose()
})
</script>

<template>
  <TresPerspectiveCamera :position="[0, 0, 4]" :fov="45" :look-at="[0,0,0]" />
  <primitive v-if="points" :object="points" />
  <TresPoints v-else ref="points" :geometry="geometry" :material="material" />
</template>
