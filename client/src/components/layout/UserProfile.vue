<script setup>
/**
 * @file User Profile menu option
 * @author Evan Jelle
 */

// Import Libraries
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Avatar, Menu } from 'primevue'
import { useRouter } from 'vue-router'
const router = useRouter()

// Stores
import { useTokenStore } from '@/stores/Token'
const tokenStore = useTokenStore()
const { token, username } = storeToRefs(tokenStore)

// Declare State
const items = ref([
  {
    label: username,
    icon: 'pi pi-cog',
    command: () => {
      router.push({ name: 'profile' })
    },
  },
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: tokenStore.logout,
  },
])

// Menu Popup State
const menu = ref()

// Menu Toggle Button Handler
const toggle = function (event) {
  menu.value.toggle(event)
}
</script>

<template>
  <div class="p-menubar-item">
    <div v-if="token.length == 0" class="p-menubar-item-content">
      <a class="p-menubar-item-link" @click="tokenStore.getToken(true)">
        <span class="p-menubar-item-icon pi pi-sign-in" />
        <span class="p-menu-item-label">Login</span>
      </a>
    </div>
    <div v-else class="p-menubar-item-content">
      <a
        class="p-menubar-item-link"
        id="user-icon"
        @click="toggle"
        aria-haspopup="true"
        aria-controls="profile_menu"
      >
        <Avatar icon="pi pi-user" shape="circle" />
      </a>
      <Menu ref="menu" id="profile_menu" :model="items" :popup="true" />
    </div>
  </div>
</template>

<style scoped>
#user-icon {
  padding: 0px 12px;
}
</style>