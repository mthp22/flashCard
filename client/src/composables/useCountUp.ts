import { ref, watch, type MaybeRefOrGetter, toValue } from 'vue'
import { gsap } from '../plugins/gsap'

/**
 * Animates a number towards its target with GSAP — the value counts up
 * smoothly whenever the source changes. Great for stats and progress.
 */
export function useCountUp(
  target: MaybeRefOrGetter<number>,
  options: { duration?: number; decimals?: number } = {},
) {
  const { duration = 0.8, decimals = 0 } = options
  const displayed = ref(0)
  const proxy = { value: 0 }

  watch(
    () => toValue(target),
    (value) => {
      gsap.to(proxy, {
        value,
        duration,
        ease: 'power2.out',
        onUpdate: () => {
          displayed.value = Number(proxy.value.toFixed(decimals))
        },
      })
    },
    { immediate: true },
  )

  return displayed
}
