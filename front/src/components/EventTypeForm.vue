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

const nameRules = [(v: unknown) => (typeof v === 'string' && v.trim().length > 0) || 'Укажите название']
const durationRules = [(v: unknown) => (typeof v === 'number' && v > 0) || 'Минимум 1 минута']

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
    class="grid gap-4 rounded-lg border border-black/10 bg-surface p-4 shadow-sm md:grid-cols-[1fr_1fr_160px_auto]"
    @submit="onSubmit"
  >
    <FormField v-model="form.name" label="Название" :rules="nameRules" />
    <FormField v-model="form.description" label="Описание" hint="Необязательно" />

    <NumberField.Root
      v-model="form.duration"
      :min="1"
      :max="480"
      :step="5"
      :rules="durationRules"
      class="flex flex-col gap-1"
    >
      <label class="text-sm font-medium">Длительность (мин)</label>
      <div class="flex items-stretch overflow-hidden rounded-md border border-black/15 bg-white">
        <NumberField.Decrement
          class="border-r border-black/10 px-2 text-sm hover:bg-black/5 disabled:opacity-40"
        >
          −
        </NumberField.Decrement>
        <NumberField.Control
          class="w-full bg-transparent px-2 py-1.5 text-center text-sm focus:outline-none"
        />
        <NumberField.Increment
          class="border-l border-black/10 px-2 text-sm hover:bg-black/5 disabled:opacity-40"
        >
          +
        </NumberField.Increment>
      </div>
      <NumberField.Error v-slot="{ errors }">
        <span v-if="errors.length" class="text-xs text-red-600">{{ errors[0] }}</span>
      </NumberField.Error>
    </NumberField.Root>

    <div class="flex items-end">
      <AppButton type="submit" :disabled="props.submitting" block>
        {{ props.submitting ? 'Создание…' : 'Добавить' }}
      </AppButton>
    </div>

    <AppAlert v-if="props.serverError" severity="error" class="md:col-span-4">
      {{ props.serverError }}
    </AppAlert>
  </Form>
</template>
