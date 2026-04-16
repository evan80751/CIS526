<script setup>
/**
 * @file Theme toggle button
 * @author Evan Jelle
 */

// Import Libraries
import { ref } from 'vue'

// Get theme from localStorage
const getTheme = function () {
  return localStorage.getItem('user-theme')
}

// Get browser media preference
const getMediaPreference = function () {
  const hasDarkPreference = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (hasDarkPreference) {
    return 'dark-theme'
  } else {
    return 'light-theme'
  }
}

// Set theme on page
const setTheme = function () {
  localStorage.setItem('user-theme', theme.value)
  if (theme.value === 'dark-theme') {
    document.documentElement.classList.add('app-dark-mode')
  } else {
    document.documentElement.classList.remove('app-dark-mode')
  }
}

// Toggle theme
const toggleDarkMode = function () {
  if (theme.value === 'dark-theme') {
    theme.value = 'light-theme'
  } else {
    theme.value = 'dark-theme'
  }
  setTheme()
}

const theme = ref(getTheme() || getMediaPreference())
setTheme()
</script>

<template>
  <div class="p-menubar-item">
    <div class="p-menubar-item-content">
      <a @click="toggleDarkMode" class="p-menubar-item-link">
        <span v-if="theme == 'light-theme'" v-tooltip.bottom="'Toggle Dark Mode'" class="p-menubar-item-label">Dark</span>
        <span v-else v-tooltip.bottom="'Toggle Light Mode'" class="p-menubar-item-label">Light</span>
      </a>
    </div>
  </div>
</template>