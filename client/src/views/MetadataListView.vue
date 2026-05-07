<script setup>
/**
 * @file Metadata List View
 * @author Evan Jelle
 */
// Import Libraries
import { storeToRefs } from 'pinia'
import { useMetadataStore } from '@/stores/Metadata'
import DataView from 'primevue/dataview'
import MetadataCard from '@/components/metadata/MetadataCard.vue'
// Store
const metadataStore = useMetadataStore()
const { metadata } = storeToRefs(metadataStore)
metadataStore.hydrate()
</script>
<template>
  <div class="m-4">
    <h1 class="text-2xl font-bold mb-4">Metadata</h1>
    <DataView :value="metadata">
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