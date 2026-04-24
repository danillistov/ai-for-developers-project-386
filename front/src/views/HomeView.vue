<script setup lang="ts">
import { useQuery } from '@pinia/colada'
import AppAlert from '@/components/AppAlert.vue'
import AppButton from '@/components/AppButton.vue'
import AppEmptyState from '@/components/AppEmptyState.vue'
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

    <p v-if="isLoading && !data" class="text-sm opacity-70" role="status" aria-live="polite">
      Загрузка каталога…
    </p>
    <AppAlert v-else-if="error" severity="error">
      Не удалось загрузить типы событий: {{ error.message }}
      <template #action>
        <AppButton variant="ghost" size="sm" @click="refresh()">
          Повторить
        </AppButton>
      </template>
    </AppAlert>
    <AppEmptyState v-else-if="!data || data.length === 0" padding="lg">
      Владелец ещё не добавил ни одного типа события.
    </AppEmptyState>
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
