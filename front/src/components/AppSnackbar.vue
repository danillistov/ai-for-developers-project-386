<script setup lang="ts">
import { Snackbar } from '@vuetify/v0'

const severityClasses: Record<string, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error: 'border-red-200 bg-red-50 text-red-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  info: 'border-sky-200 bg-sky-50 text-sky-800',
}
</script>

<template>
  <Snackbar.Portal>
    <div class="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <Snackbar.Queue v-slot="{ items }">
        <Snackbar.Root
          v-for="item in items"
          :id="item.id"
          :key="item.id"
          :role="item.severity === 'error' || item.severity === 'warning' ? 'alert' : 'status'"
          class="pointer-events-auto flex min-w-[260px] max-w-sm items-start gap-3 rounded-md border bg-surface px-3 py-2 text-sm shadow-lg"
          :class="severityClasses[item.severity as string] ?? severityClasses.info"
        >
          <Snackbar.Content class="flex flex-1 flex-col">
            <span class="font-medium">{{ item.subject }}</span>
            <span v-if="item.body" class="text-xs opacity-80">{{ item.body }}</span>
          </Snackbar.Content>
          <Snackbar.Close class="rounded p-1 text-xs opacity-70 hover:bg-black/5 hover:opacity-100">
            ×
          </Snackbar.Close>
        </Snackbar.Root>
      </Snackbar.Queue>
    </div>
  </Snackbar.Portal>
</template>
