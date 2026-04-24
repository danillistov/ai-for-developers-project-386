<script setup lang="ts">
import type { EventType, Slot } from '@/services/api'
import { Button, Dialog, Form, Input } from '@vuetify/v0'
import { reactive, shallowRef, watch } from 'vue'
import { formatDateTime, formatTime } from '@/utils/dates'

const props = defineProps<{
  open: boolean
  eventType: EventType | null
  slotValue: Slot | null
  submitting?: boolean
  serverError?: string | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'confirm': [value: { guestName: string, guestEmail: string }]
}>()

const form = reactive({ guestName: '', guestEmail: '' })
const valid = shallowRef<boolean | null>(null)

watch(
  () => props.open,
  (next) => {
    if (next) {
      form.guestName = ''
      form.guestEmail = ''
      valid.value = null
    }
  },
)

function onSubmit(e: { valid: boolean }) {
  if (!e.valid)
    return
  emit('confirm', {
    guestName: form.guestName.trim(),
    guestEmail: form.guestEmail.trim(),
  })
}

function onOpenUpdate(value: boolean) {
  if (!props.submitting)
    emit('update:open', value)
}
</script>

<template>
  <Dialog.Root :open="props.open" @update:open="onOpenUpdate">
    <Dialog.Content
      class="fixed inset-0 m-auto h-fit max-w-md rounded-lg border border-black/10 bg-surface p-6 shadow-xl backdrop:bg-black/40"
    >
      <Dialog.Title class="text-lg font-semibold">
        Подтверждение брони
      </Dialog.Title>
      <Dialog.Description class="mt-1 text-sm opacity-75">
        Укажите имя и email — бронь на один заранее заданный слот.
      </Dialog.Description>

      <dl
        v-if="props.eventType && props.slotValue"
        class="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-md bg-primary/5 p-3 text-sm"
      >
        <dt class="opacity-60">
          Тип:
        </dt>
        <dd class="font-medium">
          {{ props.eventType.name }} · {{ props.eventType.duration }} мин
        </dd>
        <dt class="opacity-60">
          Начало:
        </dt>
        <dd class="font-medium">
          {{ formatDateTime(props.slotValue.startTime) }}
        </dd>
        <dt class="opacity-60">
          Окончание:
        </dt>
        <dd class="font-medium">
          {{ formatTime(props.slotValue.endTime) }}
        </dd>
      </dl>

      <Form v-model="valid" class="mt-4 flex flex-col gap-3" @submit="onSubmit">
        <Input.Root
          v-model="form.guestName"
          :rules="[(v: unknown) => (typeof v === 'string' && v.trim().length > 0) || 'Укажите имя']"
          class="flex flex-col gap-1"
        >
          <label class="text-sm font-medium">Имя</label>
          <Input.Control
            class="rounded-md border border-black/15 bg-white px-3 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <Input.Error v-slot="{ errors }">
            <span v-if="errors.length" class="text-xs text-red-600">{{ errors[0] }}</span>
          </Input.Error>
        </Input.Root>

        <Input.Root
          v-model="form.guestEmail"
          :rules="[
            (v: unknown) => (typeof v === 'string' && v.trim().length > 0) || 'Укажите email',
            (v: unknown) => (typeof v === 'string' && /.+@.+\..+/.test(v)) || 'Некорректный email',
          ]"
          class="flex flex-col gap-1"
        >
          <label class="text-sm font-medium">Email</label>
          <Input.Control
            type="email"
            class="rounded-md border border-black/15 bg-white px-3 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <Input.Error v-slot="{ errors }">
            <span v-if="errors.length" class="text-xs text-red-600">{{ errors[0] }}</span>
          </Input.Error>
        </Input.Root>

        <p
          v-if="props.serverError"
          class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          role="alert"
        >
          {{ props.serverError }}
        </p>

        <div class="mt-2 flex justify-end gap-2">
          <Dialog.Close
            as-child
          >
            <Button.Root
              type="button"
              :disabled="props.submitting"
              class="rounded-md border border-black/10 px-3 py-1.5 text-sm hover:bg-black/5 disabled:opacity-50"
            >
              <Button.Content>Отмена</Button.Content>
            </Button.Root>
          </Dialog.Close>
          <Button.Root
            type="submit"
            :disabled="props.submitting"
            class="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-on-primary shadow-sm hover:opacity-90 disabled:opacity-50"
          >
            <Button.Content>
              {{ props.submitting ? 'Бронируем…' : 'Забронировать' }}
            </Button.Content>
          </Button.Root>
        </div>
      </Form>
    </Dialog.Content>
  </Dialog.Root>
</template>
