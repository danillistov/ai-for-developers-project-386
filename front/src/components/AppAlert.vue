<script setup lang="ts">
import type { Severity } from '@/utils/severity'
import { ariaRoleFor, severityClasses } from '@/utils/severity'

const props = withDefaults(defineProps<{
  severity?: Severity
}>(), { severity: 'error' })
</script>

<template>
  <div
    :role="ariaRoleFor(props.severity)"
    class="flex items-start justify-between gap-3 rounded-md border p-3 text-sm"
    :class="severityClasses[props.severity]"
  >
    <div class="flex-1">
      <slot />
    </div>
    <div v-if="$slots.action" class="shrink-0">
      <slot name="action" />
    </div>
  </div>
</template>
