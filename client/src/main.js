/**
 * @file Main Vue application
 * @author Evan Jelle
 */

// Import Libraries
import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import Tooltip from 'primevue/tooltip'

// Import CSS
import './assets/main.css'

//Import Vue App
import App from './App.vue'

// Import Configurations
import router from './router'

// Create Vue App
const app = createApp(App)

// Install Libraries
app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark-mode',
        },
    },
})

// Install Directives
app.directive('tooltip', Tooltip)

// Mount Vue App on page
app.mount('#app')