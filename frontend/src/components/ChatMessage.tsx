import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import SourceCard from './SourceCard'
import ContactCard from './ContactCard'
import type { Message } from '../types'

interface Props {
  message: Message
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  )
}

export default function ChatMessage({ message }: Props) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end mb-4 px-4">
        <div className="max-w-2xl bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed shadow-sm">
          {message.content}
        </div>
      </div>
    )
  }

  const isEmpty = !message.content

  return (
    <div className="flex justify-start mb-6 px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-800 shadow-sm">
          {isEmpty ? (
            <TypingDots />
          ) : (
            <div className="prose-legal">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {message.sources && message.sources.length > 0 && (
          <div className="mt-3 px-1">
            <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wider">
              Manbalar
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {message.sources.map((src) => (
                <SourceCard key={src.id} source={src} />
              ))}
            </div>
          </div>
        )}

        {message.contacts && message.contacts.length > 0 && (
          <div className="mt-3 px-1">
            <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wider">
              Yordam olish mumkin
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {message.contacts.map((c) => (
                <ContactCard key={c.name} contact={c} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
