const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

/** Today's date as YYYY-MM-DD in the user's local time zone. */
export function todayISO(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

export function isISODate(value: unknown): value is string {
  return typeof value === 'string' && DATE_PATTERN.test(value)
}

/** Formats a YYYY-MM-DD string for display without time-zone shifts. */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
