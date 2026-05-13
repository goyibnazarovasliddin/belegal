import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import type { Message } from '../types'
import { useAuth } from './AuthContext'

export interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}

interface ChatContextValue {
  chats: Chat[]
  activeId: string | null
  activeChat: Chat | null
  setActiveId: (id: string | null) => void
  newChat: () => string
  updateMessages: (id: string, messages: Message[]) => void
  deleteChat: (id: string) => void
  clearAll: () => void
}

const ChatContext = createContext<ChatContextValue>(null!)

function storageKey(userId: number | undefined) {
  return `belegal_chats_${userId ?? 'guest'}`
}

function loadChats(userId: number | undefined): Chat[] {
  try {
    return JSON.parse(localStorage.getItem(storageKey(userId)) || '[]')
  } catch {
    return []
  }
}

function saveChats(userId: number | undefined, chats: Chat[]) {
  localStorage.setItem(storageKey(userId), JSON.stringify(chats))
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const uid = user?.id

  const [chats, setChats] = useState<Chat[]>(() => loadChats(uid))
  const [activeId, setActiveIdState] = useState<string | null>(null)

  // Reload chats when user changes (login / logout / switch account)
  useEffect(() => {
    setChats(loadChats(uid))
    setActiveIdState(null) // always start with fresh empty chat
  }, [uid])

  const setActiveId = useCallback((id: string | null) => {
    setActiveIdState(id)
  }, [])

  const newChat = useCallback(() => {
    const id = crypto.randomUUID()
    const chat: Chat = {
      id,
      title: 'Yangi chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    setChats((prev) => {
      const next = [chat, ...prev]
      saveChats(uid, next)
      return next
    })
    setActiveIdState(id)
    return id
  }, [uid])

  const updateMessages = useCallback(
    (id: string, messages: Message[]) => {
      setChats((prev) => {
        const next = prev.map((c) => {
          if (c.id !== id) return c
          const firstUser = messages.find((m) => m.role === 'user')
          const title = firstUser
            ? firstUser.content.slice(0, 45) +
              (firstUser.content.length > 45 ? '…' : '')
            : c.title
          return { ...c, messages, title, updatedAt: Date.now() }
        })
        saveChats(uid, next)
        return next
      })
    },
    [uid]
  )

  const deleteChat = useCallback(
    (id: string) => {
      setChats((prev) => {
        const next = prev.filter((c) => c.id !== id)
        saveChats(uid, next)
        return next
      })
      setActiveIdState((prev) => {
        if (prev !== id) return prev
        const remaining = loadChats(uid).filter((c) => c.id !== id)
        return remaining[0]?.id ?? null
      })
    },
    [uid]
  )

  const clearAll = useCallback(() => {
    setChats([])
    setActiveIdState(null)
    localStorage.removeItem(storageKey(uid))
  }, [uid])

  const activeChat = chats.find((c) => c.id === activeId) ?? null

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeId,
        activeChat,
        setActiveId,
        newChat,
        updateMessages,
        deleteChat,
        clearAll,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChats = () => useContext(ChatContext)
