import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FlashcardsView from '../views/FlashcardsView.vue'
import StatsView from '../views/StatsView.vue'

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
  ],
})

export default router
