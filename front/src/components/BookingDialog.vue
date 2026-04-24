<script setup lang="ts">
import type { EventType, Slot } from '@/services/api'
import { Dialog, Form } from '@vuetify/v0'
import { reactive, shallowRef, watch } from 'vue'
import AppAlert from '@/components/AppAlert.vue'
import AppButton from '@/components/AppButton.vue'
import FormField from '@/components/FormField.vue'
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

watch(() => props.open, (next) => {
  if (!next) {
    form.guestName = ''
    form.guestEmail = ''
    valid.value = null
  }
})

const nameRules = [(v: unknown) => (typeof v === 'string' && v.trim().length > 0) || 'Укажите имя']
const emailRules = [
  (v: unknown) => (typeof v === 'string' && v.trim().length > 0) || 'Укажите email',
  (v: unknown) => (typeof v === 'string' && /.[^\n\r@\u2028\u2029]*@.+\..+/.test(v)) || 'Некорректный email',
]

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

      <Form
        v-model="valid"
        class="mt-4 flex flex-col gap-3"
        @submit="onSubmit"
      >
        <FormField v-model="form.guestName" label="Имя" :rules="nameRules" />
        <FormField v-model="form.guestEmail" label="Email" type="email" :rules="emailRules" />

        <AppAlert v-if="props.serverError" severity="error">
          {{ props.serverError }}
        </AppAlert>

        <div class="mt-2 flex justify-end gap-2">
          <Dialog.Close as-child>
            <AppButton variant="outline" :disabled="props.submitting">
              Отмена
            </AppButton>
          </Dialog.Close>
          <AppButton type="submit" :disabled="props.submitting">
            {{ props.submitting ? 'Бронируем…' : 'Забронировать' }}
          </AppButton>
        </div>
      </Form>
    </Dialog.Content>
  </Dialog.Root>
</template>
