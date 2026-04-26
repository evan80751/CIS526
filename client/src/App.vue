<script setup>
/**
 * @file Main Vue Application
 * @author Evan Jelle
 */
// Import Components
import TopMenu from './components/layout/TopMenu.vue'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
</script>

<template>
  <header></header>
  <nav>
    <TopMenu />
  </nav>
  <main>
    <div>
      <RouterView />
    </div>
  </main>
  <footer></footer>
  <Toast position="bottom-right" />
  <ConfirmDialog />
</template>