import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { initializeFirestore } from './utils/initializeFirestore'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Initialize Firestore with sample data if empty
initializeFirestore().catch((error) => console.error('Failed to initialize Firestore:', error))

app.mount('#app')
