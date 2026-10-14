<template>
  <div class="stats-view" ref="rootRef">
    <Navbar />

    <main class="container-fluid py-5">
      <!-- Header -->
      <div class="row mb-5">
        <div class="col-12">
          <p class="serial mb-2">SHEET 03 · KEPT BY HAND</p>
          <h1 class="display-5 fw-bold mb-4">The ledger</h1>
          <p class="lead text-muted">
            Your marks, times and streaks. All of it is written in this tab only — reload and the
            ledger goes blank.
          </p>
        </div>
      </div>

      <!-- Main Stats Grid -->
      <div class="row g-4 mb-5">
        <div class="col-md-6 col-lg-4">
          <div class="stat-card card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <p class="stat-caption mb-2">CARDS STUDIED</p>
                  <h3 class="text-accent mb-0">
                    <AnimatedNumber :value="stats.totalCardsStudied" />
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div class="stat-card card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <p class="stat-caption mb-2">CARDS MASTERED</p>
                  <h3 class="text-success mb-0">
                    <AnimatedNumber :value="stats.totalCardsMastered" />
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div class="stat-card card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <p class="stat-caption mb-2">ACCURACY</p>
                  <h3 class="text-accent mb-0"><AnimatedNumber :value="accuracyPercent" />%</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div class="stat-card card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <p class="stat-caption mb-2">CURRENT STREAK</p>
                  <h3 class="text-warning mb-0">
                    <AnimatedNumber :value="stats.currentStreak" /> <small>days</small>
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div class="stat-card card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <p class="stat-caption mb-2">LONGEST STREAK</p>
                  <h3 class="text-info mb-0">
                    <AnimatedNumber :value="stats.longestStreak" /> <small>days</small>
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div class="stat-card card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <p class="stat-caption mb-2">TIME AT THE DESK</p>
                  <h3 class="text-accent mb-0">{{ formatTime(stats.totalStudyTime) }}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Category Performance Section -->
      <div class="row mb-5 panel-row">
        <div class="col-12">
          <div class="card">
            <div class="card-header border-bottom border-1">
              <h5 class="mb-0">
                <i class="fas fa-archive text-accent" aria-hidden="true"></i> By drawer
              </h5>
            </div>
            <div class="card-body">
              <div
                v-if="stats.categoryStats && Object.keys(stats.categoryStats).length > 0"
                class="row g-4"
              >
                <div
                  v-for="(categoryStat, category) in stats.categoryStats"
                  :key="category"
                  class="col-md-6 col-lg-4"
                >
                  <div class="category-stat">
                    <h6 class="category-name text-uppercase mb-3">{{ category }}</h6>

                    <div class="stat-row mb-3">
                      <div class="d-flex justify-content-between mb-2">
                        <span class="small text-muted">Studied</span>
                        <span class="small text-accent fw-bold">{{ categoryStat.studied }}</span>
                      </div>
                      <div class="progress" style="height: 6px">
                        <div
                          class="progress-bar"
                          :style="{ width: Math.min(categoryStat.studied * 5, 100) + '%' }"
                        ></div>
                      </div>
                    </div>

                    <div class="stat-row mb-3">
                      <div class="d-flex justify-content-between mb-2">
                        <span class="small text-muted">Mastered</span>
                        <span class="small text-success fw-bold">{{ categoryStat.mastered }}</span>
                      </div>
                      <div class="progress" style="height: 6px">
                        <div
                          class="progress-bar bg-success"
                          :style="{ width: Math.min(categoryStat.mastered * 5, 100) + '%' }"
                        ></div>
                      </div>
                    </div>

                    <div class="stat-row">
                      <div class="d-flex justify-content-between mb-2">
                        <span class="small text-muted">Accuracy</span>
                        <span class="small fw-bold" :class="accuracyClass(categoryStat.accuracy)">
                          {{ Math.round(categoryStat.accuracy * 100) }}%
                        </span>
                      </div>
                      <div class="progress" style="height: 6px">
                        <div
                          class="progress-bar"
                          :class="accuracyBarClass(categoryStat.accuracy)"
                          :style="{ width: Math.round(categoryStat.accuracy * 100) + '%' }"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-4 text-muted">
                <p class="serial mb-2">NO ENTRIES YET</p>
                <p>Study a card and this sheet fills in.</p>
                <router-link to="/flashcards" class="btn btn-primary btn-sm">
                  Open the drawer <i class="fas fa-arrow-right" aria-hidden="true"></i>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Session Info -->
      <div v-if="stats.lastStudiedAt" class="row panel-row">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header border-bottom border-1">
              <h5 class="mb-0">
                <i class="fas fa-history text-accent" aria-hidden="true"></i> Last sitting
              </h5>
            </div>
            <div class="card-body">
              <p class="mb-2">
                <strong>Date:</strong><br />
                <code>{{ formatDate(stats.lastStudiedAt) }}</code>
              </p>
              <p class="mb-0">
                <strong>At the desk for:</strong><br />
                <code>{{ stats.totalStudyTime }} minutes</code>
              </p>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card">
            <div class="card-header border-bottom border-1">
              <h5 class="mb-0">
                <i class="fas fa-clipboard-list text-accent" aria-hidden="true"></i> Ledger totals
              </h5>
            </div>
            <div class="card-body">
              <p class="mb-2">
                <strong>Sittings:</strong><br />
                <code>{{ stats.sessionCount }} completed</code>
              </p>
              <p class="mb-0">
                <strong>Average:</strong><br />
                <code>{{ stats.averageTimePerCard }}s per card</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCardsStore } from '../stores/cards'
import { useSessionStore } from '../stores/session'
import { gsap } from '../plugins/gsap'
import Navbar from '../components/Navbar.vue'
import AnimatedNumber from '../components/AnimatedNumber.vue'

const cardsStore = useCardsStore()
const sessionStore = useSessionStore()
const rootRef = ref<HTMLElement | null>(null)

const { userStats: stats } = storeToRefs(sessionStore)

const accuracyPercent = computed(() => Math.round((stats.value.overallAccuracy || 0) * 100))

let animationContext: gsap.Context | undefined

const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
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
  cardsStore.hydrate()
  if (!rootRef.value) return

  animationContext = gsap.context(() => {
    // Stat cards cascade in
    gsap.from('.stat-card', {
      y: 40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power3.out',
      delay: 0.1,
    })

    // Category + session panels reveal on scroll
    gsap.utils.toArray<HTMLElement>('.panel-row').forEach((row) => {
      const cards = row.querySelectorAll('.card')
      if (!cards.length) return
      gsap.from(cards, {
        y: 50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        // entry-based start so the last row is always reachable (see HomeView)
        scrollTrigger: { trigger: row, start: 'top bottom-=60', once: true },
      })
    })
  }, rootRef.value)
})

onBeforeUnmount(() => {
  animationContext?.revert()
  animationContext = undefined
})
</script>

<style scoped>
.stats-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}

.stat-caption {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 1.5px;
  color: var(--ink-soft);
  margin-bottom: 0.5rem;
}

.stat-card {
  /* No `transition: transform` on GSAP-animated elements: gsap.from()
     lazily records its end value from the computed style, and a CSS
     transform transition makes that read a lagging partial value —
     the tween then finishes mid-air (frozen y≠0). */
  transition: border-color 0.2s ease;
  border-top: 3px solid var(--rule);
}

.stat-card:hover {
  border-color: var(--accent);
}

.stat-card h3 {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 2rem;
}

.category-name {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  letter-spacing: 1.5px;
  color: var(--accent);
}

.category-stat {
  padding: 1.5rem;
  background: var(--surface-2);
  border-radius: 2px;
  border-left: 3px solid var(--accent);
}

.stat-row {
  margin-bottom: 1rem;
}

/* Category bars ease to their new width instead of snapping */
.progress-bar {
  transition: width 0.9s cubic-bezier(0.22, 1, 0.36, 1);
}

code {
  font-size: 0.85rem;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 0;
  color: var(--ink);
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
