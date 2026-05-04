/**
 * @file User Store
 * @author Evan Jelle
 */

// Imports
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/configs/api'

// Define Store
export const useUserStore = defineStore('user', () => {
  // State
  const users = ref([])
  const roles = ref([])

  // Hydrate Store
  async function hydrate() {
    await api
      .get('/api/v1/users')
      .then(function (response) {
        users.value = response.data
      })
      .catch(function (error) {
        console.log(error)
      })
    await api
      .get('/api/v1/roles')
      .then(function (response) {
        roles.value = response.data
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  // Return
  return { users, roles, hydrate }
})