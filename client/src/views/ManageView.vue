<template>
  <div class="manage-view">
    <Navbar />

    <main class="container py-5">
      <!-- Header -->
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 class="mb-1"><i class="fas fa-layer-group text-accent"></i> Manage Cards</h1>
          <p class="text-muted mb-0">
            {{ filteredCards.length }} of {{ cards.cards.length }} cards shown
          </p>
        </div>
        <div class="d-flex gap-2 flex-wrap">
          <select
            v-model="categoryFilter"
            class="form-select w-auto"
            aria-label="Filter by category"
          >
            <option value="all">All categories</option>
            <option
              v-for="category in cards.categoriesWithCount"
              :key="category.id"
              :value="category.id"
            >
              {{ category.icon }} {{ category.name }} ({{ category.cardCount }})
            </option>
          </select>
          <button class="btn btn-primary" @click="openCreate">
            <i class="fas fa-plus"></i> New Card
          </button>
        </div>
      </div>

      <!-- Card list -->
      <TransitionGroup tag="div" name="card-row" class="card-list" v-if="filteredCards.length">
        <div v-for="card in filteredCards" :key="card.id" class="card-row">
          <div class="card-row-main">
            <p class="card-question mb-1">{{ card.question }}</p>
            <div class="card-meta">
              <span class="badge bg-secondary">{{ categoryLabel(card.category) }}</span>
              <span class="badge" :class="difficultyBadge(card.difficulty)">{{
                card.difficulty
              }}</span>
              <span class="badge bg-dark" v-if="card.subcategory">{{ card.subcategory }}</span>
              <small class="text-muted ms-1">
                {{ card.attemptCount }} attempts ·
                {{
                  card.attemptCount ? Math.round((card.correctCount / card.attemptCount) * 100) : 0
                }}% ·
                <span :class="card.mastered ? 'text-success' : 'text-muted'">
                  {{ card.mastered ? 'mastered' : card.needsReview ? 'review' : 'new' }}
                </span>
              </small>
            </div>
          </div>

          <div class="card-row-actions">
            <button
              class="btn btn-sm btn-outline-light"
              :aria-label="`Edit ${card.question}`"
              @click="openEdit(card)"
            >
              <i class="fas fa-pen"></i>
            </button>
            <button
              class="btn btn-sm btn-outline-danger"
              :aria-label="`Delete ${card.question}`"
              @click="removeCard(card.id)"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </TransitionGroup>

      <!-- Empty state -->
      <div v-else class="empty-state text-center py-5">
        <div class="display-1 mb-3">🗂️</div>
        <h3>No Cards Here</h3>
        <p class="text-muted">Create one to get started</p>
        <button class="btn btn-primary" @click="openCreate">
          <i class="fas fa-plus"></i> New Card
        </button>
      </div>
    </main>

    <!-- Create / edit modal (Teleport + GSAP) -->
    <CardFormModal
      :open="modalOpen"
      :card="editingCard"
      :categories="cards.categoriesWithCount"
      @close="closeModal"
      @save="saveCard"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useCardsStore } from '../stores/cards'
import type { Card, CardDraft, Difficulty } from '../stores/types'
import Navbar from '../components/Navbar.vue'
import CardFormModal from '../components/CardFormModal.vue'

const cards = useCardsStore()

const categoryFilter = ref('all')
const modalOpen = ref(false)
const editingCard = ref<Card | null>(null)

const filteredCards = computed(() =>
  categoryFilter.value === 'all'
    ? cards.cards
    : cards.cards.filter((card) => card.category === categoryFilter.value),
)

const categoryLabel = (categoryId: string) =>
  cards.categoriesWithCount.find((c) => c.id === categoryId)?.name ?? categoryId

const difficultyBadge = (difficulty: Difficulty) =>
  ({
    easy: 'bg-success',
    medium: 'bg-warning text-dark',
    hard: 'bg-danger',
  })[difficulty]

const openCreate = () => {
  editingCard.value = null
  modalOpen.value = true
}

const openEdit = (card: Card) => {
  editingCard.value = card
  modalOpen.value = true
}

const closeModal = () => {
  modalOpen.value = false
  editingCard.value = null
}

const saveCard = (draft: CardDraft) => {
  if (editingCard.value) {
    cards.updateCard(editingCard.value.id, draft)
  } else {
    cards.addCard(draft)
  }
  closeModal()
}

const removeCard = (id: string) => {
  cards.deleteCard(id)
}

onMounted(() => cards.hydrate())
</script>

<style scoped>
.manage-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}

h1 {
  font-size: 2rem;
}

.card-list {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.card-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent);
  border-radius: 8px;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.card-row:hover {
  border-color: var(--accent);
  box-shadow: 0 8px 24px rgba(0, 212, 255, 0.12);
}

.card-question {
  font-family: var(--font-mono);
  font-weight: 600;
  color: var(--code-text);
}

.card-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
}

.card-row-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.empty-state {
  border: 2px dashed var(--border);
  border-radius: 12px;
  background: rgba(0, 212, 255, 0.05);
}

/* TransitionGroup: rows slide into place, fade out on delete */
.card-row-enter-active {
  transition: all 0.35s ease;
}

.card-row-leave-active {
  transition: all 0.3s ease;
  position: absolute;
  opacity: 0;
}

.card-row-enter-from {
  opacity: 0;
  transform: translateX(-24px);
}

.card-row-leave-to {
  opacity: 0;
  transform: translateX(24px);
}

.card-row-move {
  transition: transform 0.35s ease;
}

@media (max-width: 768px) {
  .card-row {
    flex-direction: column;
    align-items: stretch;
  }

  .card-row-actions {
    justify-content: flex-end;
  }
}
</style>
