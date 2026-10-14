<template>
  <div class="code-card-container">
    <!-- Drawer divider tab, sitting behind the card -->
    <div class="card-tab" v-if="category">{{ category }}</div>

    <div
      class="code-card"
      ref="cardRef"
      role="button"
      tabindex="0"
      aria-label="Turn the card over"
      @click="toggleFlip"
      @keydown.enter.prevent="toggleFlip"
    >
      <div class="card-inner">
        <!-- Front Side - Question -->
        <div class="card-side question-side">
          <div class="card-header">
            <span class="serial">No. {{ serialLabel }}</span>
            <span class="stamp" :class="'difficulty-' + difficulty">
              {{ difficulty }}
            </span>
          </div>
          <div class="card-content ruled">
            <pre><code class="text-mono">{{ question }}</code></pre>
          </div>
          <div class="card-footer">
            <span class="hint">turn the card — click or press space</span>
          </div>
          <span class="rod-hole" aria-hidden="true"></span>
        </div>

        <!-- Back Side - Answer -->
        <div class="card-side answer-side">
          <div class="card-header">
            <span class="card-title">Answer</span>
            <span class="serial">No. {{ serialLabel }}</span>
          </div>
          <div class="card-content">
            <pre><code class="text-mono" v-html="highlightedAnswer"></code></pre>
          </div>
          <div class="card-actions">
            <button @click.stop="$emit('know-this')" class="btn btn-know btn-sm">
              <i class="fas fa-check" aria-hidden="true"></i> I know this
            </button>
            <button @click.stop="$emit('review-again')" class="btn btn-review btn-sm">
              <i class="fas fa-redo" aria-hidden="true"></i> needs review
            </button>
          </div>
          <span class="rod-hole" aria-hidden="true"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import { hljs } from '../plugins/highlight'
import { gsap } from '../plugins/gsap'
import { useSettingsStore } from '../stores/settings'

interface Props {
  question: string
  answer: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  serial?: number
}

const props = defineProps<Props>()

const settings = useSettingsStore()
const cardRef = ref<HTMLElement | null>(null)
const isFlipped = ref(false)

const serialLabel = computed(() => String(props.serial ?? 1).padStart(3, '0'))

const flipTo = (flipped: boolean) => {
  isFlipped.value = flipped
  if (!cardRef.value) return
  gsap.to(cardRef.value, {
    rotationY: flipped ? 180 : 0,
    duration: 0.7,
    ease: 'back.inOut(1.4)',
    // subtle depth pop while rotating
    scale: flipped ? 1.02 : 1,
  })
  settings.playSound('flip')
}

const toggleFlip = () => flipTo(!isFlipped.value)

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
    if (cardRef.value) gsap.set(cardRef.value, { rotationY: 0, scale: 1 })
  },
  flip: toggleFlip,
})

defineEmits(['know-this', 'review-again'])

onBeforeUnmount(() => {
  if (cardRef.value) gsap.killTweensOf(cardRef.value)
})
</script>

<style scoped>
.code-card-container {
  position: relative;
  perspective: 1200px;
  width: 100%;
  max-width: 100%;
  margin: 2.5rem auto 2rem;
}

/* A divider tab peeking up from the drawer behind the card */
.card-tab {
  position: absolute;
  top: -30px;
  right: 2.5rem;
  z-index: 0;
  background: var(--surface-2);
  border: 1px solid var(--rule);
  border-bottom: none;
  border-radius: 3px 3px 0 0;
  padding: 0.3rem 1rem 0.35rem;
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 0.72rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--ink-soft);
}

.code-card {
  width: 100%;
  min-height: 400px;
  position: relative;
  z-index: 1;
  transform-style: preserve-3d;
  cursor: pointer;
  border-radius: 2px;
  box-shadow:
    0 1px 0 var(--rule),
    0 12px 28px rgba(36, 31, 23, 0.18);
}

:root[data-theme='dark'] .code-card {
  box-shadow:
    0 1px 0 rgba(0, 0, 0, 0.4),
    0 12px 28px rgba(0, 0, 0, 0.45);
}

.card-inner {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
}

.card-side {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  background: var(--surface);
  /* the classic index-card red top rule */
  border: 1px solid var(--rule);
  border-top: 3px solid var(--accent);
  border-radius: 2px;
  padding: 1.25rem 2rem 1.5rem;
  overflow: hidden;
}

/* the red vertical margin line, like a ruled index card */
.card-side::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 3.75rem;
  width: 1px;
  background: var(--accent);
  opacity: 0.45;
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
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.card-title {
  color: var(--accent);
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* difficulty as a small rubber stamp */
.difficulty-easy {
  color: var(--green);
}

.difficulty-medium {
  color: var(--amber);
}

.difficulty-hard {
  color: var(--accent);
}

.card-content {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 0.5rem 0;
  padding-left: 1rem;
  overflow-y: auto;
  max-height: 240px;
}

pre {
  width: 100%;
  margin: 0;
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  overflow-x: auto;
  /* Answers are mostly prose — wrap instead of scrolling off the card */
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

code {
  font-family: var(--font-mono);
  font-size: 1.05rem;
  line-height: 28px;
  color: var(--ink);
  /* the question is typed on the card, not in a code chip */
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
}

.card-footer {
  padding-top: 0.5rem;
  border-top: 1px solid var(--rule);
  background: transparent;
  text-align: left;
  padding-left: 1rem;
}

.hint {
  font-size: 0.8rem;
  color: var(--ink-soft);
  font-family: var(--font-mono);
  font-style: italic;
}

.card-actions {
  display: flex;
  gap: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--rule);
  justify-content: flex-end;
  flex-wrap: wrap;
  padding-left: 1rem;
}

/* graded in ink, not neon */
.btn-know {
  border-color: var(--green);
  color: var(--green);
  background: transparent;
}

.btn-know:hover {
  background: var(--green);
  color: var(--surface);
}

.btn-review {
  border-color: var(--accent);
  color: var(--accent);
  background: transparent;
}

.btn-review:hover {
  background: var(--accent);
  color: var(--surface);
}

.btn-sm {
  font-size: 0.8rem;
  padding: 0.4rem 0.9rem;
  font-family: var(--font-mono);
  font-weight: 700;
}

/* the punched rod hole at the card's bottom edge */
.rod-hole {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--bg);
  border: 1px solid var(--rule);
}

@media (max-width: 768px) {
  .code-card {
    min-height: 350px;
  }

  .card-side {
    padding: 1rem 1.25rem 1.25rem;
  }

  .card-side::before {
    left: 2.5rem;
  }

  .card-content {
    max-height: 190px;
    padding-left: 0.5rem;
  }

  code {
    font-size: 0.9rem;
  }

  .card-actions {
    flex-direction: column;
    justify-content: stretch;
  }

  .card-actions .btn {
    width: 100%;
  }
}

@media (max-height: 600px) and (orientation: landscape) {
  .code-card {
    min-height: 300px;
  }

  .card-content {
    max-height: 140px;
  }
}
</style>
