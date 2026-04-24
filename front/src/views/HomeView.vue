<script setup lang="ts">
import { useQuery } from '@pinia/colada'
import EventTypeCard from '@/components/EventTypeCard.vue'
import { eventTypesApi } from '@/services/api'

const { data, isLoading, error, refresh } = useQuery({
  key: ['event-types'],
  query: () => eventTypesApi.list(),
})
</script>

<template>
  <section class="flex flex-col gap-6">
    <header>
      <h2 class="text-2xl font-semibold">
        Запишитесь на встречу
      </h2>
      <p class="mt-1 text-sm opacity-75">
        Выберите тип события — мы покажем свободные слоты на ближайшие 14 дней.
      </p>
    </header>

    <div v-if="isLoading && !data" class="text-sm opacity-70">
      Загрузка каталога…
    </div>
    <div
      v-else-if="error"
      class="flex items-start justify-between gap-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
      role="alert"
    >
      <span>Не удалось загрузить типы событий: {{ error.message }}</span>
      <button class="underline" type="button" @click="refresh()">
        Повторить
      </button>
    </div>
    <div
      v-else-if="!data || data.length === 0"
      class="rounded-md border border-dashed border-black/10 p-8 text-center text-sm opacity-70"
    >
      Владелец ещё не добавил ни одного типа события.
    </div>
    <div
      v-else
      class="grid gap-4"
      style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));"
    >
      <EventTypeCard
        v-for="et in data"
        :key="et.id"
        :event-type="et"
        variant="guest"
      />
    </div>
  </section>
</template>
