<template>
  <div class="flashcardsView">
    <h1>Flashcards</h1>
    <ProgressBar
      :current="store.currentIndex + 1"
      :total="store.totalCards"
      :progress-percentage="store.progress"
    />
    <FlashCard
      v-if="store.currentCard"
      ref="flashCardRef"
      :question="store.currentCard.question ?? ''"
      :answer="store.currentCard.answer ?? ''"
    />
    <div class="navigation">
      <button @click="handlePrevious" :disabled="store.currentIndex === 0" class="nav-button">
        Previous
      </button>
      <button @click="handleReset" class="nav-button reset-button">Reset</button>
      <button
        @click="handleNext"
        :disabled="store.currentIndex === store.totalCards - 1"
        class="nav-button"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useFlashcardStore } from '../stores/pinia'
import FlashCard from '../components/FlashCard.vue'
import ProgressBar from '../components/ProgressBar.vue'

const store = useFlashcardStore()
const flashCardRef = ref()

const handleNext = () => {
  store.nextCard()
  flashCardRef.value?.resetFlip()
}

const handlePrevious = () => {
  store.prevCard()
  flashCardRef.value?.resetFlip()
}

const handleReset = () => {
  store.resetProgress()
  flashCardRef.value?.resetFlip()
}
</script>

<style scoped>
.flashcards-view {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: maroon;
  font-size: 2rem;
}

.navigation {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.nav-button {
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  background-color: linear-gradient(135deg, #4caf50 0%, cyan 100%);
  color: white;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.2s,
    box-shadow 0.2s,
    opacity 0.3s ease;
}

.nav-button:hover:not(:disabled) {
  transform: translateY(-2px);
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.reset-button {
  background-color: linear-gradient(135deg, red 0%, orange 100%);
}
</style>
