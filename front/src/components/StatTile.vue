<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  hint?: string
}>()
</script>

<template>
  <div class="flex flex-col gap-1 rounded-xl border hairline bg-surface-elevated p-3">
    <span class="eyebrow">{{ label }}</span>
    <span class="font-display text-3xl leading-none text-ink">{{ value }}</span>
    <span v-if="hint" class="text-xs text-ink-faint">{{ hint }}</span>
  </div>
</template>
