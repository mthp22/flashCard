import { onBeforeUnmount, ref } from 'vue'

/**
 * Tracks time for the current card and the whole study session.
 * `restart()` is called on every card change so `elapsed` is always
 * the seconds spent on the card currently on screen.
 */
export function useSessionTimer() {
  const elapsed = ref(0)
  let startedAt = Date.now()
  let interval: ReturnType<typeof setInterval> | null = null

  const tick = () => {
    elapsed.value = Math.round((Date.now() - startedAt) / 1000)
  }

  const start = () => {
    startedAt = Date.now()
    elapsed.value = 0
    if (interval) clearInterval(interval)
    interval = setInterval(tick, 1000)
  }

  const restart = () => {
    startedAt = Date.now()
    elapsed.value = 0
  }

  const stop = (): number => {
    if (interval) clearInterval(interval)
    interval = null
    return elapsed.value
  }

  start()

  onBeforeUnmount(stop)

  return { elapsed, start, restart, stop }
}
