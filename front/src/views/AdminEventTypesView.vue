<script setup lang="ts">
import type { EventTypeCreate } from '@/services/api'
import { useMutation, useQuery, useQueryCache } from '@pinia/colada'
import { ref } from 'vue'
import AppAlert from '@/components/AppAlert.vue'
import AppEmptyState from '@/components/AppEmptyState.vue'
import EventTypeCard from '@/components/EventTypeCard.vue'
import EventTypeForm from '@/components/EventTypeForm.vue'
import { useNotify } from '@/composables/useNotify'
import { eventTypesApi } from '@/services/api'

const queryCache = useQueryCache()
const notify = useNotify()
const formKey = ref(0)

const { data, isLoading, error } = useQuery({
  key: ['event-types'],
  query: () => eventTypesApi.list(),
})

const { mutate: create, isLoading: creating, error: createError } = useMutation({
  mutation: (body: EventTypeCreate) => eventTypesApi.create(body),
  onSuccess: (created) => {
    queryCache.invalidateQueries({ key: ['event-types'] })
    formKey.value++
    notify.success('Тип события создан', `${created.name} · ${created.duration} мин`)
  },
  onError: err => notify.error('Не удалось создать тип', err.message),
})
</script>

<template>
  <section class="flex flex-col gap-6">
    <header class="flex items-start justify-between gap-4">
      <div>
        <h2 class="text-2xl font-semibold">
          Типы событий
        </h2>
        <p class="text-sm opacity-75">
          Каталог, который гости видят на главной. Укажите название, описание и длительность.
        </p>
      </div>
    </header>

    <EventTypeForm
      :key="formKey"
      :submitting="creating"
      :server-error="createError ? createError.message : null"
      @submit="create"
    />

    <div>
      <h3 class="mb-2 text-sm font-medium opacity-70">
        Существующие типы
      </h3>
      <p v-if="isLoading && !data" class="text-sm opacity-70" role="status" aria-live="polite">
        Загрузка…
      </p>
      <AppAlert v-else-if="error" severity="error">
        {{ error.message }}
      </AppAlert>
      <AppEmptyState v-else-if="!data || data.length === 0">
        Пока пусто — добавьте первый тип.
      </AppEmptyState>
      <div
        v-else
        class="grid gap-3"
        style="grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));"
      >
        <EventTypeCard
          v-for="et in data"
          :key="et.id"
          :event-type="et"
          variant="owner"
        />
      </div>
    </div>
  </section>
</template>
