<script setup lang="ts">
import type { EventTypeCreate } from '@/services/api'
import { Form, NumberField } from '@vuetify/v0'
import { reactive, shallowRef } from 'vue'
import AppAlert from '@/components/AppAlert.vue'
import AppButton from '@/components/AppButton.vue'
import FormField from '@/components/FormField.vue'

const props = defineProps<{
  submitting?: boolean
  serverError?: string | null
}>()

const emit = defineEmits<{
  submit: [value: EventTypeCreate]
}>()

const form = reactive({
  name: '',
  description: '',
  duration: 30 as number | null,
})

const valid = shallowRef<boolean | null>(null)

const nameRules = [
  (v: unknown) => (typeof v === 'string' && v.trim().length > 0) || 'Укажите название',
]
const durationRules = [
  (v: unknown) => (typeof v === 'number' && v > 0) || 'Минимум 1 минута',
]

function onSubmit(e: { valid: boolean }) {
  if (!e.valid || !form.duration)
    return
  emit('submit', {
    name: form.name.trim(),
    description: form.description.trim() || undefined,
    duration: form.duration,
  })
}
</script>

<template>
  <Form
    v-model="valid"
    class="bento flex flex-col gap-5"
    @submit="onSubmit"
  >
    <header class="flex flex-col gap-1">
      <span class="eyebrow">Новый тип</span>
      <h3 class="font-display text-2xl text-ink">
        Добавить услугу
      </h3>
      <p class="text-sm text-ink-soft">
        Название появится на главной у гостей сразу после сохранения.
      </p>
    </header>

    <div class="grid gap-4 md:grid-cols-[1.2fr_1.6fr_160px]">
      <FormField
        v-model="form.name"
        label="Название"
        placeholder="Например, «Консультация»"
        :rules="nameRules"
      />
      <FormField
        v-model="form.description"
        label="Описание"
        hint="Короткий поясняющий текст (необязательно)"
      />

      <NumberField.Root
        v-model="form.duration"
        :min="1"
        :max="480"
        :step="5"
        :rules="durationRules"
        class="flex flex-col gap-1.5"
      >
        <label class="eyebrow">Длительность</label>
        <div class="flex items-stretch overflow-hidden rounded-xl border hairline bg-surface-elevated">
          <NumberField.Decrement
            class="flex w-10 items-center justify-center border-r hairline text-ink-soft transition-colors hover:bg-surface-muted disabled:opacity-40"
            aria-label="Уменьшить"
          >
            −
          </NumberField.Decrement>
          <NumberField.Control
            class="w-full bg-transparent px-2 py-2 text-center text-sm font-medium text-ink focus:outline-none"
          />
          <NumberField.Increment
            class="flex w-10 items-center justify-center border-l hairline text-ink-soft transition-colors hover:bg-surface-muted disabled:opacity-40"
            aria-label="Увеличить"
          >
            +
          </NumberField.Increment>
        </div>
        <NumberField.Description class="text-xs text-ink-faint">
          минут на одну встречу
        </NumberField.Description>
        <NumberField.Error v-slot="{ errors }">
          <span v-if="errors.length" class="text-xs text-red-700">{{ errors[0] }}</span>
        </NumberField.Error>
      </NumberField.Root>
    </div>

    <AppAlert v-if="props.serverError" severity="error">
      {{ props.serverError }}
    </AppAlert>

    <div class="flex items-center justify-end border-t hairline pt-4">
      <AppButton type="submit" variant="primary" size="lg" :disabled="props.submitting">
        {{ props.submitting ? 'Сохраняем…' : 'Добавить тип' }}
        <template v-if="!props.submitting" #trailing>
          <svg
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
            class="h-3.5 w-3.5" aria-hidden="true"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </template>
      </AppButton>
    </div>
  </Form>
</template>
