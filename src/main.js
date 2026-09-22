import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'
// ======= PRIMEICONS =======
// Global icon font (usage: <i class="pi pi-cart-plus"></i>). See https://primeng.org/icons
import 'primeicons/primeicons.css'

createApp(App).use(createPinia()).use(router).mount('#app')