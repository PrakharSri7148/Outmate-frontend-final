'use client'

import { motion } from 'framer-motion'
import {
  Activity, ArrowRight, BarChart3, CheckCircle2, ChevronUp,
  CircleDot, Database, GitBranch, Globe, Layers, RefreshCw,
  Sparkles, Target, TrendingUp, Users, Zap, Building2,
  Mail, Phone, Star, AlertCircle, Clock, Shield
} from 'lucide-react'

/* ─── animation helpers ─────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1] as const
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease, delay },
  viewport: { once: true, margin: '-8% 0px' },
})

/* ─── mock data ─────────────────────────────────────────────── */
const visitorFeed = [
  { company: 'Salesforce', role: 'VP Marketing', intent: 'High', status: 'Identified', time: '2s ago', color: '#22c55e' },
  { company: 'HubSpot', role: 'Head of Growth', intent: 'Medium', status: 'Enriched', time: '14s ago', color: '#a855f7' },
  { company: 'Gong.io', role: 'CRO', intent: 'High', status: 'CRM Synced', time: '31s ago', color: '#3b82f6' },
  { company: 'Outreach', role: 'Dir. Sales Ops', intent: 'High', status: 'Sequence Live', time: '1m ago', color: '#f59e0b' },
  { company: 'Drift', role: 'CMO', intent: 'Medium', status: 'Identified', time: '2m ago', color: '#22c55e' },
]

const pipelineMetrics = [
  { label: 'Visitors Identified', value: '2,847', delta: '+18%', up: true },
  { label: 'Accounts Enriched', value: '1,203', delta: '+31%', up: true },
  { label: 'Sequences Triggered', value: '489', delta: '+24%', up: true },
  { label: 'Pipeline Generated', value: '$4.2M', delta: '+41%', up: true },
]

const intentSignals = [
  { label: 'Pricing page visited', count: 47, spike: true },
  { label: 'Demo page viewed', count: 23, spike: true },
  { label: 'Competitor comparison', count: 18, spike: false },
  { label: 'Integration docs read', count: 61, spike: true },
]

const workflowNodes = [
  { id: 1, label: 'Visitor Detected', icon: Globe, color: '#7C3AED' },
  { id: 2, label: 'Identity Resolved', icon: Users, color: '#9B6BFF' },
  { id: 3, label: 'Account Enriched', icon: Database, color: '#A855F7' },
  { id: 4, label: 'Intent Scored', icon: Target, color: '#7C3AED' },
  { id: 5, label: 'CRM Synced', icon: RefreshCw, color: '#6D28D9' },
  { id: 6, label: 'Sequence Live', icon: Zap, color: '#9B6BFF' },
]

const enrichmentFields = [
  { label: 'Company', value: 'Salesforce Inc.', icon: Building2 },
  { label: 'Email', value: 'vp.mktg@salesforce.com', icon: Mail },
  { label: 'Phone', value: '+1 (415) 901-7000', icon: Phone },
  { label: 'Intent Score', value: '94 / 100', icon: Target },
  { label: 'Employees', value: '79,000+', icon: Users },
  { label: 'ARR', value: '$34.9B', icon: BarChart3 },
]

const chartBars = [28, 42, 35, 58, 47, 72, 65, 88, 76, 94, 82, 100]
const trendLine = [20, 35, 28, 52, 44, 68, 60, 82, 74, 91, 85, 100]

/* ─── sub-components ────────────────────────────────────────── */

/** Subtle light editorial grid */
function GridBg() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage:
          'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 40%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 40%, transparent 100%)',
      }}
    />
  )
}

/** Soft lavender ambient glow — reduced ~50% opacity vs original */
function PurpleGlow({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full ${className}`}
      style={{
        background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.14) 0%, rgba(168,85,247,0.06) 40%, transparent 70%)',
        filter: 'blur(60px)',
      }}
    />
  )
}

/** Animated pulse dot */
function PulseDot({ color = '#22c55e' }: { color?: string }) {
  return (
    <span className="relative flex h-2 w-2">
      <span
        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
        style={{ backgroundColor: color }}
      />
      <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: color }} />
    </span>
  )
}

/** Mini sparkline SVG */
function Sparkline({ data, color = '#9B6BFF' }: { data: number[]; color?: string }) {
  const max = Math.max(...data)
  const w = 120, h = 36
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <polyline points={pts} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline
        points={`0,${h} ${pts} ${w},${h}`}
        fill={`url(#sg-${color.replace('#', '')})`}
        stroke="none"
      />
      <defs>
        <linearGradient id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/* ─── MAIN DASHBOARD CARD ───────────────────────────────────── */
function DashboardCard() {
  return (
    <motion.div
      {...fadeUp(0.25)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-[28px] overflow-hidden border border-white/[0.07] col-span-2 row-span-2"
      style={{ background: '#0D0D0D', minHeight: '620px' }}
    >
      {/* Purple glow behind dashboard */}
      <PurpleGlow className="w-[600px] h-[400px] -top-20 left-1/2 -translate-x-1/2" />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-white/30 text-xs font-mono">outmate.io / dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <PulseDot color="#22c55e" />
          <span className="text-white/40 text-xs">Live · 2,847 visitors</span>
        </div>
      </div>

      {/* Pipeline metrics row */}
      <div className="relative z-10 grid grid-cols-4 gap-px border-b border-white/[0.06]">
        {pipelineMetrics.map((m) => (
          <div key={m.label} className="px-4 py-3 bg-white/[0.015]">
            <div className="text-white/40 text-[10px] uppercase tracking-widest mb-1">{m.label}</div>
            <div className="flex items-end gap-2">
              <span className="text-white font-bold text-lg leading-none">{m.value}</span>
              <span className="text-[#22c55e] text-[10px] font-semibold flex items-center gap-0.5 mb-0.5">
                <ChevronUp size={10} />{m.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main content: visitor feed + intent signals */}
      <div className="relative z-10 grid grid-cols-5 gap-0 flex-1" style={{ minHeight: '380px' }}>
        {/* Visitor activity feed */}
        <div className="col-span-3 border-r border-white/[0.06] p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/60 text-xs font-semibold uppercase tracking-widest">Live Visitor Feed</span>
            <span className="text-[#9B6BFF] text-[10px] flex items-center gap-1"><Activity size={10} /> Real-time</span>
          </div>
          <div className="space-y-2">
            {visitorFeed.map((v, i) => (
              <motion.div
                key={v.company}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08, duration: 0.5, ease }}
                viewport={{ once: true }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-white/[0.1] transition-all duration-300"
              >
                <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                  <Building2 size={13} className="text-white/50" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-xs font-semibold truncate">{v.company}</span>
                    <span className="text-white/40 text-[10px] truncate">· {v.role}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md font-medium" style={{ background: `${v.color}18`, color: v.color }}>
                      {v.status}
                    </span>
                    {v.intent === 'High' && (
                      <span className="text-[10px] text-[#f59e0b] flex items-center gap-0.5">
                        <Sparkles size={9} /> High buying intent
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-white/25 text-[10px] flex-shrink-0">{v.time}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right panel: intent + AI recs */}
        <div className="col-span-2 flex flex-col">
          {/* Intent signals */}
          <div className="p-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-1.5 mb-3">
              <Target size={11} className="text-[#9B6BFF]" />
              <span className="text-white/60 text-xs font-semibold uppercase tracking-widest">Intent Signals</span>
            </div>
            <div className="space-y-2">
              {intentSignals.map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-white/50 text-[11px] truncate flex-1">{s.label}</span>
                  <div className="flex items-center gap-1.5 ml-2">
                    <span className="text-white text-xs font-bold">{s.count}</span>
                    {s.spike && <span className="text-[#f59e0b] text-[9px] font-semibold px-1 py-0.5 rounded bg-[#f59e0b]/10">SPIKE</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI recommendations */}
          <div className="p-4 flex-1">
            <div className="flex items-center gap-1.5 mb-3">
              <Sparkles size={11} className="text-[#9B6BFF]" />
              <span className="text-white/60 text-xs font-semibold uppercase tracking-widest">AI Recommendations</span>
            </div>
            <div className="space-y-2">
              {[
                { text: 'VP Marketing identified at Salesforce', action: 'Trigger sequence', color: '#22c55e' },
                { text: 'Intent spike detected — Gong.io', action: 'Enrich now', color: '#9B6BFF' },
                { text: 'HubSpot synced · 3 contacts added', action: 'View CRM', color: '#3b82f6' },
              ].map((r) => (
                <div key={r.text} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                  <p className="text-white/60 text-[10px] leading-relaxed">{r.text}</p>
                  <button className="mt-1.5 text-[10px] font-semibold flex items-center gap-1" style={{ color: r.color }}>
                    {r.action} <ArrowRight size={9} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CRM sync bar */}
      <div className="relative z-10 flex items-center gap-4 px-5 py-3 border-t border-white/[0.06] bg-white/[0.015]">
        {[
          { label: 'HubSpot synced', icon: CheckCircle2, color: '#22c55e' },
          { label: 'Outbound sequence triggered', icon: Zap, color: '#9B6BFF' },
          { label: 'Intent spike detected', icon: AlertCircle, color: '#f59e0b' },
          { label: 'Outreach connected', icon: Shield, color: '#3b82f6' },
        ].map((tag) => (
          <div key={tag.label} className="flex items-center gap-1.5">
            <tag.icon size={11} style={{ color: tag.color }} />
            <span className="text-white/40 text-[10px]">{tag.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

/* ─── ENRICHMENT CARD ───────────────────────────────────────── */
function EnrichmentCard() {
  return (
    <motion.div
      {...fadeUp(0.35)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-[28px] overflow-hidden border border-white/[0.08] p-6"
      style={{ background: '#F8F8F8' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-lg bg-[#7C3AED] flex items-center justify-center">
              <Database size={12} className="text-white" />
            </div>
            <span className="text-[#0D0D0D] font-bold text-sm">Real-time enrichment</span>
          </div>
          <p className="text-[#666] text-xs leading-relaxed max-w-[200px]">
            Verified emails, company data, and buying signals — instantly.
          </p>
        </div>
        <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-[#7C3AED]/10 text-[#7C3AED]">Live</span>
      </div>

      {/* Enrichment fields */}
      <div className="space-y-2">
        {enrichmentFields.map((f) => (
          <div key={f.label} className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white border border-black/[0.06]">
            <f.icon size={11} className="text-[#7C3AED] flex-shrink-0" />
            <span className="text-[#999] text-[10px] w-20 flex-shrink-0">{f.label}</span>
            <span className="text-[#0D0D0D] text-[10px] font-semibold truncate">{f.value}</span>
          </div>
        ))}
      </div>

      {/* Confidence bar */}
      <div className="mt-4 flex items-center gap-2">
        <span className="text-[#999] text-[10px]">Match confidence</span>
        <div className="flex-1 h-1.5 rounded-full bg-black/[0.08] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '94%' }}
            transition={{ duration: 1.2, ease, delay: 0.6 }}
            viewport={{ once: true }}
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #7C3AED, #A855F7)' }}
          />
        </div>
        <span className="text-[#7C3AED] text-[10px] font-bold">94%</span>
      </div>
    </motion.div>
  )
}

/* ─── AUTOMATION CARD ───────────────────────────────────────── */
function AutomationCard() {
  return (
    <motion.div
      {...fadeUp(0.4)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-[28px] overflow-hidden border border-white/[0.07] p-6"
      style={{ background: '#0D0D0D' }}
    >
      <PurpleGlow className="w-[300px] h-[200px] -top-10 -right-10" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-lg bg-[#7C3AED]/20 border border-[#7C3AED]/30 flex items-center justify-center">
            <GitBranch size={12} className="text-[#9B6BFF]" />
          </div>
          <span className="text-white font-bold text-sm">Workflow Automation</span>
        </div>
        <p className="text-white/40 text-xs mb-5">Zero-touch GTM pipeline activation</p>

        {/* Workflow nodes */}
        <div className="relative">
          {workflowNodes.map((node, i) => (
            <div key={node.id} className="relative">
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.5, ease }}
                viewport={{ once: true }}
                className="flex items-center gap-3 py-2"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border"
                  style={{ background: `${node.color}18`, borderColor: `${node.color}40` }}
                >
                  <node.icon size={12} style={{ color: node.color }} />
                </div>
                <span className="text-white/70 text-xs">{node.label}</span>
                <div className="ml-auto">
                  <CheckCircle2 size={12} className="text-[#22c55e]" />
                </div>
              </motion.div>
              {i < workflowNodes.length - 1 && (
                <div className="ml-3.5 w-px h-3 bg-gradient-to-b from-[#7C3AED]/40 to-transparent" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20">
          <Zap size={11} className="text-[#22c55e]" />
          <span className="text-[#22c55e] text-[10px] font-semibold">Outbound sequence triggered · 489 contacts</span>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── QUOTE CARD ────────────────────────────────────────────── */
function QuoteCard() {
  return (
    <motion.div
      {...fadeUp(0.45)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-[28px] overflow-hidden border border-white/[0.08] p-7"
      style={{ background: '#F8F8F8' }}
    >
      <div className="flex gap-0.5 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={12} fill="#7C3AED" className="text-[#7C3AED]" />
        ))}
      </div>
      <blockquote className="text-[#0D0D0D] text-sm font-medium leading-relaxed mb-5">
        "Outmate replaced hours of manual prospecting with instant pipeline visibility. We went from 3-day research cycles to real-time intent activation."
      </blockquote>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center">
          <span className="text-white text-xs font-bold">JR</span>
        </div>
        <div>
          <div className="text-[#0D0D0D] text-xs font-semibold">Jordan Rivera</div>
          <div className="text-[#999] text-[10px]">VP Sales · Momentum.io</div>
        </div>
        <div className="ml-auto px-2 py-1 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20">
          <span className="text-[#7C3AED] text-[9px] font-semibold">Verified customer</span>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── ANALYTICS CARD ────────────────────────────────────────── */
function AnalyticsCard() {
  return (
    <motion.div
      {...fadeUp(0.5)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-[28px] overflow-hidden border border-white/[0.07] p-6"
      style={{ background: '#0D0D0D' }}
    >
      <PurpleGlow className="w-[250px] h-[180px] -bottom-10 -left-10" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <BarChart3 size={13} className="text-[#9B6BFF]" />
              <span className="text-white font-bold text-sm">Pipeline Analytics</span>
            </div>
            <p className="text-white/40 text-[10px]">Last 12 weeks · All sources</p>
          </div>
          <div className="text-right">
            <div className="text-white font-bold text-lg">$4.2M</div>
            <div className="text-[#22c55e] text-[10px] flex items-center gap-0.5 justify-end">
              <TrendingUp size={9} /> +41% MoM
            </div>
          </div>
        </div>

        {/* Bar chart */}
        <div className="flex items-end gap-1 h-16 mb-3">
          {chartBars.map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              whileInView={{ height: `${h}%` }}
              transition={{ delay: 0.6 + i * 0.04, duration: 0.6, ease }}
              viewport={{ once: true }}
              className="flex-1 rounded-sm"
              style={{
                background: i >= 9
                  ? 'linear-gradient(180deg, #A855F7, #7C3AED)'
                  : 'rgba(168,85,247,0.25)',
                minHeight: '4px',
              }}
            />
          ))}
        </div>

        {/* Trend sparklines */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <div className="text-white/40 text-[9px] uppercase tracking-widest mb-1.5">Visitor Trend</div>
            <Sparkline data={trendLine} color="#9B6BFF" />
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <div className="text-white/40 text-[9px] uppercase tracking-widest mb-1.5">Engagement</div>
            <Sparkline data={chartBars} color="#22c55e" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── IDENTITY CARD ─────────────────────────────────────────── */
function IdentityCard() {
  return (
    <motion.div
      {...fadeUp(0.3)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-[28px] overflow-hidden border border-white/[0.07] p-6"
      style={{ background: '#0D0D0D' }}
    >
      <PurpleGlow className="w-[200px] h-[150px] top-0 right-0" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-lg bg-[#7C3AED]/20 border border-[#7C3AED]/30 flex items-center justify-center">
            <Layers size={12} className="text-[#9B6BFF]" />
          </div>
          <span className="text-white font-bold text-sm">Identity Resolution</span>
        </div>
        <p className="text-white/40 text-xs mb-4">Anonymous → identified in milliseconds</p>

        <div className="space-y-2">
          {[
            { from: 'Anonymous visitor', to: 'VP Marketing · Salesforce', ms: '120ms' },
            { from: 'Unknown IP', to: 'Head of Growth · HubSpot', ms: '89ms' },
            { from: 'Untracked session', to: 'CRO · Gong.io', ms: '145ms' },
          ].map((r) => (
            <div key={r.from} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <span className="text-white/30 text-[10px] flex-1 truncate">{r.from}</span>
              <ArrowRight size={9} className="text-[#7C3AED] flex-shrink-0" />
              <span className="text-white text-[10px] font-semibold flex-1 truncate">{r.to}</span>
              <span className="text-[#22c55e] text-[9px] font-mono flex-shrink-0">{r.ms}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Clock size={10} className="text-white/30" />
          <span className="text-white/30 text-[10px]">Avg resolution time</span>
          <span className="text-[#9B6BFF] text-[10px] font-bold ml-auto">118ms</span>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── MAIN EXPORT ───────────────────────────────────────────── */
export default function FeatureShowcase() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: '#F6F6F4' }}
    >
      {/* Background grid */}
      <GridBg />

      {/* Very subtle bottom ambient — barely visible on light bg */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(124,58,237,0.025) 0%, transparent 70%)',
        }}
      />

      {/* Section container */}
      <div className="relative z-10 max-w-[1700px] mx-auto px-6 md:px-12 pt-40 pb-20">

        {/* ── TOP HEADER ROW ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14 items-end">
          {/* Left: headline */}
          <motion.div {...fadeUp(0)}>
            <div className="flex items-center gap-2 mb-5">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-black/10 bg-black/[0.04]">
                <CircleDot size={10} className="text-black/40" />
                <span className="text-black/50 text-xs font-semibold tracking-wide">Platform Overview</span>
              </div>
            </div>
            <h2
              className="font-black leading-[0.9] tracking-[-0.07em]"
              style={{ fontSize: 'clamp(2.8rem, 5vw, 4.8rem)', color: '#0D0D0D' }}
            >
              IDENTIFY VISITORS<br />
              IN MINUTES, NOT MONTHS.
            </h2>
          </motion.div>

          {/* Right: subtext */}
          <motion.div {...fadeUp(0.12)}>
            <p className="text-xl leading-relaxed max-w-[620px] mt-6 lg:mt-0" style={{ color: '#3D3D3D' }}>
              Outmate helps GTM teams identify anonymous visitors, enrich accounts instantly,
              and activate outbound workflows without manual research.
            </p>
            <div className="flex items-center gap-4 mt-6">
              {/* Primary button */}
              <button
                className="group flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold text-white transition-all duration-200"
                style={{ backgroundColor: '#111111' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#2a2a2a')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#111111')}
              >
                See platform <ArrowRight size={14} />
              </button>
              {/* Secondary button */}
              <button
                className="flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold transition-all duration-200"
                style={{ border: '1px solid rgba(0,0,0,0.10)', color: '#111111', backgroundColor: 'transparent' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Documentation
              </button>
            </div>
          </motion.div>
        </div>

        {/* ── BENTO GRID ── */}
        <div className="flex flex-col gap-5">

          {/* Row 1: Dashboard (left 2/3) + Identity+Enrichment stack (right 1/3) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
            <div className="lg:col-span-2">
              <DashboardCard />
            </div>
            <div className="flex flex-col gap-5">
              <IdentityCard />
              <EnrichmentCard />
            </div>
          </div>

          {/* Row 2: Automation + Quote + Analytics — flush below row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
            <AutomationCard />
            <QuoteCard />
            <AnalyticsCard />
          </div>

        </div>
      </div>
    </section>
  )
}
