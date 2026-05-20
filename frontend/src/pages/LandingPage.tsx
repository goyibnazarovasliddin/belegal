import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  BoltIcon, BookIcon, LockIcon, SearchIcon, ChatBubbleIcon,
  DocumentIcon, CheckIcon, XIcon, ArrowRightIcon, ClockIcon,
} from '../components/Icons'
import Logo from '../components/Logo'
import Reveal from '../components/Reveal'

const FEATURES = [
  { Icon: BoltIcon,        title: 'Tezkor javob',  desc: 'Savolingizga soniyalar ichida aniq, moddalar bilan asoslangan javob olasiz.' },
  { Icon: BookIcon,        title: 'Aniq manbalar', desc: 'Har bir javob tegishli kodeks moddasi bilan to\'liq asoslanadi.' },
  { Icon: LockIcon,        title: 'Ishonchli',     desc: 'Faqat rasmiy qonun matni asosida ishlaydi. Hech qanday taxmin yo\'q.' },
  { Icon: SearchIcon,      title: 'Aqlli qidiruv', desc: 'BM25 algoritmi yordamida eng tegishli moddalarni topadi.' },
  { Icon: ChatBubbleIcon,  title: 'Chat tarixi',   desc: 'Barcha suhbatlaringiz saqlanadi. Istalgan vaqt qaytib ko\'rishingiz mumkin.' },
  { Icon: DocumentIcon,    title: 'Hujjat ko\'rish', desc: '5 ta asosiy kodeksni to\'liq o\'qing. Moddaga to\'g\'ridan-to\'g\'ri o\'ting.' },
]

const PLANS = [
  {
    name: 'Bepul', price: '0', period: '', badge: null,
    color: 'border-white/10',
    btnClass: 'bg-white/10 hover:bg-white/20 text-white',
    features: ['Kunlik 20 ta savol', '5 ta kodeks bazasi', 'Chat tarixi (7 kun)', 'Asosiy hujjat ko\'rish', 'BM25 qidiruv'],
    missing: ['AI tahlil', 'PDF eksport', 'API kirish'],
    cta: 'Hozir boshlash', available: true,
  },
  {
    name: 'Pro', price: '49 900', period: '/oy', badge: 'Eng mashhur',
    color: 'border-indigo-500/60',
    btnClass: 'bg-indigo-600 hover:bg-indigo-500 text-white',
    features: ['Kunlik 500 ta savol', 'Barcha qonunlar bazasi', 'Cheksiz chat tarixi', 'AI tahlil va xulosalar', 'PDF/TXT eksport', 'Ustuvor qo\'llab-quvvatlash'],
    missing: ['API kirish', 'Advokat ulash'],
    cta: 'Tez orada', available: false,
  },
  {
    name: 'Advokat', price: '149 900', period: '/oy', badge: 'Korporativ',
    color: 'border-purple-500/60',
    btnClass: 'bg-purple-600 hover:bg-purple-500 text-white',
    features: ['Cheksiz savollar', 'Barcha qonunlar + arxiv', 'Hujjat tahlili va tekshirish', 'Ish holati kuzatuvi', 'API kirish (REST)', 'Jamoa hisobi (5 foydalanuvchi)', 'Shaxsiy onboarding', 'SLA kafolati'],
    missing: [],
    cta: 'Tez orada', available: false,
  },
]

const STEPS = [
  { n: '01', title: 'Ro\'yxatdan o\'ting', desc: 'Email va parol bilan 30 soniyada hisob yarating.' },
  { n: '02', title: 'Savol bering',       desc: 'Huquqiy savolingizni oddiy tilda yozing.' },
  { n: '03', title: 'Javob oling',        desc: 'AI tegishli moddalarni topib, batafsil javob beradi.' },
]

export default function LandingPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-slate-950 text-white animate-fade-in">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <Logo size={36} />
            <span className="font-bold text-white text-lg tracking-tight">BeLegal</span>
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <Link to="/chat"
                className="inline-flex items-center gap-1.5 text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg transition-colors font-medium">
                Chatga o'tish
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5">
                  Kirish
                </Link>
                <Link to="/register"
                  className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg transition-colors font-medium">
                  Ro'yxatdan o'tish
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-28 px-6 text-center relative overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/20 blur-[100px] rounded-full pointer-events-none animate-fade-in" />

        <div className="relative max-w-4xl mx-auto">
          <Reveal>
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs px-3 py-1.5 rounded-full mb-8">
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
              O'zbekiston Respublikasi qonunchiligi asosida
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
              O'zbekiston Qonunlarini{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                AI bilan Tushunib Oling
              </span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              BeLegal — huquqiy savollaringizga rasmiy qonun moddalariga asoslangan,
              aniq va ishonchli javob beradigan AI yordamchi.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/register"
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-7 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/40">
                Bepul boshlash
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <Link to="/login"
                className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-7 py-3 rounded-xl font-semibold text-sm transition-all">
                Hisobga kirish
              </Link>
            </div>
          </Reveal>

          <Reveal delay={340}>
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
          </Reveal>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-3 tracking-tight">Nima uchun BeLegal?</h2>
              <p className="text-gray-400">Huquqiy ma'lumot olishning eng qulay yo'li</p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 80}>
                <div className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-2xl p-6 transition-colors h-full">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-indigo-300" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-3 tracking-tight">Qanday ishlaydi?</h2>
              <p className="text-gray-400">3 ta oddiy qadam</p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 120}>
                <div className="text-center">
                  <div className="text-4xl font-black text-indigo-500/30 mb-4">{s.n}</div>
                  <h3 className="font-semibold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6" id="pricing">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-3 tracking-tight">Obuna rejalari</h2>
              <p className="text-gray-400">Ehtiyojingizga mos rejani tanlang</p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {PLANS.map((plan, idx) => (
              <Reveal key={plan.name} delay={idx * 120}>
              <div
                className={`relative bg-white/[0.03] border-2 ${plan.color} rounded-2xl p-7 flex flex-col h-full`}>
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
                      <CheckIcon className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                  {plan.missing.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <XIcon className="w-4 h-4 text-gray-700 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                {plan.available ? (
                  <Link to="/register"
                    className={`w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-colors ${plan.btnClass}`}>
                    {plan.cta}
                  </Link>
                ) : (
                  <button disabled
                    className="w-full py-2.5 rounded-xl text-sm font-semibold bg-white/5 text-gray-500 cursor-not-allowed border border-white/5 inline-flex items-center justify-center gap-1.5">
                    <ClockIcon className="w-3.5 h-3.5" />
                    {plan.cta}
                  </button>
                )}
              </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Logo size={20} />
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
