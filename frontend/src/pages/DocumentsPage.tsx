import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { LegalDocument } from '../types'

const DOC_ICONS: Record<string, string> = {
  "O'zbekiston Respublikasi Konstitutsiyasi": '🏛️',
  'Jinoyat kodeksi': '⚖️',
  'Mehnat kodeksi': '👷',
  'Fuqarolik kodeksi': '📜',
  "Ma'muriy javobgarlik to'g'risidagi kodeks": '🏢',
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
      fill="none" stroke="currentColor" viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
    </svg>
  )
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<LegalDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDoc, setSelectedDoc] = useState(0)
  const [expandedDocs, setExpandedDocs] = useState<Set<number>>(new Set())
  const location = useLocation()
  const navigate = useNavigate()

  const highlighted = location.hash.slice(1)
  const fromChat = (location.state as { fromChat?: boolean } | null)?.fromChat

  useEffect(() => {
    fetch('/api/documents')
      .then((r) => r.json())
      .then((data) => {
        const docs: LegalDocument[] = data.documents
        setDocuments(docs)
        setLoading(false)

        // If a hash is present, auto-select the document containing that article
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

  useEffect(() => {
    if (!highlighted || loading) return
    const timer = setTimeout(() => {
      document.getElementById(highlighted)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 200)
    return () => clearTimeout(timer)
  }, [highlighted, loading])

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
    if (!expandedDocs.has(i)) {
      setExpandedDocs((prev) => new Set(prev).add(i))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        Yuklanmoqda...
      </div>
    )
  }

  const doc = documents[selectedDoc]

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 border-r border-gray-200 overflow-y-auto bg-gray-50 flex-shrink-0">
        <div className="px-4 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Huquqiy hujjatlar
          </h2>
          <p className="text-[11px] text-gray-400 mt-0.5">{documents.length} ta hujjat</p>
        </div>

        <div className="p-2 space-y-1">
          {documents.map((d, i) => {
            const isActive = selectedDoc === i
            const isOpen = expandedDocs.has(i)
            const icon = DOC_ICONS[d.name] ?? '📄'

            return (
              <div
                key={i}
                className={`rounded-xl overflow-hidden border transition-all duration-200 ${
                  isActive
                    ? 'border-indigo-200 bg-white shadow-sm'
                    : 'border-transparent bg-white/60 hover:bg-white hover:border-gray-200'
                }`}
              >
                {/* Document header row */}
                <div className="flex items-center">
                  <button
                    onClick={() => selectDoc(i)}
                    className="flex-1 flex items-center gap-2.5 px-3 py-2.5 text-left min-w-0"
                  >
                    <span className="text-base flex-shrink-0">{icon}</span>
                    <span className={`text-xs font-semibold leading-snug ${
                      isActive ? 'text-indigo-700' : 'text-gray-700'
                    }`}>
                      {d.name}
                    </span>
                  </button>
                  <button
                    onClick={() => toggleExpand(i)}
                    className={`px-2.5 py-2.5 flex-shrink-0 transition-colors ${
                      isOpen ? 'text-indigo-500' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <ChevronIcon open={isOpen} />
                  </button>
                </div>

                {/* Bob list — accordion */}
                {isOpen && d.bobs.length > 0 && (
                  <div className="border-t border-gray-100 bg-gray-50/80 pb-1">
                    {d.bobs.map((bob, j) => (
                      <a
                        key={j}
                        href={`#${bob.moddalar[0]?.id ?? ''}`}
                        onClick={() => setSelectedDoc(i)}
                        className="flex items-start gap-2 px-3 py-2 mx-1 my-0.5 rounded-lg text-[11px] text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors group"
                      >
                        <span className="mt-0.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-indigo-400 transition-colors" />
                        <span className="leading-tight">{bob.name}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </aside>

      {/* Main viewer */}
      <div className="flex-1 overflow-y-auto bg-white">
        {fromChat && (
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-200 px-6 py-2.5">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Chatga qaytish
            </button>
          </div>
        )}

        <div className="px-8 py-8">
          <div className="max-w-3xl mx-auto">
            {doc ? (
              <>
                <div className="flex items-center gap-3 mb-10">
                  <span className="text-4xl">{DOC_ICONS[doc.name] ?? '📄'}</span>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">{doc.name}</h1>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {doc.bobs.reduce((n, b) => n + b.moddalar.length, 0)} ta modda
                    </p>
                  </div>
                </div>

                {doc.bobs.map((bob, bi) => (
                  <section key={bi} className="mb-12">
                    {bob.bolim && (
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        {bob.bolim}
                      </p>
                    )}
                    <h2 className="text-base font-bold text-gray-800 mb-5 pb-2 border-b border-gray-200">
                      {bob.name}
                    </h2>

                    {bob.moddalar.map((modda) => {
                      const isHL = highlighted === modda.id
                      return (
                        <div
                          key={modda.id}
                          id={modda.id}
                          className={`mb-5 p-4 rounded-xl border scroll-mt-16 transition-colors ${
                            isHL
                              ? 'bg-amber-50 border-amber-300 shadow-sm'
                              : 'border-transparent hover:bg-gray-50 hover:border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-bold text-indigo-700">
                              {modda.number}-modda
                            </span>
                            {isHL && (
                              <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                                manba
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">{modda.text}</p>
                        </div>
                      )
                    })}
                  </section>
                ))}
              </>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                Hujjat tanlanmagan
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
