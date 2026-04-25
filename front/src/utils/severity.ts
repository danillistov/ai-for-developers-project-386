export type Severity = 'success' | 'error' | 'warning' | 'info'

export const severityClasses: Record<Severity, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error: 'border-red-200 bg-red-50 text-red-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  info: 'border-sky-200 bg-sky-50 text-sky-800',
}

const assertiveSeverities = new Set<Severity>(['error', 'warning'])

export function ariaRoleFor(severity: Severity): 'alert' | 'status' {
  return assertiveSeverities.has(severity) ? 'alert' : 'status'
}
