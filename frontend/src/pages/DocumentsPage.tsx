import { useEffect, useState, useRef } from 'react'
import type { ComponentType, SVGProps } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { LegalDocument } from '../types'
import {
  BuildingIcon, GavelIcon, HardHatIcon, ScrollIcon, DocumentIcon,
  ChevronRightIcon, ArrowLeftIcon,
} from '../components/Icons'
import Reveal from '../components/Reveal'

const DOC_ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  "O'zbekiston Respublikasi Konstitutsiyasi": BuildingIcon,
  'Jinoyat kodeksi': GavelIcon,
  'Mehnat kodeksi': HardHatIcon,
  'Fuqarolik kodeksi': ScrollIcon,
  "Ma'muriy javobgarlik to'g'risidagi kodeks": BuildingIcon,
}

function docIcon(name: string) {
  return DOC_ICONS[name] ?? DocumentIcon
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<LegalDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDoc, setSelectedDoc] = useState(0)
  const [expandedDocs, setExpandedDocs] = useState<Set<number>>(new Set())
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const highlighted = location.hash.slice(1)
  const fromChat = (location.state as { fromChat?: boolean } | null)?.fromChat

  useEffect(() => {
    fetch('/api/documents')
      .then((r) => r.json())
      .then((data) => {
        const docs: LegalDocument[] = data.documents
        setDocuments(docs)
        setLoading(false)

        if (highlighted) {
          const idx = docs.findIndex((d) =>
            d.bobs.some((b) => b.moddalar.some((m) => m.id === highlighted))
          )
          if (idx !== -1) {
            setSelectedDoc(idx)
            setExpandedDocs(new Set([idx]))
          }
        }
      })
      .catch(() => setLoading(false))
  }, [])

  // Scroll to highlighted modda — fires after render settles (double rAF + delay)
  useEffect(() => {
    if (!highlighted || loading || !documents[selectedDoc]) return

    let cancelled = false
    const scrollOnce = () => {
      const el = document.getElementById(highlighted)
      if (el && !cancelled) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    // First pass: after fonts/layout finalize
    const t1 = setTimeout(() => {
      requestAnimationFrame(() => requestAnimationFrame(scrollOnce))
    }, 250)
    // Second pass: correct any drift caused by image/font load
    const t2 = setTimeout(scrollOnce, 800)

    return () => { cancelled = true; clearTimeout(t1); clearTimeout(t2) }
    // eslint-disable-next-line
  }, [highlighted, loading, selectedDoc, documents.length])

  const toggleExpand = (i: number) => {
    setExpandedDocs((prev) => {
      const next = new Set(prev)
      if (next.has(i)) { next.delete(i) } else { next.add(i) }
      return next
    })
  }

  const selectDoc = (i: number) => {
    setSelectedDoc(i)
    navigate('/documents')
    toggleExpand(i)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 text-sm gap-3 animate-fade-in bg-slate-950">
        <svg className="w-7 h-7 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span>Hujjatlar yuklanmoqda...</span>
      </div>
    )
  }

  const doc = documents[selectedDoc]

  return (
    <div className="flex h-full overflow-hidden bg-slate-950 relative">
      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden animate-fade-in"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          fixed md:static top-0 left-0 z-40
          w-72 h-full border-r border-slate-800 overflow-y-auto bg-slate-950 flex-shrink-0
          transition-transform duration-300 ease-out
        `}
        style={{ scrollbarGutter: 'stable' }}
      >
        <div className="px-4 py-4 border-b border-slate-800 bg-slate-950 sticky top-0 z-10 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Huquqiy hujjatlar
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">{documents.length} ta hujjat</p>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden p-1 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
            aria-label="Yopish"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-2 space-y-1">
          {documents.map((d, i) => {
            const isActive = selectedDoc === i
            const isOpen = expandedDocs.has(i)
            const Icon = docIcon(d.name)

            return (
              <div
                key={i}
                className={`rounded-xl overflow-hidden border transition-all duration-200 ${
                  isActive
                    ? 'border-indigo-500/30 bg-slate-900 shadow-lg shadow-indigo-900/20'
                    : 'border-transparent bg-slate-900/30 hover:bg-slate-900/60 hover:border-slate-800'
                }`}
              >
                <button
                  onClick={() => selectDoc(i)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left"
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                    isActive
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`flex-1 min-w-0 text-xs font-semibold leading-snug ${
                    isActive ? 'text-indigo-200' : 'text-slate-300'
                  }`}>
                    {d.name}
                  </span>
                  <ChevronRightIcon
                    className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-90 text-indigo-400' : 'text-slate-500'
                    }`}
                  />
                </button>

                {/* CSS-driven dropdown: smooth open AND close via grid-rows trick */}
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-slate-800 bg-slate-950/60 pb-1">
                      {d.bobs.map((bob, j) => {
                        const targetId = bob.moddalar[0]?.id ?? ''
                        return (
                          <button
                            key={j}
                            onClick={(e) => {
                              e.preventDefault()
                              setSelectedDoc(i)
                              setMobileSidebarOpen(false)
                              // Use replace history + manual smooth scroll → no browser anchor jump
                              navigate(`/documents#${targetId}`, { replace: true })
                            }}
                            className="w-full flex items-start gap-2 px-3 py-2 mx-1 my-0.5 rounded-lg text-[11px] text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-colors group text-left"
                          >
                            <span className="mt-0.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-indigo-400 transition-colors" />
                            <span className="leading-tight">{bob.name}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </aside>

      {/* Main viewer */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto bg-slate-950">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur border-b border-slate-800 px-4 sm:px-6 py-2.5 flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition-colors"
            aria-label="Hujjatlar menyusi"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {fromChat && (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Chatga qaytish
            </button>
          )}
        </div>

        <div className="px-4 sm:px-8 py-6 sm:py-8">
          <div className="max-w-3xl mx-auto animate-fade-in" key={selectedDoc}>
            {doc ? (
              <>
                <div className="flex items-center gap-4 mb-10 animate-slide-up">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-900/40">
                    {(() => { const I = docIcon(doc.name); return <I className="w-7 h-7 text-white" /> })()}
                  </div>
                  <div>
                    <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">{doc.name}</h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {doc.bobs.reduce((n, b) => n + b.moddalar.length, 0)} ta modda · {doc.bobs.length} ta bob
                    </p>
                  </div>
                </div>

                {doc.bobs.map((bob, bi) => (
                  <section key={bi} className="mb-12">
                    <Reveal>
                      {bob.bolim && (
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                          {bob.bolim}
                        </p>
                      )}
                      <h2 className="text-base font-bold text-slate-200 mb-5 pb-2 border-b border-slate-800">
                        {bob.name}
                      </h2>
                    </Reveal>

                    {bob.moddalar.map((modda) => {
                      const isHL = highlighted === modda.id
                      return (
                        <Reveal key={modda.id} offset={16}>
                          <div
                            id={modda.id}
                            className={`mb-5 p-4 rounded-xl border scroll-mt-24 transition-all ${
                              isHL
                                ? 'bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-900/20 ring-1 ring-amber-500/30'
                                : 'border-transparent bg-slate-900/40 hover:bg-slate-900/70 hover:border-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-sm font-bold ${isHL ? 'text-amber-300' : 'text-indigo-300'}`}>
                                {modda.number}-modda
                              </span>
                              {isHL && (
                                <span className="text-xs bg-amber-500/20 text-amber-200 px-2 py-0.5 rounded-full font-medium ring-1 ring-amber-500/30">
                                  manba
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed">{modda.text}</p>
                          </div>
                        </Reveal>
                      )
                    })}
                  </section>
                ))}
              </>
            ) : (
              <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
                Hujjat tanlanmagan
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
