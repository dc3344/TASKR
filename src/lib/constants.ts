import type { Status } from '@/types/task.types'

export const STATUS_LABELS: Record<Status, string> = {
  New: 'NEW',
  Ongoing: 'ONGOING',
  Closed: 'CLOSED',
  Archive: 'ARCHIVE',
}

export const TIMEOUT_MS = 15 * 60 * 1000

export const DEMO_PIN = '000000'
