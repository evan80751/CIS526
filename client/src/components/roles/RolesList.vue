<script setup>
/**
 * @file Roles List Component
 * @author Evan Jelle
 */
// Import Libraries
import { ref } from 'vue'
import { api } from '@/configs/api'
import Card from 'primevue/card'

// Declare State
const roles = ref([])

// Load Roles
api
  .get('/api/v1/roles')
  .then(function (response) {
    roles.value = response.data
  })
  .catch(function (error) {
    console.log(error)
  })
</script>

<template>
  <div>
    <Card v-for="role in roles" :key="role.id">
      <template #title>Role: {{ role.role }}</template>
    </Card>
  </div>
</template>