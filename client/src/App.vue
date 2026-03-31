<script setup lang="ts">
import { onMounted } from 'vue'
import { useFlashcardStore } from './stores/flashcardStore'

const store = useFlashcardStore()

onMounted(() => {
  store.loadSettings()
})
</script>

<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<style>
#app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
