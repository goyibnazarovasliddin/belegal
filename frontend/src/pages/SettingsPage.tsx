import { useChats } from '../context/ChatContext'
import { useAuth } from '../context/AuthContext'
import {
  CheckIcon, ClockIcon, ClipboardIcon, BriefcaseIcon, DownloadIcon,
  BellIcon, FolderIcon, GlobeIcon, StarIcon,
} from '../components/Icons'
import Reveal from '../components/Reveal'

const PLANS = [
  {
    name: 'Bepul', price: '0', color: 'border-slate-800',
    badge: null, current: true,
    features: ['Kunlik 20 ta savol', '5 ta kodeks bazasi', '7 kunlik chat tarixi', 'Asosiy hujjat ko\'rish'],
    coming: [],
  },
  {
    name: 'Pro', price: '49 900 so\'m/oy', color: 'border-indigo-500/40',
    badge: 'Eng mashhur', current: false,
    features: ['Kunlik 500 ta savol', 'Barcha qonunlar bazasi', 'Cheksiz chat tarixi', 'AI tahlil va xulosalar', 'PDF / TXT eksport', 'Ustuvor qo\'llab-quvvatlash'],
    coming: ['API kirish', 'Advokat ulash'],
  },
  {
    name: 'Advokat', price: '149 900 so\'m/oy', color: 'border-purple-500/40',
    badge: 'Korporativ', current: false,
    features: ['Cheksiz savollar', 'To\'liq qonunchilik arxivi', 'Hujjat tahlili va tekshirish', 'Ish holati kuzatuvi', 'REST API kirish', 'Jamoa hisobi (5 foydalanuvchi)', 'Shaxsiy onboarding', 'SLA kafolati 99.9%'],
    coming: [],
  },
]

const FUTURE = [
  { Icon: ClipboardIcon, title: 'Hujjat tekshirish',  desc: 'Shartnoma va hujjatlarni AI bilan tahlil qilish' },
  { Icon: BriefcaseIcon, title: 'Advokat ulash',      desc: 'Malakali advokatlar bilan to\'g\'ridan-to\'g\'ri bog\'lanish' },
  { Icon: DownloadIcon,  title: 'Chat eksport',       desc: 'Suhbatni PDF yoki TXT formatda yuklab olish' },
  { Icon: BellIcon,      title: 'Qonun yangiliklari', desc: 'Qonunchilikdagi o\'zgarishlar haqida bildirishnomalar' },
  { Icon: FolderIcon,    title: 'Ish holati',         desc: 'Huquqiy ishlaringizni kuzatib borish vositasi' },
  { Icon: GlobeIcon,     title: 'Ko\'p tilli',         desc: 'O\'zbek, Rus va Ingliz tillarida javob olish' },
]

export default function SettingsPage() {
  const { clearAll, chats } = useChats()
  const { user } = useAuth()

  const planTag = user?.plan === 'pro'
    ? { icon: <StarIcon className="w-3 h-3" />, label: 'Pro', cls: 'bg-indigo-500/20 text-indigo-300' }
    : user?.plan === 'advokat'
      ? { icon: <BriefcaseIcon className="w-3 h-3" />, label: 'Advokat', cls: 'bg-purple-500/20 text-purple-300' }
      : { icon: null, label: 'Bepul', cls: 'bg-slate-800 text-slate-400' }

  return (
    <div className="h-full overflow-y-auto bg-slate-950 animate-fade-in">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6 sm:space-y-8">

        <Reveal>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Sozlamalar</h1>
            <p className="text-sm text-slate-500 mt-1">Hisob va ilova sozlamalari</p>
          </div>
        </Reveal>

        {/* Profile */}
        <Reveal delay={50}>
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 sm:p-6">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Profil</h2>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                {user?.full_name?.charAt(0).toUpperCase() ?? '?'}
              </div>
              <div>
                <p className="font-semibold text-white">{user?.full_name}</p>
                <p className="text-sm text-slate-400">{user?.email}</p>
                <span className={`inline-flex items-center gap-1 mt-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${planTag.cls}`}>
                  {planTag.icon}
                  {planTag.label}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-slate-800">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Saqlangan suhbatlar</p>
                <p className="text-2xl font-bold text-white mt-0.5">{chats.length}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Joriy reja</p>
                <p className="text-2xl font-bold text-white mt-0.5">{planTag.label}</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Subscription plans */}
        <Reveal delay={100}>
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Obuna rejasi
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  To'liq imkoniyatlar uchun obunani yuksaltiring
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full font-medium">
                <ClockIcon className="w-3 h-3" />
                Tez orada
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {PLANS.map((plan) => (
                <div key={plan.name}
                  className={`relative rounded-xl border-2 ${plan.color} bg-slate-950/40 p-5 flex flex-col`}>
                  {plan.badge && (
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap ${
                      plan.name === 'Pro' ? 'bg-indigo-600 text-white' : 'bg-purple-600 text-white'
                    }`}>
                      {plan.badge}
                    </div>
                  )}

                  <div className="mb-4">
                    <p className="font-bold text-white">{plan.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{plan.price === '0' ? 'Bepul' : plan.price}</p>
                  </div>

                  <ul className="space-y-1.5 flex-1 mb-4">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-1.5 text-xs text-slate-400">
                        <CheckIcon className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                    {plan.coming.map((f) => (
                      <li key={f} className="flex items-start gap-1.5 text-xs text-slate-500">
                        <ClockIcon className="w-3.5 h-3.5 text-slate-700 flex-shrink-0 mt-0.5" />
                        {f} <span className="text-[10px] text-amber-400">(tez orada)</span>
                      </li>
                    ))}
                  </ul>

                  {plan.current ? (
                    <span className="w-full text-center py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
                      Joriy reja
                    </span>
                  ) : (
                    <button disabled
                      className="w-full py-1.5 rounded-lg text-xs font-medium bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed inline-flex items-center justify-center gap-1">
                      <ClockIcon className="w-3 h-3" />
                      Tez orada
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Coming soon features */}
        <Reveal delay={150}>
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-5">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Kelajak imkoniyatlari
              </h2>
              <span className="text-xs bg-indigo-500/15 text-indigo-300 px-2 py-0.5 rounded-full font-medium">
                Ishlab chiqilmoqda
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FUTURE.map(({ Icon, title, desc }, i) => (
                <Reveal key={title} delay={i * 50}>
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 hover:border-indigo-500/30 transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-indigo-300" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">{title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-snug">{desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Danger zone */}
        <Reveal delay={200}>
          <div className="bg-slate-900/60 rounded-2xl border border-red-500/30 p-5 sm:p-6">
            <h2 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-4">
              Xavfli zona
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-200">Chat tarixini o'chirish</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {chats.length} ta chat saqlangan · Bu amalni qaytarib bo'lmaydi
                </p>
              </div>
              <button
                onClick={() => { if (confirm("Barcha chat tarixi o'chirilsinmi?")) clearAll() }}
                disabled={chats.length === 0}
                className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium bg-red-500/15 text-red-300 hover:bg-red-500/25 disabled:opacity-40 disabled:cursor-not-allowed border border-red-500/30 transition-colors"
              >
                Hammasini o'chir
              </button>
            </div>
          </div>
        </Reveal>

      </div>
    </div>
  )
}
