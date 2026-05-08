<script setup>
/**
 * @file Metadata Edit View
 * @author Evan Jelle
 */
// Import Libraries
import { ref, computed } from 'vue'
import { api } from '@/configs/api'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useMetadataStore } from '@/stores/Metadata'
import TextField from '@/components/forms/TextField.vue'
import Button from 'primevue/button'
const router = useRouter()
// Incoming Props
const props = defineProps({
  id: String,
})
// Store
const metadataStore = useMetadataStore()
const { metadata, documents, communities } = storeToRefs(metadataStore)
metadataStore.hydrate()
// State
const errors = ref([])
// Find Single Metadata
const item = computed(() => {
  return JSON.parse(
    JSON.stringify(
      metadata.value.find((m) => m.id == props.id) || {
        title: '',
        author: '',
        publisher: '',
        date: '',
        abstract: '',
        citation: '',
        copyright_id: 1,
        keywords: '',
        documents: [],
        communities: [],
      },
    ),
  )
})
// Save Metadata
const saveMetadata = function () {
  if (props.id) {
    api
      .put('/api/v1/metadata/' + props.id, item.value)
      .then(function () {
        router.push({ name: 'viewmetadata', params: { id: props.id } })
      })
      .catch(function (error) {
        if (error.response.status === 422) {
          errors.value = error.response.data.errors
        }
      })
  } else {
    api
      .post('/api/v1/metadata', item.value)
      .then(function (response) {
        router.push({ name: 'viewmetadata', params: { id: response.data.id } })
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
    <h1 class="text-xl text-center m-1">{{ id ? 'Edit Metadata' : 'New Metadata' }}</h1>
    <TextField v-model="item.title" field="title" label="Title" icon="pi pi-book" :errors="errors" />
    <TextField v-model="item.author" field="author" label="Author" icon="pi pi-user" :errors="errors" />
    <TextField v-model="item.publisher" field="publisher" label="Publisher" icon="pi pi-building" :errors="errors" />
    <TextField v-model="item.date" field="date" label="Date" icon="pi pi-calendar" :errors="errors" />
    <TextField v-model="item.abstract" field="abstract" label="Abstract" icon="pi pi-align-left" :errors="errors" />
    <TextField v-model="item.citation" field="citation" label="Citation" icon="pi pi-link" :errors="errors" />
    <TextField v-model="item.keywords" field="keywords" label="Keywords" icon="pi pi-tag" :errors="errors" />
    <div class="flex gap-2">
      <Button label="Save" icon="pi pi-save" @click="saveMetadata" />
      <Button
        label="Cancel"
        icon="pi pi-times"
        severity="secondary"
        @click="id ? router.push({ name: 'viewmetadata', params: { id: id } }) : router.push({ name: 'metadata' })"
      />
    </div>
  </div>
</template>