<template>
  <div class="flashcards-view">
    <Navbar />

    <div class="container-fluid flex-grow-1">
      <div class="row h-100 g-0">
        <!-- Sidebar -->
        <div class="col-lg-3 d-none d-lg-block">
          <Sidebar
            :categories="store.categoriesWithCount"
            :selected-category="store.selectedCategory"
            :selected-mode="store.studyMode"
            :selected-filter="store.filterMode"
            :sound-enabled="settings.soundEnabled"
            @mode-change="handleModeChange"
            @filter-change="handleFilterChange"
            @category-change="handleCategoryChange"
            @toggle-sound="settings.toggleSound()"
          />
        </div>

        <!-- Main Content -->
        <div class="col-lg-9 main-area">
          <!-- Mobile Controls (Collapsible) -->
          <div class="d-lg-none mobile-controls mb-3">
            <div class="accordion">
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button
                    class="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#mobileFilters"
                  >
                    <i class="fas fa-sliders-h"></i> Filters & Settings
                  </button>
                </h2>
                <div
                  id="mobileFilters"
                  class="accordion-collapse collapse"
                  data-bs-parent="#mobileControls"
                >
                  <div class="accordion-body">
                    <Sidebar
                      :categories="store.categoriesWithCount"
                      :selected-category="store.selectedCategory"
                      :selected-mode="store.studyMode"
                      :selected-filter="store.filterMode"
                      :sound-enabled="settings.soundEnabled"
                      @mode-change="handleModeChange"
                      @filter-change="handleFilterChange"
                      @category-change="handleCategoryChange"
                      @toggle-sound="settings.toggleSound()"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Header -->
          <div
            class="study-header mb-4 d-flex flex-wrap justify-content-between align-items-start gap-2"
          >
            <div>
              <h1><i class="fas fa-book-open"></i> Study</h1>
              <p class="text-muted small mb-0" v-if="store.selectedCategory !== 'all'">
                Category: <span class="badge bg-info">{{ getCurrentCategoryName }}</span>
              </p>
            </div>
            <router-link to="/manage" class="btn btn-outline-light btn-sm">
              <i class="fas fa-pen"></i> Manage Cards
            </router-link>
          </div>

          <!-- Keyboard hints -->
          <div class="keyboard-hints mb-3 small text-muted">
            <span class="badge bg-secondary me-2"><kbd>←</kbd><kbd>→</kbd> navigate</span>
            <span class="badge bg-secondary me-2"><kbd>Space</kbd> flip</span>
            <span class="badge bg-secondary me-2"><kbd>K</kbd> know</span>
            <span class="badge bg-secondary"><kbd>R</kbd> review</span>
          </div>

          <!-- Category Selection Collapsible -->
          <div class="category-selector mb-4 d-lg-none">
            <button
              class="collapse-header w-100"
              @click="toggleCategoryCollapse = !toggleCategoryCollapse"
            >
              <i class="fas fa-sitemap"></i>
              <span>Select Category</span>
              <i
                class="fas fa-chevron-down collapse-icon ms-auto"
                :class="{ open: toggleCategoryCollapse }"
              ></i>
            </button>
            <div v-if="toggleCategoryCollapse" class="collapse-content mt-2">
              <div class="list-group">
                <button
                  v-for="category in store.categoriesWithCount"
                  :key="category.id"
                  class="list-group-item list-group-item-action"
                  :class="{ active: store.selectedCategory === category.id }"
                  @click="handleCategoryChange(category.id)"
                >
                  {{ category.icon }} {{ category.name }}
                  <span class="badge bg-secondary float-end">{{ category.cardCount }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Progress Card -->
          <ProgressCard
            :current-index="store.currentIndex"
            :total="store.filteredCards.length"
            :accuracy="store.accuracyPercentage"
            :mastered="store.cardsMastered"
            :reviewing="store.cardsNeedingReview"
          />

          <!-- Main Card Display -->
          <div class="card-display mt-4" ref="cardDisplayRef" v-if="store.filteredCards.length > 0">
            <Transition :css="false" mode="out-in" @enter="onCardEnter" @leave="onCardLeave">
              <CodeCard
                ref="cardRef"
                :key="store.currentCard?.id"
                :question="store.currentCard?.question || ''"
                :answer="store.currentCard?.answer || ''"
                :category="currentCategoryLabel"
                :difficulty="store.currentCard?.difficulty || 'medium'"
                @know-this="markMastered"
                @review-again="markReview"
              />
            </Transition>
          </div>

          <!-- Empty State -->
          <div v-else class="empty-state text-center py-5">
            <div class="display-1 mb-3">📭</div>
            <h3>No Cards Found</h3>
            <p class="text-muted">Try selecting a different category or filter</p>
            <button @click="resetFilters" class="btn btn-primary">
              <i class="fas fa-redo"></i> Reset Filters
            </button>
          </div>

          <!-- Navigation -->
          <div v-if="store.filteredCards.length > 0" class="navigation mt-4 mb-4">
            <div class="d-flex gap-2 justify-content-center flex-wrap">
              <button
                @click="handlePrevious"
                :disabled="store.currentIndex === 0"
                class="btn btn-outline-light"
              >
                <i class="fas fa-chevron-left"></i> Previous
              </button>

              <div class="btn btn-secondary" disabled>
                {{ store.currentIndex + 1 }} / {{ store.filteredCards.length }}
              </div>

              <button
                @click="handleNext"
                :disabled="store.currentIndex === store.filteredCards.length - 1"
                class="btn btn-outline-light"
              >
                Next <i class="fas fa-chevron-right"></i>
              </button>
            </div>

            <div class="d-flex gap-2 justify-content-center flex-wrap mt-3">
              <button @click="handleShuffle" class="btn btn-info btn-sm">
                <i class="fas fa-random"></i> Shuffle
              </button>
              <button @click="resetProgress" class="btn btn-warning btn-sm">
                <i class="fas fa-undo"></i> Reset
              </button>
            </div>

            <div class="text-center mt-3">
              <small class="text-muted">
                <i class="fas fa-clock"></i> On this card: {{ timer.elapsed.value }}s
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useCardsStore } from '../stores/cards'
import { useSessionStore } from '../stores/session'
import { useSettingsStore } from '../stores/settings'
import { useKeyboardNav } from '../composables/useKeyboardNav'
import { useSwipeGesture } from '../composables/useSwipeGesture'
import { useSessionTimer } from '../composables/useSessionTimer'
import { gsap } from '../plugins/gsap'
import Navbar from '../components/Navbar.vue'
import Sidebar from '../components/Sidebar.vue'
import ProgressCard from '../components/ProgressCard.vue'
import CodeCard from '../components/CodeCard.vue'

const store = useCardsStore()
const session = useSessionStore()
const settings = useSettingsStore()

const cardRef = ref<InstanceType<typeof CodeCard> | null>(null)
const cardDisplayRef = ref<HTMLElement | null>(null)
const toggleCategoryCollapse = ref(false)

const timer = useSessionTimer()

/* --------------- Card transitions (GSAP) --------------- */

const onCardLeave = (el: Element, done: () => void) => {
  gsap.to(el, {
    x: -70,
    opacity: 0,
    rotate: -3,
    duration: 0.28,
    ease: 'power2.in',
    onComplete: done,
  })
}

const onCardEnter = (el: Element, done: () => void) => {
  gsap.fromTo(
    el,
    { x: 70, opacity: 0, rotate: 3 },
    {
      x: 0,
      opacity: 1,
      rotate: 0,
      duration: 0.45,
      ease: 'back.out(1.5)',
      onComplete: done,
    },
  )
}

/* --------------- Navigation --------------- */

const handleNext = () => {
  store.nextCard()
  cardRef.value?.resetFlip()
  timer.restart()
}

const handlePrevious = () => {
  store.prevCard()
  cardRef.value?.resetFlip()
  timer.restart()
}

const handleModeChange = (mode: 'normal' | 'quiz' | 'random') => {
  store.setStudyMode(mode)
  cardRef.value?.resetFlip()
  timer.restart()
}

const handleFilterChange = (filter: 'all' | 'mastered' | 'review') => {
  store.setFilterMode(filter)
  timer.restart()
}

const handleCategoryChange = (category: string) => {
  store.setCategory(category)
  toggleCategoryCollapse.value = false
  cardRef.value?.resetFlip()
  timer.restart()
  // New session scope when the category changes
  if (session.currentSession) {
    session.endSession()
    session.startSession(category, store.studyMode)
  }
}

const handleShuffle = () => {
  store.shuffleCards()
  store.resetProgress()
  cardRef.value?.resetFlip()
  timer.restart()
}

const resetProgress = () => {
  store.resetProgress()
  cardRef.value?.resetFlip()
  timer.restart()
}

const resetFilters = () => {
  store.setCategory('all')
  store.setFilterMode('all')
}

/* --------------- Grading --------------- */

const markMastered = () => {
  const card = store.currentCard
  if (!card) return
  store.markCardMastered(card.id)
  session.recordCardAttempt(card.id, true, timer.elapsed.value)
  handleNext()
}

const markReview = () => {
  const card = store.currentCard
  if (!card) return
  store.markCardForReview(card.id)
  session.recordCardAttempt(card.id, false, timer.elapsed.value)
  handleNext()
}

/* --------------- Keyboard + swipe --------------- */

useKeyboardNav({
  onNext: handleNext,
  onPrev: handlePrevious,
  onFlip: () => cardRef.value?.flip(),
  onMarkCorrect: markMastered,
  onMarkReview: markReview,
})

useSwipeGesture(cardDisplayRef, {
  onSwipeLeft: handleNext,
  onSwipeRight: handlePrevious,
  onSwipeUp: () => cardRef.value?.flip(),
})

/* --------------- Derived --------------- */

const getCurrentCategoryName = computed(() => {
  if (store.selectedCategory === 'all') return 'All'
  return store.categoriesWithCount.find((c) => c.id === store.selectedCategory)?.name || 'Unknown'
})

const currentCategoryLabel = computed(() => {
  const categoryId = store.currentCard?.category
  if (!categoryId) return ''
  return store.categoriesWithCount.find((c) => c.id === categoryId)?.name ?? categoryId
})

/* --------------- Session lifecycle --------------- */

watch(
  () => store.currentIndex,
  () => timer.restart(),
)

onMounted(() => {
  store.hydrate()
  session.startSession(store.selectedCategory, store.studyMode)
  timer.restart()
})

onBeforeUnmount(() => {
  timer.stop()
  session.endSession()
})
</script>

<style scoped>
.flashcards-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container-fluid {
  flex: 1;
  padding: 2rem 1rem;
}

.row {
  min-height: calc(100vh - 80px);
}

.main-area {
  padding: 2rem;
  overflow-y: auto;
  max-height: calc(100vh - 80px);
}

.study-header {
  border-bottom: 2px solid var(--border);
  padding-bottom: 1.5rem;
}

.study-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.keyboard-hints kbd {
  background: var(--code-bg);
  border: 1px solid var(--border);
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  margin: 0 2px;
  box-shadow: none;
}

.mobile-controls {
  display: block;
}

.accordion-button {
  font-family: var(--font-mono);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: var(--code-bg);
  color: var(--accent);
  border: 1px solid var(--border);
}

.accordion-button:not(.collapsed) {
  background: rgba(0, 212, 255, 0.1);
  border-color: var(--accent);
}

.accordion-button:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 0.25rem rgba(0, 212, 255, 0.25);
}

.accordion-body {
  padding: 0;
  background: transparent;
  border-top: 1px solid var(--border);
}

.category-selector {
  margin-top: 2rem;
}

.collapse-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--code-bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  font-family: var(--font-mono);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--code-text);
}

.collapse-header:hover {
  background: rgba(0, 212, 255, 0.1);
  border-color: var(--accent);
  color: var(--accent);
}

.collapse-icon {
  transition: transform 0.3s ease;
}

.collapse-icon.open {
  transform: rotate(180deg);
}

.collapse-content {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.list-group-item {
  background: var(--code-bg);
  border: 1px solid var(--border);
  color: var(--code-text);
  font-family: var(--font-mono);
  transition: all 0.3s ease;
}

.list-group-item:hover {
  background: rgba(0, 212, 255, 0.1);
  border-color: var(--accent);
  color: var(--accent);
}

.list-group-item.active {
  background: linear-gradient(135deg, var(--accent) 0%, var(--secondary) 100%);
  border-color: transparent;
  color: var(--darker);
}

.card-display {
  min-height: 450px;
}

.empty-state {
  padding: 4rem 2rem;
  border: 2px dashed var(--border);
  border-radius: 12px;
  background: rgba(0, 212, 255, 0.05);
}

.navigation {
  padding: 2rem 0;
  border-top: 2px solid var(--border);
}

@media (max-width: 768px) {
  .container-fluid {
    padding: 1rem 0.5rem;
  }

  .main-area {
    padding: 1rem;
  }

  .study-header h1 {
    font-size: 1.75rem;
  }

  .card-display {
    min-height: auto;
  }

  .navigation {
    padding: 1rem 0;
  }
}
</style>
