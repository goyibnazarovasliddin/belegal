import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Message } from '../types'
import { useChats } from '../context/ChatContext'
import { useSettings } from '../hooks/useSettings'
import ChatMessage from '../components/ChatMessage'
import ChatInput from '../components/ChatInput'

const SUGGESTIONS = [
  "So'z erkinligi qanday kafolatlanadi?",
  "Prezidentga qo'yiladigan talablar qanday?",
  "Mulkchilik huquqi haqida nimalar aytilgan?",
  "Fuqarolikni qanday yo'qotish mumkin?",
  "Davlat hokimiyati tizimi qanday tuzilgan?",
  "Inson qadr-qimmati qanday himoya qilinadi?",
]

export default function ChatPage() {
  const { activeId, activeChat, newChat, updateMessages } = useChats()
  const { settings } = useSettings()
  const navigate = useNavigate()

  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const currentChatId = useRef<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Sync messages from active chat
  useEffect(() => {
    if (activeChat) {
      setMessages(activeChat.messages)
      currentChatId.current = activeChat.id
    } else {
      setMessages([])
      currentChatId.current = null
    }
  }, [activeId]) // eslint-disable-line

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(
    async (query: string) => {
      // Ensure a chat exists
      let chatId = currentChatId.current
      if (!chatId) {
        chatId = newChat()
        currentChatId.current = chatId
      }

      const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: query }
      const asstId = crypto.randomUUID()
      const asstMsg: Message = { id: asstId, role: 'assistant', content: '', sources: [], contacts: [] }

      const nextMessages = [...messages, userMsg, asstMsg]
      setMessages(nextMessages)
      setLoading(true)

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, k: settings.k }),
        })
        if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`)

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buf = ''
        let finalMessages = nextMessages

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buf += decoder.decode(value, { stream: true })
          const lines = buf.split('\n')
          buf = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const raw = line.slice(6).trim()
            if (raw === '[DONE]') continue
            try {
              const event = JSON.parse(raw)
              if (event.type === 'token') {
                setMessages((prev) => {
                  const updated = prev.map((m) =>
                    m.id === asstId ? { ...m, content: m.content + event.content } : m
                  )
                  finalMessages = updated
                  return updated
                })
              } else if (event.type === 'sources') {
                setMessages((prev) => {
                  const updated = prev.map((m) =>
                    m.id === asstId ? { ...m, sources: event.sources } : m
                  )
                  finalMessages = updated
                  return updated
                })
              } else if (event.type === 'contacts') {
                setMessages((prev) => {
                  const updated = prev.map((m) =>
                    m.id === asstId ? { ...m, contacts: event.contacts } : m
                  )
                  finalMessages = updated
                  return updated
                })
              }
            } catch { /* skip malformed */ }
          }
        }

        updateMessages(chatId, finalMessages)
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === asstId
              ? { ...m, content: "Xatolik yuz berdi. Server yoki API kalitini tekshiring." }
              : m
          )
        )
      } finally {
        setLoading(false)
      }
    },
    [messages, newChat, settings.k, updateMessages]
  )

  const handleSourceClick = () => {
    // DocumentsPage will get { state: { fromChat: true } } via SourceCard
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="text-5xl mb-4">⚖️</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-1">
              BeLegal Huquqiy Yordamchisi
            </h2>
            <p className="text-sm text-gray-400 mb-8 max-w-md">
              O'zbekiston Respublikasi Konstitutsiyasi asosida batafsil huquqiy
              ma'lumot beradi. Barcha javoblar moddalar bilan asoslanadi.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl">
              {SUGGESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-sm bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 rounded-xl px-4 py-3 text-left text-gray-600 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto w-full">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <ChatInput onSend={sendMessage} disabled={loading} />
    </div>
  )
}
