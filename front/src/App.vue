<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNav from '@/components/AppNav.vue'
import AppSnackbar from '@/components/AppSnackbar.vue'
</script>

<template>
  <div class="min-h-full flex flex-col">
    <header class="flex flex-wrap items-center gap-4 border-b border-black/10 px-6 py-3">
      <h1 class="text-xl font-semibold">
        Calendar Booking
      </h1>
      <AppNav class="ml-2" />
    </header>
    <main class="flex-1 px-6 py-6">
      <RouterView />
    </main>
    <AppSnackbar />
  </div>
</template>
