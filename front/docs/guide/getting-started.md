# Начало работы

## Стек

- **Vite 8** — сборка и dev-сервер
- **Vue 3** + **TypeScript** + `<script setup>`
- **Pinia** + **Pinia Colada** — state и data fetching
- **Vue Router** — навигация
- **Vuetify0** — headless UI-примитивы
- **Tailwind CSS v4** — стилизация
- **Vitest** + **Vue Test Utils** — тестирование
- **@antfu/eslint-config** — линтинг + форматирование
- **Stoplight Prism** — mock API по OpenAPI-контракту
- **openapi-typescript** — типы TypeScript из контракта

## Установка

```bash
npm install
```

## Команды

| Скрипт                      | Описание                                                       |
| --------------------------- | -------------------------------------------------------------- |
| `npm run dev`               | Dev-сервер (`http://localhost:5173`)                           |
| `npm run build`             | Production-сборка + type-check                                 |
| `npm run preview`           | Превью сборки                                                  |
| `npm run test`              | Vitest в watch-режиме                                          |
| `npm run test:run`          | Vitest одноразово                                              |
| `npm run lint` / `lint:fix` | ESLint                                                         |
| `npm run mock`              | Prism mock на порту `4010`                                     |
| `npm run mock:proxy`        | Prism proxy (контракт + реальный сервер)                       |
| `npm run api:types`         | Генерация `src/types/api.d.ts` из `../tsp-output/openapi.yaml` |
| `npm run docs:dev`          | VitePress dev                                                  |

## Рабочий поток

Контракт описан в корне проекта через TypeSpec (`api.tsp`). Генерация OpenAPI:

```bash
# из корня репозитория
npm run compile
```

Затем во фронте:

```bash
# терминал 1 — mock API по актуальному контракту
npm run mock

# терминал 2 — dev-сервер фронта
npm run dev
```

Vite проксирует `/api/*` → `http://localhost:4010` (Prism).

При изменениях контракта перегенерируйте типы:

```bash
npm run api:types
```
