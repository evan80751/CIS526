/**
 * @file Vue Router for the application
 * @author Evan Jelle
 */

// Import Libraries
import { createRouter, createWebHistory } from "vue-router";

// Import Views
import HomeView from "@/views/HomeView.vue";
import { useTokenStore } from "@/stores/Token";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
    },
  ],
})

// Global Route Guard
router.beforeEach(async (to) => {
  const tokenStore = useTokenStore()
  const noLoginRequired = ['home', 'about']
  if (noLoginRequired.includes(to.name)) {
    if (!tokenStore.token.length > 0) {
      tokenStore.getToken()
    }
  } else {
    if (!tokenStore.token.length > 0) {
      await tokenStore.getToken(true)
    }
  }
})

export default router