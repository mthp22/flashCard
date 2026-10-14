export type Difficulty = 'easy' | 'medium' | 'hard'
export type StudyMode = 'normal' | 'quiz' | 'random'
export type FilterMode = 'all' | 'mastered' | 'review'

export interface Card {
  id: string
  question: string
  answer: string
  /** Category id (slug), e.g. "javascript" */
  category: string
  subcategory: string
  difficulty: Difficulty
  createdAt: number
  updatedAt: number
  correctCount: number
  attemptCount: number
  mastered: boolean
  needsReview: boolean
  lastStudiedAt?: number
  dueDate?: number
}

export interface Category {
  id: string
  name: string
  icon: string
  subcategories: string[]
  /** Derived in the cards store getter — never persisted as a constant */
  cardCount: number
}

export interface StudySession {
  id: string
  startedAt: number
  endedAt?: number
  durationMinutes: number
  cardsStudied: number
  correctCount: number
  accuracy: number
  /** Category id ("all" when no filter applied) */
  category: string
  mode: StudyMode
  cardIds: string[]
}

export interface CategoryStat {
  studied: number
  mastered: number
  accuracy: number
}

export interface UserStats {
  totalCardsStudied: number
  totalCardsMastered: number
  totalCardsReviewing: number
  overallAccuracy: number
  currentStreak: number
  longestStreak: number
  lastStudiedAt: number | null
  averageTimePerCard: number
  sessionCount: number
  totalStudyTime: number
  categoryStats: Record<string, CategoryStat>
}

/** Payload for creating/updating a card through the CRUD UI */
export type CardDraft = Pick<
  Card,
  'question' | 'answer' | 'category' | 'subcategory' | 'difficulty'
>
