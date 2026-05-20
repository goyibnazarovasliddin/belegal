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
import { uuid } from '../lib/uuid'

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
  setChatTitle: (id: string, title: string) => void
  deleteChat: (id: string) => void
  clearAll: () => void
}

const ChatContext = createContext<ChatContextValue>(null!)
const DEFAULT_TITLE = 'Yangi suhbat'

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

  useEffect(() => {
    setChats(loadChats(uid))
    setActiveIdState(null)
  }, [uid])

  const setActiveId = useCallback((id: string | null) => {
    setActiveIdState(id)
  }, [])

  const newChat = useCallback(() => {
    const id = uuid()
    const chat: Chat = {
      id,
      title: DEFAULT_TITLE,
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

  // Only updates messages — title is set separately by setChatTitle (LLM-generated)
  const updateMessages = useCallback(
    (id: string, messages: Message[]) => {
      setChats((prev) => {
        const next = prev.map((c) =>
          c.id === id ? { ...c, messages, updatedAt: Date.now() } : c
        )
        saveChats(uid, next)
        return next
      })
    },
    [uid]
  )

  const setChatTitle = useCallback(
    (id: string, title: string) => {
      const clean = title.trim()
      if (!clean) return
      setChats((prev) => {
        const next = prev.map((c) =>
          c.id === id ? { ...c, title: clean } : c
        )
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
        setChatTitle,
        deleteChat,
        clearAll,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChats = () => useContext(ChatContext)
