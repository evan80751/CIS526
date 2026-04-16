<script setup>
/**
 * @file Main Vue Application
 * @author Evan Jelle
 */

// Import Components
import TopMenu from './components/layout/TopMenu.vue'
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
</template>