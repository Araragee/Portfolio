import type { Project } from '@/types/caseStudy'

export const projects: Project[] = [
  {
    slug: 'lms-ai-platform',
    index: '01',
    title: 'LMS-AI Platform',
    categoryLabel: 'EdTech / AI Integration',
    description:
      'Adaptive learning management system with real-time AI risk scoring, instructor intervention workflows, and student analytics dashboards.',
    backgroundImage:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    role: 'Lead Frontend Engineer',
    stack: 'Vue 3, Pinia, TypeScript, FastAPI, PostgreSQL',
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
        body: 'The frontend was architected around a strict separation between the AI data-layer (Pinia stores with typed API contracts) and the presentation layer. Vue 3 Composition API composables were used to encapsulate all real-time polling and risk calculation logic, keeping components declarative and testable.',
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
    slug: 'portfolio-architecture',
    index: '02',
    title: 'Portfolio Architecture',
    categoryLabel: 'Design System / Open Source',
    description:
      'Monolith Architectural design system — brutalist editorial aesthetic built entirely in Vue 3 + TypeScript + Tailwind with zero runtime dependencies.',
    backgroundImage:
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80',
    role: 'Architect & Developer',
    stack: 'Vue 3, TypeScript, Tailwind CSS, Vite',
    timeline: '2026',
    liveUrl: 'https://yourportfolio.com',
    introStatement:
      'A complete design system built from first principles — rejecting every UX convention in favor of the stark, structural clarity of brutalist print design. Typography is the interface. Whitespace is the layout. Color is prohibited.',
    heroImage:
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1400&q=80',
    sections: [
      {
        heading: 'The Philosophy',
        body: 'Most portfolio sites over-signal with gradients, glassmorphism, and particle effects. This system argues the opposite: that restraint is a technical statement. The discipline required to build a beautiful interface with only black, white, and a single serif — that is the portfolio.',
      },
      {
        heading: 'Design Token Architecture',
        body: 'All colors, spacing, and typography are defined as Tailwind design tokens, mapped directly to the Monolith Architectural spec. No ad-hoc utilities. No one-off values. Every visual decision is a function of the token system.',
        code: {
          filename: 'tailwind.config.js',
          content: `// Monolith Architectural tokens
colors: {
  surface: '#F9F9F8',       // warm off-white paper
  'on-surface': '#111111',  // near-black
  outline: '#E5E5E5',       // hairline divider
  secondary: '#888888',     // metadata grey
  primary: '#111111',       // CTA black
}`,
        },
      },
    ],
    gallery: [
      {
        src: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
        alt: 'Typography system detail',
      },
      {
        src: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&q=80',
        alt: 'Grid layout structure',
      },
    ],
  },
  {
    slug: 'enterprise-dashboard',
    index: '03',
    title: 'Enterprise Dashboard',
    categoryLabel: 'Internal Tooling / Data Viz',
    description:
      'Complex data visualization engine for internal analytics. Real-time KPI tracking, drill-down tables, and role-based access control in Vue 3.',
    backgroundImage:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    role: 'Senior Frontend Engineer',
    stack: 'Vue 3, TypeScript, D3.js, Pinia, Node.js',
    timeline: '2024',
    introStatement:
      'Rebuilding a legacy jQuery dashboard into a fully typed, reactive Vue 3 architecture — reducing time-to-insight for data analysts by 60% through intelligent data pre-fetching and component virtualization.',
    heroImage:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=80',
    sections: [
      {
        heading: 'The Challenge',
        body: "The existing dashboard rendered 10,000+ row tables synchronously, freezing the browser on every filter. The real challenge wasn't the data — it was the architectural debt of five years of jQuery patches.",
      },
      {
        heading: 'Implementation Strategy',
        body: 'Virtual scrolling with @tanstack/vue-virtual eliminated render bottlenecks. Pinia stores with smart caching reduced API calls by 70%. TypeScript strict mode enforced data contracts across 40+ components.',
      },
      {
        heading: 'Outcomes',
        body: 'P95 dashboard load time dropped from 4.2s to 800ms. PDF export was rebuilt as a headless Vue 3 render pipeline, eliminating a legacy PhantomJS dependency.',
      },
    ],
    gallery: [
      {
        src: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80',
        alt: 'Analytics charts view',
      },
      {
        src: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&q=80',
        alt: 'Data table interface',
      },
    ],
  },
  {
    slug: 'headless-storefront',
    index: '04',
    title: 'Headless Storefront',
    categoryLabel: 'E-Commerce Architecture',
    description:
      'Highly scalable headless commerce frontend using Nuxt 3, Pinia state management, and a fully typed Shopify Storefront API integration.',
    backgroundImage:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80',
    role: 'Frontend Architect',
    stack: 'Nuxt 3, Pinia, TypeScript, Shopify API, Tailwind',
    timeline: '2023',
    liveUrl: undefined,
    introStatement:
      'Decoupling a monolithic Shopify theme into a fully headless Nuxt 3 storefront — enabling independent frontend deployments, sub-100ms navigation via prefetching, and a typed GraphQL API layer.',
    heroImage:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&q=80',
    sections: [
      {
        heading: 'The Challenge',
        body: 'Shopify Liquid themes are tightly coupled to the platform renderer, making modern frontend tooling impossible. The goal was full decoupling while maintaining Shopify as the commerce engine.',
      },
      {
        heading: 'Implementation Strategy',
        body: 'Nuxt 3 with the Composition API provided the SSR + SPA hybrid model required. A typed GraphQL client with auto-generated types from the Shopify schema eliminated runtime type errors entirely.',
        code: {
          filename: 'composables/useCart.ts',
          content: `export function useCart() {
  const cart = useCartStore()
  
  async function addItem(variantId: string, quantity: number) {
    await cart.addToCart({ variantId, quantity })
    // Optimistic UI update before API confirms
  }
  
  return { cart, addItem }
}`,
        },
      },
    ],
    gallery: [
      {
        src: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80',
        alt: 'Product listing page',
      },
      {
        src: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80',
        alt: 'Shopping cart interface',
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
