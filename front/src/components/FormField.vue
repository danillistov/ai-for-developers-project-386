<script setup lang="ts">
import { Input } from '@vuetify/v0'

defineProps<{
  modelValue: string
  label: string
  type?: string
  rules?: Array<(v: unknown) => boolean | string>
  hint?: string
}>()

defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <Input.Root
    :model-value="modelValue"
    :rules="rules"
    class="flex flex-col gap-1"
    @update:model-value="$emit('update:modelValue', String($event ?? ''))"
  >
    <label class="text-sm font-medium">{{ label }}</label>
    <Input.Control
      :type="type"
      class="rounded-md border border-black/15 bg-white px-3 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
    />
    <Input.Description v-if="hint" class="text-xs opacity-60">
      {{ hint }}
    </Input.Description>
    <Input.Error v-slot="{ errors }">
      <span v-if="errors.length" class="text-xs text-red-600">{{ errors[0] }}</span>
    </Input.Error>
  </Input.Root>
</template>
