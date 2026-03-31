<template>
  <div class="flashcards-view">
    <Navbar />

    <div class="container-fluid flex-grow-1">
      <div class="row h-100 g-0">
        <!-- Sidebar -->
        <div class="col-lg-3 d-none d-lg-block">
          <Sidebar
            :categories="store.categories"
            :selected-category="store.selectedCategory"
            :selected-mode="store.studyMode"
            :selected-filter="store.filterMode"
            :sound-enabled="store.soundEnabled"
            @mode-change="handleModeChange"
            @filter-change="handleFilterChange"
            @category-change="handleCategoryChange"
            @toggle-sound="store.toggleSound()"
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
                <div id="mobileFilters" class="accordion-collapse collapse" data-bs-parent="#mobileControls">
                  <div class="accordion-body">
                    <Sidebar
                      :categories="store.categories"
                      :selected-category="store.selectedCategory"
                      :selected-mode="store.studyMode"
                      :selected-filter="store.filterMode"
                      :sound-enabled="store.soundEnabled"
                      @mode-change="handleModeChange"
                      @filter-change="handleFilterChange"
                      @category-change="handleCategoryChange"
                      @toggle-sound="store.toggleSound()"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Header -->
          <div class="study-header mb-4">
            <h1>
              <i class="fas fa-book-open"></i> Study
            </h1>
            <p class="text-muted small mb-3" v-if="store.selectedCategory !== 'all'">
              Category: <span class="badge bg-info">{{ getCurrentCategoryName }}</span>
            </p>
          </div>

          <!-- Category Selection Collapsible -->
          <div class="category-selector mb-4 d-lg-none">
            <button class="collapse-header w-100" @click="toggleCategoryCollapse = !toggleCategoryCollapse">
              <i class="fas fa-sitemap"></i>
              <span>Select Category</span>
              <i class="fas fa-chevron-down collapse-icon ms-auto" :class="{ open: toggleCategoryCollapse }"></i>
            </button>
            <div v-if="toggleCategoryCollapse" class="collapse-content mt-2">
              <div class="list-group">
                <button
                  v-for="category in store.categories"
                  :key="category.id"
                  class="list-group-item list-group-item-action"
                  :class="{ active: store.selectedCategory === category.id }"
                  @click="handleCategoryChange(category.id)"
                >
                  {{ getIcon(category.name) }} {{ category.name }}
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
          <div class="card-display mt-4" v-if="store.filteredCards.length > 0">
            <CodeCard
              ref="cardRef"
              :key="store.currentCard?.id"
              :question="store.currentCard?.question || ''"
              :answer="store.currentCard?.answer || ''"
              :category="store.currentCard?.category || ''"
              :difficulty="store.currentCard?.difficulty || 'medium'"
              @know-this="markMastered"
              @review-again="markReview"
            />
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFlashcardStore } from '../stores/flashcardStore'
import Navbar from '../components/Navbar.vue'
import Sidebar from '../components/Sidebar.vue'
import ProgressCard from '../components/ProgressCard.vue'
import CodeCard from '../components/CodeCard.vue'

const store = useFlashcardStore()
const cardRef = ref()
const toggleCategoryCollapse = ref(false)

const handleNext = () => {
  store.nextCard()
  cardRef.value?.resetFlip()
}

const handlePrevious = () => {
  store.prevCard()
  cardRef.value?.resetFlip()
}

const handleModeChange = (mode: 'normal' | 'quiz' | 'random') => {
  store.setStudyMode(mode)
  cardRef.value?.resetFlip()
}

const handleFilterChange = (filter: 'all' | 'mastered' | 'review') => {
  store.setFilterMode(filter)
}

const handleCategoryChange = async (category: string) => {
  store.setCategory(category)
  toggleCategoryCollapse.value = false
  cardRef.value?.resetFlip()
}

const handleShuffle = () => {
  store.shuffleCards()
  store.resetProgress()
  cardRef.value?.resetFlip()
}

const resetProgress = () => {
  store.resetProgress()
  cardRef.value?.resetFlip()
}

const resetFilters = () => {
  store.selectedCategory = 'all'
  store.filterMode = 'all'
  store.currentIndex = 0
}

const markMastered = async () => {
  const card = store.currentCard
  if (card?.id) {
    await store.markCardMastered(card.id)
    handleNext()
  }
}

const markReview = async () => {
  const card = store.currentCard
  if (card?.id) {
    await store.markCardForReview(card.id)
    handleNext()
  }
}

const getCurrentCategoryName = computed(() => {
  if (store.selectedCategory === 'all') return 'All'
  return store.categories.find((c) => c.id === store.selectedCategory)?.name || 'Unknown'
})

const getIcon = (name: string): string => {
  const icons: Record<string, string> = {
    JavaScript: '📜',
    'Vue.js': '🟢',
    Angular: '🔴',
    '.NET': '🟦',
    GraphQL: '🔸',
    Python: '🐍',
    Java: '☕',
    'Spring Boot': '🍃',
  }
  return icons[name] || '📚'
}

onMounted(async () => {
  store.loadSettings()
  await store.fetchCategories()
  await store.fetchCards()
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
  margin-bottom: 2rem;
}

.study-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
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
