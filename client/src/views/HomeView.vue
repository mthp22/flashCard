<template>
  <div class="home-view" ref="rootRef">
    <Navbar />

    <main class="main-content">
      <!-- Hero: an honest headline on the left, a real card from the deck on the right -->
      <section class="hero-section container-fluid py-5">
        <div class="row align-items-center">
          <div class="col-lg-6 py-5">
            <p class="hero-eyebrow serial mb-3">
              A CARD CATALOG FOR TECHNICAL INTERVIEW PREP · 537.19
            </p>
            <h1 class="display-4 fw-bold mb-4 hero-title">
              A drawer of {{ store.cards.length }} interview cards.
            </h1>
            <p class="lead mb-4 hero-text">
              JavaScript, Vue, Angular, .NET, Python and friends — studied one card at a time. No
              account, no server: everything lives in this tab, and reloading resets the deck.
            </p>
            <div class="d-flex gap-3 flex-wrap hero-actions">
              <router-link to="/flashcards" class="btn btn-primary btn-lg">
                Open the drawer <i class="fas fa-arrow-right" aria-hidden="true"></i>
              </router-link>
              <router-link to="/stats" class="btn btn-secondary btn-lg">
                Read the ledger
              </router-link>
            </div>
          </div>
          <div class="col-lg-6 text-center py-5">
            <!-- A real card from the deck, lying on the desk -->
            <router-link to="/flashcards" class="hero-card-link" aria-label="Start studying">
              <div class="hero-card">
                <div class="hero-card-tab">{{ heroCategory }}</div>
                <div class="hero-card-meta">
                  <span class="hc-serial serial">No. 001</span>
                  <span
                    class="hc-stamp stamp"
                    v-if="heroCard"
                    :class="'difficulty-' + heroCard.difficulty"
                  >
                    {{ heroCard.difficulty }}
                  </span>
                </div>
                <div class="hc-question ruled">
                  <span class="hc-line" v-for="(line, i) in heroLines" :key="i">{{ line }}</span>
                </div>
                <div class="hc-foot">
                  <span class="hint" v-if="heroCard">press space to turn it over</span>
                </div>
                <span class="rod-hole" aria-hidden="true"></span>
              </div>
            </router-link>
          </div>
        </div>
      </section>

      <!-- How it works — three typed notes, no marketing -->
      <section class="how-section container-fluid py-5 reveal-section">
        <h2 class="section-title mb-5 reveal-item">
          <span class="serial">SHEET 01</span> How the desk works
        </h2>
        <div class="row g-4">
          <div v-for="(note, idx) in notes" :key="note.title" class="col-md-4 reveal-item">
            <div class="note card h-100">
              <div class="note-body">
                <span class="note-number serial">{{ String(idx + 1).padStart(2, '0') }}</span>
                <h3 class="note-title">{{ note.title }}</h3>
                <p class="note-text">{{ note.body }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- The drawers -->
      <section class="categories-section container-fluid py-5 reveal-section">
        <h2 class="section-title mb-5 reveal-item">
          <span class="serial">SHEET 02</span> The drawers
        </h2>
        <div class="row g-4">
          <div
            v-for="category in categories"
            :key="category.id"
            class="col-md-6 col-lg-3 reveal-item"
          >
            <div class="category-card card h-100 cursor-pointer" @click="startStudy(category.id)">
              <div class="drawer-face">
                <div class="drawer-label">
                  <i :class="category.icon" aria-hidden="true"></i>
                  <span class="drawer-name">{{ category.name }}</span>
                  <span class="badge bg-secondary">{{ category.cardCount }}</span>
                </div>
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
              <div class="card-footer">
                <span class="drawer-pull serial">pull open</span>
                <i class="fas fa-arrow-right" aria-hidden="true"></i>
              </div>
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

const heroCard = computed(() => store.cards[0] ?? null)

const heroCategory = computed(() => {
  if (!heroCard.value) return 'the first card'
  return (
    store.categoriesWithCount.find((c) => c.id === heroCard.value?.category)?.name ??
    heroCard.value.category
  )
})

// The question, broken into typewriter lines for the intro stagger
const heroLines = computed(() => {
  const question = heroCard.value?.question ?? 'Loading the first card from the drawer…'
  if (question.length <= 46) return [question]
  const words = question.split(' ')
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    if ((current + ' ' + word).trim().length > 46) {
      lines.push(current.trim())
      current = word
    } else {
      current = (current + ' ' + word).trim()
    }
  }
  if (current) lines.push(current)
  return lines.slice(0, 4)
})

const notes = [
  {
    title: 'Spaced repetition',
    body: 'Cards you miss come back the next day; cards you know wait two weeks. You grade every card yourself — the ledger just keeps the books.',
  },
  {
    title: 'Keyboard first',
    body: 'Arrows page through the drawer, space turns the card, K and R grade it. The mouse is optional, on purpose.',
  },
  {
    title: 'Nothing leaves the tab',
    body: 'State lives in Pinia and the deck lives in memory. No account, no server, no cookies. Reload the page and the drawer resets.',
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
    // --- Desk intro timeline ---
    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })
    intro
      .from('.hero-eyebrow', { y: 20, opacity: 0, duration: 0.5 })
      .from('.hero-title', { y: 40, opacity: 0, duration: 0.7 }, '-=0.2')
      .from('.hero-text', { y: 30, opacity: 0, duration: 0.6 }, '-=0.4')
      .from('.hero-actions > *', { y: 20, opacity: 0, duration: 0.5, stagger: 0.12 }, '-=0.3')
      .from(
        '.hero-card-link',
        { x: 60, opacity: 0, rotate: 6, duration: 0.8, ease: 'back.out(1.4)' },
        '-=0.6',
      )
      .from(
        '.hero-card .hc-line',
        { opacity: 0, x: -12, duration: 0.3, stagger: 0.14, ease: 'power2.out' },
        '-=0.3',
      )

    // The card settles on the desk, then breathes slightly
    gsap.to('.hero-card', {
      y: -7,
      rotate: -0.6,
      duration: 2.6,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 1.4,
    })

    // --- Scroll-triggered section reveals ---
    // start on viewport entry (not 'top 78%'): the last section on a short
    // page can never reach 78%, which would leave it permanently invisible
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
          start: 'top bottom-=60',
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

/* ---------------- Hero ---------------- */

.hero-section {
  border-bottom: 3px double var(--rule);
}

.hero-eyebrow {
  letter-spacing: 2px;
}

.hero-title {
  font-family: var(--font-mono);
  font-weight: 700;
}

.hero-text {
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--ink-soft);
  max-width: 34rem;
}

/* A real card from the deck, lying at a slight angle */
.hero-card-link {
  display: block;
  text-decoration: none;
  perspective: 1000px;
}

.hero-card {
  position: relative;
  display: block;
  text-align: left;
  max-width: 480px;
  margin: 0 auto;
  background: var(--surface);
  border: 1px solid var(--rule);
  border-top: 3px solid var(--accent);
  border-radius: 2px;
  padding: 1.5rem 2rem 1.75rem;
  transform: rotate(-2deg);
  box-shadow:
    0 1px 0 var(--rule),
    0 14px 30px rgba(36, 31, 23, 0.22);
  transition: border-color 0.2s ease;
}

:root[data-theme='dark'] .hero-card {
  box-shadow:
    0 1px 0 rgba(0, 0, 0, 0.4),
    0 14px 30px rgba(0, 0, 0, 0.5);
}

.hero-card:hover {
  border-color: var(--accent);
}

/* the drawer tab peeking above the card */
.hero-card-tab {
  position: absolute;
  top: -30px;
  right: 1.75rem;
  background: var(--surface-2);
  border: 1px solid var(--rule);
  border-bottom: none;
  border-radius: 3px 3px 0 0;
  padding: 0.3rem 1rem 0.35rem;
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 0.72rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--ink-soft);
}

.hero-card::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 3.75rem;
  width: 1px;
  background: var(--accent);
  opacity: 0.45;
}

.hero-card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.hc-stamp.difficulty-easy {
  color: var(--green);
}

.hc-stamp.difficulty-medium {
  color: var(--amber);
}

.hc-stamp.difficulty-hard {
  color: var(--accent);
}

.hc-question {
  min-height: 112px;
  padding-left: 1rem;
}

.hc-line {
  display: block;
  font-family: var(--font-mono);
  font-size: 1.05rem;
  line-height: 28px;
  color: var(--ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hc-foot {
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--rule);
  padding-left: 1rem;
}

.hint {
  font-family: var(--font-mono);
  font-style: italic;
  font-size: 0.8rem;
  color: var(--ink-soft);
}

.rod-hole {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--bg);
  border: 1px solid var(--rule);
}

/* ---------------- Sections ---------------- */

.section-title {
  font-family: var(--font-mono);
  font-size: 1.5rem;
  display: flex;
  align-items: baseline;
  gap: 1rem;
  border-bottom: 3px double var(--rule);
  padding-bottom: 0.75rem;
}

/* Three typed notes */
.note {
  background: var(--surface-2);
  border: 1px solid var(--rule);
  border-radius: 2px;
}

.note-body {
  padding: 1.5rem;
}

.note-number {
  display: inline-block;
  border: 1px solid var(--rule);
  border-radius: 2px;
  padding: 0.15rem 0.5rem;
  margin-bottom: 1rem;
}

.note-title {
  font-family: var(--font-mono);
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
}

.note-text {
  color: var(--ink-soft);
  line-height: 1.7;
  margin-bottom: 0;
  font-size: 0.95rem;
}

/* ---------------- Drawers ---------------- */

.category-card {
  cursor: pointer;
  background: var(--drawer);
  border: 1px solid color-mix(in srgb, var(--drawer) 70%, #000 30%);
  border-radius: 3px;
  overflow: hidden;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(36, 31, 23, 0.28);
}

.drawer-face {
  padding: 1.25rem 1.25rem 1rem;
}

/* the typed label strip on the drawer front */
.drawer-label {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: var(--drawer-ink);
  color: var(--drawer);
  border: 1px solid var(--brass);
  border-radius: 2px;
  padding: 0.55rem 0.75rem;
  margin-bottom: 1rem;
}

.drawer-label i {
  color: var(--accent);
  width: 1.1rem;
  text-align: center;
}

.drawer-name {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 0.9rem;
  flex: 1;
}

.drawer-label .badge {
  background: transparent !important;
  color: var(--drawer) !important;
  border: 1px solid color-mix(in srgb, var(--drawer) 45%, transparent);
}

.topics-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-card .badge.bg-secondary {
  background: transparent !important;
  color: color-mix(in srgb, var(--drawer-ink) 75%, var(--drawer) 25%) !important;
  border: 1px solid color-mix(in srgb, var(--drawer-ink) 30%, var(--drawer) 70%);
}

.category-card .card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: color-mix(in srgb, var(--drawer) 88%, #000 12%) !important;
  border-top: 1px solid color-mix(in srgb, var(--drawer-ink) 18%, transparent) !important;
  color: var(--brass);
}

.drawer-pull {
  letter-spacing: 2px;
  color: color-mix(in srgb, var(--drawer-ink) 60%, var(--drawer) 40%);
}

@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 1.9rem;
  }

  .hero-card {
    padding: 1.25rem 1.25rem 1.5rem;
    transform: rotate(-1deg);
  }

  .hc-line {
    font-size: 0.9rem;
  }
}

.cursor-pointer {
  cursor: pointer;
}
</style>
