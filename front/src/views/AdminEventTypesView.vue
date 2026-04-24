<script setup lang="ts">
import type { EventTypeCreate } from '@/services/api'
import { useMutation, useQuery, useQueryCache } from '@pinia/colada'
import { ref } from 'vue'
import EventTypeCard from '@/components/EventTypeCard.vue'
import EventTypeForm from '@/components/EventTypeForm.vue'
import { useNotify } from '@/composables/useNotify'
import { eventTypesApi } from '@/services/api'

const queryCache = useQueryCache()
const notify = useNotify()
const formRef = ref<InstanceType<typeof EventTypeForm> | null>(null)

const { data, isLoading, error } = useQuery({
  key: ['event-types'],
  query: () => eventTypesApi.list(),
})

const { mutate: create, isLoading: creating, error: createError } = useMutation({
  mutation: (body: EventTypeCreate) => eventTypesApi.create(body),
  onSuccess: (created) => {
    queryCache.invalidateQueries({ key: ['event-types'] })
    formRef.value?.reset()
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
      ref="formRef"
      :submitting="creating"
      :server-error="createError ? createError.message : null"
      @submit="create"
    />

    <div>
      <h3 class="mb-2 text-sm font-medium opacity-70">
        Существующие типы
      </h3>
      <p v-if="isLoading && !data" class="text-sm opacity-70">
        Загрузка…
      </p>
      <p
        v-else-if="error"
        class="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        role="alert"
      >
        {{ error.message }}
      </p>
      <p
        v-else-if="!data || data.length === 0"
        class="rounded-md border border-dashed border-black/10 p-6 text-center text-sm opacity-70"
      >
        Пока пусто — добавьте первый тип.
      </p>
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
