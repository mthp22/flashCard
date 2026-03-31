<template>
  <nav class="navbar navbar-expand-lg sticky-top">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand">
        <i class="fas fa-code"></i> FlashCode
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <div class="navbar-nav ms-auto gap-3">
          <router-link to="/" class="nav-link" active-class="active">
            <i class="fas fa-home"></i> Home
          </router-link>
          <router-link to="/flashcards" class="nav-link" active-class="active">
            <i class="fas fa-book"></i> Study
          </router-link>
          <router-link to="/stats" class="nav-link" active-class="active">
            <i class="fas fa-chart-bar"></i> Stats
          </router-link>
          <button
            @click="toggleDarkMode"
            class="btn btn-outline-light btn-sm"
            :title="darkMode ? 'Light Mode' : 'Dark Mode'"
          >
            <i :class="darkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useFlashcardStore } from '../stores/flashcardStore'

const store = useFlashcardStore()

const toggleDarkMode = () => {
  store.toggleDarkMode()
}

const darkMode = computed(() => store.darkMode)

import { computed } from 'vue'
</script>

<style scoped>
.navbar-toggler {
  border-color: var(--accent);
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='%2300d4ff' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
}

.btn-sm {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
}
</style>
