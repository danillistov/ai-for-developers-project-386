<script setup lang="ts">
import type { Component } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { Button } from '@vuetify/v0'
import { computed } from 'vue'

type Variant = 'primary' | 'outline' | 'ghost'
type Size = 'sm' | 'md'

const props = withDefaults(defineProps<{
  variant?: Variant
  size?: Size
  as?: string | Component
  to?: RouteLocationRaw
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  block?: boolean
}>(), { variant: 'primary', size: 'md', type: 'button', block: false })

const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50'

const variantClass: Record<Variant, string> = {
  primary: 'bg-primary text-on-primary shadow-sm hover:opacity-90',
  outline: 'border border-black/10 hover:bg-black/5',
  ghost: 'hover:bg-black/5',
}

const sizeClass: Record<Size, string> = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-4 py-1.5 text-sm',
}

const classes = computed(() => [
  base,
  variantClass[props.variant],
  sizeClass[props.size],
  props.block && 'w-full',
])
</script>

<template>
  <Button.Root
    :as="as"
    :to="to"
    :type="as ? undefined : type"
    :disabled="disabled"
    :class="classes"
  >
    <Button.Content>
      <slot />
    </Button.Content>
  </Button.Root>
</template>
