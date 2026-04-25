<script setup lang="ts">
import type { EventTypeCreate } from '@/services/api'
import { useMutation, useQuery, useQueryCache } from '@pinia/colada'
import { computed, ref } from 'vue'
import AppAlert from '@/components/AppAlert.vue'
import AppEmptyState from '@/components/AppEmptyState.vue'
import EventTypeCard from '@/components/EventTypeCard.vue'
import EventTypeForm from '@/components/EventTypeForm.vue'
import SectionHeader from '@/components/SectionHeader.vue'
import SkeletonBlock from '@/components/SkeletonBlock.vue'
import StatTile from '@/components/StatTile.vue'
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

const totalDuration = computed(
  () => (data.value ?? []).reduce((sum, et) => sum + et.duration, 0),
)

const average = computed(() => {
  const list = data.value ?? []
  if (list.length === 0)
    return 0
  return Math.round(totalDuration.value / list.length)
})
</script>

<template>
  <section class="flex flex-col gap-8">
    <SectionHeader
      eyebrow="Администратор"
      title="Event types"
      description="Каталог услуг, который гости видят на главной. Добавляйте новые типы, редактируйте описания, следите за общей длительностью."
    />

    <!-- overview stats -->
    <div class="grid gap-3 md:grid-cols-4">
      <StatTile
        label="Всего"
        :value="data?.length ?? 0"
        hint="активных типов"
      />
      <StatTile
        label="Сумма"
        :value="`${totalDuration}′`"
        hint="минут в каталоге"
      />
      <StatTile
        label="Средняя"
        :value="`${average}′`"
        hint="на одну встречу"
      />
      <StatTile
        label="Окно"
        value="14"
        hint="дней на бронирование"
      />
    </div>

    <EventTypeForm
      :key="formKey"
      :submitting="creating"
      :server-error="createError ? createError.message : null"
      @submit="create"
    />

    <div class="flex flex-col gap-4">
      <div class="flex items-end justify-between border-b hairline pb-2">
        <div>
          <span class="eyebrow">Каталог</span>
          <h3 class="font-display text-2xl text-ink">
            Существующие типы
          </h3>
        </div>
        <span v-if="data && data.length > 0" class="text-xs text-ink-faint">
          {{ data.length }} шт.
        </span>
      </div>

      <div
        v-if="isLoading && !data"
        class="grid gap-4"
        style="grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));"
        aria-hidden="true"
      >
        <div v-for="i in 3" :key="i" class="bento flex flex-col gap-3">
          <SkeletonBlock height="12px" width="40%" />
          <SkeletonBlock height="24px" width="70%" />
          <SkeletonBlock height="60px" />
        </div>
      </div>
      <AppAlert v-else-if="error" severity="error">
        {{ error.message }}
      </AppAlert>
      <AppEmptyState
        v-else-if="!data || data.length === 0"
        title="Пока пусто"
      >
        Добавьте первый тип — он появится здесь и у гостей на главной.
      </AppEmptyState>
      <div
        v-else
        class="grid gap-4"
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
