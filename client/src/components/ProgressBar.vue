<template>
  <div class="progress-container">
    <div class="progress-info">
      <span>Card {{ current }} of {{ total }}</span>
      <span>{{ progressPercentage }} % Complete</span>
    </div>
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  current: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  progressPercentage: {
    type: Number,
    required: true,
  },
})
</script>

<style scoped>
.progress-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto 2rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #555;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 5px;
  border-style: hidden;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: linear-gradient(90deg, #4caf50 0%, cyan 100%);
  transition: width 0.3s ease;
}
</style>
