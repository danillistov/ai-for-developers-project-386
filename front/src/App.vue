<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import AppNav from '@/components/AppNav.vue'
import AppSnackbar from '@/components/AppSnackbar.vue'
</script>

<template>
  <div class="min-h-full flex flex-col bg-surface text-ink">
    <a
      href="#main"
      class="absolute left-2 top-2 -translate-y-16 rounded-md bg-primary px-3 py-1 text-xs text-on-primary transition-transform focus:translate-y-0"
    >
      К основному контенту
    </a>

    <header class="sticky top-0 z-30 border-b hairline bg-surface/80 backdrop-blur">
      <div class="mx-auto flex max-w-7xl items-center gap-4 px-6 py-3">
        <!-- brand mark -->
        <RouterLink
          to="/"
          aria-label="На главную — Calendar Booking"
          class="flex h-11 w-11 items-center justify-center rounded-xl border hairline bg-surface-elevated text-ink transition-colors hover:bg-surface-muted"
        >
          <svg
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"
            class="h-5 w-5" aria-hidden="true"
          >
            <rect x="3" y="5" width="18" height="16" rx="2.5" />
            <path d="M8 3v4M16 3v4M3 10h18" />
          </svg>
        </RouterLink>

        <!-- brand title: shown on larger screens, hidden in nav pill area -->
        <span class="sr-only">Calendar Booking</span>

        <AppNav class="mx-auto" />

        <div class="ml-auto flex items-center gap-2">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full border hairline bg-surface-elevated text-ink transition-colors hover:bg-surface-muted"
            aria-label="Поиск"
            title="Поиск (скоро)"
            disabled
          >
            <svg
              viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"
              class="h-4 w-4" aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>

          <div
            class="h-10 w-10 rounded-full border hairline"
            style="background: linear-gradient(135deg, #c65a3a 0%, #f1d9cc 100%);"
            role="img"
            aria-label="Вы (демо-аккаунт)"
          />
        </div>
      </div>
    </header>

    <main id="main" class="flex-1">
      <div class="mx-auto max-w-7xl px-6 py-8">
        <RouterView v-slot="{ Component, route }">
          <transition name="view" mode="out-in">
            <component :is="Component" :key="route?.fullPath" />
          </transition>
        </RouterView>
      </div>
    </main>

    <footer class="border-t hairline py-6 text-center text-xs text-ink-faint">
      <p class="mx-auto max-w-7xl px-6">
        Calendar Booking · тихие дни, аккуратные встречи.
      </p>
    </footer>

    <AppSnackbar />
  </div>
</template>

<style scoped>
.view-enter-active,
.view-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.view-enter-from,
.view-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>
