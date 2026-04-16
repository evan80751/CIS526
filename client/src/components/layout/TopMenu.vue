<script setup>
/**
 * @file Top menu bar of the entire application
 * @author Evan Jelle
 */

//Import Libraries
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

// Import Components
import Menubar from 'primevue/menubar'
import ThemeToggle from './ThemeToggle.vue'
import UserProfile from './UserProfile.vue'

// Declare State
const items = ref([
    {
        label: 'Home',
        command: () => { router.push({ name: 'home' }) }
    },
    {
        label: 'About',
        command: () => { router.push({ name: 'about' }) }
    }
])
</script>

<template>
    <div>
        <Menubar :model="items">
            <template #start>
                <img src="https://placehold.co/40x40" alt="Placeholder Logo" />
            </template>
            <template #end>
                <UserProfile />
                <ThemeToggle />
            </template>
        </Menubar>
    </div>
</template>