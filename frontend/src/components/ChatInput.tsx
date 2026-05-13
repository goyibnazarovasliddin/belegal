import { useState, useRef } from 'react'

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
    <div className="border-t border-gray-200 bg-white px-4 py-3">
      <div className="max-w-3xl mx-auto flex items-end gap-2">
        <div className="flex-1 bg-gray-50 border border-gray-300 rounded-2xl overflow-hidden focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
          <textarea
            ref={ref}
            value={value}
            disabled={disabled}
            rows={1}
            placeholder="Savol bering... (masalan: So'z erkinligi qanday kafolatlanadi?)"
            className="w-full bg-transparent px-4 py-3 text-sm resize-none outline-none max-h-40 disabled:opacity-50 placeholder-gray-400"
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
        </div>

        <button
          onClick={submit}
          disabled={disabled || !value.trim()}
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
        >
          {disabled ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>
      <p className="text-center text-xs text-gray-400 mt-2">
        Enter — yuborish &nbsp;·&nbsp; Shift+Enter — yangi qator
      </p>
    </div>
  )
}
