import { defineStore } from 'pinia'

export const useFlashcardStore = defineStore('flashcards', {
  state: () => ({
    currentIndex: 0,
    flashcards: [
      {
        id: 1,
        question: 'How do you declare a variable in JavaScript?',
        answer:
          'You can declare a variable using var, let, or const. For example: let myVariable = 10;',
      },
      {
        id: 2,
        question: 'What is the difference between var, let, and const?',
        answer:
          'var is function-scoped and can be redeclared and updated. let is block-scoped and can be updated but not redeclared. const is block-scoped and cannot be updated or redeclared.',
      },
      {
        id: 3,
        question: 'What is a closure in JavaScript?',
        answer:
          'A closure is a function that has access to its own scope, the outer function’s scope, and the global scope. It allows you to access variables from an outer function even after that function has finished executing.',
      },
      {},
    ],
  }),

  getters: {
    currentCard: (state) => state.flashcards[state.currentIndex],
    totalCards: (state) => state.flashcards.length,
    progress: (state) => ((state.currentIndex + 1) / state.flashcards.length) * 100,
  },

  actions: {
    nextCard() {
      if (this.currentIndex < this.flashcards.length - 1) {
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
  },
})
