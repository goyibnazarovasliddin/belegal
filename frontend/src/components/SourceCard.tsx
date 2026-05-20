import { useNavigate } from 'react-router-dom'
import type { Source } from '../types'
import { ArrowRightIcon } from './Icons'

interface Props {
  source: Source
}

export default function SourceCard({ source }: Props) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() =>
        navigate(`/documents#${source.id}`, { state: { fromChat: true } })
      }
      className="text-left w-full p-3 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-900/20 transition-all group"
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-xs font-semibold text-indigo-300 bg-indigo-500/15 group-hover:bg-indigo-500/25 px-2 py-0.5 rounded-md">
          {source.modda}-modda
        </span>
        {source.bob && (
          <span className="text-xs text-slate-500 truncate max-w-[140px]">
            {source.bob}
          </span>
        )}
      </div>
      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
        {source.text}
      </p>
      <p className="text-xs text-indigo-400 mt-2 font-medium group-hover:text-indigo-300 flex items-center gap-1">
        {source.document}
        <ArrowRightIcon className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
      </p>
    </button>
  )
}
