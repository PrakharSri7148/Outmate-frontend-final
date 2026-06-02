import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Bot, MessageSquare, PhoneCall, Gauge, Linkedin, UserCog, Mail, ShieldCheck, Clock, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { GlassWindow } from '../components/mocks'

const SIGNALS = ['Series B · $48M', 'Visited /pricing', 'Hiring 4 AEs', 'Champion: Dana W.']
const EMAIL =
  'Hi Dana — congrats on the Series B. Noticed the Atlas team has been comparing pricing this week. Most VPs of Sales scaling robotics GTM use Outmate to turn anonymous traffic into booked meetings. Worth 15 minutes?'

function useTypewriter(full: string, speed = 22) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.3 })
  const reduce = useReducedMotion()
  const [n, setN] = useState(0)

  useEffect(() => {
    if (reduce) {
      setN(full.length)
      return
    }
    if (!inView) return
    let i = 0
    const id = setInterval(() => {
      i += 1
      if (i > full.length + 28) i = 0
      setN(Math.min(i, full.length))
    }, speed)
    return () => clearInterval(id)
  }, [reduce, inView, full, speed])

  return { ref, text: full.slice(0, n), done: n >= full.length }
}

export function AIOutboundHero() {
  const { ref, text, done } = useTypewriter(EMAIL)
  return (
    <div ref={ref}>
      <GlassWindow title="AI SDR · composing">
        <div className="mb-3 flex flex-wrap gap-1.5">
          <span className="mr-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
            <Sparkles className="h-3 w-3 text-blue-400" /> signals
          </span>
          {SIGNALS.map((s) => (
            <span key={s} className="rounded-md bg-blue-500/10 px-2 py-0.5 font-mono text-[10px] text-blue-200 ring-1 ring-blue-500/20">
              {s}
            </span>
          ))}
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5 text-[11px]">
            <span className="text-white/40">To: <span className="font-mono text-white/70">d.whitfield@atlasrobotics.com</span></span>
            <span className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[9px] text-white/40">from your Gmail</span>
          </div>
          <p className="mt-2.5 min-h-[88px] text-[12.5px] leading-[1.6] text-white/80">
            {text}
            {!done && <span className="ml-0.5 inline-block h-[14px] w-[2px] translate-y-0.5 animate-pulse bg-blue-400" />}
          </p>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-mono text-[10px] text-white/30">personalised · 1:1</span>
            <span className={`rounded-md px-2.5 py-1 text-[11px] font-semibold ${done ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/50'}`}>
              {done ? 'Sent ✓' : 'Drafting…'}
            </span>
          </div>
        </div>
      </GlassWindow>
    </div>
  )
}

const AGENTS: { icon: LucideIcon; name: string; job: string; status: string }[] = [
  { icon: Bot, name: 'AI SDR', job: 'Finds ICP, writes & sends', status: 'Running' },
  { icon: MessageSquare, name: 'Reply Handler', job: 'Classifies 7 reply types', status: 'Running' },
  { icon: PhoneCall, name: 'Voice AI', job: 'Calls in local hours', status: 'Running' },
  { icon: Gauge, name: 'ICP Scorer', job: 'Scores every contact 0-100', status: 'Running' },
  { icon: Linkedin, name: 'LinkedIn Outreach', job: 'Multi-touch follow-up', status: 'Running' },
  { icon: UserCog, name: 'Champion Tracker', job: 'Watches job changes', status: 'Running' },
]

export function AIOutboundDeepDive() {
  return (
    <div className="mx-auto max-w-[940px]">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {AGENTS.map((a, i) => {
          const Icon = a.icon
          return (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4f46e5]/15 text-blue-300">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" style={{ animation: 'sandbox-pulse 1.6s ease-in-out infinite' }} />
                  {a.status}
                </span>
              </div>
              <h4 className="mt-3.5 text-[14px] font-semibold text-white/90">{a.name}</h4>
              <p className="mt-1 text-[12px] leading-[1.5] text-white/45">{a.job}</p>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// Dedicated deliverability band (light) — rendered via the page's `deliverability` slot.
export function DeliverabilityBlock() {
  const items = [
    { icon: Mail, title: "Sends from your rep's own inbox", body: 'Native Gmail & Outlook via OAuth — not a shared warmup domain. Deliverability-wise, it is a real 1:1 email.' },
    { icon: ShieldCheck, title: 'SPF · DKIM · DMARC aligned', body: 'Authentication stays on your own sending domain, so messages land in the inbox and protect your reputation.' },
    { icon: Clock, title: 'TCPA-aware Voice AI', body: 'Honors Do Not Call lists, calls only in local business hours, and the AI introduces itself as AI on every call.' },
  ]
  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[1280px] px-5 md:px-8">
        <div className="max-w-[760px]">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.26em] text-blue-600">Deliverability</span>
          <h2 className="mt-4 font-display font-extrabold leading-[1.05] tracking-[-0.035em] text-black" style={{ fontSize: 'clamp(28px, 3.6vw, 46px)' }}>
            Lands in the inbox. Protects your domain.
          </h2>
          <p className="mt-5 text-[16px] leading-[1.7] text-slate-600 md:text-[17px]">
            The reason most AI SDR tools fail isn't the writing — it's the sending. Outmate sends like a human, from your own
            accounts, and stays compliant by design.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map((it, i) => {
            const Icon = it.icon
            return (
              <motion.div
                key={it.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-[24px] border border-slate-200 bg-slate-50/60 p-7"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-blue-600">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <h3 className="mt-5 font-display text-[17px] font-bold tracking-[-0.02em] text-slate-900">{it.title}</h3>
                <p className="mt-2 text-[14px] leading-[1.6] text-slate-600">{it.body}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
