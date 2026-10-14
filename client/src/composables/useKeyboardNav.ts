import { onBeforeUnmount, onMounted } from 'vue'

interface KeyboardHandlers {
  onNext?: () => void
  onPrev?: () => void
  onFlip?: () => void
  onMarkCorrect?: () => void
  onMarkReview?: () => void
}

/**
 * Global keyboard navigation for the study view.
 * ← / → navigate, Space flips, K marks known, R marks review.
 * Ignores keystrokes while typing in form fields.
 */
export function useKeyboardNav(handlers: KeyboardHandlers) {
  const isTyping = (target: EventTarget | null) => {
    const el = target as HTMLElement | null
    return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (isTyping(event.target)) return

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault()
        handlers.onNext?.()
        break
      case 'ArrowLeft':
        event.preventDefault()
        handlers.onPrev?.()
        break
      case ' ':
      case 'Enter':
        event.preventDefault()
        handlers.onFlip?.()
        break
      case 'k':
      case 'K':
        handlers.onMarkCorrect?.()
        break
      case 'r':
      case 'R':
        handlers.onMarkReview?.()
        break
    }
  }

  onMounted(() => window.addEventListener('keydown', onKeyDown))
  onBeforeUnmount(() => window.removeEventListener('keydown', onKeyDown))
}
