<template>
  <div class="flashcard-container">
    <div class="flashcard" :class="{ flipped: isFlipped }" @click="toggleFlip">
      <div class="flashcard-inner">
        <div class="flashcard-front">
          <h3>Question</h3>
          <p>{{ question }}</p>
          <span class="flip-hint">Click to reveal answer</span>
        </div>

        <div class="flashcard-back">
          <h3>Answer</h3>
          <p>{{ answer }}</p>
          <span class="flip-hint">Click to see question</span>
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
</script>

<style scoped>
.flashcard-container {
  perspective: 1000px;
  width: 300px;
  height: 200px;
  margin: 20px auto;
  max-width: 600px;
}

.flashcard {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
  cursor: pointer;
}

.flashcard.flipped {
  transform: rotateY(180deg);
}

.flashcard-front,
.flashcard-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.flashcard-front {
  background: linear-gradient(135deg, green, yellow);
  color: blue;
}

.flashcard-back {
  background: linear-gradient(135deg, red, orange);
  color: blue;
  transform: rotateY(180deg);
}

h3 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

p {
  font-size: 1.2rem;
  text-align: center;
  margin: 0;
  line-height: 1.6;
}

.flip-hint {
  position: absolute;
  bottom: 1rem;
  font-size: 0.8rem;
  opacity: 0.7;
}
</style>
