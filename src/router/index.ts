import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'


const routes: Array<RouteRecordRaw> = [
  {
    // Phase 8: journey is now the home — docs/PLAN.md §Phase 8
    path: '/',
    name: 'Journey',
    component: () => import('@/views/JourneyPage.vue'),
    meta: { title: "The Long Way Around — Dave Gonzales" }
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
  scrollBehavior(_to, _from, savedPosition) {
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
