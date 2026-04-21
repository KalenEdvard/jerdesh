'use client'
import { useState, useEffect, useRef } from 'react'
import { useStore } from '@/store'
import { createClient } from '@/lib/supabase-client'
import type { Message } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

export default function ChatModal({ listingId, receiverId }: { listingId: string; receiverId: string }) {
  const { user, chatOpen, chatListingId, closeChat } = useStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const isOpen = chatOpen && chatListingId === listingId

  useEffect(() => {
    if (!isOpen || !user) return

    // Load messages
    const loadMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*, sender:users(name,avatar_url)')
        .eq('listing_id', listingId)
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user.id})`
        )
        .order('created_at', { ascending: true })
      setMessages(data || [])
    }
    loadMessages()

    // Subscribe to realtime
    const channel = supabase
      .channel(`chat:${listingId}:${user.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `listing_id=eq.${listingId}`,
      }, (payload: { new: unknown }) => {
        const message = payload.new as Message
        const isConversationMessage =
          (message.sender_id === user.id && message.receiver_id === receiverId) ||
          (message.sender_id === receiverId && message.receiver_id === user.id)
        if (!isConversationMessage) return
        setMessages(prev => [...prev, message])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [isOpen, user, listingId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!text.trim() || !user) return
    setLoading(true)
    await supabase.from('messages').insert({
      listing_id: listingId,
      sender_id: user.id,
      receiver_id: receiverId,
      text: text.trim(),
    })
    setText('')
    setLoading(false)
  }

  if (!isOpen) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: 24, pointerEvents: 'none' }}>
      <div style={{ width: 360, height: 480, background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', pointerEvents: 'all', animation: 'fadeIn 0.2s ease' }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
            <span style={{ fontSize: 14, fontWeight: 700 }}>Чат с продавцом</span>
          </div>
          <button onClick={closeChat} style={{ fontSize: 18, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, marginTop: 40 }}>
              💬 Напишите продавцу первым!
            </div>
          )}
          {messages.map(m => {
            const isOwn = m.sender_id === user?.id
            return (
              <div key={m.id} style={{ display: 'flex', justifyContent: isOwn ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '75%', padding: '9px 14px', borderRadius: isOwn ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: isOwn ? '#1d4ed8' : '#f1f5f9', color: isOwn ? '#fff' : '#0f172a', fontSize: 13 }}>
                  <p style={{ margin: 0 }}>{m.text}</p>
                  <p style={{ margin: '4px 0 0', fontSize: 10, opacity: 0.65, textAlign: 'right' }}>
                    {formatDistanceToNow(new Date(m.created_at), { locale: ru })}
                  </p>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 8 }}>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Написать сообщение..."
            style={{ flex: 1, padding: '9px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none' }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !text.trim()}
            style={{ padding: '9px 16px', borderRadius: 12, background: text.trim() ? '#1d4ed8' : '#e2e8f0', color: '#fff', fontSize: 16, border: 'none', cursor: text.trim() ? 'pointer' : 'default', transition: 'background 0.15s' }}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  )
}
