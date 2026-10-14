import { onBeforeUnmount, watch, type Ref } from 'vue'

interface SwipeHandlers {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
}

const THRESHOLD = 50

/**
 * Touch swipe detection for the flashcard.
 * Swipe left → next card, right → previous, up → flip.
 * Attaches reactively, so the element can mount after the composable runs.
 */
export function useSwipeGesture(target: Ref<HTMLElement | null>, handlers: SwipeHandlers) {
  let startX = 0
  let startY = 0
  let attached: HTMLElement | null = null

  const onTouchStart = (event: TouchEvent) => {
    const touch = event.changedTouches[0]
    if (!touch) return
    startX = touch.clientX
    startY = touch.clientY
  }

  const onTouchEnd = (event: TouchEvent) => {
    const touch = event.changedTouches[0]
    if (!touch) return

    const dx = touch.clientX - startX
    const dy = touch.clientY - startY

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx <= -THRESHOLD) handlers.onSwipeLeft?.()
      else if (dx >= THRESHOLD) handlers.onSwipeRight?.()
    } else if (dy <= -THRESHOLD) {
      handlers.onSwipeUp?.()
    }
  }

  const detach = () => {
    if (!attached) return
    attached.removeEventListener('touchstart', onTouchStart)
    attached.removeEventListener('touchend', onTouchEnd)
    attached = null
  }

  watch(
    target,
    (el) => {
      detach()
      if (!el) return
      el.addEventListener('touchstart', onTouchStart, { passive: true })
      el.addEventListener('touchend', onTouchEnd, { passive: true })
      attached = el
    },
    { immediate: true },
  )

  onBeforeUnmount(detach)
}
