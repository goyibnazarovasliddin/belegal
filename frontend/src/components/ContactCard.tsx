import type { Contact } from '../types'

interface Props {
  contact: Contact
}

export default function ContactCard({ contact }: Props) {
  const href = `tel:${contact.phone.replace(/\s/g, '')}`

  return (
    <a
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 rounded-xl transition-colors group"
    >
      <div className="w-8 h-8 rounded-full bg-indigo-100 group-hover:bg-indigo-200 flex items-center justify-center flex-shrink-0 transition-colors">
        <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-700 truncate">{contact.name}</p>
        <p className="text-xs text-indigo-600 font-semibold">{contact.phone}</p>
      </div>
    </a>
  )
}
