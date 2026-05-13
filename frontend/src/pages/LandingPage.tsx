import { Link } from 'react-router-dom'

const FEATURES = [
  {
    icon: '⚡',
    title: 'Tezkor javob',
    desc: 'Savolingizga soniyalar ichida aniq, moddalar bilan asoslangan javob olasiz.',
  },
  {
    icon: '📚',
    title: 'Aniq manbalar',
    desc: 'Har bir javob tegishli konstitutsiya moddasi bilan to\'liq asoslanadi.',
  },
  {
    icon: '🔒',
    title: 'Ishonchli',
    desc: 'Faqat rasmiy qonun matni asosida ishlaydi. Hech qanday taxmin yo\'q.',
  },
  {
    icon: '🔍',
    title: 'Aqlli qidiruv',
    desc: 'BM25 algoritmi yordamida eng tegishli moddalarni topadi.',
  },
  {
    icon: '💬',
    title: 'Chat tarixi',
    desc: 'Barcha suhbatlaringiz saqlanadi. Istalgan vaqt qaytib ko\'rishingiz mumkin.',
  },
  {
    icon: '📄',
    title: 'Hujjat ko\'rish',
    desc: 'Konstitutsiyani to\'liq o\'qing. Moddaga to\'g\'ridan-to\'g\'ri o\'ting.',
  },
]

const PLANS = [
  {
    name: 'Bepul',
    price: '0',
    period: '',
    badge: null,
    color: 'border-white/10',
    btnClass: 'bg-white/10 hover:bg-white/20 text-white',
    features: [
      'Kunlik 20 ta savol',
      'Konstitutsiya bazasi',
      'Chat tarixi (7 kun)',
      'Asosiy hujjat ko\'rish',
      'BM25 qidiruv',
    ],
    missing: ['Barcha qonunlar', 'AI tahlil', 'PDF eksport', 'API kirish'],
    cta: 'Hozir boshlash',
    available: true,
  },
  {
    name: 'Pro',
    price: '49 900',
    period: '/oy',
    badge: 'Eng mashhur',
    color: 'border-indigo-500',
    btnClass: 'bg-indigo-600 hover:bg-indigo-500 text-white',
    features: [
      'Kunlik 500 ta savol',
      'Barcha qonunlar bazasi',
      'Cheksiz chat tarixi',
      'AI tahlil va xulosalar',
      'PDF/TXT eksport',
      'Ustuvor qo\'llab-quvvatlash',
    ],
    missing: ['API kirish', 'Advokat ulash'],
    cta: 'Tez orada',
    available: false,
  },
  {
    name: 'Advokat',
    price: '149 900',
    period: '/oy',
    badge: 'Korporativ',
    color: 'border-purple-500',
    btnClass: 'bg-purple-600 hover:bg-purple-500 text-white',
    features: [
      'Cheksiz savollar',
      'Barcha qonunlar + arxiv',
      'Hujjat tahlili va tekshirish',
      'Ish holati kuzatuvi',
      'API kirish (REST)',
      'Jamoa hisobi (5 foydalanuvchi)',
      'Shaxsiy onboarding',
      'SLA kafolati',
    ],
    missing: [],
    cta: 'Tez orada',
    available: false,
  },
]

const STEPS = [
  { n: '01', title: 'Ro\'yxatdan o\'ting', desc: 'Email va parol bilan 30 soniyada hisob yarating.' },
  { n: '02', title: 'Savol bering', desc: 'Huquqiy savolingizni oddiy tilda yozing.' },
  { n: '03', title: 'Javob oling', desc: 'AI tegishli moddalarni topib, batafsil javob beradi.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚖️</span>
            <span className="font-bold text-white text-lg">BeLegal</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5"
            >
              Kirish
            </Link>
            <Link
              to="/register"
              className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg transition-colors font-medium"
            >
              Ro'yxatdan o'tish
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-28 px-6 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs px-3 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
            O'zbekiston Respublikasi Konstitutsiyasi asosida
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6">
            O'zbekiston Qonunlarini{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              AI bilan Tushunib Oling
            </span>
          </h1>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            BeLegal — huquqiy savollaringizga rasmiy qonun moddalariga asoslangan,
            aniq va ishonchli javob beradigan AI yordamchi.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-7 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-600/25"
            >
              Bepul boshlash
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-7 py-3 rounded-xl font-semibold text-sm transition-all"
            >
              Hisobga kirish
            </Link>
          </div>

          {/* Mock chat preview */}
          <div className="mt-16 max-w-2xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-4 text-left backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              <span className="text-xs text-gray-500 ml-2">BeLegal Chat</span>
            </div>
            <div className="flex justify-end mb-3">
              <div className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-xl rounded-tr-sm max-w-xs">
                So'z erkinligi haqida nimalar aytilgan?
              </div>
            </div>
            <div className="bg-white/5 text-gray-300 text-sm px-4 py-3 rounded-xl rounded-tl-sm max-w-sm">
              <p className="font-semibold text-white mb-1">33-modda — Fikrlash va so'z erkinligi</p>
              <p className="text-gray-400 text-xs leading-relaxed">
                "Har bir inson fikrlash, so'z va e'tiqod erkinligi huquqiga ega. Har kim istalgan
                axborotni izlash, olish va tarqatish huquqiga ega..."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-3">Nima uchun BeLegal?</h2>
            <p className="text-gray-400">Huquqiy ma'lumot olishning eng qulay yo'li</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white/3 hover:bg-white/5 border border-white/8 rounded-2xl p-6 transition-colors"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-3">Qanday ishlaydi?</h2>
            <p className="text-gray-400">3 ta oddiy qadam</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {STEPS.map((s) => (
              <div key={s.n} className="text-center">
                <div className="text-4xl font-black text-indigo-500/30 mb-4">{s.n}</div>
                <h3 className="font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6" id="pricing">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-3">Obuna rejalari</h2>
            <p className="text-gray-400">Ehtiyojingizga mos rejani tanlang</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white/3 border-2 ${plan.color} rounded-2xl p-7 flex flex-col`}
              >
                {plan.badge && (
                  <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-1 rounded-full ${
                    plan.name === 'Pro' ? 'bg-indigo-600 text-white' : 'bg-purple-600 text-white'
                  }`}>
                    {plan.badge}
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">{plan.price}</span>
                    {plan.price !== '0' && <span className="text-sm text-gray-400">so'm</span>}
                    <span className="text-sm text-gray-500">{plan.period}</span>
                  </div>
                  {plan.price === '0' && <span className="text-sm text-gray-500">Har doim bepul</span>}
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-gray-300">
                      <svg className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                  {plan.missing.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-gray-700 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                {plan.available ? (
                  <Link
                    to="/register"
                    className={`w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-colors ${plan.btnClass}`}
                  >
                    {plan.cta}
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl text-sm font-semibold bg-white/5 text-gray-500 cursor-not-allowed border border-white/5"
                  >
                    🔜 {plan.cta}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <span>⚖️</span>
            <span>BeLegal © 2025</span>
          </div>
          <p className="text-xs text-gray-600 text-center">
            Bu platforma huquqiy maslahat bermaydi. Rasmiy huquqiy yordam uchun advokat bilan bog'laning.
          </p>
        </div>
      </footer>
    </div>
  )
}
