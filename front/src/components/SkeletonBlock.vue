<script setup lang="ts">
withDefaults(defineProps<{
  height?: string
  width?: string
  rounded?: string
}>(), { height: '1rem', width: '100%', rounded: '8px' })
</script>

<template>
  <div
    class="skeleton"
    role="status"
    aria-label="Загрузка"
    :style="{ height, width, borderRadius: rounded }"
  />
</template>
