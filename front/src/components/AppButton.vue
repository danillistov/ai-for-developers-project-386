<script setup lang="ts">
import type { Component } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { Button } from '@vuetify/v0'
import { computed } from 'vue'

type Variant = 'primary' | 'outline' | 'ghost' | 'accent'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
  variant?: Variant
  size?: Size
  as?: string | Component
  to?: RouteLocationRaw
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  block?: boolean
}>(), { variant: 'primary', size: 'md', type: 'button', block: false })

const base
  = 'inline-flex items-center justify-center gap-1.5 rounded-full font-medium '
    + 'transition-colors disabled:cursor-not-allowed disabled:opacity-50 '
    + 'whitespace-nowrap'

const variantClass: Record<Variant, string> = {
  primary: 'bg-primary text-on-primary hover:bg-[#2a2a2a]',
  outline: 'border hairline bg-surface-elevated text-ink hover:bg-surface-muted',
  ghost: 'text-ink-soft hover:bg-surface-muted hover:text-ink',
  accent: 'bg-accent text-white hover:brightness-95',
}

const sizeClass: Record<Size, string> = {
  sm: 'px-3 py-1 text-xs',
  md: 'px-4 py-1.5 text-sm',
  lg: 'px-5 py-2.5 text-sm',
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
    <Button.Content class="flex items-center gap-1.5">
      <slot name="leading" />
      <slot />
      <slot name="trailing" />
    </Button.Content>
  </Button.Root>
</template>
