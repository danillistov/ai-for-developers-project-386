<script setup lang="ts">
import { useQuery } from '@pinia/colada'
import { computed } from 'vue'
import AppAlert from '@/components/AppAlert.vue'
import AppButton from '@/components/AppButton.vue'
import AppEmptyState from '@/components/AppEmptyState.vue'
import EventTypeCard from '@/components/EventTypeCard.vue'
import SectionHeader from '@/components/SectionHeader.vue'
import SkeletonBlock from '@/components/SkeletonBlock.vue'
import StatTile from '@/components/StatTile.vue'
import { eventTypesApi } from '@/services/api'

const { data, isLoading, error, refresh } = useQuery({
  key: ['event-types'],
  query: () => eventTypesApi.list(),
})

const featured = computed(() => data.value?.[0] ?? null)
const rest = computed(() => (data.value ?? []).slice(1))

const totalDuration = computed(
  () => (data.value ?? []).reduce((sum, et) => sum + et.duration, 0),
)

const average = computed(() => {
  const list = data.value ?? []
  if (list.length === 0)
    return 0
  return Math.round(totalDuration.value / list.length)
})

const shortest = computed(() => {
  const list = data.value ?? []
  if (list.length === 0)
    return null
  return list.reduce((min, et) => (et.duration < min.duration ? et : min), list[0])
})
</script>

<template>
  <section class="flex flex-col gap-8">
    <SectionHeader
      eyebrow="Каталог"
      title="Запишитесь на встречу"
      description="Выберите тип события — мы покажем свободные окна на ближайшие 14 дней и забронируем одно из них за пару шагов."
    />

    <!-- loading skeletons -->
    <div v-if="isLoading && !data" class="grid gap-4 lg:grid-cols-3" aria-hidden="true">
      <div v-for="i in 3" :key="i" class="bento flex flex-col gap-3">
        <SkeletonBlock height="14px" width="40%" />
        <SkeletonBlock height="32px" width="80%" />
        <SkeletonBlock height="60px" />
      </div>
    </div>

    <AppAlert v-else-if="error" severity="error">
      Не удалось загрузить типы событий: {{ error.message }}
      <template #action>
        <AppButton variant="ghost" size="sm" @click="refresh()">
          Повторить
        </AppButton>
      </template>
    </AppAlert>

    <AppEmptyState
      v-else-if="!data || data.length === 0"
      padding="lg"
      title="Каталог пока пуст"
    >
      Владелец ещё не добавил ни одного типа события. Загляните позже.
    </AppEmptyState>

    <template v-else>
      <!-- Bento hero: featured + stats tiles -->
      <div class="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <EventTypeCard
          v-if="featured"
          :event-type="featured"
          variant="feature"
        />

        <div class="flex flex-col gap-4">
          <div class="bento flex flex-col gap-3">
            <span class="eyebrow">Обзор каталога</span>
            <p class="font-display text-3xl text-ink">
              {{ data.length }} {{ data.length === 1 ? 'тип' : data.length < 5 ? 'типа' : 'типов' }}
            </p>
            <p class="text-sm text-ink-soft">
              Сейчас доступно {{ data.length }} услуг общей длительностью
              <strong class="text-ink">{{ totalDuration }}</strong> минут.
            </p>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <StatTile
              label="Средняя"
              :value="`${average}′`"
              hint="мин на встречу"
            />
            <StatTile
              label="Кратчайшая"
              :value="shortest ? `${shortest.duration}′` : '—'"
              :hint="shortest?.name"
            />
          </div>
        </div>
      </div>

      <!-- Rest of the catalog -->
      <div v-if="rest.length > 0" class="flex flex-col gap-4">
        <div class="flex items-end justify-between border-b hairline pb-2">
          <div>
            <span class="eyebrow">Также доступно</span>
            <h3 class="font-display text-2xl text-ink">
              Весь каталог
            </h3>
          </div>
          <span class="text-xs text-ink-faint">
            {{ rest.length }} {{ rest.length === 1 ? 'карточка' : 'карточек' }}
          </span>
        </div>

        <div
          class="grid gap-4"
          style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));"
        >
          <EventTypeCard
            v-for="et in rest"
            :key="et.id"
            :event-type="et"
            variant="guest"
          />
        </div>
      </div>
    </template>
  </section>
</template>
