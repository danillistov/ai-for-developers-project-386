<script setup lang="ts">
import type { Severity } from '@/utils/severity'
import { ariaRoleFor } from '@/utils/severity'

const props = withDefaults(defineProps<{
  severity?: Severity
}>(), { severity: 'error' })

const severityStyles: Record<Severity, { dot: string, text: string, ring: string }> = {
  success: {
    dot: 'bg-emerald-500',
    text: 'text-emerald-800',
    ring: 'ring-emerald-200 bg-emerald-50/70',
  },
  error: {
    dot: 'bg-red-500',
    text: 'text-red-800',
    ring: 'ring-red-200 bg-red-50/70',
  },
  warning: {
    dot: 'bg-amber-500',
    text: 'text-amber-900',
    ring: 'ring-amber-200 bg-amber-50/70',
  },
  info: {
    dot: 'bg-sky-500',
    text: 'text-sky-800',
    ring: 'ring-sky-200 bg-sky-50/70',
  },
}
</script>

<template>
  <div
    :role="ariaRoleFor(props.severity)"
    class="flex items-start justify-between gap-3 rounded-xl p-3 text-sm ring-1"
    :class="[severityStyles[props.severity].ring, severityStyles[props.severity].text]"
  >
    <div class="flex flex-1 items-start gap-2.5">
      <span
        class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
        :class="severityStyles[props.severity].dot"
        aria-hidden="true"
      />
      <div class="flex-1">
        <slot />
      </div>
    </div>
    <div v-if="$slots.action" class="shrink-0">
      <slot name="action" />
    </div>
  </div>
</template>
