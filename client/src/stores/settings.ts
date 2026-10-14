import { defineStore } from 'pinia'
// Importing the plugin registers its `persist` option type augmentation
import 'pinia-plugin-persistedstate'

export type SoundType = 'flip' | 'correct' | 'review'

let audioContext: AudioContext | null = null

/**
 * Settings store — user preferences.
 * Persistence is handled by the pinia-plugin-persistedstate plugin
 * registered in main.ts, so `persist: true` is all it takes.
 */
export const useSettingsStore = defineStore('settings', {
  state: () => ({
    // Paper is the default; dim is the late-night mode
    darkMode: false,
    soundEnabled: true,
  }),

  actions: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode
    },

    toggleSound() {
      this.soundEnabled = !this.soundEnabled
    },

    /** Tiny WebAudio synth — no audio assets needed */
    playSound(type: SoundType) {
      if (!this.soundEnabled) return

      try {
        const AudioContextClass =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        audioContext ??= new AudioContextClass()

        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        const now = audioContext.currentTime

        switch (type) {
          case 'flip':
            oscillator.frequency.value = 800
            gainNode.gain.setValueAtTime(0.1, now)
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1)
            oscillator.start(now)
            oscillator.stop(now + 0.1)
            break
          case 'correct':
            oscillator.frequency.value = 1000
            gainNode.gain.setValueAtTime(0.1, now)
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
            oscillator.start(now)
            oscillator.stop(now + 0.3)
            break
          case 'review':
            oscillator.frequency.value = 600
            gainNode.gain.setValueAtTime(0.1, now)
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
            oscillator.start(now)
            oscillator.stop(now + 0.2)
            break
        }
      } catch (error) {
        console.warn('Unable to play sound:', error)
      }
    },
  },

  persist: true,
})
