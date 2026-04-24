<script setup lang="ts">
withDefaults(defineProps<{
  padding?: 'sm' | 'md' | 'lg'
}>(), { padding: 'md' })
</script>

<template>
  <div
    class="rounded-md border border-dashed border-black/10 text-center text-sm opacity-70"
    :class="{
      'p-3': padding === 'sm',
      'p-6': padding === 'md',
      'p-8': padding === 'lg',
    }"
  >
    <slot />
  </div>
</template>
