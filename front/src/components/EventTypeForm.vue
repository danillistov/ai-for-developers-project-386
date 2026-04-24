<script setup lang="ts">
import type { EventTypeCreate } from '@/services/api'
import { Button, Form, Input, NumberField } from '@vuetify/v0'
import { reactive, shallowRef } from 'vue'

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

function onSubmit(e: { valid: boolean }) {
  if (!e.valid || !form.duration)
    return
  emit('submit', {
    name: form.name.trim(),
    description: form.description.trim() || undefined,
    duration: form.duration,
  })
}

function resetForm() {
  form.name = ''
  form.description = ''
  form.duration = 30
  valid.value = null
}

defineExpose({ reset: resetForm })
</script>

<template>
  <Form
    v-model="valid"
    class="grid gap-4 rounded-lg border border-black/10 bg-surface p-4 shadow-sm md:grid-cols-[1fr_1fr_160px_auto]"
    @submit="onSubmit"
  >
    <Input.Root
      v-model="form.name"
      :rules="[(v: unknown) => (typeof v === 'string' && v.trim().length > 0) || 'Укажите название']"
      class="flex flex-col gap-1"
    >
      <label class="text-sm font-medium">Название</label>
      <Input.Control
        class="rounded-md border border-black/15 bg-white px-3 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
      <Input.Error v-slot="{ errors }">
        <span v-if="errors.length" class="text-xs text-red-600">{{ errors[0] }}</span>
      </Input.Error>
    </Input.Root>

    <Input.Root
      v-model="form.description"
      class="flex flex-col gap-1"
    >
      <label class="text-sm font-medium">Описание</label>
      <Input.Control
        class="rounded-md border border-black/15 bg-white px-3 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
      <Input.Description class="text-xs opacity-60">
        Необязательно
      </Input.Description>
    </Input.Root>

    <NumberField.Root
      v-model="form.duration"
      :min="1"
      :max="480"
      :step="5"
      :rules="[(v: unknown) => (typeof v === 'number' && v > 0) || 'Минимум 1 минута']"
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
      <Button.Root
        type="submit"
        :disabled="props.submitting"
        class="inline-flex h-[34px] w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-on-primary shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50 md:w-auto"
      >
        <Button.Content>
          {{ props.submitting ? 'Создание…' : 'Добавить' }}
        </Button.Content>
      </Button.Root>
    </div>

    <p
      v-if="props.serverError"
      class="text-sm text-red-600 md:col-span-4"
      role="alert"
    >
      {{ props.serverError }}
    </p>
  </Form>
</template>
