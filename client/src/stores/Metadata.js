/**
 * @file Metadata Store
 * @author Evan Jelle
 */

// Imports
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/configs/api'

// Define Store
export const useMetadataStore = defineStore('metadata', () => {
  // State
  const metadata = ref([])
  const documents = ref([])
  const communities = ref([])

  // Hydrate Store
  async function hydrate() {
    await api
      .get('/api/v1/metadata')
      .then(function (response) {
        metadata.value = response.data
      })
      .catch(function (error) {
        console.log(error)
      })
    await api
      .get('/api/v1/documents')
      .then(function (response) {
        documents.value = response.data
      })
      .catch(function (error) {
        console.log(error)
      })
    await api
      .get('/api/v1/communities')
      .then(function (response) {
        communities.value = response.data
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  // Return
  return { metadata, documents, communities, hydrate }
})