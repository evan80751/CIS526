<script setup>
import { useRoute } from 'vue-router'
import UserEdit from '../components/users/UserEdit.vue'

const route = useRoute()
</script>

<template>
  <UserEdit :id="route.params.id" />
</template>