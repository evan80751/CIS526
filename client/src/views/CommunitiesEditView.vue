<script setup>
/**
 * @file Communities Edit View
 * @author Evan Jelle
 */
import { useRoute } from 'vue-router'
import CommunityEdit from '../components/communities/CommunityEdit.vue'

const route = useRoute()
</script>

<template>
  <CommunityEdit :id="route.params.id" />
</template>