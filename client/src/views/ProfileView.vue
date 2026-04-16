<script setup>
/**
 * @file Profile view - lists all users and roles
 * @author Evan Jelle
 */

// Import Libraries
import { ref, onMounted } from 'vue'
import { api } from '@/configs/api'

// Declare State
const users = ref([])

// Load users on mount
onMounted(async () => {
  try {
    const response = await api.get('/api/v1/users')
    users.value = response.data
  } catch (error) {
    console.log(error)
  }
})
</script>

<template>
  <main>
    <h1>Users and Roles</h1>
    <div v-for="user in users" :key="user.id">
      <h2>{{ user.username }}</h2>
      <ul>
        <li v-for="role in user.roles" :key="role.id">
          {{ role.role }}
        </li>
      </ul>
    </div>
  </main>
</template>
