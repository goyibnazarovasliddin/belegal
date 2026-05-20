import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export interface Settings {
  k: number
  language: 'uz' | 'ru' | 'en'
}

const DEFAULTS: Settings = { k: 6, language: 'uz' }

function key(userId: number | undefined) {
  return `belegal_settings_${userId ?? 'guest'}`
}

function load(userId: number | undefined): Settings {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(key(userId)) || '{}') }
  } catch {
    return DEFAULTS
  }
}

export function useSettings() {
  const { user } = useAuth()
  const uid = user?.id

  const [settings, setSettings] = useState<Settings>(() => load(uid))

  // Reload settings when user changes
  useEffect(() => {
    setSettings(load(uid))
  }, [uid])

  const update = (updates: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates }
      localStorage.setItem(key(uid), JSON.stringify(next))
      return next
    })
  }

  return { settings, update }
}
