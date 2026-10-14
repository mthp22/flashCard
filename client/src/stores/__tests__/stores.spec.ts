import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useCardsStore } from '../cards'
import { useSessionStore } from '../session'
import { useSettingsStore } from '../settings'

describe('cards store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('hydrates from the in-memory seed', () => {
    const store = useCardsStore()
    expect(store.cards).toHaveLength(0)

    store.hydrate()

    expect(store.cards.length).toBeGreaterThan(0)
    expect(store.categories.length).toBeGreaterThan(0)
    expect(store.cards.length).toBeGreaterThan(0)
  })

  it('is idempotent — hydrating twice does not duplicate cards', () => {
    const store = useCardsStore()
    store.hydrate()
    const count = store.cards.length
    store.hydrate()
    expect(store.cards).toHaveLength(count)
  })

  it('derives category card counts', () => {
    const store = useCardsStore()
    store.hydrate()

    const js = store.categoriesWithCount.find((c) => c.id === 'javascript')
    expect(js).toBeDefined()
    expect(js!.cardCount).toBeGreaterThan(0)

    const total = store.categoriesWithCount.reduce((sum, c) => sum + c.cardCount, 0)
    expect(total).toBe(store.cards.length)
  })

  it('filters by category', () => {
    const store = useCardsStore()
    store.hydrate()

    store.setCategory('javascript')

    expect(store.filteredCards.length).toBeGreaterThan(0)
    expect(store.filteredCards.every((card) => card.category === 'javascript')).toBe(true)
  })

  it('filters mastered cards only', () => {
    const store = useCardsStore()
    store.hydrate()

    const first = store.filteredCards[0]!
    store.markCardMastered(first.id)
    store.setFilterMode('mastered')

    expect(store.filteredCards.every((card) => card.mastered)).toBe(true)
  })

  it('adds, updates and deletes cards', () => {
    const store = useCardsStore()
    store.hydrate()
    const initial = store.cards.length

    const created = store.addCard({
      question: 'What is a monad?',
      answer: 'A monad is a design pattern...',
      category: 'javascript',
      subcategory: 'Functions',
      difficulty: 'hard',
    })
    expect(store.cards).toHaveLength(initial + 1)
    expect(store.cards.some((card) => card.id === created.id)).toBe(true)

    store.updateCard(created.id, { difficulty: 'easy' })
    const updated = store.cards.find((card) => card.id === created.id)
    expect(updated?.difficulty).toBe('easy')

    store.deleteCard(created.id)
    expect(store.cards).toHaveLength(initial)
    expect(store.cards.some((card) => card.id === created.id)).toBe(false)
  })

  it('tracks accuracy when grading cards', () => {
    const store = useCardsStore()
    store.hydrate()

    const card = store.filteredCards[0]!
    store.markCardMastered(card.id)
    store.markCardForReview(card.id)

    const graded = store.cards.find((c) => c.id === card.id)!
    expect(graded.attemptCount).toBe(2)
    expect(graded.correctCount).toBe(1)
    expect(graded.needsReview).toBe(true)
    expect(graded.mastered).toBe(false)
    expect(store.accuracyPercentage).toBeGreaterThan(0)
  })

  it('navigates within bounds', () => {
    const store = useCardsStore()
    store.hydrate()

    store.prevCard()
    expect(store.currentIndex).toBe(0)

    for (let i = 0; i < 100; i++) store.nextCard()
    expect(store.currentIndex).toBe(store.filteredCards.length - 1)
  })
})

describe('session store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('records attempts and derives user stats', () => {
    const cards = useCardsStore()
    const session = useSessionStore()
    cards.hydrate()

    session.startSession('javascript', 'normal')
    const card = cards.filteredCards[0]!

    cards.markCardMastered(card.id)
    session.recordCardAttempt(card.id, true, 12)

    expect(session.currentSession?.cardsStudied).toBe(1)
    expect(session.currentSession?.correctCount).toBe(1)

    const ended = session.endSession()
    expect(ended).not.toBeNull()
    expect(session.sessions).toHaveLength(1)

    const stats = session.userStats
    expect(stats.sessionCount).toBe(1)
    expect(stats.totalCardsStudied).toBe(1)
    expect(stats.overallAccuracy).toBe(1)
    expect(stats.lastStudiedAt).toBeTypeOf('number')
  })

  it('keeps empty sessions out of history', () => {
    const session = useSessionStore()
    session.startSession('all', 'normal')
    session.endSession()
    expect(session.sessions).toHaveLength(0)
    expect(session.currentSession).toBeNull()
  })

  it('computes streaks across consecutive days', () => {
    const session = useSessionStore()
    const now = Date.now()
    const day = 24 * 60 * 60 * 1000

    session.sessions = [
      {
        id: 'a',
        startedAt: now - 2 * day,
        endedAt: now - 2 * day,
        durationMinutes: 5,
        cardsStudied: 3,
        correctCount: 2,
        accuracy: 0.66,
        category: 'all',
        mode: 'normal',
        cardIds: [],
      },
      {
        id: 'b',
        startedAt: now - day,
        endedAt: now - day,
        durationMinutes: 5,
        cardsStudied: 3,
        correctCount: 3,
        accuracy: 1,
        category: 'all',
        mode: 'normal',
        cardIds: [],
      },
      {
        id: 'c',
        startedAt: now,
        endedAt: now,
        durationMinutes: 5,
        cardsStudied: 3,
        correctCount: 1,
        accuracy: 0.33,
        category: 'all',
        mode: 'normal',
        cardIds: [],
      },
    ]

    const stats = session.userStats
    expect(stats.longestStreak).toBe(3)
    expect(stats.currentStreak).toBe(3)
  })
})

describe('settings store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('toggles dark mode and sound', () => {
    const settings = useSettingsStore()
    const initialDark = settings.darkMode

    settings.toggleDarkMode()
    expect(settings.darkMode).toBe(!initialDark)

    settings.toggleSound()
    expect(settings.soundEnabled).toBe(false)
  })

  it('does not throw when playing sounds without AudioContext', () => {
    const settings = useSettingsStore()
    expect(() => settings.playSound('correct')).not.toThrow()
  })
})
