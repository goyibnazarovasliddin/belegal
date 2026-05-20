import { useState, useRef } from 'react'
import { SendIcon } from './Icons'

interface Props {
  onSend: (query: string) => void
  disabled: boolean
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)

  const submit = () => {
    const q = value.trim()
    if (!q || disabled) return
    onSend(q)
    setValue('')
    if (ref.current) ref.current.style.height = 'auto'
  }

  return (
    <div className="border-t border-slate-800 bg-slate-950/95 backdrop-blur-sm px-3 sm:px-4 py-3">
      <div className="max-w-3xl mx-auto">
        <div className="relative bg-slate-900 border border-slate-800 rounded-2xl focus-within:border-indigo-500/60 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
          <textarea
            ref={ref}
            value={value}
            disabled={disabled}
            rows={1}
            placeholder="Savol bering..."
            className="w-full bg-transparent pl-4 pr-14 py-3 text-sm resize-none outline-none max-h-40 disabled:opacity-50 placeholder-slate-500 text-slate-100 align-middle"
            onChange={(e) => setValue(e.target.value)}
            onInput={() => {
              if (ref.current) {
                ref.current.style.height = 'auto'
                ref.current.style.height = `${ref.current.scrollHeight}px`
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                submit()
              }
            }}
          />

          {/* Send button — inside textarea container, vertically centered, equal right/top/bottom margin */}
          <button
            onClick={submit}
            disabled={disabled || !value.trim()}
            aria-label="Yuborish"
            className="absolute top-1/2 right-2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-800 disabled:to-slate-800 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-md shadow-indigo-900/40 disabled:shadow-none"
          >
            {disabled ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <SendIcon className="w-4 h-4" />
            )}
          </button>
        </div>

        <p className="text-center text-xs text-slate-600 mt-2 hidden sm:block">
          Enter — yuborish &nbsp;·&nbsp; Shift+Enter — yangi qator
        </p>
      </div>
    </div>
  )
}
