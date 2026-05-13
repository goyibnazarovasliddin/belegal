import { useNavigate } from 'react-router-dom'
import type { Source } from '../types'

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
      className="text-left w-full p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/60 transition-colors group"
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 group-hover:bg-indigo-100 px-2 py-0.5 rounded-full">
          {source.modda}-modda
        </span>
        {source.bob && (
          <span className="text-xs text-gray-400 truncate max-w-[140px]">
            {source.bob}
          </span>
        )}
      </div>
      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
        {source.text}
      </p>
      <p className="text-xs text-indigo-500 mt-1.5 font-medium group-hover:text-indigo-600">
        {source.document} →
      </p>
    </button>
  )
}
