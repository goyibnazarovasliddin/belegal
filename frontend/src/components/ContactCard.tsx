import type { Contact } from '../types'
import { PhoneIcon } from './Icons'

interface Props {
  contact: Contact
}

export default function ContactCard({ contact }: Props) {
  const href = `tel:${contact.phone.replace(/\s/g, '')}`

  return (
    <a
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900 hover:shadow-lg hover:shadow-indigo-900/20 rounded-xl transition-all group"
    >
      <div className="w-9 h-9 rounded-lg bg-indigo-500/15 group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-purple-600 flex items-center justify-center flex-shrink-0 transition-all">
        <PhoneIcon className="w-4 h-4 text-indigo-300 group-hover:text-white transition-colors" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-200 truncate">{contact.name}</p>
        <p className="text-xs text-indigo-300 font-semibold">{contact.phone}</p>
      </div>
    </a>
  )
}
