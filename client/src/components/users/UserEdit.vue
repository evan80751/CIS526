<script setup>
/**
 * @file User Edit Component
 * @author Evan Jelle
 */
// Import Libraries
import { ref, computed, inject } from 'vue'
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
const errors = ref([])
const isDialog = ref(false)
const userId = ref()
// Detect Dialog
const dialogRef = inject('dialogRef')
if (dialogRef && dialogRef.value.data) {
  isDialog.value = true
  userId.value = dialogRef.value.data.id
} else {
  userId.value = props.id
}
// Stores
const userStore = useUserStore()
const { users, roles } = storeToRefs(userStore)
userStore.hydrate()
// Find Single User
const user = computed(() => {
  return JSON.parse(
    JSON.stringify(users.value.find((u) => u.id == userId.value) || { username: '', roles: [] }),
  )
})

// Save User
const saveUser = function () {
  if (userId.value) {
    // Edit existing user
    api
      .put('/api/v1/users/' + userId.value, user.value)
      .then(function (response) {
        leave()
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
        leave()
      })
      .catch(function (error) {
        if (error.response.status === 422) {
          errors.value = error.response.data.errors
        }
      })
  }
}

// Leave Component
const leave = function () {
  if (isDialog.value) {
    dialogRef.value.close()
  } else {
    router.push({ name: 'users' })
  }
}

</script>

<template>
  <div class="flex flex-col gap-4 m-4">
    <h1 class="text-xl text-center m-1">{{  userId ? 'Edit User' : 'New User'  }}</h1>
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
      <Button label="Cancel" icon="pi pi-times" severity="secondary" @click="leave" />
    </div>
  </div>
</template>