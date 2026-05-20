import { useState, useMemo, useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useChats } from '../context/ChatContext'
import { useAuth } from '../context/AuthContext'
import {
  PlusIcon, DocumentsIcon, SearchIcon,
  LogoutIcon, TrashIcon,
} from './Icons'
import Logo from './Logo'

function timeLabel(ts: number) {
  const diff = Date.now() - ts
  const day = 86_400_000
  if (diff < day) return 'Bugun'
  if (diff < 2 * day) return 'Kecha'
  if (diff < 7 * day) return 'Bu hafta'
  return 'Oldingi'
}

const GROUP_ORDER = ['Bugun', 'Kecha', 'Bu hafta', 'Oldingi']

const PLAN_META: Record<string, { label: string; cls: string }> = {
  free:    { label: 'Bepul',   cls: 'bg-slate-800 text-slate-300 ring-1 ring-slate-700' },
  pro:     { label: 'Pro',     cls: 'bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/40' },
  advokat: { label: 'Advokat', cls: 'bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/40' },
}

function HamburgerIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function CloseIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

export default function Layout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { chats, activeId, setActiveId, newChat, deleteChat } = useChats()
  const { user, logout } = useAuth()
  const [query, setQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  const isChat = pathname === '/chat' || pathname.startsWith('/chat/')
  const isDocuments = pathname.startsWith('/documents')
  const isSettings = pathname.startsWith('/settings')

  // Close mobile sidebar on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  const handleNewChat = () => { setActiveId(null); navigate('/chat') }
  const handleSelect = (id: string) => { setActiveId(id); navigate(`/chat/${id}`) }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return chats
    return chats.filter((c) => c.title.toLowerCase().includes(q))
  }, [chats, query])

  const groups: Record<string, typeof chats> = {}
  for (const c of filtered) {
    const g = timeLabel(c.updatedAt)
    if (!groups[g]) groups[g] = []
    groups[g].push(c)
  }

  const plan = PLAN_META[user?.plan ?? 'free']

  return (
    <div className="flex h-[100dvh] bg-slate-950 overflow-hidden relative">
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          fixed md:static top-0 left-0 z-40
          w-64 h-[100dvh] md:h-full bg-slate-950 flex flex-col flex-shrink-0 border-r border-slate-800
          transition-transform duration-300 ease-out
        `}
      >
        {/* Logo — clicks to home */}
        <Link
          to="/"
          className="px-4 py-4 flex items-center gap-2.5 hover:bg-slate-900/60 transition-colors"
        >
          <Logo size={32} />
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-white tracking-tight">BeLegal</h1>
            <p className="text-[10px] text-slate-500 leading-none">Huquqiy Yordamchi</p>
          </div>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMobileOpen(false) }}
            className="md:hidden p-1 -m-1 text-slate-400 hover:text-white rounded"
            aria-label="Yopish"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </Link>

        {/* New chat */}
        <div className="px-3 pb-2">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-white bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-sm shadow-indigo-900/40"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            Yangi suhbat
          </button>
        </div>

        {/* Documents nav (FIRST) */}
        <div className="px-3 pb-3">
          <Link
            to="/documents"
            className={`relative w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium overflow-hidden group transition-all ${
              isDocuments
                ? 'bg-gradient-to-r from-indigo-500/20 via-purple-500/15 to-transparent text-white ring-1 ring-indigo-500/40 shadow-md shadow-indigo-900/30'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 ring-1 ring-transparent'
            }`}
          >
            {/* Active indicator bar (left) */}
            <span
              className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 rounded-r bg-gradient-to-b from-indigo-400 to-purple-400 transition-all ${
                isDocuments ? 'h-5 opacity-100' : 'h-0 opacity-0'
              }`}
            />
            <DocumentsIcon className={`w-4 h-4 transition-colors ${isDocuments ? 'text-indigo-300' : ''}`} />
            <span>Hujjatlar</span>
            <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-md font-semibold transition-colors ${
              isDocuments
                ? 'bg-indigo-500/30 text-indigo-200 ring-1 ring-indigo-400/30'
                : 'bg-slate-800 text-slate-500'
            }`}>5</span>
          </Link>
        </div>

        {/* Search */}
        <div className="px-3 pb-2">
          <div className="relative">
            <SearchIcon className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Suhbatlardan qidirish..."
              className="w-full bg-slate-900/60 border border-slate-800 focus:border-indigo-500/50 focus:bg-slate-900 text-slate-200 text-xs placeholder-slate-600 rounded-lg pl-8 pr-2 py-1.5 outline-none transition-colors"
            />
          </div>
        </div>

        {/* History */}
        <div className="flex-1 overflow-y-auto px-2 py-1 min-h-0">
          <p className="text-[10px] text-slate-600 px-2 pt-1 pb-2 font-semibold uppercase tracking-wider">
            Suhbatlar tarixi
          </p>

          {filtered.length === 0 ? (
            <p className="text-xs text-slate-600 text-center py-6 px-3">
              {query ? 'Hech narsa topilmadi' : 'Hali suhbat yo\'q'}
            </p>
          ) : (
            GROUP_ORDER.filter((g) => groups[g]?.length).map((group) => (
              <div key={group} className="mb-3 animate-fade-in">
                <p className="text-[10px] text-slate-600 px-2 pb-1 font-medium uppercase tracking-wider">
                  {group}
                </p>
                {groups[group].map((chat) => {
                  const active = activeId === chat.id && isChat
                  return (
                    <div key={chat.id} className="relative group">
                      <button
                        onClick={() => handleSelect(chat.id)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors pr-7 ${
                          active
                            ? 'bg-slate-800 text-white'
                            : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                        }`}
                      >
                        <span className="block truncate">{chat.title}</span>
                      </button>
                      {/* Delete: always visible on mobile, hover-only on md+ */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (confirm(`"${chat.title}" o'chirilsinmi?`)) deleteChat(chat.id)
                        }}
                        aria-label="O'chirish"
                        className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded text-slate-500 hover:text-red-400 hover:bg-slate-700 transition-opacity opacity-100 md:opacity-0 md:group-hover:opacity-100"
                      >
                        <TrashIcon className="w-3 h-3" />
                      </button>
                    </div>
                  )
                })}
              </div>
            ))
          )}
        </div>

        {/* User card — clicks to settings */}
        <div className="px-3 py-3 border-t border-slate-800/80">
          <div className={`flex items-center gap-2.5 rounded-lg p-1.5 -m-1.5 transition-colors ${
            isSettings ? 'bg-slate-800' : 'hover:bg-slate-900'
          }`}>
            <Link
              to="/settings"
              title="Sozlamalar"
              className="flex items-center gap-2.5 flex-1 min-w-0"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user?.full_name?.charAt(0).toUpperCase() ?? '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate leading-tight">{user?.full_name}</p>
                <span className={`inline-block mt-0.5 text-[9px] px-1.5 py-0.5 rounded font-medium ${plan.cls}`}>
                  {plan.label}
                </span>
              </div>
            </Link>
            <button
              onClick={() => { setActiveId(null); logout(); navigate('/') }}
              className="text-slate-500 hover:text-slate-200 transition-colors p-1 rounded hover:bg-slate-800"
              title="Chiqish"
            >
              <LogoutIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-hidden flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-3 py-2.5 border-b border-slate-800 bg-slate-950/90 backdrop-blur-sm">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-900 transition-colors"
            aria-label="Menyu"
          >
            <HamburgerIcon className="w-5 h-5" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <Logo size={24} />
            <span className="text-sm font-bold text-white tracking-tight">BeLegal</span>
          </Link>
          <div className="w-7" />
        </div>

        <div key={pathname.split('/')[1] || 'root'} className="flex-1 overflow-hidden animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
