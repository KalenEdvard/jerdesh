// Заглушка — Supabase удалён, используем lib/db.ts напрямую
export async function createClient() {
  throw new Error('Supabase удалён. Используй lib/db.ts')
}
