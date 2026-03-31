import { defineStore } from 'pinia'
import { db } from '../firebase'
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore'

export interface Card {
  id?: string
  question: string
  answer: string
  category: string
  subcategory: string
  difficulty: 'easy' | 'medium' | 'hard'
  createdAt?: Timestamp
  updatedAt?: Timestamp
  correctCount?: number
  attemptCount?: number
  mastered?: boolean
  needsReview?: boolean
  lastStudiedAt?: Timestamp
  dueDate?: Timestamp
}

export interface UserProgress {
  cardId: string
  userId: string
  status: 'new' | 'learning' | 'mastered'
  correctAttempts: number
  totalAttempts: number
  accuracy: number
  lastAttemptAt: Timestamp
  nextReviewDate: Timestamp
  dueToday: boolean
}

export interface UserStats {
  userId: string
  totalCardsStudied: number
  totalCardsMastered: number
  totalCardsReviewing: number
  overallAccuracy: number
  currentStreak: number
  longestStreak: number
  lastStudiedAt: Timestamp
  averageTimePerCard: number
  sessionCount: number
  totalStudyTime: number
  categoryStats: Record<
    string,
    {
      studied: number
      mastered: number
      accuracy: number
    }
  >
}

export interface Category {
  id?: string
  name: string
  icon: string
  subcategories: string[]
  cardCount: number
}

export interface StudySession {
  id?: string
  userId: string
  startedAt: Timestamp
  endedAt?: Timestamp
  durationMinutes: number
  cardsStudied: number
  correctCount: number
  accuracy: number
  category: string
  mode: 'normal' | 'quiz' | 'random'
  cardIds: string[]
}

export const useFlashcardStore = defineStore('flashcards', {
  state: () => ({
    cards: [] as Card[],
    currentIndex: 0,
    selectedCategory: 'all',
    filterMode: 'all' as 'all' | 'mastered' | 'review',
    studyMode: 'normal' as 'normal' | 'quiz' | 'random',
    categories: [] as Category[],
    userStats: null as UserStats | null,
    darkMode: false,
    soundEnabled: true,
    currentSession: null as StudySession | null,
    sessionStartTime: null as number | null,
    cardScores: new Map<string, { isCorrect: boolean; timeSpent: number }>(),
  }),

  getters: {
    currentCard(): Card | null {
      return this.cards[this.currentIndex] || null
    },

    totalCards(): number {
      return this.cards.length
    },

    progress(): number {
      return this.totalCards > 0
        ? Math.round(((this.currentIndex + 1) / this.totalCards) * 100)
        : 0
    },

    cardsMastered(): number {
      return this.cards.filter((card) => card.mastered).length
    },

    cardsNeedingReview(): number {
      return this.cards.filter((card) => card.needsReview).length
    },

    filteredCards(): Card[] {
      let filtered = this.cards

      if (this.selectedCategory !== 'all') {
        filtered = filtered.filter((card) => card.category === this.selectedCategory)
      }

      if (this.filterMode === 'mastered') {
        filtered = filtered.filter((card) => card.mastered)
      } else if (this.filterMode === 'review') {
        filtered = filtered.filter((card) => card.needsReview)
      }

      return filtered
    },

    accuracyPercentage(): number {
      const totalAttempts = this.cards.reduce((sum, card) => sum + (card.attemptCount || 0), 0)
      const totalCorrect = this.cards.reduce((sum, card) => sum + (card.correctCount || 0), 0)
      return totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0
    },
  },

  actions: {
    async fetchCategories() {
      try {
        const categorySnapshot = await getDocs(collection(db, 'categories'))
        this.categories = categorySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            }) as Category
        )
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    },

    async fetchCards() {
      try {
        const querySnapshot = await getDocs(collection(db, 'cards'))
        this.cards = querySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            }) as Card
        )

        // Apply spaced repetition if in normal mode
        if (this.studyMode === 'normal') {
          this.sortBySpacedRepetition()
        }
      } catch (error) {
        console.error('Error fetching cards:', error)
      }
    },

    async fetchCardsByCategory(category: string) {
      try {
        const q = query(collection(db, 'cards'), where('category', '==', category))
        const querySnapshot = await getDocs(q)
        this.cards = querySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            }) as Card
        )
      } catch (error) {
        console.error('Error fetching cards by category:', error)
      }
    },

    async addCard(card: Card) {
      try {
        await addDoc(collection(db, 'cards'), {
          ...card,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          correctCount: 0,
          attemptCount: 0,
          mastered: false,
          needsReview: false,
        })
        await this.fetchCards()
      } catch (error) {
        console.error('Error adding card:', error)
      }
    },

    async updateCard(id: string, updates: Partial<Card>) {
      try {
        const cardRef = doc(db, 'cards', id)
        await updateDoc(cardRef, {
          ...updates,
          updatedAt: Timestamp.now(),
        })
        await this.fetchCards()
      } catch (error) {
        console.error('Error updating card:', error)
      }
    },

    async deleteCard(id: string) {
      try {
        await deleteDoc(doc(db, 'cards', id))
        await this.fetchCards()
      } catch (error) {
        console.error('Error deleting card:', error)
      }
    },

    nextCard() {
      if (this.currentIndex < this.filteredCards.length - 1) {
        this.currentIndex++
      }
    },

    prevCard() {
      if (this.currentIndex > 0) {
        this.currentIndex--
      }
    },

    resetProgress() {
      this.currentIndex = 0
    },

    setCategory(category: string) {
      this.selectedCategory = category
      this.currentIndex = 0
    },

    setFilterMode(mode: 'all' | 'mastered' | 'review') {
      this.filterMode = mode
      this.currentIndex = 0
    },

    setStudyMode(mode: 'normal' | 'quiz' | 'random') {
      this.studyMode = mode
      this.currentIndex = 0

      if (mode === 'random') {
        this.shuffleCards()
      } else if (mode === 'normal') {
        this.sortBySpacedRepetition()
      }
    },

    shuffleCards() {
      const filtered = [...this.filteredCards]
      for (let i = filtered.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = filtered[i]
        if (temp && filtered[j]) {
          filtered[i] = filtered[j]
          filtered[j] = temp
        }
      }
      this.cards = filtered
    },

    sortBySpacedRepetition() {
      // Sort cards by dueDate (cards due soon appear first)
      this.cards.sort((a, b) => {
        const dueA = a.dueDate?.toMillis() || 0
        const dueB = b.dueDate?.toMillis() || 0
        return dueA - dueB
      })
    },

    async markCardMastered(id: string) {
      try {
        const card = this.cards.find((c) => c.id === id)
        if (card) {
          const newAttemptCount = (card.attemptCount || 0) + 1
          const newCorrectCount = (card.correctCount || 0) + 1

          await this.updateCard(id, {
            mastered: true,
            needsReview: false,
            correctCount: newCorrectCount,
            attemptCount: newAttemptCount,
            lastStudiedAt: Timestamp.now(),
            dueDate: new Timestamp(
              Math.floor(Date.now() / 1000) + 14 * 24 * 60 * 60,
              0
            ), // 14 days
          })

          // Play sound if enabled
          if (this.soundEnabled) {
            this.playSound('correct')
          }
        }
      } catch (error) {
        console.error('Error marking card as mastered:', error)
      }
    },

    async markCardForReview(id: string) {
      try {
        const card = this.cards.find((c) => c.id === id)
        if (card) {
          const newAttemptCount = (card.attemptCount || 0) + 1

          await this.updateCard(id, {
            needsReview: true,
            mastered: false,
            attemptCount: newAttemptCount,
            lastStudiedAt: Timestamp.now(),
            dueDate: new Timestamp(Math.floor(Date.now() / 1000) + 1 * 24 * 60 * 60, 0), // 1 day
          })

          if (this.soundEnabled) {
            this.playSound('review')
          }
        }
      } catch (error) {
        console.error('Error marking card for review:', error)
      }
    },

    toggleDarkMode() {
      this.darkMode = !this.darkMode
      localStorage.setItem('darkMode', JSON.stringify(this.darkMode))
    },

    toggleSound() {
      this.soundEnabled = !this.soundEnabled
      localStorage.setItem('soundEnabled', JSON.stringify(this.soundEnabled))
    },

    loadSettings() {
      const darkMode = localStorage.getItem('darkMode')
      const soundEnabled = localStorage.getItem('soundEnabled')

      if (darkMode !== null) this.darkMode = JSON.parse(darkMode)
      if (soundEnabled !== null) this.soundEnabled = JSON.parse(soundEnabled)
    },

    playSound(type: 'flip' | 'correct' | 'review') {
      if (!this.soundEnabled) return

      // Placeholder - will use actual audio files
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const audioContext = new AudioContextClass()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      switch (type) {
        case 'flip':
          oscillator.frequency.value = 800
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + 0.1
          )
          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.1)
          break
        case 'correct':
          oscillator.frequency.value = 1000
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + 0.3
          )
          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.3)
          break
        case 'review':
          oscillator.frequency.value = 600
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + 0.2
          )
          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.2)
      }
    },

    startSession(category: string) {
      this.currentSession = {
        userId: 'current-user', // Will be replaced with actual user ID
        startedAt: Timestamp.now(),
        durationMinutes: 0,
        cardsStudied: 0,
        correctCount: 0,
        accuracy: 0,
        category,
        mode: this.studyMode,
        cardIds: this.filteredCards.map((c) => c.id || ''),
      }
      this.sessionStartTime = Date.now()
      this.currentIndex = 0
    },

    recordCardAttempt(cardId: string, isCorrect: boolean, timeSpent: number) {
      if (this.currentSession) {
        this.cardScores.set(cardId, { isCorrect, timeSpent })
        this.currentSession.cardsStudied++
        if (isCorrect) this.currentSession.correctCount++
        this.currentSession.accuracy =
          this.currentSession.correctCount / this.currentSession.cardsStudied
      }
    },

    async endSession(): Promise<StudySession | null> {
      if (!this.currentSession || !this.sessionStartTime) return null

      const durationMs = Date.now() - this.sessionStartTime
      this.currentSession.durationMinutes = Math.round(durationMs / 60000)
      this.currentSession.endedAt = Timestamp.now()

      try {
        await addDoc(collection(db, 'studySessions'), this.currentSession)
      } catch (error) {
        console.error('Error saving study session:', error)
      }

      const session = this.currentSession
      this.currentSession = null
      this.sessionStartTime = null
      this.cardScores.clear()

      return session
    },
  },
})
