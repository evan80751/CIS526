<script setup>
/**
 * @file Metadata Single View
 * @author Evan Jelle
 */
// Import Libraries
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/configs/api'
import { useTokenStore } from '@/stores/Token'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Chip from 'primevue/chip'
import { useConfirm } from 'primevue'
import { useToast } from 'primevue/usetoast'
const router = useRouter()
const confirm = useConfirm()
const toast = useToast()
const tokenStore = useTokenStore()
// Incoming Props
const props = defineProps({
  id: String,
})
// State
const metadata = ref(null)
// Load Metadata
api
  .get('/api/v1/metadata/' + props.id)
  .then(function (response) {
    metadata.value = response.data
  })
  .catch(function (error) {
    console.log(error)
  })
// Delete Metadata
const confirmDelete = function () {
  confirm.require({
    message: 'Are you sure you want to delete this metadata item?',
    header: 'Delete Metadata',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: { label: 'Cancel', severity: 'secondary', outlined: true },
    acceptProps: { label: 'Delete', severity: 'danger' },
    accept: () => {
      api
        .delete('/api/v1/metadata/' + props.id)
        .then(function () {
          router.push({ name: 'metadata' })
        })
        .catch(function (error) {
          toast.add({ severity: 'error', summary: 'Error', detail: error, life: 5000 })
        })
    },
  })
}
</script>
<template>
  <div class="m-4" v-if="metadata">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">{{ metadata.title }}</h1>
      <div class="flex gap-2" v-if="tokenStore.has_role('manage_documents')">
        <Button
          icon="pi pi-pencil"
          label="Edit"
          @click="router.push({ name: 'editmetadata', params: { id: metadata.id } })"
        />
        <Button
          icon="pi pi-trash"
          label="Delete"
          severity="danger"
          @click="confirmDelete"
        />
      </div>
    </div>
    <Card class="mb-4">
      <template #content>
        <div class="flex flex-col gap-2">
          <div><strong>Author:</strong> {{ metadata.author }}</div>
          <div><strong>Publisher:</strong> {{ metadata.publisher }}</div>
          <div><strong>Date:</strong> {{ metadata.date }}</div>
          <div><strong>Abstract:</strong> {{ metadata.abstract }}</div>
          <div><strong>Citation:</strong> {{ metadata.citation }}</div>
          <div><strong>Owner:</strong> {{ metadata.owner?.username }}</div>
          <div>
            <strong>Keywords:</strong>
            <div class="flex flex-wrap gap-1 mt-1">
              <Chip
                v-for="keyword in metadata.keywords.split(' ')"
                :key="keyword"
                :label="keyword.trim()"
              />
            </div>
          </div>
        </div>
      </template>
    </Card>
    <h2 class="text-xl font-bold mb-2">Communities</h2>
    <Card class="mb-4">
      <template #content>
        <div v-if="metadata.communities.length === 0" class="text-gray-500">No communities linked.</div>
        <div v-for="community in metadata.communities" :key="community.id" class="mb-1">
          {{ community.name }} ({{ community.county?.name }})
        </div>
      </template>
    </Card>
    <h2 class="text-xl font-bold mb-2">Documents</h2>
    <Card>
      <template #content>
        <div v-if="metadata.documents.length === 0" class="text-gray-500">No documents linked.</div>
        <div v-for="document in metadata.documents" :key="document.id" class="mb-1">
          {{ document.title }}
        </div>
      </template>
    </Card>
  </div>
</template>