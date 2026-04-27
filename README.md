### Hexlet tests and linter status:
[![Actions Status](https://github.com/danillistov/ai-for-developers-project-386/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/danillistov/ai-for-developers-project-386/actions)
[![E2E](https://github.com/danillistov/ai-for-developers-project-386/actions/workflows/e2e.yml/badge.svg)](https://github.com/danillistov/ai-for-developers-project-386/actions/workflows/e2e.yml)

## Deployed application

https://calendar-booking-gbxb.onrender.com

## End-to-end tests

Интеграционные сценарии описаны в [`e2e/SCENARIOS.md`](./e2e/SCENARIOS.md) и
покрываются Playwright-тестами в [`e2e/booking.spec.ts`](./e2e/booking.spec.ts).
Тесты поднимают реальный фронтенд (Vite, `:5173`), реальный бэкенд (NestJS,
`:4010`) и изолированную SQLite-базу `backend/booking.test.sqlite`, которая
очищается перед каждым запуском.

### Локальный запуск

```bash
# 1. Установить зависимости (один раз)
npm ci
npm --prefix front ci
npm --prefix backend ci

# 2. Установить браузер Chromium для Playwright (один раз)
npm run e2e:install

# 3. Прогнать e2e
npm run e2e

# 4. Интерактивный режим / отладка
npm run e2e:ui
```

Playwright сам стартует фронтенд и бэкенд через `webServer` и останавливает их
после прогона. Если оба сервера уже запущены вручную (`npm --prefix backend run
start:dev` + `npm --prefix front run dev`), Playwright переиспользует их вне CI.

### CI

Workflow [`.github/workflows/e2e.yml`](./.github/workflows/e2e.yml) запускается на
`push` и `pull_request`, ставит зависимости трёх пакетов, скачивает Chromium и
выполняет `npm run e2e`. На неудачных прогонах артефакты `playwright-report/` и
`test-results/` (с трейсами и видео) загружаются в Actions.