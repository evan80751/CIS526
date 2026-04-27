<script setup>
/**
 * @file Top menu bar of the entire application
 * @author Evan Jelle
 */
// Import Libraries
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

// Import Components
import Menubar from 'primevue/menubar'
import ThemeToggle from './ThemeToggle.vue'
import UserProfile from './UserProfile.vue'

// Stores
import { useTokenStore } from '@/stores/Token'
const tokenStore = useTokenStore()

// Declare State
const items = ref([
  {
    label: 'Home',
    icon: 'pi pi-home',
    command: () => { router.push({ name: 'home' }) },
  },
  {
    label: 'About',
    icon: 'pi pi-info-circle',
    command: () => { router.push({ name: 'about' }) },
  },
  {
    label: 'Profile',
    icon: 'pi pi-user',
    command: () => { router.push({ name: 'profile' }) },
  },
  {
    label: 'Roles',
    icon: 'pi pi-id-card',
    command: () => { router.push({ name: 'roles' }) },
    roles: ['manage_users'],
  },
  {
    label: 'Users',
    icon: 'pi pi-users',
    command: () => { router.push({ name: 'users' }) },
    roles: ['manage_users'],
  },
  {
    label: 'Counties',
    icon: 'pi pi-map',
    command: () => { router.push({ name: 'counties' }) },
    roles: ['view_communities', 'manage_communities', 'add_communities'],
  },
  {
    label: 'Communities',
    icon: 'pi pi-building-columns',
    command: () => { router.push({ name: 'communities' }) },
    roles: ['view_communities', 'manage_communities', 'add_communities'],
  },
{
    label: 'Documents',
    icon: 'pi pi-file',
    command: () => { router.push({ name: 'documents' }) },
    roles: ['view_documents', 'manage_documents', 'add_documents'],
  },
])

// Filter items by role
const visible_items = computed(() => {
  return items.value.filter((item) => {
    if (item.roles) {
      if (tokenStore.token.length > 0) {
        if (item.roles == '*') {
          return true
        } else {
          return item.roles.some((r) => tokenStore.has_role(r))
        }
      } else {
        return false
      }
    } else {
      return true
    }
  })
})
</script>

<template>
  <div>
    <Menubar :model="visible_items">
      <template #start>
        <img src="https://placehold.co/40x40" alt="Placeholder Logo" />
      </template>
      <template #end>
        <div class="flex items-center gap-1">
          <ThemeToggle />
          <UserProfile />
        </div>
      </template>
    </Menubar>
  </div>
</template>