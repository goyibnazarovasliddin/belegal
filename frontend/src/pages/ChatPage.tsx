import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Message } from '../types'
import { useChats } from '../context/ChatContext'
import { useSettings } from '../hooks/useSettings'
import ChatMessage from '../components/ChatMessage'
import ChatInput from '../components/ChatInput'
import Logo from '../components/Logo'
import { uuid } from '../lib/uuid'

const SUGGESTIONS = [
  "So'z erkinligi qanday kafolatlanadi?",
  "Mulkchilik huquqi haqida nimalar aytilgan?",
  "Ishdan bo'shatish tartibi qanday?",
  "O'g'irlik uchun qanday jazo beriladi?",
]

export default function ChatPage() {
  const { chats, setActiveId, newChat, updateMessages, setChatTitle } = useChats()
  const { settings } = useSettings()
  const navigate = useNavigate()
  const { chatId: urlChatId } = useParams<{ chatId: string }>()

  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const currentChatId = useRef<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Sync ChatContext activeId with URL param + load messages
  useEffect(() => {
    // If we just created/are streaming this chat locally, skip the reload
    if (urlChatId && urlChatId === currentChatId.current) {
      setActiveId(urlChatId)
      return
    }
    if (urlChatId) {
      const chat = chats.find((c) => c.id === urlChatId)
      if (chat) {
        setActiveId(urlChatId)
        setMessages(chat.messages)
        currentChatId.current = urlChatId
      } else {
        navigate('/chat', { replace: true })
      }
    } else {
      setActiveId(null)
      setMessages([])
      currentChatId.current = null
    }
    // eslint-disable-next-line
  }, [urlChatId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(
    async (query: string) => {
      // Ensure a chat exists. If creating new, navigate to its URL.
      let chatId = currentChatId.current
      if (!chatId) {
        chatId = newChat()
        currentChatId.current = chatId
        navigate(`/chat/${chatId}`, { replace: true })
      }

      const userMsg: Message = { id: uuid(), role: 'user', content: query }
      const asstId = uuid()
      const asstMsg: Message = { id: asstId, role: 'assistant', content: '', sources: [], contacts: [] }

      const nextMessages = [...messages, userMsg, asstMsg]
      setMessages(nextMessages)
      setLoading(true)

      try {
        // Strip empty assistant placeholder; send only filled turns
        const historyPayload = messages
          .filter((m) => m.content.trim().length > 0)
          .map((m) => ({ role: m.role, content: m.content }))

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, k: settings.k, history: historyPayload }),
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

        // First user message in this chat → ask LLM for a short title
        const isFirstMessage = messages.length === 0
        if (isFirstMessage) {
          const finalAssistant = finalMessages.find((m) => m.id === asstId)
          fetch('/api/chat/title', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, answer: finalAssistant?.content ?? '' }),
          })
            .then((r) => r.ok ? r.json() : null)
            .then((data: { title?: string } | null) => {
              if (data?.title) setChatTitle(chatId!, data.title)
            })
            .catch(() => { /* title is non-critical */ })
        }
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
    [messages, newChat, settings.k, updateMessages, setChatTitle, navigate]
  )

  return (
    <div className="flex flex-col h-full bg-slate-950 animate-fade-in">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-start sm:justify-center min-h-full text-center px-6 pt-8 sm:pt-0 pb-4 animate-fade-in">
            <Logo size={68} className="mb-4 sm:mb-5 drop-shadow-2xl" />
            <h2 className="text-lg sm:text-2xl font-bold text-white mb-2 tracking-tight animate-slide-up">
              BeLegal Huquqiy Yordamchisi
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mb-5 sm:mb-8 max-w-md leading-relaxed animate-slide-up" style={{ animationDelay: '80ms' }}>
              5 ta asosiy O'zbekiston kodeksi asosida batafsil huquqiy ma'lumot beradi.
              Barcha javoblar moddalar bilan asoslanadi.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-2xl">
              {SUGGESTIONS.map((q, i) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-sm bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 rounded-xl px-4 py-3.5 text-left text-slate-200 transition-[background-color,border-color,box-shadow] duration-200 hover:shadow-lg hover:shadow-indigo-900/30 leading-snug animate-slide-up"
                  style={{ animationDelay: `${150 + i * 50}ms` }}
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
