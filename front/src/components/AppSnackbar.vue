<script setup lang="ts">
import type { Severity } from '@/utils/severity'
import { Snackbar } from '@vuetify/v0'
import { ariaRoleFor } from '@/utils/severity'

const severityDot: Record<Severity, string> = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  warning: 'bg-amber-500',
  info: 'bg-sky-500',
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
          :role="ariaRoleFor(item.severity as Severity)"
          class="pointer-events-auto flex min-w-[280px] max-w-sm items-start gap-3 rounded-xl border hairline bg-surface-elevated px-4 py-3 text-sm text-ink shadow-[0_12px_32px_-16px_rgba(20,20,20,0.35)]"
        >
          <span
            class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
            :class="severityDot[item.severity as Severity] ?? severityDot.info"
            aria-hidden="true"
          />
          <Snackbar.Content class="flex flex-1 flex-col">
            <span class="font-medium">{{ item.subject }}</span>
            <span v-if="item.body" class="mt-0.5 text-xs text-ink-soft">
              {{ item.body }}
            </span>
          </Snackbar.Content>
          <Snackbar.Close
            aria-label="Закрыть уведомление"
            class="rounded-full p-1 text-ink-faint transition-colors hover:bg-surface-muted hover:text-ink"
          >
            <svg
              viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
              class="h-3.5 w-3.5" aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </Snackbar.Close>
        </Snackbar.Root>
      </Snackbar.Queue>
    </div>
  </Snackbar.Portal>
</template>
