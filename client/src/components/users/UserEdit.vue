<script setup>
/**
 * @file User Edit Component
 * @author Evan Jelle
 */
// Import Libraries
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/User'
import { api } from '@/configs/api'
import { useRouter } from 'vue-router'
const router = useRouter()
import TextField from '../forms/TextField.vue'
import AutoCompleteMultipleField from '../forms/AutoCompleteMultipleField.vue'
import Button from 'primevue/button'

// Incoming Props
const props = defineProps({
  id: String,
})

// Declare State
const user = ref({ username: '', roles: [] })
const errors = ref([])
const userStore = useUserStore()
const { roles } = storeToRefs(userStore)
userStore.hydrate()

// Load User (only if editing)
if (props.id) {
  api
    .get('/api/v1/users/' + props.id)
    .then(function (response) {
      user.value = response.data
    })
    .catch(function (error) {
      console.log(error)
    })
}

// Save User
const saveUser = function () {
  if (props.id) {
    // Edit existing user
    api
      .put('/api/v1/users/' + props.id, user.value)
      .then(function (response) {
        router.push({ name: 'users' })
      })
      .catch(function (error) {
        if (error.response.status === 422) {
          errors.value = error.response.data.errors
        }
      })
  } else {
    // Create new user
    api
      .post('/api/v1/users', user.value)
      .then(function (response) {
        router.push({ name: 'users' })
      })
      .catch(function (error) {
        if (error.response.status === 422) {
          errors.value = error.response.data.errors
        }
      })
  }
}
</script>

<template>
  <div class="flex flex-col gap-4 m-4">
    <TextField
      v-model="user.username"
      field="username"
      label="Username"
      icon="pi pi-user"
      :errors="errors"
    />
    <AutoCompleteMultipleField
      v-model="user.roles"
      field="roles"
      label="Roles"
      icon="pi pi-id-card"
      :options="roles"
      optionLabel="role"
      :errors="errors"
    />
    <div class="flex gap-2">
      <Button label="Save" icon="pi pi-save" @click="saveUser" />
      <Button label="Cancel" icon="pi pi-times" severity="secondary" @click="router.push({ name: 'users' })" />
    </div>
  </div>
</template>