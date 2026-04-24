import type { App } from 'vue'
import { createThemePlugin } from '@vuetify/v0'

export default function vuetify0(app: App) {
  app.use(
    createThemePlugin({
      default: 'light',
      themes: {
        light: {
          dark: false,
          colors: {
            'primary': '#3b82f6',
            'surface': '#ffffff',
            'on-primary': '#ffffff',
            'on-surface': '#212121',
          },
        },
        dark: {
          dark: true,
          colors: {
            'primary': '#60a5fa',
            'surface': '#1e1e1e',
            'on-primary': '#1a1a1a',
            'on-surface': '#e0e0e0',
          },
        },
      },
    }),
  )
}
