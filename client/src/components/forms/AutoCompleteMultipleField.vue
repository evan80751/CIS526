<script setup>
/**
 * @file Custom Autocomplete Multiple Field Component
 * @author Evan Jelle
 */
// Import Libraries
import { ref, computed } from 'vue'
import { InputIcon, IconField, FloatLabel, AutoComplete, Message } from 'primevue'

// Incoming Props
const props = defineProps({
  field: String,
  label: String,
  icon: String,
  options: Array,
  optionLabel: String,
  errors: Array
})

// Declare State
const suggestions = ref([])

// Filter suggestions
const search = function (event) {
  suggestions.value = props.options.filter((o) =>
    o[props.optionLabel].toLowerCase().includes(event.query.toLowerCase())
  )
}

// Find Error for Field
const error = computed(() => {
  return props.errors.find((e) => e.attribute === props.field)
})

// V-model of the field to be edited
const model = defineModel()
</script>

<template>
  <div>
    <FloatLabel variant="on">
      <IconField>
        <InputIcon :class="props.icon" />
        <AutoComplete
          :id="props.field"
          v-model="model"
          :suggestions="suggestions"
          :optionLabel="props.optionLabel"
          @complete="search"
          multiple
          class="w-full"
        />
      </IconField>
      <label :for="props.field">{{ props.label }}</label>
    </FloatLabel>
    <Message v-if="error" severity="error" variant="simple" size="small">{{
      error.message
    }}</Message>
  </div>
</template>