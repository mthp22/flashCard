<template>
  <div class="sidebar">
    <!-- Study Mode Collapse -->
    <div class="collapse-section">
      <div class="collapse-header" @click="toggleMode = !toggleMode">
        <i class="fas fa-layer-group" aria-hidden="true"></i>
        <span>Study Mode</span>
        <i class="fas fa-chevron-down collapse-icon" :class="{ open: toggleMode }"></i>
      </div>
      <div v-if="toggleMode" class="collapse-content">
        <div class="tree">
          <div
            v-for="mode in modes"
            :key="mode"
            class="tree-item"
            :class="{ active: selectedMode === mode }"
            @click="$emit('mode-change', mode)"
          >
            <i :class="modeIcons[mode]" aria-hidden="true"></i>
            <span>{{ mode }}</span>
            <i v-if="selectedMode === mode" class="fas fa-check pull-mark" aria-hidden="true"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Collapse -->
    <div class="collapse-section">
      <div class="collapse-header" @click="toggleFilter = !toggleFilter">
        <i class="fas fa-filter" aria-hidden="true"></i>
        <span>Show</span>
        <i class="fas fa-chevron-down collapse-icon" :class="{ open: toggleFilter }"></i>
      </div>
      <div v-if="toggleFilter" class="collapse-content">
        <div class="tree">
          <div
            v-for="filter in filters"
            :key="filter"
            class="tree-item"
            :class="{ active: selectedFilter === filter }"
            @click="$emit('filter-change', filter)"
          >
            <i :class="filterIcons[filter]" aria-hidden="true"></i>
            <span>{{ filter }}</span>
            <i
              v-if="selectedFilter === filter"
              class="fas fa-check pull-mark"
              aria-hidden="true"
            ></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings Collapse -->
    <div class="collapse-section">
      <div class="collapse-header" @click="toggleSettings = !toggleSettings">
        <i class="fas fa-cog" aria-hidden="true"></i>
        <span>Desk Settings</span>
        <i class="fas fa-chevron-down collapse-icon" :class="{ open: toggleSettings }"></i>
      </div>
      <div v-if="toggleSettings" class="collapse-content">
        <div class="settings-item">
          <label class="form-check-label">
            <input
              type="checkbox"
              class="form-check-input"
              :checked="soundEnabled"
              @change="$emit('toggle-sound')"
            />
            <i
              :class="soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-off'"
              aria-hidden="true"
            ></i>
            Card sounds
          </label>
        </div>
      </div>
    </div>

    <!-- Categories Collapse -->
    <div class="collapse-section mt-3">
      <div class="collapse-header" @click="toggleCategories = !toggleCategories">
        <i class="fas fa-archive" aria-hidden="true"></i>
        <span>Drawers</span>
        <i class="fas fa-chevron-down collapse-icon" :class="{ open: toggleCategories }"></i>
      </div>
      <div v-if="toggleCategories" class="collapse-content">
        <div class="tree">
          <div
            class="tree-item"
            @click="$emit('category-change', 'all')"
            :class="{ active: selectedCategory === 'all' }"
          >
            <i class="fas fa-box-open" aria-hidden="true"></i>
            <span>All cards</span>
            <i
              v-if="selectedCategory === 'all'"
              class="fas fa-check pull-mark"
              aria-hidden="true"
            ></i>
          </div>
          <div
            v-for="category in categories"
            :key="category.id"
            class="tree-item tree-item--nested"
            :class="{ active: selectedCategory === category.id }"
            @click="$emit('category-change', category.id)"
          >
            <i :class="category.icon" aria-hidden="true"></i>
            <span class="drawer-label">{{ category.name }}</span>
            <span class="badge bg-secondary ms-2">{{ category.cardCount }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Category } from '../stores/types'

interface Props {
  categories: Category[]
  selectedCategory: string
  selectedMode: 'normal' | 'quiz' | 'random'
  selectedFilter: 'all' | 'mastered' | 'review'
  soundEnabled: boolean
}

defineProps<Props>()

const modes = ['normal', 'quiz', 'random']
const filters = ['all', 'mastered', 'review']

const modeIcons: Record<string, string> = {
  normal: 'fas fa-book-open',
  quiz: 'fas fa-question',
  random: 'fas fa-random',
}

const filterIcons: Record<string, string> = {
  all: 'fas fa-bars',
  mastered: 'fas fa-check-double',
  review: 'fas fa-redo',
}

const toggleMode = ref(true)
const toggleFilter = ref(false)
const toggleSettings = ref(false)
const toggleCategories = ref(true)

defineEmits(['mode-change', 'filter-change', 'category-change', 'toggle-sound'])
</script>

<style scoped>
.sidebar {
  background: var(--drawer);
  border-right: 1px solid var(--rule);
  padding: 1rem 0;
  height: 100%;
  overflow-y: auto;
}

.collapse-section {
  margin-bottom: 1rem;
  padding: 0 0.5rem;
}

.collapse-section:first-child {
  margin-top: 0;
}

/* A brass-framed label holder on the drawer front */
.collapse-header {
  padding: 0.55rem 0.75rem;
  background: var(--drawer-ink);
  color: var(--drawer);
  border: 1px solid var(--brass);
  border-radius: 2px;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--brass) 40%, transparent);
  cursor: pointer;
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 0.82rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  transition: background 0.2s ease;
}

.collapse-header:hover {
  background: #ffffff;
}

.collapse-icon {
  margin-left: auto;
  transition: transform 0.3s ease;
}

.collapse-icon.open {
  transform: rotate(180deg);
}

.collapse-content {
  margin-top: 0.5rem;
  padding: 0.25rem 0;
  animation: slideDown 0.3s ease-out;
}

.tree {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Typed drawer labels */
.tree-item {
  padding: 0.5rem 0.75rem;
  border-left: 3px solid transparent;
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: color-mix(in srgb, var(--drawer-ink) 78%, var(--drawer) 22%);
}

.tree-item:hover {
  background: color-mix(in srgb, var(--drawer) 84%, #ffffff 16%);
  color: var(--drawer-ink);
}

.tree-item.active {
  background: color-mix(in srgb, var(--drawer) 88%, #ffffff 12%);
  border-left-color: var(--brass);
  color: #ffffff;
}

.tree-item i {
  width: 1rem;
  text-align: center;
  font-size: 0.8rem;
}

.drawer-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pull-mark {
  margin-left: auto;
  color: var(--brass);
}

.tree-item--nested {
  padding-left: 1.5rem;
  font-size: 0.8rem;
}

.settings-item {
  padding: 0.6rem 0.75rem;
}

.form-check-input {
  accent-color: var(--brass);
  cursor: pointer;
}

.form-check-label {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0;
  font-size: 0.85rem;
  font-family: var(--font-mono);
  color: var(--drawer-ink);
}

.badge {
  font-size: 0.68rem;
  font-family: var(--font-mono);
  margin-left: auto;
  background: transparent !important;
  color: color-mix(in srgb, var(--drawer-ink) 70%, var(--drawer) 30%) !important;
  border: 1px solid color-mix(in srgb, var(--drawer-ink) 35%, var(--drawer) 65%);
}

.tree-item.active .badge {
  color: var(--drawer-ink) !important;
  border-color: color-mix(in srgb, var(--drawer-ink) 55%, var(--drawer) 45%);
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

@media (max-width: 768px) {
  .sidebar {
    padding: 0.5rem 0;
  }

  .collapse-header {
    padding: 0.5rem 0.6rem;
    font-size: 0.78rem;
  }

  .tree-item {
    padding: 0.45rem 0.6rem;
    font-size: 0.8rem;
  }

  .tree-item--nested {
    padding-left: 1.25rem;
  }
}
</style>
