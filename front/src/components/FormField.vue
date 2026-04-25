<script setup lang="ts">
import { Input } from '@vuetify/v0'

defineProps<{
  modelValue: string
  label: string
  type?: string
  rules?: Array<(v: unknown) => boolean | string>
  hint?: string
  placeholder?: string
}>()

defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <Input.Root
    :model-value="modelValue"
    :rules="rules"
    class="flex flex-col gap-1.5"
    @update:model-value="$emit('update:modelValue', String($event ?? ''))"
  >
    <label class="eyebrow">{{ label }}</label>
    <Input.Control
      :type="type"
      :placeholder="placeholder"
      class="rounded-xl border hairline bg-surface-elevated px-3.5 py-2.5 text-sm text-ink transition-colors placeholder:text-ink-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
    />
    <Input.Description v-if="hint" class="text-xs text-ink-faint">
      {{ hint }}
    </Input.Description>
    <Input.Error v-slot="{ errors }">
      <span v-if="errors.length" class="text-xs text-red-700">{{ errors[0] }}</span>
    </Input.Error>
  </Input.Root>
</template>
