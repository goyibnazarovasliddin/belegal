import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import SourceCard from './SourceCard'
import ContactCard from './ContactCard'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'
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
          className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  )
}

function UserAvatar({ initial }: { initial: string }) {
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md shadow-indigo-900/40">
      {initial || '?'}
    </div>
  )
}

function AssistantAvatar() {
  return (
    <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
      <Logo size={26} />
    </div>
  )
}

export default function ChatMessage({ message }: Props) {
  const { user } = useAuth()
  const initial = user?.full_name?.charAt(0).toUpperCase() ?? '?'

  if (message.role === 'user') {
    return (
      <div className="flex justify-end items-start gap-2 mb-4 px-4 animate-slide-up">
        <div className="max-w-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed shadow-lg shadow-indigo-900/30">
          {message.content}
        </div>
        <UserAvatar initial={initial} />
      </div>
    )
  }

  const isEmpty = !message.content

  return (
    <div className="flex justify-start items-start gap-2 mb-6 px-4 animate-slide-up">
      <AssistantAvatar />
      <div className="max-w-2xl w-full">
        <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-sm rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-200 shadow-lg shadow-black/20">
          {isEmpty ? (
            <TypingDots />
          ) : (
            <div className="prose-legal prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {message.sources && message.sources.length > 0 && (
          <div className="mt-3 px-1 animate-fade-in">
            <p className="text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wider">
              Manbalar
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {message.sources.map((src, i) => (
                <div
                  key={src.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <SourceCard source={src} />
                </div>
              ))}
            </div>
          </div>
        )}

        {message.contacts && message.contacts.length > 0 && (
          <div className="mt-3 px-1 animate-fade-in">
            <p className="text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wider">
              Yordam olish mumkin
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {message.contacts.map((c, i) => (
                <div
                  key={c.name}
                  className="animate-slide-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <ContactCard contact={c} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
