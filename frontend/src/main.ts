import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import PrimeVue from 'primevue/config'
import FspPreset from './theme/fsp-preset'

import 'primeicons/primeicons.css'
import './assets/main.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(PrimeVue, {
  license: import.meta.env.VITE_PRIMEVUE_LICENSE,
  theme: {
    preset: FspPreset,
    options: {
      darkModeSelector: '.dark',
    },
  },
})

app.mount('#app')
