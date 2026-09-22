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
  // ======= FIRST-LOAD SAFETY NET =======
  // HomeView (and every data-aos section inside it) mounts through the
  // async router-view — which can complete AFTER AOS.init above. Once the
  // router has resolved the initial navigation, force AOS to re-scan and
  // reveal everything that is currently in view. Without this, sections that
  // mounted late keep [data-aos] + opacity:0 (from the AOS package CSS) and
  // the first load shows a white page.
  router.isReady().then(() => {
    AOS.refreshHard()
    onRouterChange = () => AOS.refresh()
    router.afterEach(onRouterChange)
  })
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

<style>
/* ======= AOS MOBILE SAFETY NET =======
   Below md (768px) AOS is disabled in AOS.init (see script block), which means
   it only strips data-aos attributes from elements that existed at init time.
   First-load async sections that mount later keep their data-aos attribute and
   the AOS package CSS would hold them at opacity:0 forever. This override is
   THE guarantee that small screens never show hidden content: force every
   data-aos element visible (no transform/opacity hiding) on <768px. Above that
   (tablets/desktop) AOS is active and handles reveal through its own logic. */
@media (max-width: 767.98px) {
  [data-aos] {
    opacity: 1 !important;
    transform: none !important;
  }
}
</style>