<script setup>
/**
 * @file Metadata Card Component
 * @author Evan Jelle
 */
// Import Libraries
import { useRouter } from 'vue-router'
const router = useRouter()
import Card from 'primevue/card'
import Button from 'primevue/button'
import Chip from 'primevue/chip'
// Incoming Props
const props = defineProps({
  metadata: Object,
})
</script>
<template>
  <Card class="m-2 cursor-pointer" @click="router.push({ name: 'viewmetadata', params: { id: metadata.id } })">
    <template #title>{{ metadata.title }}</template>
    <template #subtitle>{{ metadata.author }} | {{ metadata.date }}</template>
    <template #content>
      <p class="text-sm mb-2">{{ metadata.abstract }}</p>
      <div class="flex flex-wrap gap-1">
        <span
        v-for="keyword in metadata.keywords.split(' ')"
        :key="keyword"
        @click.stop="router.push({ name: 'metadatatag', params: { tag: keyword.trim() } })"
        >
        <Chip
            :label="keyword.trim()"
            class="text-xs cursor-pointer"
        />
        </span>
      </div>
    </template>
    <template #footer>
      <div class="flex gap-2 text-sm text-gray-500">
        <span>{{ metadata.communities.length }} communities</span>
        <span>{{ metadata.documents.length }} documents</span>
      </div>
    </template>
  </Card>
</template>