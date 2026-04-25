# Архитектура

## Структура проекта

```
front/
├── src/
│   ├── components/       # UI-компоненты
│   ├── views/            # Страницы роутера
│   │   ├── HomeView.vue
│   │   ├── EventTypesView.vue
│   │   ├── SlotsView.vue
│   │   └── BookingsView.vue
│   ├── router/           # Конфигурация Vue Router
│   ├── stores/           # Pinia-хранилища (клиентское состояние)
│   ├── services/api.ts   # Типизированный API-клиент поверх fetch
│   ├── types/api.d.ts    # Авто-сгенерированные типы OpenAPI
│   ├── plugins/          # Плагины (Vuetify0 и т.п.)
│   ├── styles/           # Глобальные стили
│   ├── __tests__/        # Тесты и setup
│   ├── App.vue
│   └── main.ts
├── docs/                 # VitePress
└── ...

# Контракт лежит в корне репозитория:
../api.tsp               # TypeSpec-исходник
../tsp-output/openapi.yaml  # Генерируется `npm run compile` в корне
```

## Data flow

1. **Контракт** — единственный источник истины. Описан на TypeSpec (`api.tsp`),
   компилируется в `tsp-output/openapi.yaml`.
2. **Типы TypeScript** — генерируются из OpenAPI через
   `openapi-typescript` (`npm run api:types`). Файл `src/types/api.d.ts`
   коммитится в репозиторий.
3. **API-клиент** (`@/services/api`) — тонкая обёртка над `fetch`
   с типобезопасными методами и классом `HttpError`, несущим распарсенный
   `ApiError` из ответа 4xx.
4. **Pinia Colada** (`useQuery`, `useMutation`) — источник истины
   для серверных данных: кэш, инвалидация (`useQueryCache().invalidateQueries`),
   оптимистичные апдейты.
5. **Pinia stores** — клиентское состояние (UI, выбранный event type и т.п.).

## Прокси и окружения

- В dev `VITE_API_BASE_URL=/api`; Vite проксирует на `VITE_API_PROXY_TARGET`
  (по умолчанию `http://localhost:4010` — Prism).
- В проде можно подставить реальный backend через `.env.production`.

## Инвалидация кэша

Ключи соглашения:

| Ресурс                 | Ключ                           |
| ---------------------- | ------------------------------ |
| Список event types     | `['event-types']`              |
| Слоты конкретного типа | `['event-types', id, 'slots']` |
| Список bookings        | `['bookings']`                 |

После мутаций вызывается `queryCache.invalidateQueries({ key })`.
