<template>
  <nav class="navbar navbar-expand-lg sticky-top">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand"> Flashcard Catalog </router-link>

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
        <div class="navbar-nav ms-auto align-items-lg-center gap-2">
          <router-link to="/" class="nav-link" active-class="active">
            <i class="fas fa-desktop" aria-hidden="true"></i> Desk
          </router-link>
          <router-link to="/flashcards" class="nav-link" active-class="active">
            <i class="fas fa-layer-group" aria-hidden="true"></i> Study
          </router-link>
          <router-link to="/stats" class="nav-link" active-class="active">
            <i class="fas fa-book" aria-hidden="true"></i> Ledger
          </router-link>
          <router-link to="/manage" class="nav-link" active-class="active">
            <i class="fas fa-pen-fancy" aria-hidden="true"></i> Catalog
          </router-link>
          <button
            @click="toggleDarkMode"
            class="btn btn-outline-light btn-sm"
            :title="isDark ? 'Daylight' : 'Dim the lamp'"
            :aria-label="isDark ? 'Switch to daylight theme' : 'Switch to dim theme'"
          >
            <i :class="isDark ? 'fas fa-sun' : 'fas fa-moon'" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '../stores/settings'

const settings = useSettingsStore()
const { darkMode } = storeToRefs(settings)

const toggleDarkMode = () => {
  settings.toggleDarkMode()
}

const isDark = computed(() => darkMode.value)
</script>

<style scoped>
.navbar-toggler {
  border-color: var(--ink);
  padding: 0.25rem 0.5rem;
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='%232a251d' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
}

:root[data-theme='dark'] .navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='%23d9cfb8' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
}

.nav-link i {
  margin-right: 0.35rem;
}

.btn-sm {
  padding: 0.3rem 0.7rem;
  font-size: 0.85rem;
}
</style>
