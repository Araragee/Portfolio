<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useEventListener } from '@/composables/useEventListener'
import { useReducedMotion } from '@/composables/useReducedMotion'

interface Beat {
  layer: string
  heading: string
  body: string
}

// Top → bottom of the laptop. One beat per part, read in this order.
const beats: Beat[] = [
  {
    layer: 'Lid',
    heading: 'Built to be replaced',
    body: 'I write code that is meant to be read, debugged, and eventually replaced. No clever tricks that save five lines but take an hour to understand. I assume someone else will open this up.',
  },
  {
    layer: 'Display',
    heading: 'Performance budgets',
    body: 'I keep an eye on bundle sizes and render times. A fast, responsive interface makes users trust the system. Slow apps usually mean someone got lazy with dependencies.',
  },
  {
    layer: 'Keyboard',
    heading: 'Consistency over novelty',
    body: 'Years on the CBMS Portal taught me that consistency beats the latest framework feature. Established patterns, the same keys in the same place, every time.',
  },
  {
    layer: 'Logic board',
    heading: 'Strict TypeScript',
    body: 'Strict mode and explicit types. If the compiler cannot catch it, the runtime will, and I would rather fix it in the editor.',
  },
  {
    layer: 'Battery',
    heading: 'Composables',
    body: 'Vue 3 changed how I write front-ends. State and logic live in small, testable composables that power the UI, not in huge monolithic component files.',
  },
  {
    layer: 'Bottom case',
    heading: 'Deleting code',
    body: 'The best pull requests remove lines. If logic or a component is no longer used, it goes. Dead code is weight the whole machine carries.',
  },
]

const runwayRef = ref<HTMLElement | null>(null)
const progress = ref(0)
const { prefersReducedMotion } = useReducedMotion()

// Scroll script, as fractions of the runway:
// closed → parts lift off one by one → one beat per part → reassemble.
const EXPLODE: [number, number] = [0.06, 0.16]
const BEATS: [number, number] = [0.22, 0.88]
const ASSEMBLE: [number, number] = [0.9, 0.97]
/** Each part starts moving this much later than the one above it. */
const STAGGER = 0.012
const BEAT_SPAN = (BEATS[1] - BEATS[0]) / beats.length
/** Resting height of each part in the closed laptop (px, top → bottom). */
const CLOSED_Z = [26, 22, 16, 11, 8, 0]

const runwayStyle = computed(() => (prefersReducedMotion.value ? 'py-24' : 'h-[700vh]'))
const stageStyle = computed(() =>
  prefersReducedMotion.value
    ? 'grid gap-12 lg:grid-cols-[3fr_2fr] lg:items-center'
    : 'sticky top-0 grid h-screen grid-rows-[3fr_2fr] lg:grid-cols-[3fr_2fr] lg:grid-rows-1 lg:items-center',
)

// The exploded stack grows upward on screen (translateZ · sin 58°); slide the
// rig down by half that so the whole stack stays centred in the stage.
const rigStyle = computed(() => {
  const lifted = beats.reduce((sum, _, i) => sum + explode(i), 0) / beats.length
  const shift = (lifted * (beats.length - 1) * partGap() * 0.85) / 2
  return { transform: `translateY(${shift}px) rotateX(58deg) rotateZ(-36deg)` }
})

/** Active beat: -1 intro, 0…n-1 parts, n outro. */
const activeBeat = computed(() => {
  const p = progress.value
  if (p < BEATS[0]) return -1
  if (p >= BEATS[1]) return beats.length
  return Math.min(beats.length - 1, Math.floor((p - BEATS[0]) / BEAT_SPAN))
})

function window01(p: number, [a, b]: [number, number]): number {
  return Math.min(1, Math.max(0, (p - a) / (b - a)))
}

function ease(t: number): number {
  return t * t * (3 - 2 * t)
}

/** 0 closed → 1 exploded → 0 closed. Top parts lift first and land last. */
function explode(i: number): number {
  if (prefersReducedMotion.value) return 1
  const p = progress.value
  const lift = window01(p, [EXPLODE[0] + i * STAGGER, EXPLODE[1] + i * STAGGER])
  const land = window01(p, [ASSEMBLE[0] + (beats.length - 1 - i) * STAGGER * 0.5, ASSEMBLE[1]])
  return ease(lift) - ease(land)
}

/** 0→1→0 plateau while part i holds its beat. */
function focus(i: number): number {
  const t = (progress.value - BEATS[0] - i * BEAT_SPAN) / BEAT_SPAN
  if (t <= 0 || t >= 1) return 0
  return ease(Math.min(1, t / 0.2)) * (1 - ease(Math.max(0, (t - 0.8) / 0.2)))
}

/** Vertical spacing between exploded parts; fits the stack to short viewports. */
function partGap(): number {
  return Math.min(window.innerWidth < 1024 ? 46 : 80, window.innerHeight * 0.075)
}

/** Wrapper transform + `--o` opacity that each face/slab reads, so the 3D stack never flattens. */
function partStyle(i: number): Record<string, string> {
  const gap = partGap()
  const fromTop = beats.length - 1 - i
  const e = explode(i)
  const z = CLOSED_Z[i] + e * (fromTop * gap + 6 - CLOSED_Z[i])
  // A slight tilt while in flight sells the "lifted off" read; gone once settled
  const tilt = Math.sin(e * Math.PI) * (i % 2 ? 2 : -2)
  if (prefersReducedMotion.value) return { transform: `translateZ(${z}px)` }

  const f = focus(i)
  const dim = window01(progress.value, [BEATS[0] - 0.02, BEATS[0]]) * (1 - window01(progress.value, [BEATS[1], BEATS[1] + 0.02]))
  return {
    transform: `translateZ(${z + f * 24}px) translateX(${f * (window.innerWidth < 1024 ? 32 : 72)}px) rotateY(${tilt}deg)`,
    '--o': String(1 - dim * (1 - f) * 0.9),
  }
}

let measuredTop = 0
let measuredSpan = 1
let frame = 0

function measure(): void {
  const el = runwayRef.value
  if (!el) return
  measuredTop = el.getBoundingClientRect().top + window.scrollY
  measuredSpan = Math.max(1, el.offsetHeight - window.innerHeight)
}

function onScroll(): void {
  if (frame) return
  frame = requestAnimationFrame(() => {
    frame = 0
    progress.value = Math.min(1, Math.max(0, (window.scrollY - measuredTop) / measuredSpan))
  })
}

useEventListener(window, 'scroll', onScroll, { passive: true })
useEventListener(window, 'resize', () => {
  measure()
  onScroll()
})

onMounted(() => {
  measure()
  onScroll()
})
</script>

<template>
  <section ref="runwayRef" class="relative overflow-x-clip" :class="runwayStyle" aria-labelledby="manifesto-heading">
    <div class="px-5 sm:px-6 md:px-12" :class="stageStyle">
      <!-- Stage: an exploded-view laptop drawn in CSS 3D (decorative).
           Every face reads opacity from its part's --o so dimming never flattens the slabs. -->
      <div class="-ml-8 flex items-center justify-center pt-16 lg:ml-0 lg:pt-0 [perspective:2400px]" aria-hidden="true">
        <div class="relative h-[11rem] w-[17rem] sm:h-[16rem] sm:w-[25rem] lg:h-[18rem] lg:w-[28rem] xl:h-[23.5rem] xl:w-[36rem] [transform-style:preserve-3d]"
          :style="rigStyle"
        >
          <!-- 0 Lid: plain aluminium shell -->
          <div class="absolute inset-0 [transform-style:preserve-3d]" :style="partStyle(0)">
            <div class="absolute inset-0 border border-primary/30 bg-[#a3a3a1] [opacity:var(--o,1)] [transform:translateZ(-3px)]" />
            <div class="absolute inset-0 border border-primary/30 bg-gradient-to-br from-[#dcdcda] via-[#cfcfcd] to-[#b6b6b4] [opacity:var(--o,1)]" />
          </div>

          <!-- 1 Display: bezel, panel, notch -->
          <div class="absolute inset-0 [transform-style:preserve-3d]" :style="partStyle(1)">
            <div class="absolute inset-0 bg-[#050505] [opacity:var(--o,1)] [transform:translateZ(-2px)]" />
            <div class="absolute inset-0 bg-[#0d0d0d] p-[2.5%] [opacity:var(--o,1)]">
              <div class="relative h-full w-full overflow-hidden bg-gradient-to-br from-[#262626] to-[#050505]">
                <span class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.07] to-transparent" />
                <span class="absolute left-1/2 top-0 h-[5%] w-[12%] -translate-x-1/2 bg-[#0d0d0d]" />
              </div>
            </div>
          </div>

          <!-- 2 Top case: speakers, keyboard, trackpad -->
          <div class="absolute inset-0 [transform-style:preserve-3d]" :style="partStyle(2)">
            <div class="absolute inset-0 border border-primary/30 bg-[#a9a9a7] [opacity:var(--o,1)] [transform:translateZ(-3px)]" />
            <div class="absolute inset-0 flex flex-col items-center border border-primary/30 bg-gradient-to-b from-[#d8d8d6] to-[#c6c6c4] px-[4%] pt-[4%] [opacity:var(--o,1)]">
              <div class="flex h-[50%] w-full gap-[2.5%]">
                <span class="w-[9%] bg-[radial-gradient(#6f6f6d_1px,transparent_1.2px)] [background-size:5px_5px]" />
                <div class="grid flex-1 grid-cols-[repeat(14,1fr)] grid-rows-[0.55fr_repeat(5,1fr)] gap-[2px] bg-[#151515] p-[3px]">
                  <span v-for="k in 84" :key="k" class="bg-[#2c2c2c]" />
                </div>
                <span class="w-[9%] bg-[radial-gradient(#6f6f6d_1px,transparent_1.2px)] [background-size:5px_5px]" />
              </div>
              <span class="mt-[4%] h-[36%] w-[44%] border border-primary/20 bg-[#cbcbc9]" />
            </div>
          </div>

          <!-- 3 Logic board: strip along the hinge, SoC, memory, fans -->
          <div class="absolute inset-0 [transform-style:preserve-3d]" :style="partStyle(3)">
            <div class="absolute inset-x-[4%] top-[3%] h-[40%] bg-[#0c0f0d] [opacity:var(--o,1)] [transform:translateZ(-2px)]" />
            <div class="absolute inset-x-[4%] top-[3%] flex h-[40%] items-center gap-[3%] border border-[#2b332e] bg-[#161c18] px-[3%] [opacity:var(--o,1)]">
              <span class="grid aspect-square h-[78%] place-items-center rounded-full border border-[#3a3a3a] bg-[#1f1f1f]">
                <span class="h-[30%] w-[30%] rounded-full bg-[#3a3a3a]" />
              </span>
              <div class="flex h-[80%] flex-1 items-center justify-center gap-[4%]">
                <span class="h-[70%] w-[10%] bg-[#2a2a2a]" />
                <span class="grid aspect-square h-full place-items-center bg-[#8f8f8d]">
                  <span class="h-[62%] w-[62%] bg-[#5c5c5a]" />
                </span>
                <span class="h-[70%] w-[10%] bg-[#2a2a2a]" />
                <div class="flex h-[70%] w-[18%] flex-col gap-[8%]">
                  <span class="flex-1 bg-[#2a2a2a]" />
                  <span class="flex-1 bg-[#2a2a2a]" />
                </div>
              </div>
              <span class="grid aspect-square h-[78%] place-items-center rounded-full border border-[#3a3a3a] bg-[#1f1f1f]">
                <span class="h-[30%] w-[30%] rounded-full bg-[#3a3a3a]" />
              </span>
            </div>
          </div>

          <!-- 4 Battery: six cells across the front -->
          <div class="absolute inset-0 [transform-style:preserve-3d]" :style="partStyle(4)">
            <div class="absolute inset-x-[7%] bottom-[5%] h-[48%] bg-[#0a0a0a] [opacity:var(--o,1)] [transform:translateZ(-3px)]" />
            <div class="absolute inset-x-[7%] bottom-[5%] grid h-[48%] grid-cols-3 grid-rows-2 gap-[2%] [opacity:var(--o,1)]">
              <span v-for="c in 6" :key="c" class="flex flex-col justify-center gap-[10%] border border-[#333] bg-[#1b1b1b] px-[8%]">
                <span class="h-[6%] w-1/2 bg-[#4a4a48]" />
                <span class="h-[6%] w-1/3 bg-[#3a3a38]" />
              </span>
            </div>
          </div>

          <!-- 5 Bottom case: inner face, vents, screw posts -->
          <div class="absolute inset-0 [transform-style:preserve-3d]" :style="partStyle(5)">
            <div class="absolute inset-0 border border-primary/30 bg-[#9c9c9a] [opacity:var(--o,1)] [transform:translateZ(-6px)]" />
            <div class="absolute inset-0 border border-primary/30 bg-[#acacaa] [opacity:var(--o,1)] [transform:translateZ(-3px)]" />
            <div class="absolute inset-0 border border-primary/30 bg-gradient-to-b from-[#cececc] to-[#bebebc] [opacity:var(--o,1)]">
              <span class="absolute inset-x-[10%] top-[3%] h-[3%] bg-[repeating-linear-gradient(90deg,#8a8a88_0_2px,transparent_2px_6px)]" />
              <span class="absolute left-[2.5%] top-[4%] h-2 w-2 rounded-full border border-primary/40 bg-[#b0b0ae]" />
              <span class="absolute right-[2.5%] top-[4%] h-2 w-2 rounded-full border border-primary/40 bg-[#b0b0ae]" />
              <span class="absolute bottom-[4%] left-[2.5%] h-2 w-2 rounded-full border border-primary/40 bg-[#b0b0ae]" />
              <span class="absolute bottom-[4%] right-[2.5%] h-2 w-2 rounded-full border border-primary/40 bg-[#b0b0ae]" />
              <span class="absolute bottom-[4%] left-1/2 h-2 w-2 -translate-x-1/2 rounded-full border border-primary/40 bg-[#b0b0ae]" />
            </div>
          </div>
        </div>
      </div>

      <!-- Copy: one beat visible at a time (reduced motion: all, as a list) -->
      <div class="relative lg:pl-10" :class="prefersReducedMotion ? 'space-y-10' : 'h-full lg:h-80'">
        <div
          class="transition-opacity duration-300"
          :class="[
            prefersReducedMotion ? '' : 'absolute inset-x-0 top-0',
            prefersReducedMotion || activeBeat === -1 ? 'opacity-100' : 'pointer-events-none opacity-0',
          ]"
        >
          <span class="mb-4 block font-mono text-caption uppercase text-secondary">About the work</span>
          <h1 id="manifesto-heading" class="mb-6 font-headline text-heading-xl font-semibold text-primary">
            How I work
          </h1>
          <p class="max-w-md font-body text-body leading-relaxed text-secondary">
            Good software is like a laptop: layers someone else will open one day. Scroll to take mine apart.
          </p>
        </div>

        <div
          v-for="(beat, i) in beats"
          :key="beat.layer"
          class="transition-opacity duration-300"
          :class="[
            prefersReducedMotion ? '' : 'absolute inset-x-0 top-0',
            prefersReducedMotion || activeBeat === i ? 'opacity-100' : 'pointer-events-none opacity-0',
          ]"
        >
          <span class="mb-4 block font-mono text-caption uppercase text-secondary">
            0{{ i + 1 }} / {{ beat.layer }}
          </span>
          <h2 class="mb-4 font-headline text-heading font-semibold text-primary">{{ beat.heading }}</h2>
          <p class="max-w-md font-body text-body-sm leading-relaxed text-on-surface-variant">{{ beat.body }}</p>
        </div>

        <div
          class="transition-opacity duration-300"
          :class="[
            prefersReducedMotion ? '' : 'absolute inset-x-0 top-0',
            prefersReducedMotion || activeBeat === beats.length ? 'opacity-100' : 'pointer-events-none opacity-0',
          ]"
        >
          <span class="mb-4 block font-mono text-caption uppercase text-secondary">Assembled</span>
          <h2 class="mb-4 font-headline text-heading font-semibold text-primary">Then it ships</h2>
          <p class="max-w-md font-body text-body-sm leading-relaxed text-on-surface-variant">
            Every layer gets opened, fixed, and eventually replaced. I build so that part is boring.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
