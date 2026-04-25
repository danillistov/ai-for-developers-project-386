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

const nameRules = [
  (v: unknown) => (typeof v === 'string' && v.trim().length > 0) || 'Укажите имя',
]
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
      class="fixed inset-0 m-auto h-fit max-w-lg rounded-3xl border hairline bg-surface-elevated p-7 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.4)] backdrop:bg-black/40"
    >
      <header class="flex flex-col gap-1 border-b hairline pb-5">
        <span class="eyebrow">Подтверждение</span>
        <Dialog.Title class="font-display text-3xl text-ink">
          Забронировать встречу
        </Dialog.Title>
        <Dialog.Description class="text-sm text-ink-soft">
          Слот удерживается, пока вы заполняете форму. Укажите имя и email — мы пришлём подтверждение.
        </Dialog.Description>
      </header>

      <dl
        v-if="props.eventType && props.slotValue"
        class="mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 rounded-2xl border hairline bg-surface p-4 text-sm"
      >
        <dt class="eyebrow mt-1">
          Тип
        </dt>
        <dd class="font-display text-lg text-ink">
          {{ props.eventType.name }}
          <span class="ml-1 text-sm text-ink-faint">· {{ props.eventType.duration }} мин</span>
        </dd>
        <dt class="eyebrow mt-1">
          Начало
        </dt>
        <dd class="font-medium text-ink">
          {{ formatDateTime(props.slotValue.startTime) }}
        </dd>
        <dt class="eyebrow mt-1">
          Окончание
        </dt>
        <dd class="font-medium text-ink">
          {{ formatTime(props.slotValue.endTime) }}
        </dd>
      </dl>

      <Form
        v-model="valid"
        class="mt-5 flex flex-col gap-4"
        @submit="onSubmit"
      >
        <FormField
          v-model="form.guestName"
          label="Имя"
          placeholder="Как к вам обращаться?"
          :rules="nameRules"
        />
        <FormField
          v-model="form.guestEmail"
          label="Email"
          type="email"
          placeholder="you@example.com"
          :rules="emailRules"
        />

        <AppAlert v-if="props.serverError" severity="error">
          {{ props.serverError }}
        </AppAlert>

        <div class="mt-3 flex justify-end gap-2 border-t hairline pt-4">
          <Dialog.Close as-child>
            <AppButton variant="outline" :disabled="props.submitting">
              Отмена
            </AppButton>
          </Dialog.Close>
          <AppButton type="submit" variant="primary" :disabled="props.submitting">
            {{ props.submitting ? 'Бронируем…' : 'Подтвердить' }}
          </AppButton>
        </div>
      </Form>
    </Dialog.Content>
  </Dialog.Root>
</template>
