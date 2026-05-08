<script setup>
/**
 * @file Metadata Single View
 * @author Evan Jelle
 */
// Import Libraries
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/configs/api'
import { useTokenStore } from '@/stores/Token'
import { storeToRefs } from 'pinia'
import { useMetadataStore } from '@/stores/Metadata'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Chip from 'primevue/chip'
import Select from 'primevue/select'
import { useConfirm } from 'primevue'
import { useToast } from 'primevue/usetoast'
const router = useRouter()
const confirm = useConfirm()
const toast = useToast()
const tokenStore = useTokenStore()
const metadataStore = useMetadataStore()
const { documents, communities } = storeToRefs(metadataStore)
metadataStore.hydrate()
// Incoming Props
const props = defineProps({
  id: String,
})
// State
const metadata = ref(null)
const selectedDocument = ref(null)
const selectedCommunity = ref(null)
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
// Add Document
const addDocument = function () {
  if (!selectedDocument.value) return
  api.post('/api/v1/metadata/' + props.id + '/add_document', { id: selectedDocument.value.id })
    .then(function () {
      metadata.value.documents.push(selectedDocument.value)
      selectedDocument.value = null
    })
    .catch(function (error) { console.log(error) })
}
// Remove Document
const removeDocument = function (document) {
  api.post('/api/v1/metadata/' + props.id + '/remove_document', { id: document.id })
    .then(function () {
      metadata.value.documents = metadata.value.documents.filter((d) => d.id !== document.id)
    })
    .catch(function (error) { console.log(error) })
}
// Add Community
const addCommunity = function () {
  if (!selectedCommunity.value) return
  api.post('/api/v1/metadata/' + props.id + '/add_community', { id: selectedCommunity.value.id })
    .then(function () {
      metadata.value.communities.push(selectedCommunity.value)
      selectedCommunity.value = null
    })
    .catch(function (error) { console.log(error) })
}
// Remove Community
const removeCommunity = function (community) {
  api.post('/api/v1/metadata/' + props.id + '/remove_community', { id: community.id })
    .then(function () {
      metadata.value.communities = metadata.value.communities.filter((c) => c.id !== community.id)
    })
    .catch(function (error) { console.log(error) })
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
        <div v-for="community in metadata.communities" :key="community.id" class="flex justify-between items-center mb-1">
          <span>{{ community.name }} ({{ community.county?.name }})</span>
          <Button
            v-if="tokenStore.has_role('manage_documents') || tokenStore.has_role('add_documents')"
            icon="pi pi-times"
            severity="danger"
            rounded
            outlined
            size="small"
            @click="removeCommunity(community)"
          />
        </div>
        <div v-if="tokenStore.has_role('manage_documents') || tokenStore.has_role('add_documents')" class="flex gap-2 mt-2">
          <Select
            v-model="selectedCommunity"
            :options="communities"
            optionLabel="name"
            placeholder="Select a community"
            class="flex-1"
          />
          <Button icon="pi pi-plus" @click="addCommunity" />
        </div>
      </template>
    </Card>
    <div v-if="metadata.communities.length > 0 && metadata.communities[0].lat && metadata.communities[0].long" class="mb-4">
      <h2 class="text-xl font-bold mb-2">Map</h2>
      <ol-map style="height: 400px">
        <ol-view
          :center="[metadata.communities[0].long, metadata.communities[0].lat]"
          :zoom="12"
          projection="EPSG:4326"
        />
        <ol-tile-layer>
          <ol-source-osm />
        </ol-tile-layer>
        <ol-vector-layer>
          <ol-source-vector>
            <ol-feature>
              <ol-geom-point
                :coordinates="[metadata.communities[0].long, metadata.communities[0].lat]"
              />
              <ol-style>
                <ol-style-circle :radius="8">
                  <ol-style-fill color="red" />
                  <ol-style-stroke color="white" :width="2" />
                </ol-style-circle>
              </ol-style>
            </ol-feature>
          </ol-source-vector>
        </ol-vector-layer>
      </ol-map>
    </div>
    <h2 class="text-xl font-bold mb-2">Documents</h2>
    <Card>
      <template #content>
        <div v-if="metadata.documents.length === 0" class="text-gray-500">No documents linked.</div>
        <div v-for="document in metadata.documents" :key="document.id" class="flex justify-between items-center mb-1">
          <span>{{ document.display_name }}</span>
          <Button
            v-if="tokenStore.has_role('manage_documents') || tokenStore.has_role('add_documents')"
            icon="pi pi-times"
            severity="danger"
            rounded
            outlined
            size="small"
            @click="removeDocument(document)"
          />
        </div>
        <div v-if="tokenStore.has_role('manage_documents') || tokenStore.has_role('add_documents')" class="flex gap-2 mt-2">
          <Select
            v-model="selectedDocument"
            :options="documents"
            optionLabel="display_name"
            placeholder="Select a document"
            class="flex-1"
          />
          <Button icon="pi pi-plus" @click="addDocument" />
        </div>
      </template>
    </Card>
  </div>
</template>