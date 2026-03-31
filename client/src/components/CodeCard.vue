<template>
  <div class="code-card-container">
    <div
      class="code-card"
      :class="{ flipped: isFlipped }"
      @click="toggleFlip"
    >
      <div class="card-inner">
        <!-- Front Side - Question -->
        <div class="card-side question-side">
          <div class="card-header">
            <span class="card-title">
              <i class="fas fa-question-circle"></i> Question
            </span>
            <span class="difficulty-badge" :class="'difficulty-' + difficulty">
              {{ difficulty }}
            </span>
          </div>
          <div class="card-content">
            <pre><code class="text-mono">{{ question }}</code></pre>
          </div>
          <div class="card-footer">
            <span class="hint">
              <i class="fas fa-mouse"></i> Click to reveal answer
            </span>
          </div>
        </div>

        <!-- Back Side - Answer -->
        <div class="card-side answer-side">
          <div class="card-header">
            <span class="card-title">
              <i class="fas fa-lightbulb"></i> Answer
            </span>
            <span class="category-badge">{{ category }}</span>
          </div>
          <div class="card-content">
            <pre><code class="text-mono" v-html="highlightedAnswer"></code></pre>
          </div>
          <div class="card-actions">
            <button
              @click.stop="$emit('know-this')"
              class="btn btn-success btn-sm"
            >
              <i class="fas fa-check"></i> I Know This
            </button>
            <button
              @click.stop="$emit('review-again')"
              class="btn btn-warning btn-sm"
            >
              <i class="fas fa-redo"></i> Review
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import hljs from 'highlight.js'

interface Props {
  question: string
  answer: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
}

const props = defineProps<Props>()

const isFlipped = ref(false)

const toggleFlip = () => {
  isFlipped.value = !isFlipped.value
}

const highlightedAnswer = computed(() => {
  try {
    return hljs.highlightAuto(props.answer).value
  } catch {
    return props.answer
  }
})

defineExpose({
  resetFlip: () => {
    isFlipped.value = false
  },
})

defineEmits(['know-this', 'review-again'])
</script>

<style scoped>
.code-card-container {
  perspective: 1200px;
  width: 100%;
  max-width: 100%;
  margin: 2rem auto;
}

.code-card {
  width: 100%;
  min-height: 400px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  cursor: pointer;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.code-card.flipped {
  transform: rotateY(180deg);
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
}

.card-side {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border: 2px solid var(--border);
  border-radius: 12px;
  padding: 2rem;
}

.question-side {
  justify-content: space-between;
}

.answer-side {
  transform: rotateY(180deg);
  justify-content: space-between;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border);
}

.card-title {
  color: var(--accent);
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.difficulty-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.difficulty-easy {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid #10b981;
}

.difficulty-medium {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  border: 1px solid #f59e0b;
}

.difficulty-hard {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid #ef4444;
}

.category-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  background: rgba(0, 212, 255, 0.2);
  color: var(--accent);
  border: 1px solid var(--accent);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem 0;
  overflow-y: auto;
  max-height: 200px;
}

pre {
  width: 100%;
  margin: 0;
  background: var(--code-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;
}

code {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--code-text);
}

.card-footer {
  padding-top: 1rem;
  border-top: 2px solid var(--border);
  text-align: center;
}

.hint {
  font-size: 0.85rem;
  color: #cbd5e1;
  font-family: var(--font-mono);
}

.card-actions {
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 2px solid var(--border);
  justify-content: center;
  flex-wrap: wrap;
}

.btn-sm {
  font-size: 0.8rem;
  padding: 0.5rem 1rem;
  font-family: var(--font-mono);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@media (max-width: 768px) {
  .code-card {
    min-height: 350px;
  }

  .card-side {
    padding: 1.5rem;
  }

  .card-content {
    max-height: 150px;
    font-size: 0.85rem;
  }

  pre {
    padding: 0.75rem;
  }

  code {
    font-size: 0.8rem;
  }

  .card-title {
    font-size: 0.95rem;
  }

  .card-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}

@media (max-height: 600px) and (orientation: landscape) {
  .code-card {
    min-height: 300px;
  }

  .card-side {
    padding: 1rem;
  }

  .card-content {
    max-height: 120px;
  }
}
</style>
