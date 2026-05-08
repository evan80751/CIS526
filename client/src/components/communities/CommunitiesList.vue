<script setup>
/**
 * @file Communities List Component
 * @author Evan Jelle
 */
// Import Libraries
import { ref } from 'vue'
import { api } from '@/configs/api'
import { FilterMatchMode } from '@primevue/core/api'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { useTokenStore } from '@/stores/Token'
const tokenStore = useTokenStore()
import { format } from 'date-fns'

const router = useRouter()
const confirm = useConfirm()
const toast = useToast()

// Declare State
const communities = ref([])
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

// Load Communities
const loadCommunities = function () {
  api
    .get('/api/v1/communities')
    .then(function (response) {
      communities.value = response.data
    })
    .catch(function (error) {
      console.log(error)
    })
}
loadCommunities()

// Format date helper
const formatDate = (value) => {
  if (!value) return ''
  return format(new Date(value), 'MM/dd/yyyy')
}

// Delete community
const deleteCommunity = function (community) {
  confirm.require({
    message: `Are you sure you want to delete ${community.name}?`,
    header: 'Delete Community',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: { label: 'Cancel', severity: 'secondary' },
    acceptProps: { label: 'Delete', severity: 'danger' },
    accept: () => {
      api
        .delete('/api/v1/communities/' + community.id)
        .then(function () {
          toast.add({ severity: 'success', summary: 'Deleted', detail: community.name + ' deleted.', life: 3000 })
          loadCommunities()
        })
        .catch(function (error) {
          console.log(error)
        })
    },
  })
}
</script>

<template>
  <div class="m-4">
    <DataTable
      :value="communities"
      :filters="filters"
      filterDisplay="menu"
      :globalFilterFields="['name', 'county.name']"
      sortMode="multiple"
      paginator
      :rows="10"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-xl font-bold">Communities</span>
          <div class="flex gap-2">
            <InputText v-model="filters['global'].value" placeholder="Search..." />
            <Button
              v-if="tokenStore.has_role('manage_communities') || tokenStore.has_role('add_communities')"
              label="New Community"
              icon="pi pi-plus"
              @click="router.push({ name: 'newcommunity' })"
            />
          </div>
        </div>
      </template>
      <Column field="name" header="Name" sortable />
      <Column field="county.name" header="County" sortable />
      <Column field="lat" header="Latitude" sortable />
      <Column field="long" header="Longitude" sortable />
      <Column field="createdAt" header="Created" sortable>
        <template #body="{ data }">{{ formatDate(data.createdAt) }}</template>
      </Column>
      <Column field="updatedAt" header="Updated" sortable>
        <template #body="{ data }">{{ formatDate(data.updatedAt) }}</template>
      </Column>
      <Column header="Actions">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button
              v-if="tokenStore.has_role('manage_communities')"
              icon="pi pi-pencil"
              severity="info"
              @click="router.push({ name: 'editcommunity', params: { id: data.id } })"
            />
            <Button
              v-if="tokenStore.has_role('manage_communities')"
              icon="pi pi-trash"
              severity="danger"
              @click="deleteCommunity(data)"
            />          
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>