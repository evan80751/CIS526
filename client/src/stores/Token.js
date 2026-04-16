/**
 * @file JWT Token Store
 * @author Evan Jelle
 */

// Import Libraries
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'

// Define Store
export const useTokenStore = defineStore('token', () => {
  // State properties
  const token = ref('')

  // Getters
  const username = computed(() => token.value.length > 0 ? jwtDecode(token.value)['username'] : '')
  const has_role = computed(() =>
    (role) => token.value.length > 0 ? jwtDecode(token.value)['roles'].some((r) => r.role == role) : false
  )

  // Actions
  async function getToken(redirect = false) {
    console.log('token:get')
    try {
      const response = await axios.get('/auth/token', { withCredentials: true })
      token.value = response.data.token
    } catch (error) {
      token.value = ''
      if (error.response && error.response.status === 401) {
        console.log('token:get user not logged in')
        if (redirect) {
          console.log('token:get redirecting to login page')
          window.location.href = '/auth/cas'
        }
      } else {
        console.log('token:get error' + error)
      }
    }
  }

  function logout() {
    token.value = ''
    window.location.href = '/auth/logout'
  }

  return { token, username, has_role, getToken, logout }
})