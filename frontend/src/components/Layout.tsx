import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useChats } from '../context/ChatContext'
import { useAuth } from '../context/AuthContext'

function timeLabel(ts: number) {
  const diff = Date.now() - ts
  const day = 86_400_000
  if (diff < day) return 'Bugun'
  if (diff < 2 * day) return 'Kecha'
  if (diff < 7 * day) return 'Bu hafta'
  return 'Oldingi'
}

const GROUP_ORDER = ['Bugun', 'Kecha', 'Bu hafta', 'Oldingi']

export default function Layout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { chats, activeId, setActiveId, newChat, deleteChat } = useChats()
  const { user, logout } = useAuth()
  const [hovered, setHovered] = useState<string | null>(null)

  const handleNewChat = () => { newChat(); navigate('/chat') }
  const handleSelect = (id: string) => { setActiveId(id); navigate('/chat') }

  const groups: Record<string, typeof chats> = {}
  for (const c of chats) {
    const g = timeLabel(c.updatedAt)
    if (!groups[g]) groups[g] = []
    groups[g].push(c)
  }

  const isChat = pathname === '/chat'

  const planBadge: Record<string, string> = {
    free: 'Bepul',
    pro: 'Pro',
    advokat: 'Advokat',
  }

  const planColor: Record<string, string> = {
    free: 'bg-gray-700 text-gray-300',
    pro: 'bg-indigo-600 text-white',
    advokat: 'bg-purple-600 text-white',
  }

  const bottomNav = [
    {
      path: '/documents',
      label: 'Hujjatlar',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      path: '/settings',
      label: 'Sozlamalar',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-900 flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="px-4 py-4 border-b border-gray-700/50 flex items-center gap-2.5">
          <span className="text-xl">⚖️</span>
          <div>
            <h1 className="text-sm font-bold text-white">BeLegal</h1>
            <p className="text-xs text-gray-500 leading-none">Huquqiy Yordamchi</p>
          </div>
        </div>

        {/* New Chat */}
        <div className="px-2 pt-3 pb-1">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-300 border border-gray-700 hover:bg-gray-800 hover:text-white hover:border-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yangi chat
          </button>
        </div>

        {/* Chat history */}
        <div className="flex-1 overflow-y-auto px-2 py-1 min-h-0">
          {chats.length === 0 ? (
            <p className="text-xs text-gray-600 text-center py-4">Hali chat yo'q</p>
          ) : (
            GROUP_ORDER.filter((g) => groups[g]?.length).map((group) => (
              <div key={group} className="mb-2">
                <p className="text-[10px] text-gray-600 px-2 py-1 font-semibold uppercase tracking-wider">
                  {group}
                </p>
                {groups[group].map((chat) => (
                  <div
                    key={chat.id}
                    className="relative group"
                    onMouseEnter={() => setHovered(chat.id)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <button
                      onClick={() => handleSelect(chat.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors pr-8 ${
                        activeId === chat.id && isChat
                          ? 'bg-gray-700 text-white'
                          : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                      }`}
                    >
                      <span className="block truncate">{chat.title}</span>
                    </button>
                    {hovered === chat.id && (
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteChat(chat.id) }}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded text-gray-600 hover:text-red-400 hover:bg-gray-700 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Bottom nav */}
        <div className="px-2 py-2 border-t border-gray-700/50 space-y-0.5">
          {bottomNav.map(({ path, label, icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname === path
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {icon}
              {label}
            </Link>
          ))}
        </div>

        {/* User */}
        <div className="px-3 py-3 border-t border-gray-700/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.full_name?.charAt(0).toUpperCase() ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{user?.full_name}</p>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${planColor[user?.plan ?? 'free']}`}>
                {planBadge[user?.plan ?? 'free']}
              </span>
            </div>
            <button
              onClick={() => { setActiveId(null); logout(); navigate('/') }}
              className="text-gray-600 hover:text-gray-400 transition-colors"
              title="Chiqish"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}
