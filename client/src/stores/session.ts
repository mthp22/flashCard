import { defineStore } from 'pinia'
import { useCardsStore } from './cards'
import type { CategoryStat, StudyMode, StudySession, UserStats } from './types'

const DAY = 24 * 60 * 60 * 1000
const MS_PER_DAY = DAY

let sessionCounter = 0

/** Consecutive study days ending today (or yesterday) + best run */
function computeStreaks(sessions: StudySession[]): {
  currentStreak: number
  longestStreak: number
} {
  if (sessions.length === 0) return { currentStreak: 0, longestStreak: 0 }

  const dayKeys = new Set<number>()
  for (const session of sessions) {
    const end = session.endedAt ?? session.startedAt
    dayKeys.add(Math.floor(end / MS_PER_DAY))
  }

  const days = [...dayKeys].sort((a, b) => a - b)

  let longest = 1
  let run = 1
  for (let i = 1; i < days.length; i++) {
    const prev = days[i - 1]
    const curr = days[i]
    if (prev !== undefined && curr !== undefined && curr - prev === 1) {
      run++
    } else {
      run = 1
    }
    longest = Math.max(longest, run)
  }

  const today = Math.floor(Date.now() / MS_PER_DAY)
  const last = days[days.length - 1] ?? 0
  let current = 0
  if (last === today || last === today - 1) {
    current = 1
    for (let i = days.length - 1; i > 0; i--) {
      const prev = days[i - 1]
      const curr = days[i]
      if (prev !== undefined && curr !== undefined && curr - prev === 1) {
        current++
      } else {
        break
      }
    }
  }

  return { currentStreak: current, longestStreak: Math.max(longest, current) }
}

/**
 * Session store — study sessions, per-card scores and derived statistics.
 * Stats are computed from the cards + completed sessions held in memory.
 */
export const useSessionStore = defineStore('session', {
  state: () => ({
    sessions: [] as StudySession[],
    currentSession: null as StudySession | null,
    sessionStartTime: null as number | null,
    cardScores: new Map<string, { isCorrect: boolean; timeSpent: number }>(),
  }),

  getters: {
    sessionCount(state): number {
      return state.sessions.length
    },

    userStats(): UserStats {
      const cards = useCardsStore()
      const sessions = this.sessions

      const studiedCards = cards.cards.filter((card) => card.attemptCount > 0)
      const totalAttempts = cards.cards.reduce((sum, card) => sum + card.attemptCount, 0)
      const totalCorrect = cards.cards.reduce((sum, card) => sum + card.correctCount, 0)

      const totalStudyTime = sessions.reduce((sum, s) => sum + s.durationMinutes, 0)
      const cardsStudiedInSessions = sessions.reduce((sum, s) => sum + s.cardsStudied, 0)

      const lastStudiedAt = sessions.reduce<number | null>(
        (latest, s) => (s.endedAt && (!latest || s.endedAt > latest) ? s.endedAt : latest),
        null,
      )

      const categoryStats: Record<string, CategoryStat> = {}
      for (const category of cards.categoriesWithCount) {
        const inCategory = cards.cards.filter((card) => card.category === category.id)
        const attempts = inCategory.reduce((sum, card) => sum + card.attemptCount, 0)
        const correct = inCategory.reduce((sum, card) => sum + card.correctCount, 0)
        categoryStats[category.name] = {
          studied: inCategory.filter((card) => card.attemptCount > 0).length,
          mastered: inCategory.filter((card) => card.mastered).length,
          accuracy: attempts > 0 ? correct / attempts : 0,
        }
      }

      const { currentStreak, longestStreak } = computeStreaks(sessions)

      return {
        totalCardsStudied: studiedCards.length,
        totalCardsMastered: cards.cardsMastered,
        totalCardsReviewing: cards.cardsNeedingReview,
        overallAccuracy: totalAttempts > 0 ? totalCorrect / totalAttempts : 0,
        currentStreak,
        longestStreak,
        lastStudiedAt,
        averageTimePerCard:
          cardsStudiedInSessions > 0
            ? Math.round((totalStudyTime * 60) / cardsStudiedInSessions)
            : 0,
        sessionCount: sessions.length,
        totalStudyTime,
        categoryStats,
      }
    },
  },

  actions: {
    startSession(category: string, mode: StudyMode) {
      this.currentSession = {
        id: `session-${Date.now().toString(36)}-${sessionCounter++}`,
        startedAt: Date.now(),
        durationMinutes: 0,
        cardsStudied: 0,
        correctCount: 0,
        accuracy: 0,
        category,
        mode,
        cardIds: [],
      }
      this.sessionStartTime = Date.now()
      this.cardScores.clear()
    },

    recordCardAttempt(cardId: string, isCorrect: boolean, timeSpent: number) {
      if (!this.currentSession) return

      this.cardScores.set(cardId, { isCorrect, timeSpent })
      this.currentSession.cardIds.push(cardId)
      this.currentSession.cardsStudied++
      if (isCorrect) this.currentSession.correctCount++
      this.currentSession.accuracy =
        this.currentSession.correctCount / this.currentSession.cardsStudied
    },

    endSession(): StudySession | null {
      if (!this.currentSession || !this.sessionStartTime) return null

      const durationMs = Date.now() - this.sessionStartTime
      this.currentSession.durationMinutes = Math.max(1, Math.round(durationMs / 60000))
      this.currentSession.endedAt = Date.now()

      const session = { ...this.currentSession }
      // Sessions with no attempts are not worth keeping
      if (session.cardsStudied > 0) this.sessions.push(session)

      this.currentSession = null
      this.sessionStartTime = null
      this.cardScores.clear()

      return session
    },
  },
})
