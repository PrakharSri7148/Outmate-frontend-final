import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Radio, Database, Gauge, Slack, Mail, Banknote, UserCog, Eye, Swords } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { GlassWindow } from '../components/mocks'

function useCycle(count: number, ms = 1100) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.2 })
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  useEffect(() => {
    if (reduce || !inView) return
    const id = setInterval(() => setI((x) => (x + 1) % (count + 1)), ms)
    return () => clearInterval(id)
  }, [reduce, inView, count, ms])
  return { ref, active: reduce ? count : i }
}

const NODES: { icon: LucideIcon; label: string; tone: string }[] = [
  { icon: Banknote, label: 'Series B raised', tone: 'text-amber-300' },
  { icon: Database, label: 'Enrich account', tone: 'text-blue-300' },
  { icon: Gauge, label: 'Score ICP', tone: 'text-blue-300' },
  { icon: Slack, label: 'Alert rep', tone: 'text-emerald-300' },
  { icon: Mail, label: 'Draft email', tone: 'text-emerald-300' },
]

function Canvas({ active }: { active: number }) {
  return (
    <div className="flex flex-col gap-2.5">
      {NODES.map((n, i) => {
        const on = active > i
        const Icon = n.icon
        return (
          <div key={n.label} className="relative">
            <motion.div
              animate={{
                borderColor: on ? 'rgba(79,70,229,0.55)' : 'rgba(255,255,255,0.07)',
                backgroundColor: on ? 'rgba(79,70,229,0.10)' : 'rgba(255,255,255,0.02)',
              }}
              className="flex items-center gap-3 rounded-xl border px-3.5 py-2.5"
            >
              <span className={`flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.06] ${on ? n.tone : 'text-white/30'}`}>
                <Icon className="h-3.5 w-3.5" />
              </span>
              <span className={`text-[12.5px] font-medium ${on ? 'text-white/90' : 'text-white/40'}`}>{n.label}</span>
              {i === active - 1 && (
                <motion.span layoutId="pulse" className="ml-auto h-2 w-2 rounded-full bg-emerald-400" />
              )}
            </motion.div>
            {i < NODES.length - 1 && (
              <div className="ml-[26px] h-2.5 w-px bg-white/10">
                <motion.span className="block w-px bg-blue-400" animate={{ height: on ? '100%' : '0%' }} transition={{ duration: 0.3 }} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export function AutomateHero() {
  const { ref, active } = useCycle(NODES.length, 950)
  return (
    <div ref={ref}>
      <GlassWindow title="Workflow · funding-round play">
        <Canvas active={active} />
        <div className="mt-3 flex items-center justify-between rounded-lg bg-white/[0.02] px-3 py-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">signal → action</span>
          <span className="font-mono text-[11px] font-semibold text-emerald-400">&lt; 60s</span>
        </div>
      </GlassWindow>
    </div>
  )
}

const PLAYS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Banknote, title: 'Funding round', desc: 'New raise → warm intro + sequence' },
  { icon: UserCog, title: 'Champion job change', desc: 'Tracked move → re-intro at new co.' },
  { icon: Eye, title: 'Hot visitor reactivation', desc: 'Pricing revisit → instant Slack + email' },
  { icon: Swords, title: 'Competitor mention', desc: 'ICP mentions rival → battlecard play' },
]

export function AutomateDeepDive() {
  const { ref, active } = useCycle(NODES.length, 950)
  return (
    <div ref={ref} className="mx-auto grid max-w-[940px] items-start gap-5 md:grid-cols-[0.95fr_1.05fr]">
      <GlassWindow title="Visual workflow builder">
        <Canvas active={active} />
      </GlassWindow>
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Radio className="h-4 w-4 text-blue-400" />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">Templated plays</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {PLAYS.map((p, i) => {
            const Icon = p.icon
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3.5 transition-colors hover:border-white/15 hover:bg-white/[0.05]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4f46e5]/15 text-blue-300">
                  <Icon className="h-4 w-4" />
                </span>
                <h4 className="mt-3 text-[13px] font-semibold text-white/90">{p.title}</h4>
                <p className="mt-1 text-[11.5px] leading-[1.5] text-white/45">{p.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
