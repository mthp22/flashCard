<template>
  <div class="stats-view">
    <Navbar />

    <main class="container-fluid py-5">
      <!-- Header -->
      <div class="row mb-5">
        <div class="col-12">
          <h1 class="display-5 fw-bold mb-4">
            <i class="fas fa-chart-bar text-accent"></i> Statistics Dashboard
          </h1>
          <p class="lead text-muted">Track your learning progress and performance metrics</p>
        </div>
      </div>

      <!-- Main Stats Grid -->
      <div class="row g-4 mb-5">
        <div class="col-md-6 col-lg-4">
          <div class="stat-card card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <p class="text-muted small mb-2">
                    <i class="fas fa-book"></i> CARDS STUDIED
                  </p>
                  <h3 class="text-accent mb-0">{{ store.userStats?.totalCardsStudied || 0 }}</h3>
                </div>
                <i class="fas fa-book-open fa-2x text-accent opacity-50"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div class="stat-card card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <p class="text-muted small mb-2">
                    <i class="fas fa-star"></i> CARDS MASTERED
                  </p>
                  <h3 class="text-success mb-0">{{ store.userStats?.totalCardsMastered || 0 }}</h3>
                </div>
                <i class="fas fa-trophy fa-2x text-success opacity-50"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div class="stat-card card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <p class="text-muted small mb-2">
                    <i class="fas fa-target"></i> ACCURACY
                  </p>
                  <h3 class="text-accent mb-0">{{ Math.round((store.userStats?.overallAccuracy || 0) * 100) }}%</h3>
                </div>
                <i class="fas fa-bullseye fa-2x text-accent opacity-50"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div class="stat-card card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <p class="text-muted small mb-2">
                    <i class="fas fa-fire"></i> CURRENT STREAK
                  </p>
                  <h3 class="text-warning mb-0">{{ store.userStats?.currentStreak || 0 }} <small>days</small></h3>
                </div>
                <i class="fas fa-flame fa-2x text-warning opacity-50"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div class="stat-card card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <p class="text-muted small mb-2">
                    <i class="fas fa-history"></i> LONGEST STREAK
                  </p>
                  <h3 class="text-info mb-0">{{ store.userStats?.longestStreak || 0 }} <small>days</small></h3>
                </div>
                <i class="fas fa-crown fa-2x text-info opacity-50"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div class="stat-card card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <p class="text-muted small mb-2">
                    <i class="fas fa-clock"></i> TOTAL TIME
                  </p>
                  <h3 class="text-accent mb-0">{{ formatTime(store.userStats?.totalStudyTime || 0) }}</h3>
                </div>
                <i class="fas fa-hourglass-end fa-2x text-accent opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Category Performance Section -->
      <div class="row mb-5">
        <div class="col-12">
          <div class="card">
            <div class="card-header bg-code border-bottom border-1">
              <h5 class="mb-0">
                <i class="fas fa-layer-group text-accent"></i> Performance by Category
              </h5>
            </div>
            <div class="card-body">
              <div v-if="store.userStats?.categoryStats && Object.keys(store.userStats.categoryStats).length > 0">
                <div class="row g-4">
                  <div
                    v-for="(stats, category) in store.userStats.categoryStats"
                    :key="category"
                    class="col-md-6 col-lg-4"
                  >
                    <div class="category-stat">
                      <h6 class="text-accent text-uppercase mb-3">{{ category }}</h6>

                      <div class="stat-row mb-3">
                        <div class="d-flex justify-content-between mb-2">
                          <span class="small text-muted">Studied</span>
                          <span class="small text-accent fw-bold">{{ stats.studied }}</span>
                        </div>
                        <div class="progress" style="height: 6px">
                          <div class="progress-bar" :style="{ width: Math.min(stats.studied * 5, 100) + '%' }"></div>
                        </div>
                      </div>

                      <div class="stat-row mb-3">
                        <div class="d-flex justify-content-between mb-2">
                          <span class="small text-muted">Mastered</span>
                          <span class="small text-success fw-bold">{{ stats.mastered }}</span>
                        </div>
                        <div class="progress" style="height: 6px">
                          <div class="progress-bar bg-success" :style="{ width: Math.min(stats.mastered * 5, 100) + '%' }"></div>
                        </div>
                      </div>

                      <div class="stat-row">
                        <div class="d-flex justify-content-between mb-2">
                          <span class="small text-muted">Accuracy</span>
                          <span class="small fw-bold" :class="accuracyClass(stats.accuracy)">
                            {{ Math.round(stats.accuracy * 100) }}%
                          </span>
                        </div>
                        <div class="progress" style="height: 6px">
                          <div
                            class="progress-bar"
                            :class="accuracyBarClass(stats.accuracy)"
                            :style="{ width: Math.round(stats.accuracy * 100) + '%' }"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-4 text-muted">
                <p>No category data yet. Start studying to see stats!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Session Info -->
      <div v-if="store.userStats?.lastStudiedAt" class="row">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header bg-code border-bottom border-1">
              <h5 class="mb-0">
                <i class="fas fa-history text-accent"></i> Last Session
              </h5>
            </div>
            <div class="card-body">
              <p class="mb-2">
                <strong>Date:</strong><br />
                <code>{{ formatDate(store.userStats.lastStudiedAt.toDate()) }}</code>
              </p>
              <p class="mb-0">
                <strong>Session Details:</strong><br />
                <code>Duration: {{ store.userStats.totalStudyTime }} minutes</code>
              </p>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card">
            <div class="card-header bg-code border-bottom border-1">
              <h5 class="mb-0">
                <i class="fas fa-stats text-accent"></i> Session Stats
              </h5>
            </div>
            <div class="card-body">
              <p class="mb-2">
                <strong>Sessions:</strong><br />
                <code>{{ store.userStats.sessionCount }} completed</code>
              </p>
              <p class="mb-0">
                <strong>Average:</strong><br />
                <code>{{ store.userStats.averageTimePerCard }}s per card</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useFlashcardStore } from '../stores/flashcardStore'
import Navbar from '../components/Navbar.vue'

const store = useFlashcardStore()

const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const accuracyClass = (accuracy: number) => {
  if (accuracy >= 0.8) return 'text-success'
  if (accuracy >= 0.6) return 'text-warning'
  return 'text-danger'
}

const accuracyBarClass = (accuracy: number) => {
  if (accuracy >= 0.8) return 'bg-success'
  if (accuracy >= 0.6) return 'bg-warning'
  return 'bg-danger'
}

onMounted(() => {
  store.loadSettings()
})
</script>

<style scoped>
.stats-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #0f172a 100%);
}

main {
  flex: 1;
}

.stat-card {
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
  box-shadow: 0 15px 35px rgba(0, 212, 255, 0.15);
}

.category-stat {
  padding: 1.5rem;
  background: rgba(0, 212, 255, 0.05);
  border-radius: 8px;
  border-left: 3px solid var(--accent);
}

.stat-row {
  margin-bottom: 1rem;
}

code {
  font-size: 0.85rem;
  padding: 0.25rem 0.5rem;
  background: var(--code-bg);
  border-radius: 4px;
  color: #4ade80;
}

@media (max-width: 768px) {
  .display-5 {
    font-size: 1.75rem;
  }

  .stat-card {
    margin-bottom: 1rem;
  }

  .category-stat {
    padding: 1rem;
  }
}
</style>
