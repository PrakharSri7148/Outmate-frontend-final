import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Check, Mail, Phone, Linkedin, Building2, Banknote, Cpu, GitBranch } from 'lucide-react'
import { GlassWindow, Avatar, ScoreChip } from '../components/mocks'

const FIELDS = [
  { icon: Mail, label: 'Verified email', value: 'd.whitfield@atlasrobotics.com' },
  { icon: Phone, label: 'Direct phone', value: '+1 (415) •••-2207' },
  { icon: Linkedin, label: 'LinkedIn', value: '/in/danawhitfield' },
  { icon: Building2, label: 'Company size', value: '540 employees' },
  { icon: Banknote, label: 'Funding', value: 'Series B · $48M' },
  { icon: Cpu, label: 'Tech stack', value: 'Salesforce, Segment' },
]

function useStepLoop(count: number, hold = 700) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.2 })
  const reduce = useReducedMotion()
  const [step, setStep] = useState(reduce ? count : 0)

  useEffect(() => {
    if (reduce) {
      setStep(count)
      return
    }
    if (!inView) return
    const id = setInterval(() => setStep((s) => (s >= count + 2 ? 0 : s + 1)), hold)
    return () => clearInterval(id)
  }, [reduce, inView, count, hold])

  return { ref, step: Math.min(step, count) }
}

export function EnrichHero() {
  const { ref, step } = useStepLoop(FIELDS.length, 650)
  return (
    <div ref={ref}>
      <GlassWindow title="Enriching lead — atlasrobotics.com">
        <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <Avatar initials="DW" size={38} />
          <div className="flex-1">
            <div className="text-[13px] font-semibold text-white/90">Dana Whitfield</div>
            <div className="text-[11px] text-white/40">Form filled · 0:00s ago</div>
          </div>
          <span className="rounded-md bg-amber-500/15 px-2 py-1 font-mono text-[10px] font-semibold text-amber-300 ring-1 ring-amber-500/25">
            enriching…
          </span>
        </div>
        <ul className="mt-3 flex flex-col gap-1.5">
          {FIELDS.map((f, i) => {
            const done = i < step
            const Icon = f.icon
            return (
              <li
                key={f.label}
                className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors duration-300 ${done ? 'bg-white/[0.03]' : ''}`}
              >
                <Icon className={`h-3.5 w-3.5 shrink-0 ${done ? 'text-blue-300' : 'text-white/25'}`} />
                <span className={`text-[11px] ${done ? 'text-white/45' : 'text-white/25'}`}>{f.label}</span>
                <span className="ml-auto truncate font-mono text-[11px] text-white/70">
                  {done ? (
                    <motion.span initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                      {f.value}
                    </motion.span>
                  ) : (
                    <span className="text-white/15">— — —</span>
                  )}
                </span>
                {done && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  </motion.span>
                )}
              </li>
            )
          })}
        </ul>
      </GlassWindow>
    </div>
  )
}

const REPS = [
  { initials: 'AE', name: 'West · Enterprise', active: true },
  { initials: 'AE', name: 'East · Mid-market', active: false },
  { initials: 'AE', name: 'Round-robin', active: false },
]

export function EnrichDeepDive() {
  const { ref, step } = useStepLoop(4, 800)
  const nodes = ['Form fill', 'Enrich', 'Score 92', 'Route']
  return (
    <div ref={ref} className="mx-auto max-w-[920px]">
      <GlassWindow title="Routing flow — inbound">
        <div className="flex flex-col gap-6 p-2 md:flex-row md:items-center">
          {/* pipeline */}
          <div className="flex flex-1 items-center justify-between gap-2">
            {nodes.map((n, i) => (
              <div key={n} className="flex items-center gap-2">
                <motion.div
                  animate={{
                    borderColor: step > i ? 'rgba(79,70,229,0.6)' : 'rgba(255,255,255,0.08)',
                    backgroundColor: step > i ? 'rgba(79,70,229,0.12)' : 'rgba(255,255,255,0.02)',
                  }}
                  className="rounded-xl border px-3 py-2 text-center"
                >
                  <span className={`text-[11px] font-semibold ${step > i ? 'text-white' : 'text-white/45'}`}>{n}</span>
                  {n.startsWith('Score') && <span className="ml-1"><ScoreChip score={92} /></span>}
                </motion.div>
                {i < nodes.length - 1 && (
                  <div className="relative h-px w-5 bg-white/10 md:w-7">
                    <motion.span
                      className="absolute inset-y-0 left-0 bg-blue-400"
                      animate={{ width: step > i ? '100%' : '0%' }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* branch to reps */}
          <div className="flex items-center gap-3">
            <GitBranch className="h-5 w-5 rotate-90 text-white/30 md:rotate-0" />
            <div className="flex flex-col gap-1.5">
              {REPS.map((r) => (
                <div
                  key={r.name}
                  className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 ${r.active && step >= 4 ? 'border-emerald-500/40 bg-emerald-500/[0.08]' : 'border-white/[0.06] bg-white/[0.02]'}`}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-white/10 text-[8px] font-bold text-white/70">{r.initials}</span>
                  <span className={`text-[10.5px] ${r.active && step >= 4 ? 'text-emerald-300' : 'text-white/45'}`}>{r.name}</span>
                  {r.active && step >= 4 && <Check className="ml-auto h-3 w-3 text-emerald-400" strokeWidth={3} />}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* speed metric */}
        <div className="mt-4 flex items-center justify-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] py-3">
          <span className="font-mono text-[12px] text-white/40 line-through">4 hrs</span>
          <span className="text-white/30">→</span>
          <span className="font-display text-[20px] font-extrabold tracking-[-0.02em] text-emerald-400">90 seconds</span>
          <span className="text-[11px] text-white/40">speed-to-lead</span>
        </div>
      </GlassWindow>
    </div>
  )
}
