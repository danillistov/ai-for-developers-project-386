import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Front Docs',
  description: 'Документация фронтенд-приложения',
  lang: 'ru-RU',
  themeConfig: {
    nav: [
      { text: 'Главная', link: '/' },
      { text: 'Гайды', link: '/guide/getting-started' },
    ],
    sidebar: [
      {
        text: 'Гайды',
        items: [
          { text: 'Начало работы', link: '/guide/getting-started' },
          { text: 'Архитектура', link: '/guide/architecture' },
        ],
      },
    ],
  },
})
