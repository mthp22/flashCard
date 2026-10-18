import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  base: '/flashCard/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Keep the heavy libraries in their own cached chunks
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('highlight.js')) return 'highlight'
          if (id.includes('/gsap/') || id.includes('\\gsap\\')) return 'gsap'
        },
      },
    },
  },
})
