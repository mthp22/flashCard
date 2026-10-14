<template>
  <span>{{ shown }}</span>
</template>

<script setup lang="ts">
import { useCountUp } from '../composables/useCountUp'

const props = withDefaults(
  defineProps<{
    value: number
    decimals?: number
    duration?: number
  }>(),
  {
    decimals: 0,
    duration: 1,
  },
)

const shown = useCountUp(() => props.value, {
  decimals: props.decimals,
  duration: props.duration,
})
</script>
