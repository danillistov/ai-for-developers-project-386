<script setup lang="ts">
import type { Severity } from '@/utils/severity'
import { Snackbar } from '@vuetify/v0'
import { ariaRoleFor, severityClasses } from '@/utils/severity'
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
          class="pointer-events-auto flex min-w-[260px] max-w-sm items-start gap-3 rounded-md border bg-surface px-3 py-2 text-sm shadow-lg"
          :class="severityClasses[item.severity as Severity] ?? severityClasses.info"
        >
          <Snackbar.Content class="flex flex-1 flex-col">
            <span class="font-medium">{{ item.subject }}</span>
            <span v-if="item.body" class="text-xs opacity-80">{{ item.body }}</span>
          </Snackbar.Content>
          <Snackbar.Close
            aria-label="Закрыть уведомление"
            class="rounded p-1 text-xs opacity-70 hover:bg-black/5 hover:opacity-100"
          >
            ×
          </Snackbar.Close>
        </Snackbar.Root>
      </Snackbar.Queue>
    </div>
  </Snackbar.Portal>
</template>
