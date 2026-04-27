import { existsSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

const dbName = process.env.DATABASE_PATH ?? 'booking.test.sqlite'
const cwd = process.cwd()
const targets = [dbName, `${dbName}-shm`, `${dbName}-wal`]

for (const target of targets) {
  const fullPath = resolve(cwd, target)
  if (existsSync(fullPath)) {
    rmSync(fullPath, { force: true })
    console.log(`[e2e] removed ${target}`)
  }
}
