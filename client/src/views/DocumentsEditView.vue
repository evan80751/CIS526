<script setup>
/**
 * @file Documents Edit View
 * @author Evan Jelle
 */
import { useRoute } from 'vue-router'
import DocumentEdit from '../components/documents/DocumentEdit.vue'

const route = useRoute()
</script>

<template>
  <DocumentEdit :id="route.params.id" />
</template>