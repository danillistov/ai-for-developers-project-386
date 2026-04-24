import { useNotifications } from '@vuetify/v0'

export function useNotify() {
  const notifications = useNotifications()

  return {
    success: (subject: string, body?: string) =>
      notifications.send({ subject, body, severity: 'success' }),
    error: (subject: string, body?: string) =>
      notifications.send({ subject, body, severity: 'error', timeout: 6000 }),
    info: (subject: string, body?: string) =>
      notifications.send({ subject, body, severity: 'info' }),
  }
}
