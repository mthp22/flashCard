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
                    <i class="fas fa-sliders-h" aria-hidden="true"></i> Drawer controls
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
              <p class="serial mb-1">DESK 01 · {{ store.filteredCards.length }} CARDS IN VIEW</p>
              <h1>Study desk</h1>
              <p class="text-muted small mb-0" v-if="store.selectedCategory !== 'all'">
                Drawer: <span class="badge bg-info">{{ getCurrentCategoryName }}</span>
              </p>
            </div>
            <router-link to="/manage" class="btn btn-outline-light btn-sm">
              <i class="fas fa-pen-fancy" aria-hidden="true"></i> Edit the catalog
            </router-link>
          </div>

          <!-- Keyboard legend — a typed slip clipped to the desk -->
          <div class="legend mb-3" aria-label="Keyboard shortcuts">
            <span><kbd>←</kbd><kbd>→</kbd> page through</span>
            <span><kbd>Space</kbd> turn over</span>
            <span><kbd>K</kbd> mark known</span>
            <span><kbd>R</kbd> needs review</span>
          </div>

          <!-- Category Selection Collapsible -->
          <div class="category-selector mb-4 d-lg-none">
            <button
              class="collapse-header w-100"
              @click="toggleCategoryCollapse = !toggleCategoryCollapse"
            >
              <i class="fas fa-archive" aria-hidden="true"></i>
              <span>Pick a drawer</span>
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
                  <i :class="category.icon" aria-hidden="true"></i>
                  {{ category.name }}
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
                :serial="store.currentIndex + 1"
                @know-this="markMastered"
                @review-again="markReview"
              />
            </Transition>

            <!-- Grading stamp — slammed on before the card is filed away -->
            <Transition :css="false" @leave="onStampLeave">
              <div
                v-if="stamp"
                ref="stampRef"
                class="grade-stamp"
                :class="stamp.tone === 'green' ? 'stamp--green' : 'stamp--red'"
                aria-live="polite"
              >
                {{ stamp.text }}
              </div>
            </Transition>
          </div>

          <!-- Empty State -->
          <div v-else class="empty-state text-center py-5">
            <p class="serial mb-2">EMPTY DRAWER</p>
            <h3>Nothing filed under this filter</h3>
            <p class="text-muted">Try another drawer, or show every card again.</p>
            <button @click="resetFilters" class="btn btn-primary">
              <i class="fas fa-redo" aria-hidden="true"></i> Reset filters
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
                <i class="fas fa-chevron-left" aria-hidden="true"></i> Previous
              </button>

              <div class="btn btn-secondary" disabled>
                {{ store.currentIndex + 1 }} / {{ store.filteredCards.length }}
              </div>

              <button
                @click="handleNext"
                :disabled="store.currentIndex === store.filteredCards.length - 1"
                class="btn btn-outline-light"
              >
                Next <i class="fas fa-chevron-right" aria-hidden="true"></i>
              </button>
            </div>

            <div class="d-flex gap-2 justify-content-center flex-wrap mt-3">
              <button @click="handleShuffle" class="btn btn-info btn-sm">
                <i class="fas fa-random" aria-hidden="true"></i> Shuffle the drawer
              </button>
              <button @click="resetProgress" class="btn btn-warning btn-sm">
                <i class="fas fa-undo" aria-hidden="true"></i> Reset marks
              </button>
            </div>

            <div class="text-center mt-3">
              <small class="serial">TIME AT THIS CARD — {{ timer.elapsed.value }}s</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
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
const stampRef = ref<HTMLElement | null>(null)
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

const onStampLeave = (el: Element, done: () => void) => {
  gsap.to(el, { opacity: 0, duration: 0.15, onComplete: done })
}

/* --------------- Navigation --------------- */

const clearStamp = () => {
  if (stampTimer) {
    clearTimeout(stampTimer)
    stampTimer = null
  }
  stamp.value = null
}

const handleNext = () => {
  clearStamp()
  store.nextCard()
  cardRef.value?.resetFlip()
  timer.restart()
}

const handlePrevious = () => {
  clearStamp()
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

/* --------------- Grading — stamp first, then file the card away --------------- */

const stamp = ref<{ text: string; tone: 'green' | 'red' } | null>(null)
let stampTimer: ReturnType<typeof setTimeout> | null = null

const stampAndAdvance = (text: string, tone: 'green' | 'red') => {
  stamp.value = { text, tone }
  stampTimer = setTimeout(() => {
    stampTimer = null
    stamp.value = null
    // advance without clearing the stamp we just removed (avoid double reset)
    store.nextCard()
    cardRef.value?.resetFlip()
    timer.restart()
  }, 550)
}

// the stamp lands like it was slammed down by hand
watch(stamp, async (value) => {
  if (!value) return
  await nextTick()
  if (stampRef.value) {
    gsap.fromTo(
      stampRef.value,
      { scale: 2.4, opacity: 0, rotate: -18 },
      { scale: 1, opacity: 1, rotate: -8, duration: 0.28, ease: 'back.out(2.5)' },
    )
  }
})

const markMastered = () => {
  if (stamp.value) return
  const card = store.currentCard
  if (!card) return
  store.markCardMastered(card.id)
  session.recordCardAttempt(card.id, true, timer.elapsed.value)
  stampAndAdvance('Mastered', 'green')
}

const markReview = () => {
  if (stamp.value) return
  const card = store.currentCard
  if (!card) return
  store.markCardForReview(card.id)
  session.recordCardAttempt(card.id, false, timer.elapsed.value)
  stampAndAdvance('Needs review', 'red')
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
  clearStamp()
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
  border-bottom: 3px double var(--rule);
  padding-bottom: 1.5rem;
}

.study-header h1 {
  font-size: 2.25rem;
  margin-bottom: 0.5rem;
}

/* Typed shortcut slip */
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 1.5rem;
  background: var(--surface-2);
  border: 1px solid var(--rule);
  border-left: 3px solid var(--accent);
  border-radius: 2px;
  padding: 0.6rem 1rem;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--ink-soft);
}

.legend kbd {
  margin-right: 0.35rem;
}

.mobile-controls {
  display: block;
}

.accordion-button {
  font-family: var(--font-mono);
  font-weight: 700;
  background: var(--surface-2);
  color: var(--ink);
  border: 1px solid var(--rule);
  border-radius: 2px;
}

.accordion-button:not(.collapsed) {
  background: color-mix(in srgb, var(--accent) 10%, var(--surface-2));
  border-color: var(--accent);
  color: var(--accent);
  box-shadow: none;
}

.accordion-button:focus {
  border-color: var(--accent);
  box-shadow: none;
}

.accordion-button::after {
  background-image: none;
  content: '\f078';
  font-family: 'Font Awesome 6 Free';
  font-weight: 900;
  color: var(--ink-soft);
}

.accordion-item {
  background: var(--surface);
  border: 1px solid var(--rule);
  border-radius: 2px !important;
}

.accordion-body {
  padding: 0;
  background: transparent;
  border-top: 1px solid var(--rule);
}

.category-selector {
  margin-top: 2rem;
}

.collapse-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--surface-2);
  border: 1px solid var(--rule);
  border-radius: 2px;
  font-family: var(--font-mono);
  font-weight: 700;
  cursor: pointer;
  transition: border-color 0.2s ease;
  color: var(--ink);
}

.collapse-header:hover {
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
  background: var(--surface);
  border: 1px solid var(--rule);
  border-radius: 0;
  color: var(--ink);
  font-family: var(--font-mono);
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.list-group-item:hover {
  background: var(--surface-2);
  color: var(--accent);
}

.list-group-item.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #faf5e9;
}

.list-group-item.active .badge {
  color: #faf5e9;
  background: transparent !important;
  border-color: rgba(250, 245, 233, 0.6);
}

.card-display {
  position: relative;
  min-height: 450px;
}

/* The rubber stamp that lands when you grade a card */
.grade-stamp {
  position: absolute;
  top: 42%;
  left: 50%;
  z-index: 5;
  transform: translate(-50%, -50%) rotate(-8deg);
  pointer-events: none;
  font-size: 1.4rem;
  letter-spacing: 4px;
  padding: 0.5rem 1.4rem;
  background: color-mix(in srgb, var(--surface) 55%, transparent);
}

.empty-state {
  padding: 4rem 2rem;
  border: 2px dashed var(--rule);
  border-radius: 3px;
  background: var(--surface-2);
}

.empty-state h3 {
  font-size: 1.3rem;
}

.navigation {
  padding: 2rem 0;
  border-top: 3px double var(--rule);
}

@media (max-width: 768px) {
  .container-fluid {
    padding: 1rem 0.5rem;
  }

  .main-area {
    padding: 1rem;
  }

  .study-header h1 {
    font-size: 1.6rem;
  }

  .card-display {
    min-height: auto;
  }

  .navigation {
    padding: 1rem 0;
  }
}
</style>
