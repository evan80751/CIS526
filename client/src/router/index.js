/**
 * @file Vue Router for the application
 * @author Evan Jelle
 */

// Import Libraries
import { createRouter, createWebHistory } from "vue-router";

// Import Views
import HomeView from "@/views/HomeView.vue";
import { useTokenStore } from "@/stores/Token";

// Router Guard - check roles before entering route
const requireRoles = (...roles) => {
  return () => {
    const tokenStore = useTokenStore()
    const allow = roles.some((r) => tokenStore.has_role(r))
    if (allow) {
      return true
    } else {
      return { name: 'home' }
    }
  }
}

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
    {
      path: '/roles',
      name: 'roles',
      component: () => import('../views/RolesView.vue'),
      beforeEnter: requireRoles('manage_users'),
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/UsersListView.vue'),
      beforeEnter: requireRoles('manage_users'),
    },
    {
      path: '/users/:id/edit',
      name: 'edituser',
      component: () => import('../views/UsersEditView.vue'),
      beforeEnter: requireRoles('manage_users'),
    },
    {
      path: '/users/new',
      name: 'newuser',
      component: () => import('../views/UsersEditView.vue'),
      beforeEnter: requireRoles('manage_users'),
    },
    {
      path: '/counties',
      name: 'counties',
      component: () => import('../views/CountiesListView.vue'),
      beforeEnter: requireRoles('view_communities', 'manage_communities', 'add_communities'),
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