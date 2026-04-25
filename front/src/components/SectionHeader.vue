<script setup lang="ts">
withDefaults(defineProps<{
  eyebrow?: string
  title: string
  description?: string
}>(), {})
</script>

<template>
  <header class="flex flex-col gap-1">
    <span v-if="eyebrow" class="eyebrow">{{ eyebrow }}</span>
    <h2 class="font-display text-3xl text-ink md:text-4xl">
      {{ title }}
    </h2>
    <p v-if="description" class="mt-1 max-w-xl text-sm text-ink-soft">
      {{ description }}
    </p>
    <slot />
  </header>
</template>
