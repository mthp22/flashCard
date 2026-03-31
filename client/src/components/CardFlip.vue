<template>
  <div class="card-container">
    <div
      class="card"
      :class="{ flipped: isFlipped, 'dark-mode': isDarkMode }"
      @click="toggleFlip"
    >
      <div class="card-inner">
        <!-- Front (Question) -->
        <div class="card-front">
          <div class="card-header">
            <span class="difficulty" :class="difficulty">{{ difficulty }}</span>
            <span class="flip-hint">Click to reveal</span>
          </div>
          <div class="card-content">
            <h2>Question</h2>
            <p>{{ question }}</p>
          </div>
          <div class="card-footer">
            <span class="attempt-info">Attempts: {{ attemptCount }} | Correct: {{ correctCount }}</span>
          </div>
        </div>

        <!-- Back (Answer) -->
        <div class="card-back">
          <div class="card-header">
            <span class="category-badge">{{ category }}</span>
            <span class="flip-hint">Click to see question</span>
          </div>
          <div class="card-content">
            <h2>Answer</h2>
            <p>{{ answer }}</p>
          </div>
          <div class="card-footer action-buttons">
            <button @click.stop="$emit('know-this')" class="btn btn-primary">
              ✓ I Know This
            </button>
            <button @click.stop="$emit('review-again')" class="btn btn-secondary">
              ↻ Review Again
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: 'General',
  },
  difficulty: {
    type: String as () => 'easy' | 'medium' | 'hard',
    default: 'medium',
  },
  attemptCount: {
    type: Number,
    default: 0,
  },
  correctCount: {
    type: Number,
    default: 0,
  },
  isDarkMode: {
    type: Boolean,
    default: false,
  },
})

const isFlipped = ref(false)

const toggleFlip = () => {
  isFlipped.value = !isFlipped.value
}

defineExpose({
  resetFlip: () => {
    isFlipped.value = false
  },
})

defineEmits(['know-this', 'review-again'])
</script>

<style scoped>
.card-container {
  perspective: 1200px;
  width: 100%;
  max-width: 600px;
  margin: 2rem auto;
}

.card {
  width: 100%;
  aspect-ratio: 16 / 9;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  cursor: pointer;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.card.flipped {
  transform: rotateY(180deg);
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

/* Glassmorphism effect */
.card-front,
.card-back {
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.card-front {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.8), rgba(0, 188, 212, 0.8));
  color: white;
}

.card-back {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.8), rgba(255, 152, 0, 0.8));
  color: white;
  transform: rotateY(180deg);
}

.card.dark-mode .card-front {
  background: linear-gradient(135deg, rgba(56, 142, 60, 0.9), rgba(0, 150, 136, 0.9));
}

.card.dark-mode .card-back {
  background: linear-gradient(135deg, rgba(200, 150, 0, 0.9), rgba(230, 124, 0, 0.9));
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  opacity: 0.9;
}

.difficulty {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.75rem;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.2);
}

.difficulty.easy {
  background: rgba(76, 175, 80, 0.3);
}

.difficulty.medium {
  background: rgba(255, 193, 7, 0.3);
}

.difficulty.hard {
  background: rgba(244, 67, 54, 0.3);
}

.category-badge {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.75rem;
  background: rgba(255, 255, 255, 0.2);
}

.flip-hint {
  font-size: 0.8rem;
  opacity: 0.7;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.card-content h2 {
  margin: 0 0 1rem 0;
  font-size: 1.3rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.9;
}

.card-content p {
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  font-size: 0.85rem;
  opacity: 0.8;
}

.card-footer.action-buttons {
  justify-content: center;
  gap: 1rem;
}

.attempt-info {
  display: block;
}

.btn {
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-primary {
  background: rgba(255, 255, 255, 0.3);
  color: white;
  border: 2px solid white;
}

.btn-primary:hover {
  background: white;
  color: #333;
  transform: scale(1.05);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .card {
    aspect-ratio: auto;
    min-height: 400px;
  }

  .card-front,
  .card-back {
    padding: 1.5rem;
  }

  .card-content p {
    font-size: 1rem;
  }
}
</style>
