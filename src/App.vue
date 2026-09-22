<script setup>
import { onMounted, onUnmounted } from 'vue'
import AOS from 'aos'
import 'aos/dist/aos.css'
import Navbar from './components/Navbar.vue'
import ToastContainer from './components/ToastContainer.vue'
import router from './router'

let onRouterChange = null

onMounted(() => {
  AOS.init({
    once: true,
    duration: 800,
    easing: 'ease-out-cubic',
    offset: 80,
    // ======= RESPONSIVE SAFETY =======
    // Disable AOS below md (768px): on small screens animations are
    // skipped so elements never sit at opacity:0 and the layout never
    // overflows from translateX offsets. Desktop keeps the animations.
    disable: () => window.innerWidth < 768,
  })
  onRouterChange = () => AOS.refresh()
  router.afterEach(onRouterChange)
})

onUnmounted(() => {
  if (onRouterChange) {
    router.off('afterEach', onRouterChange)
  }
})
</script>

<template>
  <!-- ======= GLOBAL APP LAYOUT =======
       Everything here shows on every page.
       - Navbar is the site-wide header (edit it in components/Navbar.vue)
       - router-view renders the page for the current route -->
  <div class="min-h-screen bg-snow-100">
    <Navbar />
    <router-view />
    <!-- ======= GLOBAL TOASTS =======
         Renders success/error notifications from stores/toast.js. -->
    <ToastContainer />
  </div>
</template>