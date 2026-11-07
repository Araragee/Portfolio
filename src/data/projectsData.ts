import type { Project } from '@/types/caseStudy'

export const projects: Project[] = [
  {
    slug: 'e-permits',
    index: '01',
    // U+2011 non-breaking hyphen: keeps the title on one line in narrow columns
    title: 'e‑Permits',
    categoryLabel: 'Government / Permit Processing',
    description:
      'End-to-end permit system for the Department of Human Settlements and Urban Development — real estate developers file online, and every DHSUD desk from intake to the Regional Director processes the case in one place.',
    backgroundImage: new URL('@/assets/projects/epermits-hero.png', import.meta.url).href,
    role: 'Full-stack Developer — DHSUD',
    stack: 'Vue 3, TypeScript, Tailwind v4, Pinia, ECharts, Laravel 13, Sanctum, PostgreSQL, Docker',
    timeline: 'Jul 2026 — Present',
    introStatement:
      'e-Permits digitizes how DHSUD receives, reviews, and approves real estate development permits. Developers file applications, upload plans, pay, and answer deficiencies online; staff move each case through the official procedure — Intake, Evaluation, Issuance of Notices, Division Chief review, Regional Director approval, and Release — with every permit and license printed on its prescribed DHSUD form.',
    heroImage: new URL('@/assets/projects/epermits-hero.png', import.meta.url).href,
    sections: [
      {
        heading: 'Paper routing, rebuilt as a workflow',
        body: 'Permit applications used to travel between desks as paper, with no single view of where a case sat or how long it had waited. The system had to follow the official DHSUD procedure exactly, enforce who may act at each stage, and keep the 15-day service level honest by aging a case only while it sits on a desk.',
      },
      {
        heading: 'How it is put together',
        body: 'A typed Vue 3 and Pinia frontend talks to a Laravel 13 API secured with Sanctum, backed by PostgreSQL. Cases route themselves to the regional office covering the property, then to the least busy desk. Case movements are all-or-nothing, so an interrupted step can never leave a case stuck between stages. Deficiency notices tie to the exact requirement, send reminders at day 30, day 60 and the deadline, and a Notice to Comply pauses the office clock. Files up to 500MB upload in chunks, and every re-upload keeps its earlier version.',
      },
      {
        heading: 'Where it stands',
        body: 'The system produces every Certificate of Registration, License to Sell, and Temporary and Conditional License on its official form, with executive dashboards for the Secretary, the Bureau, and each Regional Office built on live figures. Releases are automated with rollback, backups run on schedule on DHSUD servers, and every item from the quality assurance and user acceptance reviews has been closed.',
      },
    ],
    gallery: [],
  },
  {
    slug: 'cbms-portal',
    index: '02',
    title: 'CBMS Portal',
    categoryLabel: 'Government / Data Visualization',
    description:
      'Data-visualization portal for the Community-Based Monitoring System at the Philippine Statistics Authority — featuring 17 SDG tables, custom dashboard makers, and interactive dashboards for data visualization.',
    backgroundImage: new URL('@/assets/projects/cbms-hero.png', import.meta.url).href,
    role: 'Lead Front-end Developer — PSA Central Office',
    stack: 'Vue 3, TypeScript, Pinia, Vuetify, ECharts, D3, Babylon.js, Laravel',
    timeline: '2023 — 2026',
    liveUrl: 'https://cbmsportal.psa.gov.ph',
    introStatement:
      'A public-sector analytics portal surfacing CBMS indicators for policymakers and researchers. Built inside the PSA Central Office, the frontend is a typed Vue 3 application that surfaces 17 SDG tables and custom dashboard makers through interactive dashboards, geographic layers, and exportable reports.',
    heroImage: new URL('@/assets/projects/cbms-hero.png', import.meta.url).href,
    sections: [
      {
        heading: 'The problem with static PDFs',
        body: 'National survey datasets are large, hierarchical, and politically sensitive. The portal had to let analysts drill from region to province to municipality to barangay without stalling the browser, while enforcing strict data-release rules. Legacy reporting at PSA relied on static PDFs. The ask was to replace that workflow with an interactive, typed, auditable web application.',
      },
      {
        heading: 'How the frontend is put together',
        body: 'A Vue 3 and Pinia core feeds a visualization layer built on ECharts, D3, and Observable Plot. Each chart type is wrapped in a composable so instrumentation, legends, and export behavior stay consistent. We built custom dashboard makers and interactive dashboards for data visualization to render 17 SDG tables dynamically. Vuetify handles dense data-table surfaces and form-heavy admin views, while Babylon.js powers the 3D geographic scene. A Laravel service brokers auth and data access between the client and the PSA data layer.',
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
        heading: 'Where it landed',
        body: 'The portal is now the analyst-facing surface for CBMS rounds at PSA, supporting custom dashboard makers and interactive dashboards for data visualization across 17 SDG tables. Render-time for large indicator sets dropped from unusable to sub-second through virtualized tables, throttled store updates, and precomputed aggregates. The typed store layer has kept the codebase stable across schema changes.',
      },
    ],
    gallery: [
      {
        src: new URL('@/assets/projects/cbms-01.png', import.meta.url).href,
        alt: 'Indicator dashboard, region drill-down view',
      },
      {
        src: new URL('@/assets/projects/cbms-02.png', import.meta.url).href,
        alt: 'Indicator dashboard, municipality drill-down view',
      },
    ],
  },
  {
    slug: 'lms-ai-platform',
    index: '03',
    title: 'LMS-AI Platform',
    categoryLabel: 'EdTech / AI Integration',
    description:
      'Adaptive learning management system with real-time AI risk scoring, instructor intervention workflows, and student analytics dashboards.',
    backgroundImage: new URL('@/assets/projects/lms-hero.png', import.meta.url).href,
    role: 'Full-stack Developer',
    stack: 'Vue 3, Pinia, TypeScript, FastAPI, PostgreSQL, Docker',
    timeline: '2025 — Present',
    liveUrl: 'https://lms-ai-frontend.onrender.com/',
    introStatement:
      'A full-stack LMS platform where AI risk models surface at-risk students in real time, enabling instructors to intervene before dropout occurs. Built with a strict TypeScript architecture and Vue 3 Composition API.',
    heroImage: new URL('@/assets/projects/lms-hero.png', import.meta.url).href,
    sections: [
      {
        heading: 'Why risk scores arrive too late',
        body: 'Traditional LMS platforms surface student risk data too late, often only after exam failure. The goal was building a predictive layer that updates in real-time as students interact with course content, surfacing those signals to instructors in a usable workflow.',
      },
      {
        heading: 'Architecture',
        body: 'The frontend separates the AI data layer (Pinia stores with typed API contracts) from the presentation layer. Vue 3 Composition API composables encapsulate real-time polling and risk calculation logic, keeping components declarative and testable. The FastAPI backend and PostgreSQL schema ship together via docker-compose.',
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
        heading: 'What instructors see now',
        body: 'The resulting dashboards strip away noise to surface actionable signals. Each instructor view is context-aware, showing only the students, sections, and risk indicators relevant to their course load.',
      },
    ],
    gallery: [
      {
        src: new URL('@/assets/projects/lms-01.png', import.meta.url).href,
        alt: 'Instructor dashboard analytics view',
      },
      {
        src: new URL('@/assets/projects/lms-02.png', import.meta.url).href,
        alt: 'Student risk scoring interface',
      },
    ],
  },
  {
    slug: 'nutrisipe',
    index: '04',
    title: 'Nutrisipe',
    categoryLabel: 'Social / Recipe Platform',
    description:
      'A food-first social recipe platform with recipe forking, automatic macro calculations, meal planning, stories, and real-time messaging. Rebuilt from React and Sanity into a typed Vue 3 and Express stack.',
    backgroundImage: new URL('@/assets/projects/nutrisipe-hero.png', import.meta.url).href,
    role: 'Solo Developer',
    stack: 'Vue 3, TypeScript, Pinia, Tailwind, HeadlessUI, Express, Prisma, PostgreSQL, Socket.IO',
    timeline: '2023 — 2026',
    liveUrl: 'https://nutrisipe-frontend.onrender.com/',
    introStatement:
      'Nutrisipe answers one question — what to cook tonight — with a visual, social-first feed instead of text-heavy blog posts. Recipes are treated as social objects: saveable, remixable, and nutritionally transparent. Users can fork existing recipes into their own variations, plan weekly meals on a drag-and-drop calendar, and generate grocery lists from the plan.',
    heroImage: new URL('@/assets/projects/nutrisipe-hero.png', import.meta.url).href,
    sections: [
      {
        heading: 'The daily dinner question',
        body: 'Most recipe platforms are built for discovery but not for follow-through. Nutrisipe was designed to answer one question — what to cook tonight — with a visual, social-first feed rather than text-heavy blog posts. The framing treats recipes as social objects: saveable, remixable, and discussable, with food photography as the hero rather than advertising.',
      },
      {
        heading: 'Recipe forking and nutrition math',
        body: "The platform's signature mechanic is recipe forking: users take an existing recipe, swap ingredients, and save a variation with a credit trail back to the original. Every fork recalculates its nutrition profile automatically. Macros — calories, protein, fats, carbs — are computed per serving from a managed ingredient database, so no manual entry is required. Saved recipes drag into a weekly meal planner, which feeds the grocery list.",
      },
      {
        heading: 'From React and Sanity to a typed full stack',
        body: 'The first version ran on React 17 with Sanity CMS as the backend. The revamp rebuilds it as a Vue 3 + TypeScript client over an Express API with Prisma and PostgreSQL, so the data model lives in versioned migrations instead of a hosted CMS. Sessions use httpOnly cookies, and Socket.IO drives real-time direct messages and notifications. Stories, ratings, comments, and collections round out the social layer, with an admin suite for moderation, reports, and the ingredient records behind the macro math.',
      },
      {
        heading: 'A design system, not a pile of screens',
        body: 'Seventeen views were brought onto one token set — color, radius, shadow, and easing as CSS variables consumed by Tailwind — and onto shared primitives. A single button component covers every variant, size, and router link. Every modal now runs through one HeadlessUI-based dialog with focus trapping, Escape handling, scroll lock, and a bottom-sheet layout on phones. Native browser confirm() calls were replaced with a promise-based confirmation dialog, and unsaved recipe drafts prompt before they are discarded.',
      },
      {
        heading: 'Hardening the front door',
        body: 'The landing page was rewritten with honest copy in place of placeholder stats and testimonials, a hero image cut from JPEG to a 150 KB WebP, and accessible form labels and error announcements. Dev-only test accounts are compiled out of the production bundle. An audit also caught a sign-in route that trusted a client-supplied email without verifying a Google token; it is now restricted to development until server-side verification lands.',
      },
    ],
    gallery: [
      {
        src: new URL('@/assets/projects/nutrisipe-01.png', import.meta.url).href,
        alt: 'Home feed with recipe cards',
      },
      {
        src: new URL('@/assets/projects/nutrisipe-02.png', import.meta.url).href,
        alt: 'Explore recipes view',
      },
      {
        src: new URL('@/assets/projects/nutrisipe-03.png', import.meta.url).href,
        alt: 'Weekly meal planner',
      },
      {
        src: new URL('@/assets/projects/nutrisipe-04.png', import.meta.url).href,
        alt: 'Admin analytics dashboard',
      },
      {
        src: new URL('@/assets/projects/nutrisipe-05.png', import.meta.url).href,
        alt: 'Admin user management',
      },
      {
        src: new URL('@/assets/projects/nutrisipe-06.png', import.meta.url).href,
        alt: 'Ingredient database editor',
      },
    ],
  },
  {
    slug: 'tango',
    index: '05',
    title: 'Tango',
    categoryLabel: 'Personal / Progressive Web App',
    description:
      'A couples-first PWA for shared budgeting, goal tracking, todos, and a shared calendar, with real-time sync via Supabase channels and a demo mode fallback.',
    backgroundImage: new URL('@/assets/projects/tango-hero.png', import.meta.url).href,
    role: 'Solo Developer',
    stack: 'Vue 3, TypeScript, Tailwind v4, Pinia, Supabase, Vite PWA',
    timeline: '2025 — Present',
    liveUrl: 'https://takes22tango.netlify.app/',
    repoUrl: 'https://github.com/Araragee/Tango',
    introStatement:
      'Tango is a couples-first progressive web app built to replace scattered spreadsheets and notes with one shared surface. Budget together, split goal contributions, track todos with handoff logic, and coordinate on a shared calendar, all synced in real time through Supabase channels. A demo mode activates automatically when Supabase is unconfigured, making the app fully presentable without a live backend.',
    heroImage: new URL('@/assets/projects/tango-hero.png', import.meta.url).href,
    sections: [
      {
        heading: 'The scattered surfaces problem',
        body: 'Couples managing money and shared commitments typically split across multiple apps: a budgeting tool here, a shared note there, a calendar somewhere else. None of these surfaces talk to each other, and none of them are designed for two people operating as a unit. Tango was built to be that single surface.',
      },
      {
        heading: 'PWA architecture',
        body: 'The frontend is a strictly typed Vue 3 and Pinia application compiled as a PWA via vite-plugin-pwa. Each domain (budget, goals, todos, calendar) lives in its own Pinia store with typed API contracts against Supabase. Realtime updates are pushed through Supabase channels and merged into store state directly without polling. A composable-level demo mode layer intercepts all store reads and writes when the app is run without credentials, keeping the full UI exercisable in a presentation context.',
        code: {
          filename: 'composables/useDemoMode.ts',
          content: `import { inject } from 'vue'
import type { DemoContext } from '@/types/demo'

export function useDemoMode() {
  const demo = inject<DemoContext>('demo')
  const isDemo = computed(() => demo?.active ?? false)

  function guard<T>(live: () => T, fallback: T): T {
    return isDemo.value ? fallback : live()
  }

  return { isDemo, guard }
}`,
        },
      },
      {
        heading: 'Shipped features',
        body: 'Phase 1–19 of development shipped across 30+ bug fixes and a full feature set: recurring transactions, smart todo handoff, goal contribution splits, and a Vibe Check module. UTC date drift was caught and patched globally via a shared dateUtils composable. The app is installable as a PWA on mobile and desktop.',
      },
    ],
    gallery: [
      {
        src: new URL('@/assets/projects/tango-01.png', import.meta.url).href,
        alt: 'Budget dashboard — desktop',
      },
      {
        src: new URL('@/assets/projects/tango-02.png', import.meta.url).href,
        alt: 'Savings goals and plans — desktop',
      },
      {
        src: new URL('@/assets/projects/tango-03.png', import.meta.url).href,
        alt: 'Shared todos with handoff logic — desktop',
      },
      {
        src: new URL('@/assets/projects/tango-04.png', import.meta.url).href,
        alt: 'Shared calendar — desktop',
      },
      {
        src: new URL('@/assets/projects/tango-05.png', import.meta.url).href,
        alt: 'Budget dashboard — mobile',
      },
      {
        src: new URL('@/assets/projects/tango-06.png', import.meta.url).href,
        alt: 'Plans — mobile',
      },
      {
        src: new URL('@/assets/projects/tango-07.png', import.meta.url).href,
        alt: 'Todos — mobile',
      },
      {
        src: new URL('@/assets/projects/tango-08.png', import.meta.url).href,
        alt: 'Calendar — mobile',
      },
    ],
  },
  {
    slug: 'accomplisher',
    index: '06',
    title: 'Accomplisher',
    categoryLabel: 'Productivity / Desktop App',
    description:
      'A local-first Tauri desktop app for PSA developers to generate semi-monthly payroll accomplishment reports, log WFH output, and track IPCR coverage.',
    backgroundImage: new URL('@/assets/projects/accomplisher-hero.png', import.meta.url).href,
    role: 'Solo Developer — Personal Tool',
    stack: 'Tauri, React, TypeScript, SQLite',
    timeline: '2025 — Present',
    repoUrl: 'https://github.com/Araragee/Accomplisher',
    introStatement:
      'Accomplisher is a local-first desktop app that replaces the twice-a-month scramble of writing payroll accomplishment reports from memory. Built with Tauri and React, it runs entirely on-device with no server or login. Everything lives in a local SQLite database. The interface is designed for a productive person who is caught up, not one who is behind and panicking.',
    heroImage: new URL('@/assets/projects/accomplisher-hero.png', import.meta.url).href,
    sections: [
      {
        heading: 'Fixing the payroll scramble',
        body: 'Government developers at PSA file accomplishment reports every semi-monthly payroll cutoff (11–25 and 26–10). Without tooling, this means reconstructing two weeks of work from memory minutes before the deadline. IPCR target coverage is tracked separately, if at all. WFH logs live in a different place from in-office logs. The accumulation of friction makes every cutoff stressful.',
      },
      {
        heading: 'Paper planner aesthetics',
        body: 'The interface draws from the aesthetic of a well-kept paper planner: generous whitespace, soft sage-tinted neutrals, one warm terracotta accent for actions and current state. Flat surfaces, hairline borders, no glow, no glass. This was a deliberate inversion of the previous dark-navy-neon-glassmorphism build. Anti-references were explicitly written into the product spec to keep the design honest.',
      },
      {
        heading: 'Tauri local-first build',
        body: 'Three modules ship in the first version: the accomplishment maker (generates formatted report text for both cutoffs and custom ranges), the WFH log (daily output logged against IPCR commitment hours), and the Task Thinker (lightweight on-device suggestions reasoned from each person\'s IPCR targets and recent logged work). The Tauri shell gives native file access and OS-level window chrome without a web server dependency.',
      },
    ],
    gallery: [
      {
        src: new URL('@/assets/projects/accomplisher-01.png', import.meta.url).href,
        alt: 'Accomplisher report view',
      },
      {
        src: new URL('@/assets/projects/accomplisher-02.png', import.meta.url).href,
        alt: 'Accomplisher IPCR coverage tracker',
      },
    ],
  },
  {
    slug: 'smc',
    index: '07',
    title: "Sernan's Music Clinic",
    categoryLabel: 'Freelance / Business App',
    description:
      "A full-stack scheduling and enrollment platform for a music school. Three role-scoped surfaces — Admin, Teacher, Student — with a negotiation-based booking engine, HMAC-signed uploads, and Docker-containerized deployment.",
    backgroundImage: new URL('@/assets/projects/smc-hero.png', import.meta.url).href,
    role: 'Solo Developer',
    stack: 'Vue 3, TypeScript, Pinia, Tailwind, FastAPI, PostgreSQL, Docker',
    timeline: '2025',
    repoUrl: 'https://github.com/Araragee/SMC',
    introStatement:
      "A bespoke web app built for Sernan's Music Clinic to replace manual scheduling and paper enrollment records. Three distinct role surfaces — Admin, Teacher, and Student — each scoped to their own workflows. The admin manages rosters, schedules, and clinic settings. Teachers view and confirm their sessions. Students browse lesson packages, enroll, and track their history. Backed by a FastAPI service, PostgreSQL, and fully containerized via Docker.",
    heroImage: new URL('@/assets/projects/smc-hero.png', import.meta.url).href,
    sections: [
      {
        heading: 'Moving off spreadsheets',
        body: "The clinic was managing lesson bookings, teacher assignments, and student enrollment across spreadsheets and messaging apps — fragile, manual, and opaque to everyone involved. The ask was a web app that gives the admin a single control surface, teachers visibility into their schedule, and students a self-service layer for enrollment and session history.",
      },
      {
        heading: 'Scheduling negotiation engine',
        body: 'Bookings go through a structured negotiation: students propose a time, teachers can counter-propose, and the system caps counter-proposals at three rounds before escalating deadlocked sessions to an admin. Operating-hours enforcement blocks non-admin users from scheduling outside clinic hours. Admins get a drag-and-drop calendar with day, week, and month views. All participants can self-cancel up to 24 hours before a session.',
      },
      {
        heading: 'Security hardening',
        body: 'HMAC-signed upload URLs expire after one hour, keeping homework submissions and lesson proof files out of unauthorized hands. JWT refresh tokens live in HttpOnly cookies rather than JavaScript storage. A first-login gate forces newly created accounts to change their password immediately. All endpoints enforce strict character limits, range constraints, and password strength requirements. Uploaded images are automatically stripped of EXIF metadata, converted to WebP, and downscaled to a 2000px max edge before storage.',
      },
    ],
    gallery: [
      {
        src: new URL('@/assets/projects/smc-01.png', import.meta.url).href,
        alt: 'Login page',
      },
      {
        src: new URL('@/assets/projects/smc-02.png', import.meta.url).href,
        alt: 'Admin schedule management',
      },
      {
        src: new URL('@/assets/projects/smc-03.png', import.meta.url).href,
        alt: 'Admin student roster',
      },
      {
        src: new URL('@/assets/projects/smc-04.png', import.meta.url).href,
        alt: 'Teacher dashboard',
      },
      {
        src: new URL('@/assets/projects/smc-05.png', import.meta.url).href,
        alt: 'Teacher schedule view',
      },
      {
        src: new URL('@/assets/projects/smc-06.png', import.meta.url).href,
        alt: 'Teacher shop',
      },
      {
        src: new URL('@/assets/projects/smc-07.png', import.meta.url).href,
        alt: 'Student dashboard',
      },
      {
        src: new URL('@/assets/projects/smc-08.png', import.meta.url).href,
        alt: 'Student schedule view',
      },
      {
        src: new URL('@/assets/projects/smc-09.png', import.meta.url).href,
        alt: 'Student shop — lesson packages',
      },
    ],
  },
  {
    slug: 'araragi',
    index: '07',
    title: 'Araragi',
    categoryLabel: 'Identity / Particle Model',
    description:
      'Interactive particle avatar of Koyomi Araragi, constructed from pixel density sampling of araragi.png.',
    backgroundImage: new URL('@/assets/projects/tango-hero.png', import.meta.url).href,
    role: 'Front-end / Developer',
    stack: 'Vue 3, WebGL, Tailwind CSS, Three.js, TypeScript',
    timeline: '2026',
    liveUrl: '',
    introStatement:
      'The final node in the project deck. An image-sampled particle field that forms the shape of Koyomi Araragi, rendering at 60 FPS through custom GPU-bound vertex and fragment shaders.',
    heroImage: new URL('@/assets/projects/araragi.png', import.meta.url).href,
    sections: [
      {
        heading: 'Shader-based image sampling',
        body: 'To generate the particle representation of Araragi, we sample the pixel coordinates and color channels of the source PNG. The resulting positions are loaded into WebGL buffer attributes, allowing smooth morph transitions and interactive cursor repulsion directly in the GPU vertex shader.'
      }
    ],
    gallery: []
  },
]

/**
 * Projects that appear as particle-hero "stations" in the journey deck, in
 * scroll order. Single source of truth shared by ProjectDeck (cards),
 * ParticleField (hero formation per project) and the journey store (count) —
 * so the pinned card, its floating token, and the big picture always agree.
 *
 * Accomplisher is intentionally absent: it has no logo asset, so it can't be a
 * particle hero. It still lives in `projects` for its case-study page.
 * Each `icon` must exist under public/assets.
 */
export const journeyDeckProjects = (
  [
    { slug: 'e-permits', icon: '/assets/dhsud-logo.png' },
    { slug: 'cbms-portal', icon: '/assets/cbmsportal-favicon.svg' },
    { slug: 'lms-ai-platform', icon: '/assets/lms-ai-icon.svg' },
    { slug: 'nutrisipe', icon: '/assets/nutrisipe-logo.svg' },
    { slug: 'tango', icon: '/assets/tango-icon.png' },
    { slug: 'smc', icon: '/assets/smc-logo.png' },
    { slug: 'araragi', icon: '/assets/araragi.png' },
  ] as const
).map((d) => ({ ...projects.find((p) => p.slug === d.slug)!, icon: d.icon }))

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(p => p.slug === slug)
}

export function getNextProject(slug: string): Project | undefined {
  const idx = projects.findIndex(p => p.slug === slug)
  return projects[(idx + 1) % projects.length]
}
