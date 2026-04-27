<script setup>
/**
 * @file Documents List Component
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
import { format } from 'date-fns'

const router = useRouter()
const confirm = useConfirm()
const toast = useToast()

// Declare State
const documents = ref([])
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

// Load Documents
const loadDocuments = function () {
  api
    .get('/api/v1/documents')
    .then(function (response) {
      documents.value = response.data
    })
    .catch(function (error) {
      console.log(error)
    })
}
loadDocuments()

// Format date helper
const formatDate = (value) => {
  if (!value) return ''
  return format(new Date(value), 'MM/dd/yyyy')
}

// Delete document
const deleteDocument = function (document) {
  confirm.require({
    message: `Are you sure you want to delete ${document.display_name}?`,
    header: 'Delete Document',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: { label: 'Cancel', severity: 'secondary' },
    acceptProps: { label: 'Delete', severity: 'danger' },
    accept: () => {
      api
        .delete('/api/v1/documents/' + document.id)
        .then(function () {
          toast.add({ severity: 'success', summary: 'Deleted', detail: document.display_name + ' deleted.', life: 3000 })
          loadDocuments()
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
      :value="documents"
      :filters="filters"
      filterDisplay="menu"
      :globalFilterFields="['display_name', 'filename', 'type']"
      sortMode="multiple"
      paginator
      :rows="10"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-xl font-bold">Documents</span>
          <div class="flex gap-2">
            <InputText v-model="filters['global'].value" placeholder="Search..." />
            <Button label="New Document" icon="pi pi-plus" @click="router.push({ name: 'newdocument' })" />
          </div>
        </div>
      </template>
      <Column field="display_name" header="Name" sortable />
      <Column field="filename" header="File" sortable>
        <template #body="{ data }">
          <a v-if="data.filename" :href="'/uploads/' + data.filename" target="_blank">
            {{ data.filename }}
          </a>
          <span v-else>No file</span>
        </template>
      </Column>
      <Column field="size" header="Size (KB)" sortable />
      <Column field="type" header="Type" sortable />
      <Column field="createdAt" header="Created" sortable>
        <template #body="{ data }">{{ formatDate(data.createdAt) }}</template>
      </Column>
      <Column field="updatedAt" header="Updated" sortable>
        <template #body="{ data }">{{ formatDate(data.updatedAt) }}</template>
      </Column>
      <Column header="Actions">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button icon="pi pi-pencil" severity="info" @click="router.push({ name: 'editdocument', params: { id: data.id } })" />
            <Button icon="pi pi-trash" severity="danger" @click="deleteDocument(data)" />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>