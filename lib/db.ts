import { Pool } from 'pg'
import fs from 'fs'

const sslCa = (() => {
  try {
    const path = process.env.DB_SSL_CERT_PATH
    if (path) return fs.readFileSync(path, 'utf8')
  } catch {}
  return process.env.DB_SSL_CERT
})()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslCa ? { rejectUnauthorized: true, ca: sslCa } : undefined,
  max: 10,
  idleTimeoutMillis: 30000,
})

export default pool

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result.rows
  } finally {
    client.release()
  }
}

export async function queryOne<T = any>(text: string, params?: any[]): Promise<T | null> {
  const rows = await query<T>(text, params)
  return rows[0] ?? null
}
