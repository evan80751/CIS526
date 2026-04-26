<script setup>
/**
 * @file Users List Component
 * @author Evan Jelle
 */
// Import Libraries
import { ref } from 'vue'
import { api } from '@/configs/api'
import { formatDistance } from 'date-fns'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { IconField, InputIcon, InputText, MultiSelect, Chip } from 'primevue'
import { FilterMatchMode, FilterService } from '@primevue/core/api'
import RoleChip from '../roles/RoleChip.vue'

// Declare State
const users = ref([])
const roles = ref([])

// Custom filter for roles
FilterService.register('filterByRole', (value, filter) => {
  if (!filter || filter.length === 0) return true
  if (!value || value.length === 0) return false
  return filter.some((f) => value.some((v) => v.id === f.id))
})

// Filters
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  roles: { value: null, matchMode: 'filterByRole' },
})

// Load Users
api
  .get('/api/v1/users')
  .then(function (response) {
    users.value = response.data
  })
  .catch(function (error) {
    console.log(error)
  })

// Load Roles
api
  .get('/api/v1/roles')
  .then(function (response) {
    roles.value = response.data
  })
  .catch(function (error) {
    console.log(error)
  })
</script>

<template>
  <DataTable
    :value="users"
    v-model:filters="filters"
    :globalFilterFields="['username']"
    filterDisplay="menu"
    sortField="username"
    :sortOrder="1"
  >
    <template #header>
      <div class="flex justify-between">
        <IconField>
          <InputIcon>
            <i class="pi pi-search" />
          </InputIcon>
          <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
        </IconField>
      </div>
    </template>
    <Column field="username" header="Username" sortable />
    <Column field="createdAt" header="Created">
      <template #body="{ data }">
        {{ formatDistance(new Date(data.createdAt), new Date(), { addSuffix: true }) }}
      </template>
    </Column>
    <Column field="updatedAt" header="Updated">
      <template #body="{ data }">
        {{ formatDistance(new Date(data.updatedAt), new Date(), { addSuffix: true }) }}
      </template>
    </Column>
    <Column filterField="roles" :showFilterMatchModes="false" header="Roles">
      <template #body="{ data }">
        <div class="flex gap-2">
          <RoleChip v-for="role in data.roles" :key="role.id" :role="role" />
        </div>
      </template>
      <template #filter="{ filterModel }">
        <MultiSelect
          v-model="filterModel.value"
          :options="roles"
          optionLabel="role"
          placeholder="Any"
        >
          <template #option="slotProps">
            <RoleChip :role="slotProps.option" />
          </template>
        </MultiSelect>
      </template>
    </Column>
  </DataTable>
</template>