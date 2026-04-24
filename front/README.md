# front

Фронтенд Calendar Booking на Vite + Vue 3 + TypeScript.

## Стек

- Vite 8, Vue 3, TypeScript
- Pinia + Pinia Colada, Vue Router
- Vuetify0 (headless UI) + Tailwind CSS v4
- Vitest + Vue Test Utils
- VitePress (документация)
- @antfu/eslint-config (линт + формат)
- Stoplight Prism (mock API по OpenAPI)
- openapi-typescript (типы из контракта)

## Быстрый старт

```bash
# из корня репозитория — собрать OpenAPI из TypeSpec
npm run compile

cd front
npm install
npm run api:types   # один раз, затем после каждого изменения контракта
npm run mock        # терминал 1: Prism на :4010
npm run dev         # терминал 2: фронт на :5173
```

## Основные команды

| Скрипт              | Описание                                           |
| ------------------- | -------------------------------------------------- |
| `dev`               | Запуск dev-сервера                                 |
| `build`             | Production-сборка + type-check                     |
| `preview`           | Превью сборки                                      |
| `test`              | Vitest в watch-режиме                              |
| `test:run`          | Vitest одноразовый прогон                          |
| `lint` / `lint:fix` | Линт / автофикс                                    |
| `mock`              | Prism mock на `:4010`                              |
| `mock:proxy`        | Prism proxy-режим                                  |
| `api:types`         | Генерация TS-типов из `../tsp-output/openapi.yaml` |
| `docs:dev`          | VitePress dev                                      |
| `docs:build`        | VitePress build                                    |

## Окружение

Скопируйте `.env.example` в `.env.local` и настройте:

- `VITE_API_BASE_URL` — базовый URL API (по умолчанию `/api` через прокси Vite)
- `VITE_API_PROXY_TARGET` — куда Vite проксирует `/api` (по умолчанию Prism на `:4010`)

## Контракт API

Контракт описан в TypeSpec (корень репозитория — `api.tsp`), генерируется в
`tsp-output/openapi.yaml`. Фронт читает OpenAPI оттуда (Prism и `openapi-typescript`
берут файл по относительному пути `../tsp-output/openapi.yaml`).
