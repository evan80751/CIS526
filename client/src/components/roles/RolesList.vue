<script setup>
/**
 * @file Roles List Component
 * @author Evan Jelle
 */
// Import Libraries
import Card from 'primevue/card'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/User'

// Declare State
const userStore = useUserStore()
const { roles } = storeToRefs(userStore)
userStore.hydrate()
</script>

<template>
  <div>
    <Card v-for="role in roles" :key="role.id">
      <template #title>Role: {{ role.role }}</template>
    </Card>
  </div>
</template>