<template>
  <div class="home-view" ref="rootRef">
    <Navbar />

    <main class="main-content">
      <!-- Hero Section -->
      <section class="hero-section container-fluid py-5">
        <div class="row align-items-center">
          <div class="col-lg-6 py-5">
            <p class="hero-eyebrow text-accent mb-3">
              <i class="fas fa-bolt"></i> Vue · GSAP · Pinia
            </p>
            <h1 class="display-4 fw-bold mb-4 hero-title">
              <i class="fas fa-code text-accent"></i> Master Technical Interviews
            </h1>
            <p class="lead mb-4 hero-text">
              Interactive flashcards with spaced repetition algorithm for JavaScript, Vue, Angular,
              .NET, and more.
            </p>
            <div class="d-flex gap-3 flex-wrap hero-actions">
              <router-link to="/flashcards" class="btn btn-primary btn-lg">
                <i class="fas fa-play"></i> Start Studying
              </router-link>
              <router-link to="/stats" class="btn btn-secondary btn-lg">
                <i class="fas fa-chart-line"></i> View Stats
              </router-link>
            </div>
          </div>
          <div class="col-lg-6 text-center py-5">
            <div class="hero-code">
              <pre><code><span class="code-line">const interview = {</span><span class="code-line">  preparation: 'thorough',</span><span class="code-line">  confidence: 'maximum',</span><span class="code-line">  success: true</span><span class="code-line">}</span></code></pre>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section container-fluid py-5 bg-code reveal-section">
        <h2 class="text-center mb-5 reveal-item">
          <i class="fas fa-star text-accent"></i> Why Use Our Flashcard App?
        </h2>
        <div class="row g-4">
          <div v-for="feature in features" :key="feature.id" class="col-md-6 col-lg-4 reveal-item">
            <div class="feature-card card h-100">
              <div class="card-body text-center">
                <div class="feature-icon mb-3">{{ feature.icon }}</div>
                <h5 class="card-title text-accent">{{ feature.title }}</h5>
                <p class="card-text text-muted">{{ feature.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works -->
      <section class="how-section container-fluid py-5 reveal-section">
        <h2 class="text-center mb-5 reveal-item">
          <i class="fas fa-graduation-cap text-accent"></i> How It Works
        </h2>
        <div class="row g-4 mb-5">
          <div v-for="(step, idx) in steps" :key="idx" class="col-md-4 reveal-item">
            <div class="step-card card h-100">
              <div class="card-body text-center">
                <div class="step-number">{{ idx + 1 }}</div>
                <h5 class="card-title text-accent mt-3">{{ step.title }}</h5>
                <p class="card-text text-muted">{{ step.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Categories Preview -->
      <section class="categories-section container-fluid py-5 reveal-section">
        <h2 class="text-center mb-5 reveal-item">
          <i class="fas fa-book-open text-accent"></i> Available Frameworks
        </h2>
        <div class="row g-4">
          <div
            v-for="category in categories"
            :key="category.id"
            class="col-md-6 col-lg-3 reveal-item"
          >
            <div class="category-card card h-100 cursor-pointer" @click="startStudy(category.id)">
              <div class="card-body">
                <h5 class="card-title">{{ category.icon }} {{ category.name }}</h5>
                <p class="text-muted small mb-3">{{ category.cardCount }} cards</p>
                <div class="topics-list">
                  <span
                    v-for="topic in category.subcategories.slice(0, 3)"
                    :key="topic"
                    class="badge bg-secondary me-2 mb-2"
                  >
                    {{ topic }}
                  </span>
                  <span v-if="category.subcategories.length > 3" class="badge bg-secondary">
                    +{{ category.subcategories.length - 3 }}
                  </span>
                </div>
              </div>
              <div class="card-footer bg-transparent border-top-0">
                <button class="btn btn-sm btn-primary w-100">
                  <i class="fas fa-arrow-right"></i> Study Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section container-fluid py-5 reveal-section">
        <div class="row justify-content-center">
          <div class="col-lg-8 text-center">
            <h2 class="mb-4 reveal-item">Ready to Level Up?</h2>
            <p class="lead mb-4 reveal-item">
              Join thousands of developers mastering technical interviews
            </p>
            <div class="reveal-item">
              <router-link to="/flashcards" class="btn btn-primary btn-lg">
                <i class="fas fa-rocket"></i> Begin Now
              </router-link>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCardsStore } from '../stores/cards'
import { gsap } from '../plugins/gsap'
import Navbar from '../components/Navbar.vue'

const router = useRouter()
const store = useCardsStore()
const rootRef = ref<HTMLElement | null>(null)

let animationContext: gsap.Context | undefined

const categories = computed(() => store.categoriesWithCount)

const features = [
  {
    id: 1,
    icon: '🧠',
    title: 'Spaced Repetition',
    description: 'Smart algorithm shows you cards when you need them most',
  },
  {
    id: 2,
    icon: '📊',
    title: 'Track Progress',
    description: 'Real-time accuracy and completion percentages',
  },
  {
    id: 3,
    icon: '🎯',
    title: '3 Study Modes',
    description: 'Normal, Quiz, and Random modes for variety',
  },
  {
    id: 4,
    icon: '🌙',
    title: 'Dark Mode',
    description: 'Easy on the eyes for late-night studying',
  },
  {
    id: 5,
    icon: '📈',
    title: 'Statistics',
    description: 'Detailed analytics by category and time',
  },
  {
    id: 6,
    icon: '⚡',
    title: 'Lightning Fast',
    description: 'Optimized for instant feedback',
  },
]

const steps = [
  {
    title: 'Choose Framework',
    description: 'Select from JavaScript, Vue, Angular, .NET, and more',
  },
  {
    title: 'Study Cards',
    description: 'Flip cards to reveal answers and mark your progress',
  },
  {
    title: 'Track Growth',
    description: 'Watch your accuracy improve with real-time stats',
  },
]

const startStudy = (categoryId: string) => {
  store.setCategory(categoryId)
  router.push('/flashcards')
}

onMounted(() => {
  store.hydrate()
  if (!rootRef.value) return

  // All animation is scoped to this view and reverted on unmount
  animationContext = gsap.context(() => {
    // --- Hero intro timeline ---
    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })
    intro
      .from('.hero-eyebrow', { y: 20, opacity: 0, duration: 0.5 })
      .from('.hero-title', { y: 40, opacity: 0, duration: 0.7 }, '-=0.2')
      .from('.hero-text', { y: 30, opacity: 0, duration: 0.6 }, '-=0.4')
      .from('.hero-actions > *', { y: 20, opacity: 0, duration: 0.5, stagger: 0.12 }, '-=0.3')
      .from(
        '.hero-code',
        { x: 60, opacity: 0, rotateY: 25, duration: 0.8, ease: 'back.out(1.4)' },
        '-=0.6',
      )
      .from(
        '.code-line',
        { opacity: 0, x: -12, duration: 0.35, stagger: 0.15, ease: 'power2.out' },
        '-=0.4',
      )

    // --- Scroll-triggered section reveals ---
    gsap.utils.toArray<HTMLElement>('.reveal-section').forEach((section) => {
      const items = section.querySelectorAll('.reveal-item')
      gsap.from(items, {
        y: 48,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 78%',
          once: true,
        },
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
.home-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
}

.hero-section {
  border-bottom: 2px solid var(--border);
}

.hero-eyebrow {
  font-family: var(--font-mono);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-size: 0.9rem;
}

.hero-code {
  background: var(--code-bg);
  border: 2px solid var(--accent);
  border-radius: 12px;
  padding: 2rem;
  font-family: var(--font-mono);
  text-align: left;
  perspective: 800px;
}

.hero-code pre {
  margin: 0;
  overflow-x: auto;
}

.code-line {
  display: block;
  color: #4ade80;
  min-height: 1.6em;
}

.features-section {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%);
}

.feature-card {
  cursor: pointer;
  transition:
    box-shadow 0.3s ease,
    border-color 0.3s ease;
}

.feature-card:hover {
  box-shadow: 0 20px 40px rgba(0, 212, 255, 0.2);
}

.feature-icon {
  font-size: 3rem;
}

.how-section {
  border-top: 2px solid var(--border);
  border-bottom: 2px solid var(--border);
}

.step-card {
  text-align: center;
  transition: all 0.3s ease;
}

.step-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 212, 255, 0.15);
}

.step-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, var(--accent) 0%, var(--secondary) 100%);
  color: var(--darker);
  border-radius: 50%;
  font-size: 1.5rem;
  font-weight: 700;
  font-family: var(--font-mono);
}

.categories-section {
  border-top: 2px solid var(--border);
}

.category-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-8px);
  border-color: var(--accent);
  box-shadow: 0 15px 35px rgba(0, 212, 255, 0.15);
}

.topics-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.cta-section {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-top: 2px solid var(--border);
}

@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 2rem;
  }

  .hero-code {
    padding: 1rem;
    font-size: 0.85rem;
  }

  .feature-icon {
    font-size: 2rem;
  }
}

.cursor-pointer {
  cursor: pointer;
}
</style>
