<script setup>
/**
 * @file Document Edit Component
 * @author Evan Jelle
 */
// Import Libraries
import { ref } from 'vue'
import { api } from '@/configs/api'
import { useRouter } from 'vue-router'
const router = useRouter()
import { useToast } from 'primevue/usetoast'
const toast = useToast()
import Button from 'primevue/button'
import FileUpload from 'primevue/fileupload'
import TextField from '../forms/TextField.vue'

// Incoming Props
const props = defineProps({
  id: String,
})

// Declare State
const document = ref({})
const errors = ref([])
const file = ref()

// Load Document if editing
if (props.id) {
  api
    .get('/api/v1/documents/' + props.id)
    .then(function (response) {
      document.value = response.data
    })
    .catch(function (error) {
      console.log(error)
    })
}

// Upload file
const uploadFile = function (documentId) {
  if (file.value && file.value.hasFiles) {
    fetch(file.value.files[0].objectURL)
      .then((response) => response.blob())
      .then((blob) => {
        const fileUpload = new File([blob], file.value.files[0].name, { type: blob.type })
        const form = new FormData()
        form.append('file', fileUpload)
        api
          .post('/api/v1/documents/' + documentId + '/upload', form, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(function () {
            router.push({ name: 'documents' })
          })
          .catch(function (error) {
            console.log(error)
          })
      })
      .catch(function (error) {
        console.log(error)
      })
  } else {
    router.push({ name: 'documents' })
  }
}

// Save Document
const saveDocument = function () {
  if (!document.value.display_name) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Display name is required.', life: 3000 })
    return
  }
  errors.value = []
  const request = props.id
    ? api.put('/api/v1/documents/' + props.id, document.value)
    : api.post('/api/v1/documents', document.value)

  request
    .then(function (response) {
      const documentId = props.id ? props.id : response.data.id
      uploadFile(documentId)
    })
    .catch(function (error) {
      if (error.response.status === 422) {
        errors.value = error.response.data.errors
      }
    })
}
</script>

<template>
  <div class="flex flex-col gap-4 m-4">
    <TextField
      v-model="document.display_name"
      field="display_name"
      label="Display Name"
      icon="pi pi-file"
      :errors="errors"
    />
    <FileUpload
      ref="file"
      mode="basic"
      name="file"
      customUpload
      chooseLabel="Choose File"
    />
    <div class="flex gap-2">
      <Button label="Save" icon="pi pi-save" @click="saveDocument" />
      <Button label="Cancel" icon="pi pi-times" severity="secondary" @click="router.push({ name: 'documents' })" />
    </div>
  </div>
</template>