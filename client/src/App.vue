<script setup lang="ts">
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from './stores/settings'

const settings = useSettingsStore()
const { darkMode } = storeToRefs(settings)

// Apply the persisted theme to <html> whenever it changes
watch(
  darkMode,
  (isDark) => {
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
  },
  { immediate: true },
)
</script>

<template>
  <div id="app">
    <!-- Route transition: pages slide/fade as you navigate -->
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<style>
#app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.page-enter-active,
.page-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
