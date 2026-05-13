import { useSettings } from '../hooks/useSettings'
import { useChats } from '../context/ChatContext'
import { useAuth } from '../context/AuthContext'

const PLANS = [
  {
    name: 'Bepul',
    price: '0',
    color: 'border-gray-200',
    badge: null,
    current: true,
    features: [
      'Kunlik 20 ta savol',
      'Konstitutsiya bazasi',
      '7 kunlik chat tarixi',
      'Asosiy hujjat ko\'rish',
    ],
    coming: [],
  },
  {
    name: 'Pro',
    price: '49 900 so\'m/oy',
    color: 'border-indigo-400',
    badge: 'Eng mashhur',
    current: false,
    features: [
      'Kunlik 500 ta savol',
      'Barcha qonunlar bazasi',
      'Cheksiz chat tarixi',
      'AI tahlil va xulosalar',
      'PDF / TXT eksport',
      'Ustuvor qo\'llab-quvvatlash',
    ],
    coming: ['API kirish', 'Advokat ulash'],
  },
  {
    name: 'Advokat',
    price: '149 900 so\'m/oy',
    color: 'border-purple-400',
    badge: 'Korporativ',
    current: false,
    features: [
      'Cheksiz savollar',
      'To\'liq qonunchilik arxivi',
      'Hujjat tahlili va tekshirish',
      'Ish holati kuzatuvi',
      'REST API kirish',
      'Jamoa hisobi (5 foydalanuvchi)',
      'Shaxsiy onboarding',
      'SLA kafolati 99.9%',
    ],
    coming: [],
  },
]

const FUTURE = [
  { icon: '📋', title: 'Hujjat tekshirish', desc: 'Shartnoma va hujjatlarni AI bilan tahlil qilish' },
  { icon: '⚖️', title: 'Advokat ulash', desc: 'Malakali advokatlar bilan to\'g\'ridan-to\'g\'ri bog\'lanish' },
  { icon: '📤', title: 'Chat eksport', desc: 'Suhbatni PDF yoki TXT formatda yuklab olish' },
  { icon: '🔔', title: 'Qonun yangiliklari', desc: 'Qonunchilikdagi o\'zgarishlar haqida bildirishnomalar' },
  { icon: '🗂️', title: 'Ish holati', desc: 'Huquqiy ishlaringizni kuzatib borish vositasi' },
  { icon: '🌐', title: 'Ko\'p tilli', desc: 'O\'zbek, Rus va Ingliz tillarida javob olish' },
]

export default function SettingsPage() {
  const { settings, update } = useSettings()
  const { clearAll, chats } = useChats()
  const { user } = useAuth()

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sozlamalar</h1>
          <p className="text-sm text-gray-400 mt-1">Hisob va ilova sozlamalari</p>
        </div>

        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Profil
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl font-bold">
              {user?.full_name?.charAt(0).toUpperCase() ?? '?'}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user?.full_name}</p>
              <p className="text-sm text-gray-400">{user?.email}</p>
              <span className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                user?.plan === 'pro' ? 'bg-indigo-100 text-indigo-700' :
                user?.plan === 'advokat' ? 'bg-purple-100 text-purple-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {user?.plan === 'pro' ? '⭐ Pro' : user?.plan === 'advokat' ? '👔 Advokat' : 'Bepul'}
              </span>
            </div>
          </div>
        </div>

        {/* Search settings */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-5">
            Qidiruv sozlamalari
          </h2>

          <div>
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-sm font-medium text-gray-800">Natijalar soni (k)</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Har bir savol uchun qancha modda qidiriladi
                </p>
              </div>
              <span className="text-lg font-bold text-indigo-600 bg-indigo-50 w-10 h-10 rounded-xl flex items-center justify-center">
                {settings.k}
              </span>
            </div>
            <input
              type="range"
              min={2}
              max={8}
              step={1}
              value={settings.k}
              onChange={(e) => update({ k: Number(e.target.value) })}
              className="w-full accent-indigo-600 mt-2"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>2 — tezroq</span>
              <span>8 — kengroq qidiruv</span>
            </div>
          </div>
        </div>

        {/* Subscription plans */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Obuna rejasi
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                To'liq imkoniyatlar uchun obunani yuksaltiring
              </p>
            </div>
            <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2.5 py-1 rounded-full font-medium">
              🔜 Tez orada
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-xl border-2 ${plan.color} p-5 flex flex-col`}
              >
                {plan.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap ${
                    plan.name === 'Pro' ? 'bg-indigo-600 text-white' : 'bg-purple-600 text-white'
                  }`}>
                    {plan.badge}
                  </div>
                )}

                <div className="mb-4">
                  <p className="font-bold text-gray-900">{plan.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{plan.price === '0' ? 'Bepul' : plan.price}</p>
                </div>

                <ul className="space-y-1.5 flex-1 mb-4">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-1.5 text-xs text-gray-600">
                      <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                  {plan.coming.map((f) => (
                    <li key={f} className="flex items-start gap-1.5 text-xs text-gray-400">
                      <svg className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {f} <span className="text-[10px] text-amber-500">(tez orada)</span>
                    </li>
                  ))}
                </ul>

                {plan.current ? (
                  <span className="w-full text-center py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">
                    Joriy reja
                  </span>
                ) : (
                  <button
                    disabled
                    className="w-full py-1.5 rounded-lg text-xs font-medium bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed"
                  >
                    🔜 Tez orada
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Coming soon features */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Kelajak imkoniyatlari
            </h2>
            <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
              Ishlab chiqilmoqda
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FUTURE.map((f) => (
              <div
                key={f.title}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100"
              >
                <span className="text-xl leading-none">{f.icon}</span>
                <div>
                  <p className="text-sm font-medium text-gray-700">{f.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-2xl border border-red-100 p-6">
          <h2 className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-4">
            Xavfli zona
          </h2>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-800">Chat tarixini o'chirish</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {chats.length} ta chat saqlangan · Bu amalni qaytarib bo'lmaydi
              </p>
            </div>
            <button
              onClick={() => { if (confirm("Barcha chat tarixi o'chirilsinmi?")) clearAll() }}
              disabled={chats.length === 0}
              className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed border border-red-200 transition-colors"
            >
              Hammasini o'chir
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
