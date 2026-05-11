const counts = new Map<string, { count: number; reset: number }>()

export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = counts.get(key)
  if (!entry || entry.reset < now) {
    counts.set(key, { count: 1, reset: now + windowMs })
    return true
  }
  if (entry.count >= max) return false
  entry.count++
  return true
}
