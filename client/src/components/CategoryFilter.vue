<template>
  <div class="filter-container" :class="{ 'dark-mode': isDarkMode }">
    <!-- Study Mode Selector -->
    <div class="control-group">
      <label class="control-label">Study Mode</label>
      <div class="mode-buttons">
        <button
          v-for="mode in modes"
          :key="mode"
          :class="['mode-btn', { active: selectedMode === mode }]"
          @click="$emit('mode-change', mode)"
        >
          {{ modeIcons[mode] }} {{ mode }}
        </button>
      </div>
    </div>

    <!-- Filter Mode -->
    <div class="control-group">
      <label class="control-label">Filter</label>
      <div class="filter-buttons">
        <button
          v-for="filter in filters"
          :key="filter"
          :class="['filter-btn', { active: selectedFilter === filter }]"
          @click="$emit('filter-change', filter)"
        >
          {{ filterIcons[filter] }} {{ filter }}
        </button>
      </div>
    </div>

    <!-- Category Tabs -->
    <div class="control-group">
      <label class="control-label">Categories</label>
      <div class="category-tabs">
        <button
          v-for="category in categories"
          :key="category.id"
          :class="['category-tab', { active: selectedCategory === category.id }]"
          @click="$emit('category-change', category.id)"
          :title="category.name"
        >
          <span class="icon">{{ category.icon }}</span>
          <span class="name">{{ category.name }}</span>
          <span class="count">{{ category.cardCount }}</span>
        </button>
      </div>
    </div>

    <!-- Settings Controls -->
    <div class="control-group">
      <label class="control-label">Settings</label>
      <div class="settings-buttons">
        <button
          :class="['settings-btn', { active: darkMode }]"
          @click="$emit('toggle-dark-mode')"
          title="Toggle Dark Mode"
        >
          {{ darkMode ? '☀️' : '🌙' }} Dark Mode
        </button>
        <button
          :class="['settings-btn', { active: soundEnabled }]"
          @click="$emit('toggle-sound')"
          title="Toggle Sound"
        >
          {{ soundEnabled ? '🔊' : '🔇' }} Sound
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '../stores/flashcardStore'

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

defineProps({
  categories: {
    type: Array as () => Category[],
    default: () => [],
  },
  selectedCategory: {
    type: String,
    default: 'all',
  },
  selectedMode: {
    type: String as () => 'normal' | 'quiz' | 'random',
    default: 'normal',
  },
  selectedFilter: {
    type: String as () => 'all' | 'mastered' | 'review',
    default: 'all',
  },
  darkMode: {
    type: Boolean,
    default: false,
  },
  soundEnabled: {
    type: Boolean,
    default: true,
  },
  isDarkMode: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['mode-change', 'filter-change', 'category-change', 'toggle-dark-mode', 'toggle-sound'])
</script>

<style scoped>
.filter-container {
  width: 100%;
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(240, 240, 240, 0.95));
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.filter-container.dark-mode {
  background: linear-gradient(135deg, rgba(40, 40, 40, 0.95), rgba(30, 30, 30, 0.95));
  color: white;
}

.control-group {
  margin-bottom: 2rem;
}

.control-group:last-child {
  margin-bottom: 0;
}

.control-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;
  opacity: 0.8;
  color: #4caf50;
}

.mode-buttons,
.filter-buttons,
.settings-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.mode-btn,
.filter-btn,
.settings-btn {
  padding: 0.7rem 1.5rem;
  border: 2px solid rgba(76, 175, 80, 0.3);
  background: rgba(76, 175, 80, 0.05);
  color: #333;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.filter-container.dark-mode .mode-btn,
.filter-container.dark-mode .filter-btn,
.filter-container.dark-mode .settings-btn {
  color: white;
  background: rgba(76, 175, 80, 0.1);
  border-color: rgba(76, 175, 80, 0.4);
}

.mode-btn:hover,
.filter-btn:hover,
.settings-btn:hover {
  border-color: #4caf50;
  background: rgba(76, 175, 80, 0.15);
  transform: translateY(-2px);
}

.mode-btn.active,
.filter-btn.active,
.settings-btn.active {
  background: linear-gradient(135deg, #4caf50, #00bcd4);
  color: white;
  border-color: transparent;
  box-shadow: 0 8px 20px rgba(76, 175, 80, 0.4);
}

.category-tabs {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
}

.category-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid rgba(76, 175, 80, 0.2);
  background: rgba(76, 175, 80, 0.05);
  color: #333;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.filter-container.dark-mode .category-tab {
  color: white;
  background: rgba(76, 175, 80, 0.08);
  border-color: rgba(76, 175, 80, 0.3);
}

.category-tab:hover {
  border-color: #4caf50;
  background: rgba(76, 175, 80, 0.12);
  transform: translateY(-2px);
}

.category-tab.active {
  background: linear-gradient(135deg, #4caf50, #00bcd4);
  color: white;
  border-color: transparent;
  box-shadow: 0 8px 20px rgba(76, 175, 80, 0.4);
}

.icon {
  font-size: 1.5rem;
}

.name {
  text-transform: capitalize;
}

.count {
  font-size: 0.75rem;
  opacity: 0.7;
  background: rgba(0, 0, 0, 0.05);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
}

.filter-container.dark-mode .count {
  background: rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .filter-container {
    padding: 1.5rem;
  }

  .mode-buttons,
  .filter-buttons {
    flex-direction: column;
  }

  .mode-btn,
  .filter-btn,
  .settings-btn {
    width: 100%;
    text-align: center;
  }

  .category-tabs {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 0.8rem;
  }

  .category-tab {
    padding: 0.8rem 0.5rem;
    font-size: 0.75rem;
  }

  .icon {
    font-size: 1.2rem;
  }
}
</style>
