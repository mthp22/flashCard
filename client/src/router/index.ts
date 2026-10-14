import { createRouter, createWebHistory } from 'vue-router'

// Route-based code splitting: each view is a lazy chunk
const HomeView = () => import('../views/HomeView.vue')
const FlashcardsView = () => import('../views/FlashcardsView.vue')
const StatsView = () => import('../views/StatsView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/flashcards',
      name: 'flashcards',
      component: FlashcardsView,
    },
    {
      path: '/stats',
      name: 'stats',
      component: StatsView,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
