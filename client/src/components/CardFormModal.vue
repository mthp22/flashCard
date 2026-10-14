<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-backdrop" @click.self="close">
        <div
          class="card-modal"
          role="dialog"
          aria-modal="true"
          :aria-label="card ? 'Edit card' : 'Create card'"
          ref="panelRef"
          @keydown.esc="close"
        >
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0 text-accent">
              <i :class="card ? 'fas fa-pen' : 'fas fa-plus'" aria-hidden="true"></i>
              {{ card ? 'Edit Card' : 'New Card' }}
            </h5>
            <button class="btn btn-sm btn-outline-light" aria-label="Close" @click="close">
              <i class="fas fa-times" aria-hidden="true"></i>
            </button>
          </div>

          <form class="card-body" @submit.prevent="submit">
            <div class="mb-3">
              <label class="form-label" for="card-question">Question</label>
              <textarea
                id="card-question"
                v-model.trim="form.question"
                class="form-control"
                rows="3"
                placeholder="e.g. What is a closure?"
                :class="{ 'is-invalid': errors.question }"
              ></textarea>
              <div v-if="errors.question" class="invalid-feedback d-block">
                {{ errors.question }}
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label" for="card-answer">Answer</label>
              <textarea
                id="card-answer"
                v-model.trim="form.answer"
                class="form-control"
                rows="4"
                placeholder="e.g. A function that captures its outer scope…"
                :class="{ 'is-invalid': errors.answer }"
              ></textarea>
              <div v-if="errors.answer" class="invalid-feedback d-block">
                {{ errors.answer }}
              </div>
            </div>

            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <label class="form-label" for="card-category">Category</label>
                <select
                  id="card-category"
                  v-model="form.category"
                  class="form-select"
                  :class="{ 'is-invalid': errors.category }"
                >
                  <option value="" disabled>Select…</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
                <div v-if="errors.category" class="invalid-feedback d-block">
                  {{ errors.category }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label" for="card-subcategory">Subcategory</label>
                <input
                  id="card-subcategory"
                  v-model.trim="form.subcategory"
                  class="form-control"
                  list="subcategory-options"
                  placeholder="e.g. Closures"
                />
                <datalist id="subcategory-options">
                  <option v-for="topic in availableSubcategories" :key="topic" :value="topic" />
                </datalist>
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label">Difficulty</label>
              <div class="btn-group w-100" role="group" aria-label="Difficulty">
                <button
                  v-for="level in difficulties"
                  :key="level"
                  type="button"
                  class="btn btn-sm"
                  :class="form.difficulty === level ? 'btn-primary' : 'btn-outline-light'"
                  @click="form.difficulty = level"
                >
                  {{ level }}
                </button>
              </div>
            </div>

            <div class="d-flex gap-2 justify-content-end">
              <button type="button" class="btn btn-outline-light" @click="close">Cancel</button>
              <button type="submit" class="btn btn-primary">
                <i class="fas fa-save"></i> {{ card ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { gsap } from '../plugins/gsap'
import type { Card, CardDraft, Category, Difficulty } from '../stores/types'

interface Props {
  open: boolean
  card?: Card | null
  categories: Category[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  save: [draft: CardDraft]
}>()

const panelRef = ref<HTMLElement | null>(null)

const difficulties: Difficulty[] = ['easy', 'medium', 'hard']

const emptyForm = {
  question: '',
  answer: '',
  category: '',
  subcategory: '',
  difficulty: 'medium' as Difficulty,
}

const form = reactive({ ...emptyForm })
const errors = reactive<Record<string, string>>({})

const availableSubcategories = computed(() => {
  const category = props.categories.find((c) => c.id === form.category)
  return category?.subcategories ?? []
})

const validate = (): boolean => {
  errors.question = form.question.length >= 5 ? '' : 'Question must be at least 5 characters.'
  errors.answer = form.answer.length >= 2 ? '' : 'Answer must be at least 2 characters.'
  errors.category = form.category ? '' : 'Pick a category.'
  return !errors.question && !errors.answer && !errors.category
}

const submit = () => {
  if (!validate()) return
  emit('save', {
    question: form.question,
    answer: form.answer,
    category: form.category,
    subcategory: form.subcategory || 'General',
    difficulty: form.difficulty,
  })
  close()
}

const close = () => emit('close')

// Populate the form whenever the modal opens
watch(
  () => props.open,
  async (isOpen) => {
    if (!isOpen) return

    errors.question = ''
    errors.answer = ''
    errors.category = ''

    if (props.card) {
      form.question = props.card.question
      form.answer = props.card.answer
      form.category = props.card.category
      form.subcategory = props.card.subcategory
      form.difficulty = props.card.difficulty
    } else {
      Object.assign(form, emptyForm)
    }

    // GSAP entrance for the panel
    await nextTick()
    if (panelRef.value) {
      gsap.fromTo(
        panelRef.value,
        { y: 40, scale: 0.95, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.6)' },
      )
    }
  },
)
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  /* a warm ink wash, like the desk lamp turned down */
  background: rgba(34, 29, 22, 0.72);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 1050;
}

/* A blank card pulled from the drawer, ready to type on */
.card-modal {
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  overflow-y: auto;
  background: var(--surface);
  border: 1px solid var(--rule);
  border-top: 3px solid var(--accent);
  border-radius: 2px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
}

.card-modal .card-header {
  padding: 1.25rem 1.5rem 1rem;
  border-bottom: 3px double var(--rule);
}

.card-modal .card-body {
  padding: 1.5rem;
  color: var(--ink);
}

.form-label {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--ink-soft);
}

.form-control,
.form-select {
  font-family: var(--font-mono);
  font-size: 0.9rem;
}

/* Vue <Transition> on the backdrop */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
