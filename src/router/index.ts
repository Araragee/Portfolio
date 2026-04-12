import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomePage.vue'),
    meta: { title: 'ARCHITECT.VUE — Frontend Engineer' }
  },
  {
    path: '/manifesto',
    name: 'Manifesto',
    component: () => import('@/views/ManifestoPage.vue'),
    meta: { title: 'Manifesto — ARCHITECT.VUE' }
  },
  {
    path: '/case-study/:slug',
    name: 'CaseStudy',
    component: () => import('@/views/CaseStudyPage.vue'),
    meta: { title: 'Case Study — ARCHITECT.VUE' }
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
  document.title = (to.meta.title as string) ?? 'ARCHITECT.VUE'
})

export default router
