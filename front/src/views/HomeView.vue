<script setup lang="ts">
import { useQuery } from '@pinia/colada'
import { eventTypesApi } from '@/services/api'

const { data, isLoading, error, refresh } = useQuery({
  key: ['event-types'],
  query: () => eventTypesApi.list(),
})
</script>

<template>
  <section class="flex flex-col gap-4">
    <div>
      <h2 class="text-2xl font-semibold">
        Calendar Booking
      </h2>
      <p class="mt-1 text-sm opacity-80">
        Одно-пользовательское бронирование. Стек: Vue 3 · Pinia Colada · Vuetify0 · Prism mock.
      </p>
    </div>

    <div class="rounded-md border border-black/10 p-4">
      <div class="mb-2 flex items-center gap-3">
        <h3 class="text-lg font-medium">
          Event types
        </h3>
        <button
          class="rounded bg-primary px-3 py-1 text-on-primary text-sm"
          @click="refresh()"
        >
          Обновить
        </button>
      </div>

      <p v-if="isLoading" class="text-sm opacity-70">
        Загрузка…
      </p>
      <p v-else-if="error" class="text-sm text-red-600">
        Ошибка: {{ error.message }}
      </p>
      <p v-else-if="!data || data.length === 0" class="text-sm opacity-70">
        Типов событий пока нет.
      </p>
      <ul v-else class="flex flex-col gap-2">
        <li v-for="et in data" :key="et.id" class="border-t border-black/5 pt-2 first:border-0 first:pt-0">
          <div class="font-medium">
            {{ et.name }}
            <span class="ml-2 text-xs opacity-60">{{ et.duration }} мин</span>
          </div>
          <div v-if="et.description" class="text-sm opacity-75">
            {{ et.description }}
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
