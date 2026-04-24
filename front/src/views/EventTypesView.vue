<script setup lang="ts">
import type { EventTypeCreate } from '@/services/api'
import { useMutation, useQuery, useQueryCache } from '@pinia/colada'
import { reactive } from 'vue'
import { RouterLink } from 'vue-router'
import { eventTypesApi } from '@/services/api'

const queryCache = useQueryCache()

const { data, isLoading, error } = useQuery({
  key: ['event-types'],
  query: () => eventTypesApi.list(),
})

const form = reactive<EventTypeCreate>({
  name: '',
  description: '',
  duration: 30,
})

const { mutate: create, isLoading: creating, error: createError } = useMutation({
  mutation: (body: EventTypeCreate) => eventTypesApi.create(body),
  onSuccess: () => {
    queryCache.invalidateQueries({ key: ['event-types'] })
    form.name = ''
    form.description = ''
    form.duration = 30
  },
})

function submit() {
  if (!form.name.trim())
    return
  create({
    name: form.name.trim(),
    description: form.description?.trim() || undefined,
    duration: Number(form.duration),
  })
}
</script>

<template>
  <section class="flex flex-col gap-6">
    <header>
      <h2 class="text-2xl font-semibold">
        Event types
      </h2>
      <p class="text-sm opacity-75">
        Справочник типов событий. Доступен и владельцу (для администрирования), и гостям (для бронирования).
      </p>
    </header>

    <form class="grid gap-3 rounded-md border border-black/10 p-4 md:grid-cols-[1fr_1fr_120px_auto]" @submit.prevent="submit">
      <label class="flex flex-col gap-1 text-sm">
        <span>Название</span>
        <input v-model="form.name" required class="rounded border border-black/15 px-2 py-1">
      </label>
      <label class="flex flex-col gap-1 text-sm">
        <span>Описание</span>
        <input v-model="form.description" class="rounded border border-black/15 px-2 py-1">
      </label>
      <label class="flex flex-col gap-1 text-sm">
        <span>Длительность (мин)</span>
        <input v-model.number="form.duration" type="number" min="1" required class="rounded border border-black/15 px-2 py-1">
      </label>
      <button
        type="submit"
        :disabled="creating"
        class="self-end rounded bg-primary px-4 py-1.5 text-on-primary text-sm disabled:opacity-50"
      >
        {{ creating ? 'Создание…' : 'Добавить' }}
      </button>
      <p v-if="createError" class="text-sm text-red-600 md:col-span-4">
        {{ createError.message }}
      </p>
    </form>

    <div>
      <p v-if="isLoading" class="text-sm opacity-70">
        Загрузка…
      </p>
      <p v-else-if="error" class="text-sm text-red-600">
        {{ error.message }}
      </p>
      <p v-else-if="!data || data.length === 0" class="text-sm opacity-70">
        Пока пусто.
      </p>
      <ul v-else class="grid gap-3 md:grid-cols-2">
        <li v-for="et in data" :key="et.id" class="flex flex-col gap-1 rounded-md border border-black/10 p-3">
          <div class="flex items-baseline justify-between gap-2">
            <span class="font-medium">{{ et.name }}</span>
            <span class="text-xs opacity-60">{{ et.duration }} мин</span>
          </div>
          <p v-if="et.description" class="text-sm opacity-75">
            {{ et.description }}
          </p>
          <RouterLink
            :to="{ name: 'event-type-slots', params: { id: et.id } }"
            class="mt-1 text-sm text-primary hover:underline"
          >
            Посмотреть слоты →
          </RouterLink>
        </li>
      </ul>
    </div>
  </section>
</template>
