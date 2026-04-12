'use client'
import { useStore } from '@/store'

export default function Toast() {
  const { toast } = useStore()
  if (!toast) return null

  const colors = {
    ok:    { bg: '#10b981', icon: '✓' },
    error: { bg: '#ef4444', icon: '✕' },
    info:  { bg: '#3b82f6', icon: 'ℹ' },
  }
  const c = colors[toast.type]

  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      background: c.bg, color: '#fff', borderRadius: 12, padding: '12px 20px',
      display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 600,
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)', zIndex: 9999,
      animation: 'fadeIn 0.3s ease',
    }}>
      <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
        {c.icon}
      </span>
      {toast.msg}
    </div>
  )
}
