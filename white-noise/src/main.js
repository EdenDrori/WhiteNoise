import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import './index.css'

// Import translations
import en from './locales/en.json'
import he from './locales/he.json'

// Create i18n instance
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    he
  }
})

// Create and mount the app
const app = createApp(App)
app.use(i18n)
app.mount('#app') 