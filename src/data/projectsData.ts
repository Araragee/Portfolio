import type { Project } from '@/types/caseStudy'

export const projects: Project[] = [
  {
    slug: 'cbms-portal',
    index: '01',
    title: 'CBMS Portal',
    categoryLabel: 'Government / Data Visualization',
    description:
      'Data-visualization portal for the Community-Based Monitoring System at the Philippine Statistics Authority — dashboards, geospatial views, and analyst tooling over national survey data.',
    backgroundImage:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    role: 'Lead Front-end Developer — PSA Central Office',
    stack: 'Vue 3, TypeScript, Pinia, Vuetify, ECharts, D3, Babylon.js, Laravel',
    timeline: '2022 — Present',
    liveUrl: undefined,
    introStatement:
      'A public-sector analytics portal surfacing CBMS indicators for policymakers and researchers. Built inside the PSA Central Office, the frontend is a typed Vue 3 application that renders millions of rows of municipal survey data through interactive dashboards, geographic layers, and exportable reports.',
    heroImage:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=80',
    sections: [
      {
        heading: 'The Challenge',
        body: 'National survey datasets are large, hierarchical, and politically sensitive. The portal had to let analysts drill from region → province → municipality → barangay without stalling the browser, while enforcing strict data-release rules. Legacy reporting at PSA relied on static PDFs — the ask was to replace that workflow with an interactive, typed, auditable web application.',
      },
      {
        heading: 'Implementation Strategy',
        body: 'A Vue 3 + Pinia core feeds a visualization layer built on ECharts, D3, and Observable Plot — each chart type wrapped in a composable so instrumentation, legends, and export behavior stay consistent. Vuetify handles dense data-table surfaces and form-heavy admin views; Babylon.js powers the 3D geographic scene. A Laravel service (via laravel-vite-plugin) brokers auth and data access between the client and the PSA data layer.',
        code: {
          filename: 'composables/useIndicator.ts',
          content: `import { storeToRefs } from 'pinia'
import { useIndicatorStore } from '@/stores/indicator'

export function useIndicator(code: string) {
  const store = useIndicatorStore()
  const { series, loading } = storeToRefs(store)

  async function load(level: GeoLevel, id: string) {
    await store.fetchSeries({ code, level, id })
  }

  return { series, loading, load }
}`,
        },
      },
      {
        heading: 'Outcomes',
        body: 'The portal is now the analyst-facing surface for CBMS rounds at PSA. Render-time for large indicator sets dropped from unusable to sub-second through virtualized tables, throttled store updates, and precomputed aggregates. The typed store layer has kept the codebase stable across three years of schema changes.',
      },
    ],
    gallery: [
      {
        src: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80',
        alt: 'Indicator dashboard view',
      },
      {
        src: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&q=80',
        alt: 'Drill-down data table',
      },
    ],
  },
  {
    slug: 'lms-ai-platform',
    index: '02',
    title: 'LMS-AI Platform',
    categoryLabel: 'EdTech / AI Integration',
    description:
      'Adaptive learning management system with real-time AI risk scoring, instructor intervention workflows, and student analytics dashboards.',
    backgroundImage:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    role: 'Full-stack Developer',
    stack: 'Vue 3, Pinia, TypeScript, FastAPI, PostgreSQL, Docker',
    timeline: '2025 — Present',
    liveUrl: undefined,
    introStatement:
      'A full-stack LMS platform where AI-driven risk models surface at-risk students in real time, enabling instructors to intervene before dropout occurs. Built with a strict TypeScript architecture and a Vue 3 Composition API throughout.',
    heroImage:
      'https://images.unsplash.com/photo-1484807352052-23338990c6c6?w=1400&q=80',
    sections: [
      {
        heading: 'The Challenge',
        body: 'Traditional LMS platforms surface student risk data too late — often only after exam failure. The challenge was building a predictive layer that updates in real-time as students interact with course content, and surfacing those signals to instructors in a usable workflow.',
      },
      {
        heading: 'Implementation Strategy',
        body: 'The frontend was architected around a strict separation between the AI data-layer (Pinia stores with typed API contracts) and the presentation layer. Vue 3 Composition API composables were used to encapsulate all real-time polling and risk calculation logic, keeping components declarative and testable. The FastAPI backend and PostgreSQL schema ship together via docker-compose.',
        code: {
          filename: 'stores/riskStore.ts',
          content: `import { defineStore } from 'pinia'
import type { StudentRisk, RiskLevel } from '@/types/risk'

export const useRiskStore = defineStore('risk', () => {
  const students = ref<StudentRisk[]>([])

  async function fetchRiskScores(courseId: number) {
    const response = await api.get(\`/courses/\${courseId}/risk-analysis\`)
    students.value = response.data
  }

  const atRiskStudents = computed(() =>
    students.value.filter(s => s.riskLevel === 'high')
  )

  return { students, atRiskStudents, fetchRiskScores }
})`,
        },
      },
      {
        heading: 'Visual Outcomes',
        body: 'The resulting dashboards strip away noise to surface only actionable signals. Each instructor view is context-aware — showing only the students, sections, and risk indicators relevant to their course load. Data density without visual clutter.',
      },
    ],
    gallery: [
      {
        src: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
        alt: 'Dashboard analytics view',
      },
      {
        src: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&q=80',
        alt: 'Risk scoring interface',
      },
    ],
  },
  {
    slug: 'nutrisipe',
    index: '03',
    title: 'OfficialNutrisipe',
    categoryLabel: 'Social / Recipe Platform',
    description:
      'A social recipe and nutrition platform with real-time messaging, OAuth login, and a Sanity-backed content pipeline. Live on Cloudflare Pages.',
    backgroundImage:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80',
    role: 'Front-end Developer',
    stack: 'React 17, Sanity CMS, Socket.io, Google OAuth, Tailwind',
    timeline: '2023',
    liveUrl: 'https://officialnutrisipe.pages.dev/',
    introStatement:
      'A Pinterest-style social platform for recipes and nutrition content — users publish, save, and discuss recipes in real time. The React client talks to a Sanity-managed content layer and a Socket.io service for live interactions.',
    heroImage:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&q=80',
    sections: [
      {
        heading: 'The Idea',
        body: 'Most recipe sites treat content as static. Nutrisipe frames recipes as social objects — saveable, remixable, and discussable. The product goal was to combine structured nutrition metadata with the low-friction browsing of a social feed.',
      },
      {
        heading: 'Implementation Strategy',
        body: 'Sanity provides the structured schema for recipes, ingredients, and author profiles, with image assets served through its CDN. A lightweight Socket.io service handles presence and live comment threads. Authentication is federated through Google OAuth, keeping onboarding to a single tap.',
      },
      {
        heading: 'Outcomes',
        body: 'Shipped to production at officialnutrisipe.pages.dev with a masonry feed, authenticated publishing, and real-time commenting. The Sanity schema has absorbed multiple content-model changes without migrations on the client.',
      },
    ],
    gallery: [
      {
        src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
        alt: 'Recipe feed view',
      },
      {
        src: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&q=80',
        alt: 'Recipe detail with nutrition info',
      },
    ],
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(p => p.slug === slug)
}

export function getNextProject(slug: string): Project | undefined {
  const idx = projects.findIndex(p => p.slug === slug)
  return projects[(idx + 1) % projects.length]
}
