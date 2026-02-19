import { createRouter, createWebHistory } from 'vue-router'
import FlashcardsView from '../views/FlashcardsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'flashcards',
      component: FlashcardsView,
    },
  ],
})

export default router
