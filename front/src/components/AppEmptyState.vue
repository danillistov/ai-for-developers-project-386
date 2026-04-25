<script setup lang="ts">
withDefaults(defineProps<{
  padding?: 'sm' | 'md' | 'lg'
  title?: string
}>(), { padding: 'md' })
</script>

<template>
  <div
    class="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[color:var(--color-hairline)] bg-surface-elevated/60 text-center"
    :class="{
      'p-4': padding === 'sm',
      'p-8': padding === 'md',
      'p-12': padding === 'lg',
    }"
  >
    <div
      class="flex h-10 w-10 items-center justify-center rounded-full bg-surface-muted text-ink-faint"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"
        class="h-5 w-5"
      >
        <path d="M4 7h16M6 12h12M9 17h6" />
      </svg>
    </div>
    <p v-if="title" class="font-display text-xl text-ink">
      {{ title }}
    </p>
    <div class="text-sm text-ink-soft">
      <slot />
    </div>
  </div>
</template>
