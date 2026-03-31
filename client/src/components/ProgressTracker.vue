<template>
  <div class="progress-tracker" :class="{ 'dark-mode': isDarkMode }">
    <!-- Main Progress Bar -->
    <div class="progress-main">
      <div class="progress-info-row">
        <div class="info-section">
          <span class="label">Progress</span>
          <span class="value">{{ currentIndex + 1 }}/{{ total }}</span>
        </div>
        <div class="info-section">
          <span class="label">Completed</span>
          <span class="value">{{ progress }}%</span>
        </div>
        <div class="info-section">
          <span class="label">Accuracy</span>
          <span class="value accuracy-badge">{{ accuracy }}%</span>
        </div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }">
            <span class="progress-text" v-if="progress > 10">{{ progress }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Milestone Info -->
    <div class="milestones">
      <div class="milestone">
        <span class="milestone-label">Mastered</span>
        <span class="milestone-count">{{ masterCount }}</span>
      </div>
      <div class="milestone">
        <span class="milestone-label">Reviewing</span>
        <span class="milestone-count">{{ reviewCount }}</span>
      </div>
      <div class="milestone">
        <span class="milestone-label">Remaining</span>
        <span class="milestone-count">{{ remainingCount }}</span>
      </div>
    </div>

    <!-- Completion Celebration Animation -->
    <transition name="celebration">
      <div v-if="isCompleted" class="celebration">
        <div class="celebration-content">
          <span class="celebration-emoji">🎉</span>
          <h3>You Mastered This Deck!</h3>
          <p>{{ total }} cards completed!</p>
          <button @click="$emit('restart')" class="restart-btn">
            ↻ Restart Deck
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  currentIndex: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  masterCount: {
    type: Number,
    default: 0,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  accuracy: {
    type: Number,
    default: 0,
  },
  isDarkMode: {
    type: Boolean,
    default: false,
  },
})

const progress = computed(() => {
  return props.total > 0 ? Math.round(((props.currentIndex + 1) / props.total) * 100) : 0
})

const remainingCount = computed(() => {
  return props.total - props.masterCount - props.reviewCount
})

const isCompleted = computed(() => {
  return props.total > 0 && props.currentIndex + 1 === props.total && progress.value === 100
})

defineEmits(['restart'])
</script>

<style scoped>
.progress-tracker {
  width: 100%;
  max-width: 700px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(240, 240, 240, 0.9));
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.progress-tracker.dark-mode {
  background: linear-gradient(135deg, rgba(40, 40, 40, 0.9), rgba(30, 30, 30, 0.9));
  color: white;
}

.progress-main {
  margin-bottom: 2rem;
}

.progress-info-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.info-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
}

.label {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.7;
}

.value {
  font-size: 1.3rem;
  font-weight: bold;
  color: #4caf50;
}

.accuracy-badge {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  background: linear-gradient(135deg, #4caf50, #00bcd4);
  color: white;
  font-size: 1rem;
}

.progress-bar-container {
  position: relative;
  width: 100%;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4caf50 0%, #00bcd4 100%);
  transition: width 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
}

.progress-text {
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
}

.milestones {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.progress-tracker.dark-mode .milestones {
  border-top-color: rgba(255, 255, 255, 0.1);
}

.milestone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(0, 188, 212, 0.1));
  border-radius: 10px;
}

.milestone-label {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  opacity: 0.7;
}

.milestone-count {
  font-size: 1.8rem;
  font-weight: bold;
  color: #4caf50;
}

/* Celebration Animation */
.celebration {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.celebration-content {
  background: white;
  border-radius: 20px;
  padding: 3rem 2rem;
  text-align: center;
  max-width: 400px;
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.3);
  animation: celebrate 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.celebration-emoji {
  font-size: 5rem;
  display: block;
  margin-bottom: 1rem;
  animation: bounce 0.6s infinite;
}

.celebration-content h3 {
  font-size: 2rem;
  color: #4caf50;
  margin: 0.5rem 0;
}

.celebration-content p {
  color: #666;
  margin: 0.5rem 0 1.5rem 0;
  font-size: 1.1rem;
}

.restart-btn {
  padding: 0.8rem 2rem;
  background: linear-gradient(135deg, #4caf50, #00bcd4);
  color: white;
  border: none;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.restart-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(76, 175, 80, 0.4);
}

@keyframes celebrate {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.celebration-enter-active,
.celebration-leave-active {
  transition: all 0.3s ease;
}

.celebration-enter-from,
.celebration-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

@media (max-width: 768px) {
  .progress-tracker {
    padding: 1rem;
  }

  .progress-info-row {
    gap: 0.5rem;
  }

  .label {
    font-size: 0.7rem;
  }

  .value {
    font-size: 1rem;
  }
}
</style>
