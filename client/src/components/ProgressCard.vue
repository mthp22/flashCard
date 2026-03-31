<template>
  <div class="card progress-card fade-in">
    <div class="card-body">
      <h6 class="card-title mb-4">
        <i class="fas fa-chart-line text-accent"></i> Progress Snapshot
      </h6>

      <div class="row g-3">
        <!-- Current Card -->
        <div class="col-6 col-md-3">
          <div class="stat-item">
            <div class="stat-value text-accent">{{ currentIndex + 1 }}/{{ total }}</div>
            <div class="stat-label">Current Card</div>
          </div>
        </div>

        <!-- Progress % -->
        <div class="col-6 col-md-3">
          <div class="stat-item">
            <div class="stat-value text-accent">{{ progress }}%</div>
            <div class="stat-label">Complete</div>
          </div>
        </div>

        <!-- Accuracy -->
        <div class="col-6 col-md-3">
          <div class="stat-item">
            <div class="stat-value" :class="accuracyColor">{{ accuracy }}%</div>
            <div class="stat-label">Accuracy</div>
          </div>
        </div>

        <!-- Mastered -->
        <div class="col-6 col-md-3">
          <div class="stat-item">
            <div class="stat-value text-success">{{ mastered }}</div>
            <div class="stat-label">Mastered</div>
          </div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="progress mt-4" style="height: 24px">
        <div
          class="progress-bar"
          role="progressbar"
          :style="{ width: progress + '%' }"
          :aria-valuenow="progress"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          {{ progress }}%
        </div>
      </div>

      <!-- Review & Remaining -->
      <div class="row g-2 mt-3 small">
        <div class="col-6">
          <span class="badge bg-warning text-dark w-100">
            <i class="fas fa-repeat"></i> {{ reviewing }} Reviewing
          </span>
        </div>
        <div class="col-6">
          <span class="badge bg-secondary w-100">
            <i class="fas fa-hourglass"></i> {{ remaining }} Remaining
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentIndex: number
  total: number
  accuracy: number
  mastered: number
  reviewing: number
}

const props = defineProps<Props>()

const progress = computed(() => (props.total > 0 ? Math.round(((props.currentIndex + 1) / props.total) * 100) : 0))

const remaining = computed(() => props.total - props.mastered - props.reviewing)

const accuracyColor = computed(() => {
  if (props.accuracy >= 80) return 'text-success'
  if (props.accuracy >= 60) return 'text-warning'
  return 'text-danger'
})
</script>

<style scoped>
.progress-card {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
}

.stat-item {
  text-align: center;
  padding: 1rem 0;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-family: var(--font-mono);
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.stat-label {
  display: block;
  font-size: 0.8rem;
  color: #cbd5e1;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge {
  font-family: var(--font-mono);
  font-weight: 600;
  padding: 0.5rem;
}

@media (max-width: 768px) {
  .stat-value {
    font-size: 1.2rem;
  }

  .stat-label {
    font-size: 0.7rem;
  }
}
</style>
