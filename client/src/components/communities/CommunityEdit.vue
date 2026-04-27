<script setup>
/**
 * @file Community Edit Component
 * @author Evan Jelle
 */
// Import Libraries
import { ref } from 'vue'
import { api } from '@/configs/api'
import { useRouter } from 'vue-router'
const router = useRouter()
import Button from 'primevue/button'
import Select from 'primevue/select'
import TextField from '../forms/TextField.vue'

// Incoming Props
const props = defineProps({
  id: String,
})

// Declare State
const community = ref({ county: {} })
const counties = ref([])
const errors = ref([])

// Load Counties then Community
api
  .get('/api/v1/counties')
  .then(function (response) {
    counties.value = response.data
    if (props.id) {
      api
        .get('/api/v1/communities/' + props.id)
        .then(function (response) {
          community.value = response.data
          community.value.county = counties.value.find(
            (c) => c.id === response.data.county.id
          ) || response.data.county
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  })
  .catch(function (error) {
    console.log(error)
  })

// Save Community
const saveCommunity = function () {
  const request = props.id
    ? api.put('/api/v1/communities/' + props.id, community.value)
    : api.post('/api/v1/communities', community.value)
  request
    .then(function () {
      router.push({ name: 'communities' })
    })
    .catch(function (error) {
      if (error.response.status === 422) {
        errors.value = error.response.data.errors
      }
    })
}
</script>

<template>
  <div class="flex flex-col gap-4 m-4">
    <TextField
      v-model="community.name"
      field="name"
      label="Name"
      icon="pi pi-building-columns"
      :errors="errors"
    />
    <TextField
      v-model="community.lat"
      field="lat"
      label="Latitude"
      icon="pi pi-map-marker"
      :errors="errors"
    />
    <TextField
      v-model="community.long"
      field="long"
      label="Longitude"
      icon="pi pi-map-marker"
      :errors="errors"
    />
    <Select
      v-model="community.county"
      :options="counties"
      optionLabel="name"
      placeholder="Select a County"
    />
    <div class="flex gap-2">
      <Button label="Save" icon="pi pi-save" @click="saveCommunity" />
      <Button label="Cancel" icon="pi pi-times" severity="secondary" @click="router.push({ name: 'communities' })" />
    </div>
  </div>
</template>