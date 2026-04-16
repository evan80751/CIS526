/**
 * @file Axios Configuration and Interceptors
 * @author Evan Jelle
 */

// Import Libraries
import axios from 'axios'

// Import Stores
import { useTokenStore } from '@/stores/Token'

// Axios Instance Setup
const api = axios.create({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// Add Interceptors
const setupAxios = function () {
  // Configure Requests
  api.interceptors.request.use(
    (config) => {
      if (config.url !== '/auth/token' && config.url !== '/api') {
        const tokenStore = useTokenStore()
        if (tokenStore.token.length > 0) {
          config.headers['Authorization'] = 'Bearer ' + tokenStore.token
        }
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Configure Response
  api.interceptors.response.use(
    (res) => {
      return res
    },
    async (err) => {
      const config = err.config
      if (config.url !== '/auth/token' && err.response) {
        if (err.response.status === 401) {
          if (!config._retry) {
            config._retry = true
            try {
              const tokenStore = useTokenStore()
              await tokenStore.getToken()
              return api(config)
            } catch (error) {
              return Promise.reject(error)
            }
          } else {
            const tokenStore = useTokenStore()
            await tokenStore.getToken(true)
          }
        }
      }
      return Promise.reject(err)
    }
  )
}

export { api, setupAxios }