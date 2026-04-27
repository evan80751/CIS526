<script setup>
/**
 * @file Counties List Component
 * @author Evan Jelle
 */
// Import Libraries
import { ref } from 'vue'
import { api } from '@/configs/api'
import { FilterMatchMode } from '@primevue/core/api'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import { format } from 'date-fns'

// Declare State
const counties = ref([])
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

// Load Counties
api
  .get('/api/v1/counties')
  .then(function (response) {
    counties.value = response.data
  })
  .catch(function (error) {
    console.log(error)
  })

// Format date helper
const formatDate = (value) => {
  if (!value) return ''
  return format(new Date(value), 'MM/dd/yyyy')
}
</script>

<template>
  <div class="m-4">
    <DataTable
      :value="counties"
      :filters="filters"
      filterDisplay="menu"
      :globalFilterFields="['name', 'code', 'seat']"
      sortMode="multiple"
      paginator
      :rows="10"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-xl font-bold">Counties</span>
          <InputText v-model="filters['global'].value" placeholder="Search..." />
        </div>
      </template>
      <Column field="name" header="Name" sortable />
      <Column field="code" header="Code" sortable />
      <Column field="seat" header="County Seat" sortable />
      <Column field="population" header="Population" sortable />
      <Column field="est_year" header="Est. Year" sortable />
      <Column field="createdAt" header="Created" sortable>
        <template #body="{ data }">{{ formatDate(data.createdAt) }}</template>
      </Column>
      <Column field="updatedAt" header="Updated" sortable>
        <template #body="{ data }">{{ formatDate(data.updatedAt) }}</template>
      </Column>
    </DataTable>
  </div>
</template>