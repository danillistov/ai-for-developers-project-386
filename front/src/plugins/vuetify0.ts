import type { App } from 'vue'
import { createNotificationsPlugin, createThemePlugin } from '@vuetify/v0'

/**
 * Editorial cream palette inspired by the reference dashboard:
 * warm ivory surfaces with near-black ink and a muted terracotta accent.
 * The surface/on-surface tokens are consumed by Tailwind via `main.css`.
 */
export default function vuetify0(app: App) {
  app.use(
    createThemePlugin({
      default: 'light',
      themes: {
        light: {
          dark: false,
          colors: {
            'primary': '#141414',
            'surface': '#f4eee4',
            'surface-elevated': '#fffbf3',
            'surface-muted': '#ece5d7',
            'on-primary': '#fffbf3',
            'on-surface': '#1a1a1a',
            'accent': '#c65a3a',
          },
        },
        dark: {
          dark: true,
          colors: {
            'primary': '#f4eee4',
            'surface': '#15130f',
            'surface-elevated': '#1d1b16',
            'surface-muted': '#272420',
            'on-primary': '#15130f',
            'on-surface': '#f4eee4',
            'accent': '#e07a55',
          },
        },
      },
    }),
  )

  app.use(createNotificationsPlugin({ timeout: 4000 }))
}
