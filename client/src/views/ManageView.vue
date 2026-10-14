<template>
  <div class="manage-view">
    <Navbar />

    <main class="container py-5">
      <!-- Header -->
      <div class="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <p class="serial mb-2">CATALOG · CARDS ON FILE</p>
          <h1 class="mb-1">The catalog</h1>
          <p class="text-muted mb-0">
            {{ filteredCards.length }} of {{ cards.cards.length }} cards shown · changes live in
            this tab only
          </p>
        </div>
        <div class="d-flex gap-2 flex-wrap">
          <select
            v-model="categoryFilter"
            class="form-select w-auto"
            aria-label="Filter by category"
          >
            <option value="all">All drawers</option>
            <option
              v-for="category in cards.categoriesWithCount"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }} ({{ category.cardCount }})
            </option>
          </select>
          <button class="btn btn-primary" @click="openCreate">
            <i class="fas fa-plus" aria-hidden="true"></i> Add a card
          </button>
        </div>
      </div>

      <!-- Card list -->
      <TransitionGroup tag="div" name="card-row" class="card-list" v-if="filteredCards.length">
        <div v-for="(card, index) in filteredCards" :key="card.id" class="card-row">
          <span class="row-serial serial">No. {{ String(index + 1).padStart(3, '0') }}</span>
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
                }}%
              </small>
              <span
                class="stamp stamp-xs"
                :class="{
                  'stamp--green': card.mastered,
                  'stamp--red': !card.mastered && card.needsReview,
                  'stamp--faint': !card.mastered && !card.needsReview,
                }"
              >
                {{ card.mastered ? 'mastered' : card.needsReview ? 'review' : 'unmarked' }}
              </span>
            </div>
          </div>

          <div class="card-row-actions">
            <button
              class="btn btn-sm btn-outline-light"
              :aria-label="`Edit ${card.question}`"
              @click="openEdit(card)"
            >
              <i class="fas fa-pen" aria-hidden="true"></i>
            </button>
            <button
              class="btn btn-sm btn-outline-danger"
              :aria-label="`Delete ${card.question}`"
              @click="removeCard(card.id)"
            >
              <i class="fas fa-trash" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </TransitionGroup>

      <!-- Empty state -->
      <div v-else class="empty-state text-center py-5">
        <p class="serial mb-2">EMPTY DRAWER</p>
        <h3>Nothing filed here</h3>
        <p class="text-muted">Add a card and it joins the drawer immediately.</p>
        <button class="btn btn-primary" @click="openCreate">
          <i class="fas fa-plus" aria-hidden="true"></i> Add a card
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
    medium: 'bg-warning',
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

/* Rows as filed label slips */
.card-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: var(--surface);
  border: 1px solid var(--rule);
  border-left: 3px solid var(--accent);
  border-radius: 2px;
  transition: border-color 0.2s ease;
}

.card-row:hover {
  border-color: var(--accent);
}

.row-serial {
  flex-shrink: 0;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  letter-spacing: 2px;
  border-right: 1px dashed var(--rule);
  padding-right: 0.65rem;
}

.card-row-main {
  flex: 1;
  min-width: 0;
}

.card-question {
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--ink);
}

.card-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
}

/* status stamps, small enough for a row */
.stamp-xs {
  font-size: 0.62rem;
  letter-spacing: 1.5px;
  padding: 0.1rem 0.4rem;
  border-width: 1.5px;
  transform: rotate(-2deg);
}

.card-row-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.empty-state {
  border: 2px dashed var(--rule);
  border-radius: 3px;
  background: var(--surface-2);
}

.empty-state h3 {
  font-size: 1.3rem;
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

  .row-serial {
    writing-mode: horizontal-tb;
    transform: none;
    border-right: none;
    border-bottom: 1px dashed var(--rule);
    padding: 0 0 0.4rem 0;
    margin-bottom: 0.4rem;
  }

  .card-row-actions {
    justify-content: flex-end;
  }
}
</style>
