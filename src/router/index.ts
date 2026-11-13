import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'


const routes: Array<RouteRecordRaw> = [
  {
    // Phase 8: journey is now the home — docs/PLAN.md §Phase 8
    path: '/',
    name: 'Journey',
    component: () => import('@/views/JourneyPage.vue'),
    meta: { title: "Boring, made interesting — Dave Gonzales" }
  },
  {
    path: '/journey',
    redirect: '/'
  },
  {
    path: '/manifesto',
    name: 'Manifesto',
    component: () => import('@/views/ManifestoPage.vue'),
    meta: { title: "How I work — Dave Gonzales" }
  },
  {
    path: '/personal',
    name: 'Personal',
    component: () => import('@/views/PersonalPage.vue'),
    meta: { title: "About — Dave Gonzales" }
  },
  {
    path: '/case-study/:slug',
    name: 'CaseStudy',
    component: () => import('@/views/CaseStudyPage.vue'),
    meta: { title: "Case Study — Dave Gonzales" }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    // Journey hashes are scrolled by Lenis in JourneyPage, not the router
    if (to.name === 'Journey' && to.hash) return false
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0, behavior: 'smooth' }
  }
})

// Update document title on navigation
router.afterEach((to) => {
  document.title = (to.meta.title as string) ?? 'Dave Gonzales'
})

export default router
