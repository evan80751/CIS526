<script setup>
/**
 * @file Test User Component
 * @author Evan Jelle
 */
import { ref } from 'vue'
import { api } from '@/configs/api'
import Card from 'primevue/card'
import Chip from 'primevue/chip'

const users = ref([])

api
  .get('/api/v1/users')
  .then(function (response) {
    users.value = response.data
  })
  .catch(function (error) {
    console.log(error)
  })
</script>

<template>
  <div>
    <Card v-for="user in users" :key="user.id">
      <template #title>Username: {{ user.username }}</template>
      <template #content>
        <Chip v-for="role in user.roles" :key="role.id" :label="role.role" />
      </template>
    </Card>
  </div>
</template>