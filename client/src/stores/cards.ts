import { defineStore } from 'pinia'
import { SEED_CARDS, SEED_CATEGORIES } from '../data/seed'
import { useSettingsStore } from './settings'
import type { Card, CardDraft, Category, FilterMode, StudyMode } from './types'

let idCounter = 0
const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${(idCounter++).toString(36)}`

const DAY = 24 * 60 * 60 * 1000

/**
 * Cards store — data, filtering and navigation.
 * Hydrated once from the in-memory seed (`src/data/seed.ts`).
 */
export const useCardsStore = defineStore('cards', {
  state: () => ({
    cards: [] as Card[],
    categories: [] as Category[],
    currentIndex: 0,
    selectedCategory: 'all',
    filterMode: 'all' as FilterMode,
    studyMode: 'normal' as StudyMode,
    hydrated: false,
  }),

  getters: {
    /** Categories with card counts derived from the live card list */
    categoriesWithCount(state): Category[] {
      return state.categories.map((category) => ({
        ...category,
        cardCount: state.cards.filter((card) => card.category === category.id).length,
      }))
    },

    filteredCards(state): Card[] {
      let filtered = state.cards

      if (state.selectedCategory !== 'all') {
        filtered = filtered.filter((card) => card.category === state.selectedCategory)
      }

      if (state.filterMode === 'mastered') {
        filtered = filtered.filter((card) => card.mastered)
      } else if (state.filterMode === 'review') {
        filtered = filtered.filter((card) => card.needsReview)
      }

      return filtered
    },

    currentCard(): Card | null {
      return this.filteredCards[this.currentIndex] ?? null
    },

    totalCards(): number {
      return this.filteredCards.length
    },

    progress(): number {
      return this.totalCards > 0 ? Math.round(((this.currentIndex + 1) / this.totalCards) * 100) : 0
    },

    cardsMastered(state): number {
      return state.cards.filter((card) => card.mastered).length
    },

    cardsNeedingReview(state): number {
      return state.cards.filter((card) => card.needsReview).length
    },

    accuracyPercentage(state): number {
      const totalAttempts = state.cards.reduce((sum, card) => sum + card.attemptCount, 0)
      const totalCorrect = state.cards.reduce((sum, card) => sum + card.correctCount, 0)
      return totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0
    },
  },

  actions: {
    /** Seed the store from the in-memory db (idempotent) */
    hydrate() {
      if (this.hydrated) return
      this.cards = SEED_CARDS.map((card) => ({ ...card }))
      this.categories = SEED_CATEGORIES.map((category) => ({ ...category }))
      this.hydrated = true
      this.sortBySpacedRepetition()
    },

    /* ---------------- CRUD ---------------- */

    addCard(draft: CardDraft): Card {
      const now = Date.now()
      const card: Card = {
        ...draft,
        id: uid('card'),
        createdAt: now,
        updatedAt: now,
        correctCount: 0,
        attemptCount: 0,
        mastered: false,
        needsReview: false,
      }
      this.cards.unshift(card)
      return card
    },

    updateCard(id: string, updates: Partial<Card>) {
      const index = this.cards.findIndex((card) => card.id === id)
      const existing = this.cards[index]
      if (index === -1 || !existing) return
      this.cards[index] = {
        ...existing,
        ...updates,
        id,
        updatedAt: Date.now(),
      }
      if (this.currentIndex >= this.filteredCards.length) {
        this.currentIndex = Math.max(0, this.filteredCards.length - 1)
      }
    },

    deleteCard(id: string) {
      this.cards = this.cards.filter((card) => card.id !== id)
      if (this.currentIndex >= this.filteredCards.length) {
        this.currentIndex = Math.max(0, this.filteredCards.length - 1)
      }
    },

    /* -------------- Navigation -------------- */

    nextCard() {
      if (this.currentIndex < this.filteredCards.length - 1) this.currentIndex++
    },

    prevCard() {
      if (this.currentIndex > 0) this.currentIndex--
    },

    resetProgress() {
      this.currentIndex = 0
    },

    setCategory(category: string) {
      this.selectedCategory = category
      this.currentIndex = 0
    },

    setFilterMode(mode: FilterMode) {
      this.filterMode = mode
      this.currentIndex = 0
    },

    setStudyMode(mode: StudyMode) {
      this.studyMode = mode
      this.currentIndex = 0

      if (mode === 'random') {
        this.shuffleCards()
      } else if (mode === 'normal') {
        this.sortBySpacedRepetition()
      }
    },

    shuffleCards() {
      const shuffled = [...this.cards]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const a = shuffled[i]
        const b = shuffled[j]
        if (a && b) {
          shuffled[i] = b
          shuffled[j] = a
        }
      }
      this.cards = shuffled
      this.currentIndex = 0
    },

    /** Cards due soonest float to the top */
    sortBySpacedRepetition() {
      this.cards = [...this.cards].sort((a, b) => (a.dueDate ?? 0) - (b.dueDate ?? 0))
      this.currentIndex = 0
    },

    /* ------------ Spaced repetition ------------ */

    markCardMastered(id: string) {
      const card = this.cards.find((c) => c.id === id)
      if (!card) return

      card.mastered = true
      card.needsReview = false
      card.attemptCount++
      card.correctCount++
      card.lastStudiedAt = Date.now()
      card.dueDate = Date.now() + 14 * DAY
      card.updatedAt = Date.now()

      useSettingsStore().playSound('correct')
    },

    markCardForReview(id: string) {
      const card = this.cards.find((c) => c.id === id)
      if (!card) return

      card.needsReview = true
      card.mastered = false
      card.attemptCount++
      card.lastStudiedAt = Date.now()
      card.dueDate = Date.now() + DAY
      card.updatedAt = Date.now()

      useSettingsStore().playSound('review')
    },
  },
})
