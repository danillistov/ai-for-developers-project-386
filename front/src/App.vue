<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-full flex flex-col">
    <header class="flex items-center gap-4 border-b border-black/10 px-6 py-4">
      <h1 class="text-xl font-semibold">
        Calendar Booking
      </h1>
      <nav class="flex gap-3 text-sm">
        <RouterLink to="/" class="hover:underline">
          Главная
        </RouterLink>
        <RouterLink to="/event-types" class="hover:underline">
          Event types
        </RouterLink>
        <RouterLink to="/bookings" class="hover:underline">
          Bookings
        </RouterLink>
      </nav>
    </header>
    <main class="flex-1 px-6 py-6">
      <RouterView />
    </main>
  </div>
</template>
