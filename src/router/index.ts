import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { siteConfig } from '@/data/siteConfig'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomePage.vue'),
    meta: { title: siteConfig.seo.defaultTitle }
  },
  {
    path: '/manifesto',
    name: 'Manifesto',
    component: () => import('@/views/ManifestoPage.vue'),
    meta: { title: `Manifesto — ${siteConfig.brandName}` }
  },
  {
    path: '/personal',
    name: 'Personal',
    component: () => import('@/views/PersonalPage.vue'),
    meta: { title: `Personal — ${siteConfig.brandName}` }
  },
  {
    path: '/case-study/:slug',
    name: 'CaseStudy',
    component: () => import('@/views/CaseStudyPage.vue'),
    meta: { title: `Case Study — ${siteConfig.brandName}` }
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
  document.title = (to.meta.title as string) ?? siteConfig.brandName
})

export default router
