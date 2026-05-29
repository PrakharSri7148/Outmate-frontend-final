import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UserSearch,
  Activity,
  Target,
  Sparkles,
  Send,
  Handshake,
  Check,
  ArrowRight,
  Mail,
  CalendarCheck,
  TrendingUp,
} from 'lucide-react'

// ──────────────────────────────────────────────────────────────────────────────
//  Shared visual primitives (light theme, on-brand)
// ──────────────────────────────────────────────────────────────────────────────
const panelStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}
const panelItem = {
  hidden: { opacity: 0, y: 14, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
}

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div
      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-[13px] font-bold"
      style={{ background: `${color}1a`, color, boxShadow: `inset 0 0 0 1px ${color}33` }}
    >
      {initials}
    </div>
  )
}

// ── Step 1 · Identify — live visitor feed ──────────────────────────────────────
const VISITORS = [
  { name: 'Amanda Lee', role: 'VP Growth · Notion', score: 94, color: '#3b82f6' },
  { name: 'Marcus Chen', role: 'Revenue Ops · Rippling', score: 88, color: '#10b981' },
  { name: 'Sarah Kim', role: 'GTM Lead · Vercel', score: 91, color: '#f59e0b' },
  { name: 'Jordan Park', role: 'Head of Sales · Linear', score: 86, color: '#8b5cf6' },
]
function IdentifyVisual() {
  return (
    <motion.div variants={panelStagger} initial="hidden" animate="show" className="flex h-full flex-col gap-2.5">
      <motion.div variants={panelItem} className="mb-1 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">Live visitor feed</span>
        <span className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-mono text-[10px] font-semibold text-emerald-500">LIVE</span>
        </span>
      </motion.div>
      {VISITORS.map((v) => (
        <motion.div
          key={v.name}
          variants={panelItem}
          className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-3.5 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
        >
          <Avatar initials={v.name.split(' ').map((n) => n[0]).join('')} color={v.color} />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[14px] font-semibold text-slate-800">{v.name}</div>
            <div className="truncate text-[12px] text-slate-400">{v.role}</div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="font-mono text-[13px] font-bold" style={{ color: v.color }}>{v.score}</span>
            <div className="h-1 w-14 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className="h-full rounded-full"
                style={{ background: v.color }}
                initial={{ width: 0 }}
                animate={{ width: `${v.score}%` }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

// ── Step 2 · Intent Signals — activity + intent meter ──────────────────────────
const SIGNALS = [
  { label: 'Viewed Pricing', meta: '3× this week' },
  { label: 'Read Docs · API', meta: '8 min session' },
  { label: 'Compared vs RB2B', meta: 'Just now' },
]
function IntentVisual() {
  return (
    <motion.div variants={panelStagger} initial="hidden" animate="show" className="flex h-full flex-col gap-3">
      <motion.div
        variants={panelItem}
        className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
      >
        <Avatar initials="AL" color="#3b82f6" />
        <div className="min-w-0 flex-1">
          <div className="text-[14px] font-semibold text-slate-800">Amanda Lee</div>
          <div className="text-[12px] text-slate-400">VP Growth · Notion</div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 ring-1 ring-emerald-200/70">
          <TrendingUp className="h-3 w-3" /> Intent rising
        </span>
      </motion.div>

      {/* Intent over time */}
      <motion.div variants={panelItem} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">Buying intent</span>
          <span className="font-mono text-[12px] font-bold text-blue-600">94 / 100</span>
        </div>
        <div className="flex h-16 items-end gap-1.5">
          {[28, 35, 30, 48, 52, 60, 58, 72, 80, 76, 88, 94].map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t-md bg-gradient-to-t from-blue-500/70 to-indigo-500"
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.6, delay: 0.25 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
        </div>
      </motion.div>

      {SIGNALS.map((s) => (
        <motion.div
          key={s.label}
          variants={panelItem}
          className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-3.5 py-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Activity className="h-3.5 w-3.5" />
          </span>
          <span className="flex-1 text-[13px] font-medium text-slate-700">{s.label}</span>
          <span className="text-[11px] text-slate-400">{s.meta}</span>
        </motion.div>
      ))}
    </motion.div>
  )
}

// ── Step 3 · Qualify — ICP scorecard ───────────────────────────────────────────
const CRITERIA = [
  'Matches ideal company size',
  'Tech stack aligns with ICP',
  'Decision-maker on site',
  'Active buying-intent signals',
]
function QualifyVisual() {
  const score = 95
  const R = 34
  const C = 2 * Math.PI * R
  return (
    <motion.div variants={panelStagger} initial="hidden" animate="show" className="flex h-full flex-col gap-4">
      <motion.div
        variants={panelItem}
        className="flex items-center gap-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
      >
        <div className="relative h-[88px] w-[88px] flex-shrink-0">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r={R} fill="none" stroke="#eef2f7" strokeWidth="8" />
            <motion.circle
              cx="40" cy="40" r={R} fill="none" stroke="url(#qgrad)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={C}
              initial={{ strokeDashoffset: C }}
              animate={{ strokeDashoffset: C - (C * score) / 100 }}
              transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            />
            <defs>
              <linearGradient id="qgrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-[22px] font-extrabold leading-none text-slate-800">{score}</span>
            <span className="text-[9px] font-medium uppercase tracking-wider text-slate-400">ICP fit</span>
          </div>
        </div>
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 ring-1 ring-emerald-200/70">
            Qualified lead
          </div>
          <div className="mt-2 text-[14px] font-semibold text-slate-800">Northwind Co.</div>
          <div className="text-[12px] text-slate-400">1,000–5,000 employees · $50M ARR</div>
        </div>
      </motion.div>

      <motion.div variants={panelItem} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">Qualification criteria</span>
        <div className="mt-3 flex flex-col gap-2.5">
          {CRITERIA.map((c, i) => (
            <motion.div
              key={c}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.12 }}
              className="flex items-center gap-3"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              <span className="text-[13px] text-slate-600">{c}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Step 4 · Enrich — appended data fields ─────────────────────────────────────
const FIELDS = [
  ['Work Email', 'amanda@notion.so'],
  ['Mobile', '+1 (415) 555-0192'],
  ['Company Size', '1,000–5,000'],
  ['Annual Revenue', '$50M–$100M'],
  ['Tech Stack', 'Salesforce · Slack'],
  ['LinkedIn', '/in/amandalee'],
]
function EnrichVisual() {
  return (
    <motion.div variants={panelStagger} initial="hidden" animate="show" className="flex h-full flex-col gap-4">
      <motion.div
        variants={panelItem}
        className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
      >
        <Avatar initials="AL" color="#3b82f6" />
        <div className="flex-1">
          <div className="text-[14px] font-semibold text-slate-800">Amanda Lee</div>
          <div className="text-[12px] text-slate-400">VP Growth · Notion</div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-600 ring-1 ring-blue-200/70">
          <Sparkles className="h-3 w-3" /> Enriched
        </span>
      </motion.div>

      <div className="grid grid-cols-2 gap-2.5">
        {FIELDS.map(([label, value]) => (
          <motion.div
            key={label}
            variants={panelItem}
            className="rounded-xl border border-slate-200/80 bg-white px-3.5 py-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          >
            <div className="text-[9px] font-medium uppercase tracking-wider text-slate-400">{label}</div>
            <div className="mt-0.5 truncate font-mono text-[12px] font-medium text-slate-700">{value}</div>
          </motion.div>
        ))}
      </div>

      <motion.div variants={panelItem} className="grid grid-cols-3 gap-2.5">
        {[['97%', 'Match rate'], ['32M+', 'Contacts'], ['<2s', 'Speed']].map(([v, l]) => (
          <div key={l} className="flex flex-col items-center rounded-xl border border-slate-200/80 bg-white py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <span className="font-mono text-[16px] font-extrabold text-slate-800">{v}</span>
            <span className="text-[10px] text-slate-400">{l}</span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}

// ── Step 5 · Engage — AI message + sequence ────────────────────────────────────
const SEQUENCE = [
  { label: 'Personalized email sent', done: true },
  { label: 'LinkedIn connect queued', done: true },
  { label: 'Follow-up scheduled · Day 3', done: false },
]
function EngageVisual() {
  return (
    <motion.div variants={panelStagger} initial="hidden" animate="show" className="flex h-full flex-col gap-4">
      <motion.div variants={panelItem} className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Mail className="h-3.5 w-3.5" />
          </span>
          <span className="text-[12px] font-medium text-slate-600">To: amanda@notion.so</span>
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
            <Sparkles className="h-2.5 w-2.5" /> AI draft
          </span>
        </div>
        <div className="px-4 py-3.5 text-[13px] leading-relaxed text-slate-600">
          <p className="font-medium text-slate-800">Hi Amanda,</p>
          <p className="mt-1.5">
            Saw the Notion growth team is scaling fast — we help GTM leaders turn anonymous
            traffic into pipeline automatically. Worth a quick look?
          </p>
        </div>
      </motion.div>

      <div className="flex flex-col gap-2.5">
        {SEQUENCE.map((s) => (
          <motion.div
            key={s.label}
            variants={panelItem}
            className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-3.5 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          >
            <span className={`flex h-5 w-5 items-center justify-center rounded-full ${s.done ? 'bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20' : 'bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20'}`}>
              {s.done ? <Check className="h-3 w-3" strokeWidth={3} /> : (
                <motion.span className="h-1.5 w-1.5 rounded-full bg-blue-500" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
              )}
            </span>
            <span className={`flex-1 text-[13px] ${s.done ? 'text-slate-600' : 'font-medium text-blue-600'}`}>{s.label}</span>
            {!s.done && (
              <motion.span className="font-mono text-[10px] text-blue-400" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.6, repeat: Infinity }}>
                queued
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ── Step 6 · Close — CRM sync (the hero of the screenshot) ──────────────────────
const INTEGRATIONS = [
  { name: 'HubSpot', letter: 'H', color: '#ff7a59' },
  { name: 'Salesforce', letter: 'S', color: '#00a1e0' },
  { name: 'Pipedrive', letter: 'P', color: '#111827' },
  { name: 'Close', letter: 'C', color: '#2bb1f5' },
  { name: 'Zoho', letter: 'Z', color: '#e42527' },
  { name: 'more', letter: '+20', color: '#64748b' },
]
function CloseVisual() {
  return (
    <motion.div variants={panelStagger} initial="hidden" animate="show" className="flex h-full flex-col gap-5">
      <motion.div
        variants={panelItem}
        className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.05)]"
      >
        <div className="flex items-start gap-3">
          <Avatar initials="JR" color="#f59e0b" />
          <div className="flex-1">
            <div className="text-[15px] font-bold text-slate-800">Jamie Rodriguez</div>
            <div className="text-[12px] text-slate-400">VP Marketing · Northwind Co.</div>
          </div>
          <span className="rounded-md bg-emerald-500 px-2 py-1 text-[11px] font-bold text-white">ICP 95</span>
        </div>
        <div className="mt-3.5 flex gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1.5 text-[12px] font-semibold text-blue-600">
            <Mail className="h-3.5 w-3.5" /> Replied
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1.5 text-[12px] font-semibold text-blue-600">
            <CalendarCheck className="h-3.5 w-3.5" /> Meeting booked
          </span>
        </div>
      </motion.div>

      <motion.div variants={panelItem} className="grid grid-cols-3 gap-2.5">
        {INTEGRATIONS.map((it) => (
          <div
            key={it.name}
            className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200/80 bg-white py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(15,23,42,0.08)]"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-[14px] font-extrabold text-white"
              style={{ background: it.color }}
            >
              {it.letter}
            </div>
            <span className="text-[11px] font-medium text-slate-500">{it.name}</span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
//  Step definitions
// ──────────────────────────────────────────────────────────────────────────────
const STEPS = [
  {
    label: 'Identify',
    icon: UserSearch,
    badge: 'Identify',
    title: { pre: 'Reveal the people behind ', hl: 'anonymous traffic', post: '.' },
    description:
      'Deploy one lightweight pixel and instantly resolve names, companies, and roles from the 70–80% of visitors who never fill out a form.',
    bullets: ['Real-time, account-level identification', 'No forms, no cookies-only guesswork', 'Works on every page of your site'],
    Visual: IdentifyVisual,
  },
  {
    label: 'Intent Signals',
    icon: Activity,
    badge: 'Intent',
    title: { pre: 'Read buying ', hl: 'intent', post: ' as it happens.' },
    description:
      'Track page paths, visit depth, and behavioral clusters to surface high-value buying moments the second they start to form.',
    bullets: ['Live behavioral signal tracking', 'Intent scoring out of 100', 'Catch buyers before they go cold'],
    Visual: IntentVisual,
  },
  {
    label: 'Qualify',
    icon: Target,
    badge: 'Qualify',
    title: { pre: 'Score every lead against ', hl: 'your ICP', post: '.' },
    description:
      'Outmate automatically grades each account on firmographics, tech stack, and intent so your team only sees leads worth their time.',
    bullets: ['Automatic ICP fit scoring', 'Custom qualification rules', 'Filter noise before it reaches sales'],
    Visual: QualifyVisual,
  },
  {
    label: 'Enrich',
    icon: Sparkles,
    badge: 'Enrich',
    title: { pre: 'Append ', hl: 'verified contact data', post: ' instantly.' },
    description:
      'Every identified lead is enriched with verified emails, mobile numbers, firmographics, and tech stack — from 32M+ B2B contacts.',
    bullets: ['97% match accuracy', 'Verified emails & direct dials', 'Enrichment in under 2 seconds'],
    Visual: EnrichVisual,
  },
  {
    label: 'Engage',
    icon: Send,
    badge: 'Engage',
    title: { pre: 'Reach out with ', hl: 'AI personalization', post: '.' },
    description:
      'Trigger multi-channel sequences with messaging written for each prospect — email, LinkedIn, and follow-ups, all on autopilot.',
    bullets: ['AI-personalized at scale', 'Email + LinkedIn sequences', 'Automatic, timed follow-ups'],
    Visual: EngageVisual,
  },
  {
    label: 'Close',
    icon: Handshake,
    badge: 'Close',
    title: { pre: 'Replies, meetings, and leads — ', hl: 'automatically in your CRM', post: '.' },
    description:
      'Every identified lead, reply, and meeting is pushed into HubSpot, Salesforce, Pipedrive or your CRM of choice — with full activity history so your sales team can take it from there.',
    bullets: ['Multiple native integrations (HubSpot, Salesforce & more)', 'Zapier + webhooks for everything else', 'Need something custom? We build integrations on demand'],
    Visual: CloseVisual,
  },
]

const DWELL = 6000

// ──────────────────────────────────────────────────────────────────────────────
//  Main export
// ──────────────────────────────────────────────────────────────────────────────
export default function HowItWorks() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const step = STEPS[active]

  // Auto-advance through steps; pauses on hover/focus
  useEffect(() => {
    if (paused) return
    const t = setTimeout(() => setActive((a) => (a + 1) % STEPS.length), DWELL)
    return () => clearTimeout(t)
  }, [active, paused])

  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-32">
      {/* Ambient light background */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'none' }} />
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-0" style={{ backgroundImage: 'none' }} />

      <div className="relative mx-auto max-w-[1280px] px-5 md:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 text-left md:mb-12"
        >
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.26em] text-blue-600">
            How it works
          </span>
          <h2
            className="mt-4 max-w-[28ch] font-display font-extrabold leading-[1.02] tracking-[-0.04em] text-black"
            style={{ fontSize: 'clamp(44px, 6.6vw, 88px)' }}
          >
            FROM ANONYMOUS CLICK TO CLOSED DEAL.
          </h2>
          <p className="mt-5 max-w-[70ch] text-[16px] leading-relaxed text-black md:text-[17px]">
            One platform takes a visitor through every step — identified, qualified, enriched, engaged, and
            handed to your team, ready to close.
          </p>
        </motion.div>

        {/* ── Step tabs ── */}
        <div
          className="flex gap-2.5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-6 md:overflow-visible"
          role="tablist"
          aria-label="How it works steps"
        >
          {STEPS.map((s, i) => {
            const isActive = i === active
            const Icon = s.icon
            return (
              <button
                key={s.label}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(i)}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                onFocus={() => setPaused(true)}
                onBlur={() => setPaused(false)}
                className={`group relative flex min-w-[150px] flex-shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all duration-300 md:min-w-0 ${
                  isActive
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-[0_10px_28px_-8px_rgba(59,130,246,0.55)]'
                    : 'border border-slate-200/80 bg-white/80 text-slate-700 hover:border-blue-200 hover:bg-white hover:shadow-[0_4px_14px_rgba(15,23,42,0.06)]'
                }`}
              >
                <span
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-colors ${
                    isActive ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span className="min-w-0">
                  <span className={`block font-mono text-[9px] font-semibold uppercase tracking-[0.14em] ${isActive ? 'text-white/70' : 'text-slate-400'}`}>
                    Step {i + 1}
                  </span>
                  <span className="block truncate text-[13px] font-semibold">{s.label}</span>
                </span>
              </button>
            )
          })}
        </div>

        {/* ── Progress line (per-step auto-advance timer) ── */}
        <div className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-slate-200/70">
          <motion.div
            key={`${active}-${paused}`}
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
            initial={{ width: '0%' }}
            animate={{ width: paused ? '0%' : '100%' }}
            transition={{ duration: paused ? 0 : DWELL / 1000, ease: 'linear' }}
          />
        </div>

        {/* ── Content card ── */}
        <div
          className="relative mt-8 overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_30px_70px_-30px_rgba(15,23,42,0.22)]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[0.92fr_1.08fr]">
            {/* LEFT · editorial copy */}
            <div className="relative flex flex-col justify-center px-7 py-9 md:px-12 md:py-14">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-blue-600 ring-1 ring-blue-100">
                    {step.badge}
                  </span>

                  <h3
                    className="mt-6 font-display font-bold leading-[1.05] tracking-[-0.035em] text-slate-900"
                    style={{ fontSize: 'clamp(26px, 2.7vw, 40px)' }}
                  >
                    {step.title.pre}
                    <span className="text-blue-600">{step.title.hl}</span>
                    {step.title.post}
                  </h3>

                  <p className="mt-5 max-w-[44ch] text-[15px] leading-[1.7] text-slate-500 md:text-[16px]">
                    {step.description}
                  </p>

                  <ul className="mt-7 flex flex-col gap-3">
                    {step.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-[14px] text-slate-600">
                        <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20">
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>

                  <button className="group mt-9 inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-[14px] font-semibold text-white shadow-[0_8px_22px_-8px_rgba(59,130,246,0.6)] transition-all hover:bg-blue-700 hover:shadow-[0_10px_26px_-8px_rgba(59,130,246,0.7)]">
                    Learn more
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* RIGHT · live product visual */}
            <div className="relative border-t border-slate-100 bg-gradient-to-br from-slate-50/80 to-slate-100/50 p-6 md:border-l md:border-t-0 md:p-9">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, rgba(15,23,42,0.05) 1px, transparent 1px)',
                  backgroundSize: '22px 22px',
                  maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 80%)',
                  WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 80%)',
                }}
              />
              <div className="relative flex min-h-[420px] items-center md:min-h-[480px]">
                <div className="w-full">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <step.Visual />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
