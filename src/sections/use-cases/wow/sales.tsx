import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion'
import { Slack, Sun, Database, Check } from 'lucide-react'
import { GlassWindow } from '../components/mocks'

const ROLES = ['AE', 'SDR', 'RevOps', 'Manager'] as const
type Role = (typeof ROLES)[number]

function BriefSurface() {
  const items = [
    { t: 'Atlas Robotics revisited /pricing', tag: 'Hot', tone: 'text-emerald-300 bg-emerald-500/10' },
    { t: 'Reply from Lumen Cloud needs you', tag: 'Reply', tone: 'text-blue-300 bg-blue-500/10' },
    { t: 'Demo with Vertex Health · 11:00', tag: 'Prep ✓', tone: 'text-white/60 bg-white/5' },
  ]
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-white/70">
        <Sun className="h-3.5 w-3.5 text-amber-300" /> 8:00am · Your action list
      </div>
      <ul className="flex flex-col gap-1.5">
        {items.map((it) => (
          <li key={it.t} className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-2">
            <span className="flex-1 text-[12px] text-white/80">{it.t}</span>
            <span className={`rounded px-1.5 py-0.5 text-[9px] font-semibold ${it.tone}`}>{it.tag}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SlackSurface() {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
      <div className="flex items-center gap-1.5 border-b border-white/[0.06] pb-2 text-[11px] font-semibold text-white/70">
        <Slack className="h-3.5 w-3.5" /> Pre-call brief · in 30 min
      </div>
      <p className="mt-2 text-[12px] leading-[1.55] text-white/70">
        <span className="font-semibold text-white">Vertex Health</span> · Director IT. Raised Series A, hiring 3 engineers.
      </p>
      <ul className="mt-2 flex flex-col gap-1 text-[11px] text-white/50">
        <li>• Likely objection: security review timeline</li>
        <li>• Talking point: SOC 2 + SSO included</li>
      </ul>
    </div>
  )
}

function CrmSurface() {
  const rows = [
    ['Stage', 'Discovery → Demo'],
    ['Last touch', 'Email · auto-logged'],
    ['Next step', 'Proposal · due Fri'],
  ]
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
      <div className="flex items-center gap-1.5 border-b border-white/[0.06] pb-2 text-[11px] font-semibold text-white/70">
        <Database className="h-3.5 w-3.5 text-blue-300" /> CRM · auto-filled
      </div>
      <ul className="mt-2 flex flex-col gap-1.5">
        {rows.map(([k, v]) => (
          <li key={k} className="flex items-center gap-2 text-[11.5px]">
            <span className="w-20 text-white/40">{k}</span>
            <span className="flex-1 text-white/80">{v}</span>
            <Check className="h-3 w-3 text-emerald-400" strokeWidth={3} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function PipelineSurface() {
  const bars = [70, 52, 38, 24]
  return (
    <div>
      <div className="mb-2 text-[11px] font-semibold text-white/70">Team pipeline · accurate, live</div>
      <div className="flex flex-col gap-1.5">
        {bars.map((w, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-3 flex-1 overflow-hidden rounded bg-white/[0.04]">
              <motion.div className="h-full rounded bg-gradient-to-r from-[#4f46e5] to-blue-400" initial={{ width: 0 }} whileInView={{ width: `${w}%` }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.08 }} />
            </div>
            <span className="w-8 text-right font-mono text-[10px] text-white/40">{w}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const SURFACES: Record<Role, () => React.ReactElement> = {
  AE: BriefSurface,
  SDR: SlackSurface,
  RevOps: CrmSurface,
  Manager: PipelineSurface,
}

export function SalesHero() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.2 })
  const reduce = useReducedMotion()
  const [active, setActive] = useState<Role>('AE')
  const [auto, setAuto] = useState(true)

  useEffect(() => {
    if (reduce || !inView || !auto) return
    const id = setInterval(() => {
      setActive((r) => ROLES[(ROLES.indexOf(r) + 1) % ROLES.length])
    }, 2400)
    return () => clearInterval(id)
  }, [reduce, inView, auto])

  const Surface = SURFACES[active]
  return (
    <div ref={ref}>
      <GlassWindow title="app.outmate.ai — by role">
        <div role="tablist" aria-label="Surfaces by role" className="mb-3 flex gap-1.5">
          {ROLES.map((r) => (
            <button
              key={r}
              role="tab"
              aria-selected={active === r}
              onClick={() => {
                setActive(r)
                setAuto(false)
              }}
              className={`rounded-lg px-2.5 py-1.5 text-[11.5px] font-semibold transition-colors ${active === r ? 'bg-[#4f46e5] text-white' : 'bg-white/[0.04] text-white/50 hover:text-white/80'}`}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="min-h-[150px]">
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
              <Surface />
            </motion.div>
          </AnimatePresence>
        </div>
      </GlassWindow>
    </div>
  )
}

export function SalesDeepDive() {
  const surfaces: { role: Role; label: string }[] = [
    { role: 'AE', label: 'Daily brief · 8am' },
    { role: 'SDR', label: 'Slack pre-call' },
    { role: 'RevOps', label: 'CRM auto-fill' },
  ]
  return (
    <div className="mx-auto grid max-w-[960px] gap-4 md:grid-cols-3">
      {surfaces.map((s, i) => {
        const Surface = SURFACES[s.role]
        return (
          <motion.div
            key={s.role}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <GlassWindow title={s.label}>
              <Surface />
            </GlassWindow>
          </motion.div>
        )
      })}
    </div>
  )
}
