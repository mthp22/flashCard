<template>
  <div class="sidebar">
    <!-- Study Mode Collapse -->
    <div class="collapse-section">
      <div class="collapse-header" @click="toggleMode = !toggleMode">
        <i class="fas fa-book-open"></i>
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
            {{ modeIcons[mode] }} {{ mode }}
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Collapse -->
    <div class="collapse-section">
      <div class="collapse-header" @click="toggleFilter = !toggleFilter">
        <i class="fas fa-filter"></i>
        <span>Filter Cards</span>
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
            {{ filterIcons[filter] }} {{ filter }}
          </div>
        </div>
      </div>
    </div>

    <!-- Settings Collapse -->
    <div class="collapse-section">
      <div class="collapse-header" @click="toggleSettings = !toggleSettings">
        <i class="fas fa-sliders-h"></i>
        <span>Settings</span>
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
            <i class="fas fa-volume-mute"></i> Sound
          </label>
        </div>
        <div class="settings-item">
          <small class="text-muted">More settings coming soon</small>
        </div>
      </div>
    </div>

    <!-- Categories Collapse -->
    <div class="collapse-section mt-3">
      <div class="collapse-header" @click="toggleCategories = !toggleCategories">
        <i class="fas fa-sitemap"></i>
        <span>Categories</span>
        <i class="fas fa-chevron-down collapse-icon" :class="{ open: toggleCategories }"></i>
      </div>
      <div v-if="toggleCategories" class="collapse-content">
        <div class="tree">
          <div class="tree-item" @click="$emit('category-change', 'all')" :class="{ active: selectedCategory === 'all' }">
            <i class="fas fa-list"></i> All
          </div>
          <div
            v-for="category in categories"
            :key="category.id"
            class="tree-item tree-item--nested"
            :class="{ active: selectedCategory === category.id }"
            @click="$emit('category-change', category.id)"
          >
            {{ getIcon(category.name) }} {{ category.name }}
            <span class="badge bg-secondary ms-2">{{ category.cardCount }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Category } from '../stores/flashcardStore'

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

const modeIcons = {
  normal: '📚',
  quiz: '❓',
  random: '🔀',
}

const filterIcons = {
  all: '📋',
  mastered: '✨',
  review: '🔄',
}

const toggleMode = ref(true)
const toggleFilter = ref(false)
const toggleSettings = ref(false)
const toggleCategories = ref(false)

const getIcon = (categoryName: string): string => {
  const icons: Record<string, string> = {
    'JavaScript': '<i class="fab fa-js-square"></i>',
    'Vue.js': '<i class="fab fa-vuejs"></i>',
    'Angular': '<i class="fab fa-angular"></i>',
    '.NET': '<i class="fas fa-hashtag"></i>',
    'GraphQL': '<i class="fas fa-cube"></i>',
    'Python': '<i class="fab fa-python"></i>',
    'Java': '<i class="fab fa-java"></i>',
    'Spring Boot': '<i class="fas fa-leaf"></i>',
  }
  return icons[categoryName] || '<i class="fas fa-folder"></i>'
}

defineEmits(['mode-change', 'filter-change', 'category-change', 'toggle-sound'])
</script>

<style scoped>
.sidebar {
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  border-right: 2px solid var(--border);
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

.collapse-header {
  padding: 1rem;
  background: var(--code-bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  cursor: pointer;
  font-family: var(--font-mono);
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  color: var(--code-text);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.collapse-header:hover {
  background: rgba(0, 212, 255, 0.1);
  border-color: var(--accent);
  color: var(--accent);
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
  padding: 0.5rem 0;
  animation: slideDown 0.3s ease-out;
}

.tree {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tree-item {
  padding: 0.75rem 1rem;
  border-left: 3px solid transparent;
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tree-item:hover,
.tree-item.active {
  border-left-color: var(--accent);
  background: rgba(0, 212, 255, 0.1);
  color: var(--accent);
}

.tree-item--nested {
  padding-left: 1.5rem;
  font-size: 0.8rem;
}

.settings-item {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border);
}

.settings-item:last-child {
  border-bottom: none;
}

.form-check-input {
  accent-color: var(--accent);
  cursor: pointer;
}

.form-check-label {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0;
  font-size: 0.9rem;
  font-family: var(--font-mono);
}

.badge {
  font-size: 0.7rem;
  font-family: var(--font-mono);
  margin-left: auto;
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
    padding: 0.75rem;
    font-size: 0.8rem;
  }

  .tree-item {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }

  .tree-item--nested {
    padding-left: 1.25rem;
  }
}
</style>
