import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { i18n, applyLocale } from './i18n';
import './assets/main.css';
// ======= PRIMEICONS =======
// Global icon font (usage: <i class="pi pi-cart-plus"></i>). See https://primeng.org/icons
import 'primeicons/primeicons.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(i18n);

// Sync <html lang>/dir (RTL for Arabic) with the detected/boot locale on load.
// The active locale lives in the i18n composer + src/stores/locale.js afterwards.
applyLocale(i18n.global.locale.value);

app.mount('#app');