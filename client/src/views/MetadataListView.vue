<script setup>
/**
 * @file Metadata List View
 * @author Evan Jelle
 */
// Import Libraries
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMetadataStore } from '@/stores/Metadata'
import DataView from 'primevue/dataview'
import Button from 'primevue/button'
import { useTokenStore } from '@/stores/Token'
import { useRouter } from 'vue-router'
import MetadataCard from '@/components/metadata/MetadataCard.vue'
// Incoming Props
const props = defineProps({
  tag: String,
})
const router = useRouter()
const tokenStore = useTokenStore()
// Store
const metadataStore = useMetadataStore()
const { metadata } = storeToRefs(metadataStore)
metadataStore.hydrate()
// Filter by tag if provided
const filteredMetadata = computed(() => {
  if (!props.tag) return metadata.value
  return metadata.value.filter((item) => {
    return item.keywords
      .split(' ')
      .map((k) => k.trim().toLowerCase())
      .includes(props.tag.toLowerCase())
  })
})
</script>
<template>
  <div class="m-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">
        Metadata<span v-if="tag"> — Tag: {{ tag }}</span>
      </h1>
      <Button
        v-if="tokenStore.has_role('manage_documents') || tokenStore.has_role('add_documents')"
        label="New Metadata"
        icon="pi pi-plus"
        severity="success"
        @click="router.push({ name: 'newmetadata' })"
      />
    </div>
    <DataView :value="filteredMetadata">
      <template #list="slotProps">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <MetadataCard
            v-for="item in slotProps.items"
            :key="item.id"
            :metadata="item"
          />
        </div>
      </template>
    </DataView>
  </div>
</template>