import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import {
  ArrowRight,
  BarChart3,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock3,
  Database,
  Filter,
  HeartPulse,
  Hexagon,
  Inbox,
  ListTree,
  Mic,
  PanelLeft,
  Play,
  Radar,
  Settings,
  Sparkles,
  Workflow,
} from 'lucide-react'

type SandboxTabId =
  | 'visitor'
  | 'enrichment'
  | 'copilot'
  | 'signals'
  | 'workflows'
  | 'outbound'
  | 'voice'
  | 'analytics'

type SandboxTab = {
  id: SandboxTabId
  label: string
  icon: typeof Sparkles
}

const sandboxTabs: SandboxTab[] = [
  { id: 'visitor', label: 'Visitor Intelligence', icon: Radar },
  { id: 'enrichment', label: 'Database Enrichment', icon: Database },
  { id: 'copilot', label: 'AI Copilot', icon: Bot },
  { id: 'signals', label: 'Signal Intelligence', icon: HeartPulse },
  { id: 'workflows', label: 'Workflows', icon: Workflow },
  { id: 'outbound', label: 'Outbound Engine', icon: ArrowRight },
  { id: 'voice', label: 'Voice Agent', icon: Mic },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
]

const sidebarItems = [
  { label: 'Dashboard', icon: PanelLeft, active: true },
  { label: 'Visitors', icon: Radar },
  { label: 'Accounts', icon: BriefcaseBusiness },
  { label: 'Contacts', icon: Database },
  { label: 'Signals', icon: HeartPulse },
  { label: 'Sequences', icon: ListTree },
  { label: 'Voice', icon: Mic },
  { label: 'Inbox', icon: Inbox, badge: '14' },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'Settings', icon: Settings },
]

const liveCompanies = [
  { company: 'OpenAI', visitor: 'Growth leadership team', intent: '96', pages: 'Pricing · Demo · Security', status: 'Hot', tone: 'bg-emerald-50 text-emerald-700 border-emerald-200', pulse: 'bg-emerald-500' },
  { company: 'HubSpot', visitor: 'RevOps director', intent: '91', pages: 'Comparisons · Use cases', status: 'Engaged', tone: 'bg-sky-50 text-sky-700 border-sky-200', pulse: 'bg-sky-500' },
  { company: 'Stripe', visitor: 'Enterprise marketing', intent: '88', pages: 'Platform · Integrations', status: 'Monitoring', tone: 'bg-amber-50 text-amber-700 border-amber-200', pulse: 'bg-amber-500' },
  { company: 'Salesforce', visitor: 'Demand gen leader', intent: '84', pages: 'Outbound · Security', status: 'Qualified', tone: 'bg-violet-50 text-violet-700 border-violet-200', pulse: 'bg-violet-500' },
  { company: 'Notion', visitor: 'Operations manager', intent: '79', pages: 'Workflow · Inbox', status: 'Warm', tone: 'bg-emerald-50 text-emerald-700 border-emerald-200', pulse: 'bg-emerald-500' },
  { company: 'Anthropic', visitor: 'Pipeline owner', intent: '94', pages: 'Demo · AI Copilot', status: 'Live', tone: 'bg-rose-50 text-rose-700 border-rose-200', pulse: 'bg-rose-500' },
]

const enrichmentRows = [
  { name: 'Maya Chen', company: 'OpenAI', role: 'VP Marketing', email: 'maya.chen@openai.com', phone: '+1 (415) 555-0184', linkedin: 'linkedin.com/in/maya-chen', score: 98 },
  { name: 'Jordan Patel', company: 'HubSpot', role: 'Head of Revenue Ops', email: 'jordan.patel@hubspot.com', phone: '+1 (617) 555-0128', linkedin: 'linkedin.com/in/jordan-patel', score: 95 },
  { name: 'Leila Morgan', company: 'Stripe', role: 'Demand Gen Director', email: 'leila.morgan@stripe.com', phone: '+1 (628) 555-0146', linkedin: 'linkedin.com/in/leila-morgan', score: 93 },
  { name: 'Ethan Brooks', company: 'Salesforce', role: 'VP Sales', email: 'ethan.brooks@salesforce.com', phone: '+1 (212) 555-0177', linkedin: 'linkedin.com/in/ethan-brooks', score: 91 },
  { name: 'Sara Kim', company: 'Notion', role: 'Marketing Ops Lead', email: 'sara.kim@notion.so', phone: '+1 (310) 555-0132', linkedin: 'linkedin.com/in/sara-kim', score: 89 },
]

const signalCards = [
  { title: 'Pricing Page Viewed', score: 98, time: '2m ago', tone: 'from-emerald-400/80 to-emerald-500' },
  { title: 'Demo Page Revisited', score: 95, time: '5m ago', tone: 'from-sky-400/80 to-sky-500' },
  { title: 'Competitor Comparison Viewed', score: 91, time: '11m ago', tone: 'from-violet-400/80 to-violet-500' },
  { title: 'Raised Funding', score: 88, time: '18m ago', tone: 'from-amber-400/80 to-amber-500' },
  { title: 'Hiring SDRs', score: 86, time: '23m ago', tone: 'from-rose-400/80 to-rose-500' },
  { title: 'New Leadership Hire', score: 84, time: '31m ago', tone: 'from-cyan-400/80 to-cyan-500' },
]

const outboundNodes = [
  { title: 'Email', detail: 'Personalized opener based on page intent', status: 'Sent' },
  { title: 'LinkedIn', detail: 'Connection request after profile visit', status: 'Queued' },
  { title: 'Voice', detail: 'Escalate to human call once threshold is met', status: 'Planned' },
  { title: 'Tasks', detail: 'Route to owner, update CRM, and set follow-up', status: 'Active' },
]

const analyticsMetrics = [
  { label: 'Revenue Generated', value: '$4.8M', delta: '+18.2%' },
  { label: 'Pipeline Influenced', value: '$12.4M', delta: '+24.5%' },
  { label: 'Meetings Booked', value: '186', delta: '+31' },
  { label: 'ROI', value: '11.6x', delta: '+2.1x' },
]

function SectionPill({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center rounded-full border border-black/10 bg-white px-4 py-2 text-[13px] font-semibold tracking-[-0.01em] text-black/80 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
      {children}
    </div>
  )
}

function MetricChip({ label, value, tint = 'bg-black' }: { label: string; value: string; tint?: string }) {
  return (
    <div className="rounded-2xl border border-black/8 bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-black/45">{label}</p>
        <span className={`h-2.5 w-2.5 rounded-full ${tint}`} />
      </div>
      <div className="mt-3 text-[30px] font-semibold tracking-[-0.05em] text-black">{value}</div>
    </div>
  )
}

function BrowserChrome() {
  return (
    <div className="border-b border-black/8 bg-white/95 px-4 py-3 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
          <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
          <span className="h-3 w-3 rounded-full bg-[#28C840]" />
        </div>
        <div className="ml-3 flex items-center gap-2 rounded-full border border-black/8 bg-[#F6F7F9] px-3 py-2 text-[13px] text-black/45 shadow-inner">
          <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-black/70 shadow-sm">app.outmate.ai</span>
          <span className="text-black/25">/</span>
          <span className="truncate">platform</span>
        </div>
        <div className="ml-auto flex items-center gap-2 text-black/45">
          <button className="rounded-full border border-black/8 bg-white px-3 py-2 text-[12px] font-medium transition hover:border-black/15 hover:bg-black/3">
            <Filter className="mr-1 inline-flex h-3.5 w-3.5" />
            Filter
          </button>
          <button className="rounded-full border border-black/8 bg-white px-3 py-2 text-[12px] font-medium transition hover:border-black/15 hover:bg-black/3">
            <Clock3 className="mr-1 inline-flex h-3.5 w-3.5" />
            Activity
          </button>
        </div>
      </div>
    </div>
  )
}

function Sidebar() {
  return (
    <aside className="hidden xl:flex xl:w-[252px] xl:flex-col border-r border-black/8 bg-[#FCFCFD]">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-black/6">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-black text-white shadow-sm">
          <Hexagon className="h-4.5 w-4.5" />
        </div>
        <div>
          <p className="text-[15px] font-semibold tracking-[-0.03em] text-black">Outmate</p>
          <p className="text-[12px] text-black/45">GTM operating system</p>
        </div>
      </div>

      <div className="flex-1 px-3 py-4">
        <div className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/35">Workspace</div>
        <div className="space-y-1.5">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-all ${
                  item.active
                    ? 'bg-black text-white shadow-[0_16px_32px_rgba(15,23,42,0.12)]'
                    : 'text-black/60 hover:bg-black/4 hover:text-black'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${item.active ? 'text-white' : 'text-black/40'}`} />
                <span className="text-[14px] font-medium tracking-[-0.01em]">{item.label}</span>
                {item.badge ? (
                  <span className="ml-auto rounded-full bg-emerald-500 px-2 py-0.5 text-[11px] font-semibold text-white">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>
      </div>

      <div className="p-4">
        <div className="rounded-[24px] border border-black/8 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] font-medium text-black/45">Credits left</p>
              <p className="mt-1 text-[20px] font-semibold tracking-[-0.04em] text-black">12k</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50">
              <span className="text-[11px] font-semibold text-emerald-600">67%</span>
            </div>
          </div>
          <button className="mt-4 w-full rounded-2xl bg-black px-4 py-3 text-[14px] font-semibold text-white transition hover:bg-black/90">
            Upgrade
          </button>
        </div>
      </div>
    </aside>
  )
}

function TabButton({
  tab,
  active,
  onClick,
}: {
  tab: SandboxTab
  active: boolean
  onClick: () => void
}) {
  const Icon = tab.icon
  return (
    <button
      onClick={onClick}
      className={`group relative inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-[13px] font-semibold tracking-[-0.01em] transition-all ${
        active
          ? 'border-black/8 bg-black text-white shadow-[0_12px_24px_rgba(15,23,42,0.12)]'
          : 'border-black/8 bg-white text-black/58 hover:bg-black/4 hover:text-black'
      }`}
    >
      <Icon className={`h-3.5 w-3.5 ${active ? 'text-white' : 'text-black/42'}`} />
      {tab.label}
    </button>
  )
}

function PanelFrame({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-black/8 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.08)]">
      <div className="flex items-center justify-between border-b border-black/6 px-5 py-4">
        <div>
          <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-black">{title}</h3>
          {subtitle ? <p className="mt-1 text-[13px] text-black/48">{subtitle}</p> : null}
        </div>
        <div className="flex items-center gap-2 text-[12px] font-medium text-black/45">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_6px_rgba(34,197,94,0.12)]" />
          Live
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function VisitorPanel() {
  return (
    <PanelFrame
      title="Anonymous Visitors Identified"
      subtitle="Live visitor feed with intent scoring, page depth, and active status."
    >
      <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-[24px] border border-black/8 bg-[#FCFCFD] p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[12px] uppercase tracking-[0.18em] text-black/35">Today</p>
              <p className="mt-1 text-[32px] font-semibold tracking-[-0.06em] text-black">2,486 live accounts</p>
            </div>
            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[12px] font-semibold text-emerald-700">
              +14 detected in the last 5 min
            </div>
          </div>

          <div className="overflow-hidden rounded-[20px] border border-black/8 bg-white">
            <div className="grid grid-cols-[1.05fr_1.15fr_0.65fr_1fr_0.7fr] border-b border-black/6 bg-black/[0.02] px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-black/42">
              <span>Company</span>
              <span>Visitor</span>
              <span>Intent</span>
              <span>Pages Viewed</span>
              <span>Status</span>
            </div>
            {liveCompanies.map((row, index) => (
              <div key={row.company} className={`grid grid-cols-[1.05fr_1.15fr_0.65fr_1fr_0.7fr] items-center px-4 py-3.5 text-[14px] ${index !== liveCompanies.length - 1 ? 'border-b border-black/6' : ''}`}>
                <div className="flex items-center gap-3 font-medium text-black">
                  <span className={`relative flex h-3 w-3 rounded-full ${row.pulse}`}>
                    <span className={`absolute inset-0 rounded-full ${row.pulse} animate-ping opacity-60`} />
                  </span>
                  {row.company}
                </div>
                <div className="text-black/72">{row.visitor}</div>
                <div>
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[12px] font-semibold ${row.tone}`}>
                    {row.intent}
                  </span>
                </div>
                <div className="text-black/60">{row.pages}</div>
                <div className="text-black/65">{row.status}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <MetricChip label="Online now" value="184" tint="bg-emerald-500" />
          <div className="rounded-[24px] border border-black/8 bg-[#FCFCFD] p-4">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-semibold tracking-[-0.02em] text-black">Activity pulse</p>
              <span className="rounded-full border border-black/8 bg-white px-2.5 py-1 text-[11px] font-semibold text-black/50">Updated 12s ago</span>
            </div>
            <div className="mt-4 space-y-3">
              {['OpenAI visited pricing', 'Anthropic revisited demo', 'Stripe returned from comparison', 'HubSpot hit the contact page'].map((item, index) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-black/6 bg-white px-3 py-2.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${index === 0 ? 'bg-emerald-500' : 'bg-sky-500'}`} />
                  <span className="text-[13px] text-black/68">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PanelFrame>
  )
}

function EnrichmentPanel() {
  return (
    <PanelFrame title="Database Enrichment" subtitle="Apollo-like data density with scoring, contact channels, and social context.">
      <div className="overflow-hidden rounded-[24px] border border-black/8 bg-[#FCFCFD]">
        <div className="grid grid-cols-[1fr_1fr_1fr_1.35fr_1fr_1.25fr_0.55fr] border-b border-black/6 bg-black/[0.02] px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-black/42">
          <span>Name</span>
          <span>Company</span>
          <span>Role</span>
          <span>Email</span>
          <span>Phone</span>
          <span>LinkedIn</span>
          <span>Score</span>
        </div>
        {enrichmentRows.map((row, index) => (
          <div key={row.email} className={`grid grid-cols-[1fr_1fr_1fr_1.35fr_1fr_1.25fr_0.55fr] items-center px-4 py-3.5 text-[14px] ${index !== enrichmentRows.length - 1 ? 'border-b border-black/6' : ''}`}>
            <div className="font-medium text-black">{row.name}</div>
            <div className="text-black/68">{row.company}</div>
            <div className="text-black/68">{row.role}</div>
            <div className="text-black/62">{row.email}</div>
            <div className="text-black/62">{row.phone}</div>
            <div className="text-black/60">{row.linkedin}</div>
            <div>
              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[12px] font-semibold text-emerald-700">{row.score}</span>
            </div>
          </div>
        ))}
      </div>
    </PanelFrame>
  )
}

function CopilotPanel() {
  const resultCards = [
    { title: 'Suggested contacts', detail: '47 VP Marketing and RevOps leaders across North America SaaS.' },
    { title: 'Intent insights', detail: '16 accounts hit pricing, demo, and comparison pages in one session.' },
    { title: 'Recommended actions', detail: 'Prioritize email, then route high-intent visitors to outbound sequences.' },
  ]

  return (
    <PanelFrame title="Ask Outmate Copilot" subtitle="The central command layer for discovery, reasoning, and next-best actions.">
      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[24px] border border-black/8 bg-[#FCFCFD] p-5">
          <p className="text-[12px] uppercase tracking-[0.18em] text-black/35">Prompt</p>
          <div className="mt-3 rounded-[24px] border border-black/8 bg-white px-4 py-4 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-black p-2 text-white shadow-sm">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-[15px] leading-[1.55] tracking-[-0.02em] text-black/88">
                  Find VP Marketing leaders at SaaS companies hiring SDRs in North America.
                </p>
                <div className="mt-4 flex items-center gap-2 text-[12px] text-black/42">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">Reasoning active</span>
                  <span className="rounded-full bg-black/[0.04] px-2.5 py-1 font-medium">9 signals matched</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {resultCards.map((card) => (
              <div key={card.title} className="rounded-[20px] border border-black/8 bg-white p-4">
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/38">{card.title}</p>
                <p className="mt-2 text-[13px] leading-[1.6] text-black/68">{card.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-[24px] border border-black/8 bg-[#FCFCFD] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] uppercase tracking-[0.18em] text-black/35">AI reasoning</p>
              <p className="mt-1 text-[20px] font-semibold tracking-[-0.04em] text-black">Why these accounts rank highest</p>
            </div>
            <div className="rounded-full border border-black/8 bg-white px-3 py-1.5 text-[12px] font-semibold text-black/55">Updated in real time</div>
          </div>

          <div className="rounded-[22px] border border-black/8 bg-white p-4">
            <div className="space-y-3 text-[14px] leading-[1.75] text-black/72">
              <p><span className="font-semibold text-black">1.</span> These companies show repeated pricing, demo, and comparison page visits.</p>
              <p><span className="font-semibold text-black">2.</span> Hiring signals indicate SDR team expansion and fresh pipeline pressure.</p>
              <p><span className="font-semibold text-black">3.</span> Recent leadership changes create a strong window for outbound relevance.</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {['OpenAI', 'HubSpot', 'Stripe', 'Anthropic'].map((company, index) => (
              <div key={company} className="rounded-[20px] border border-black/8 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-black">{company}</p>
                  <span className="text-[12px] font-semibold text-emerald-600">{98 - index * 2}</span>
                </div>
                <p className="mt-2 text-[13px] leading-[1.6] text-black/60">High-fit account. Signal density suggests immediate outreach.</p>
              </div>
            ))}
          </div>

          <div className="rounded-[22px] border border-black/8 bg-black px-4 py-4 text-white">
            <p className="text-[12px] uppercase tracking-[0.18em] text-white/45">Recommended actions</p>
            <div className="mt-3 space-y-2 text-[14px] text-white/78">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" />Push to SDR queue with intent score &gt; 90</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" />Generate personalized opener from visited pages</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" />Trigger outreach sequence and notify owner</div>
            </div>
          </div>
        </div>
      </div>
    </PanelFrame>
  )
}

function SignalsPanel() {
  return (
    <PanelFrame title="Signal Intelligence" subtitle="High-signal moments surfaced as live cards with score, timing, and context.">
      <div className="grid gap-4 lg:grid-cols-3">
        {signalCards.map((card) => (
          <div key={card.title} className="rounded-[24px] border border-black/8 bg-[#FCFCFD] p-4 shadow-[0_12px_36px_rgba(15,23,42,0.04)]">
            <div className={`h-1.5 rounded-full bg-gradient-to-r ${card.tone}`} />
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-[18px] font-semibold tracking-[-0.03em] text-black">{card.title}</p>
                <p className="mt-2 text-[13px] text-black/55">Live activity update from the last hour.</p>
              </div>
              <div className="rounded-full border border-black/8 bg-white px-3 py-1.5 text-[12px] font-semibold text-black/55">{card.time}</div>
            </div>
            <div className="mt-5 flex items-end justify-between gap-4">
              <div className="text-[36px] font-semibold tracking-[-0.05em] text-black">{card.score}</div>
              <div className="flex items-center gap-2 text-[12px] font-semibold text-emerald-700">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </div>
            </div>
          </div>
        ))}
      </div>
    </PanelFrame>
  )
}

function WorkflowsPanel() {
  const nodes = ['Visitor Identified', 'Enrich Account', 'Score Intent', 'Send Email', 'Notify Sales Rep']

  return (
    <PanelFrame title="Workflows" subtitle="Node-based automation for modern GTM ops and sales handoff.">
      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[24px] border border-black/8 bg-[#FCFCFD] p-5">
          <div className="relative mx-auto flex max-w-[340px] flex-col items-center py-3">
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-black/8" />
            {nodes.map((node, index) => (
              <div key={node} className="relative z-10 flex w-full flex-col items-center">
                <div className="rounded-full border border-black/8 bg-white px-4 py-2 text-[13px] font-semibold tracking-[-0.01em] text-black shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                  {node}
                </div>
                {index !== nodes.length - 1 ? (
                  <div className="my-3 flex items-center gap-1 text-black/25">
                    <ChevronRight className="h-4 w-4 rotate-90" />
                    <ChevronRight className="h-4 w-4 rotate-90" />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-[24px] border border-black/8 bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,0.04)]">
          <p className="text-[12px] uppercase tracking-[0.18em] text-black/35">Flow summary</p>
          <div className="grid gap-3">
            {[
              ['Triggers', 'Anonymous visitor intent above threshold'],
              ['Enrichment', 'Resolve company, role, and contact channels'],
              ['Routing', 'Assign owner and create task'],
              ['Action', 'Send email and notify sales rep'],
            ].map(([label, detail]) => (
              <div key={label} className="flex items-center justify-between rounded-[18px] border border-black/8 bg-[#FCFCFD] px-4 py-3">
                <div>
                  <p className="text-[13px] font-semibold text-black">{label}</p>
                  <p className="mt-1 text-[12px] text-black/52">{detail}</p>
                </div>
                <Sparkles className="h-4 w-4 text-emerald-500" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </PanelFrame>
  )
}

function OutboundPanel() {
  return (
    <PanelFrame title="Outbound Engine" subtitle="Multi-channel sequencing across email, LinkedIn, voice, and tasks.">
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[24px] border border-black/8 bg-[#FCFCFD] p-5">
          <div className="space-y-3">
            {outboundNodes.map((node, index) => (
              <div key={node.title} className="relative rounded-[22px] border border-black/8 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[16px] font-semibold tracking-[-0.03em] text-black">{node.title}</p>
                    <p className="mt-1 text-[13px] text-black/55">{node.detail}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[12px] font-semibold ${index === 0 ? 'bg-emerald-50 text-emerald-700' : index === 1 ? 'bg-sky-50 text-sky-700' : index === 2 ? 'bg-violet-50 text-violet-700' : 'bg-amber-50 text-amber-700'}`}>
                    {node.status}
                  </span>
                </div>
                {index !== outboundNodes.length - 1 ? <div className="absolute -bottom-3 left-8 h-6 w-px bg-black/8" /> : null}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-black/8 bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] uppercase tracking-[0.18em] text-black/35">Sequence status</p>
              <p className="mt-1 text-[20px] font-semibold tracking-[-0.04em] text-black">Running across 1,246 active contacts</p>
            </div>
            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[12px] font-semibold text-emerald-700">Live</div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {['Email', 'LinkedIn', 'Voice', 'Tasks'].map((channel, index) => (
              <div key={channel} className="rounded-[20px] border border-black/8 bg-[#FCFCFD] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-semibold text-black">{channel}</p>
                  <span className="text-[12px] font-semibold text-black/45">{85 - index * 7}%</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-black/6">
                  <div className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500" style={{ width: `${85 - index * 7}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PanelFrame>
  )
}

function VoicePanel() {
  return (
    <PanelFrame title="Voice Agent" subtitle="AI calling dashboard with live transcript, waveform, and booking outcomes.">
      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ['Calls Active', '18'],
            ['Calls Completed', '142'],
            ['Meetings Booked', '27'],
            ['Conversion Rate', '18.9%'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[24px] border border-black/8 bg-[#FCFCFD] p-5 shadow-[0_12px_36px_rgba(15,23,42,0.04)]">
              <p className="text-[12px] uppercase tracking-[0.18em] text-black/35">{label}</p>
              <p className="mt-3 text-[32px] font-semibold tracking-[-0.06em] text-black">{value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-[24px] border border-black/8 bg-[#FCFCFD] p-5">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold tracking-[-0.02em] text-black">Live call transcript</p>
            <div className="flex items-center gap-2 text-[12px] font-semibold text-emerald-700">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Recording
            </div>
          </div>

          <div className="mt-4 rounded-[22px] border border-black/8 bg-white p-4">
            <div className="flex items-center gap-2">
              {Array.from({ length: 18 }).map((_, index) => (
                <span
                  key={index}
                  className="w-full rounded-full bg-gradient-to-t from-emerald-500 to-black/20"
                  style={{ height: `${18 + (index % 6) * 9}px`, opacity: 0.45 + (index % 3) * 0.16 }}
                />
              ))}
            </div>
            <div className="mt-4 space-y-3 text-[14px] leading-[1.7] text-black/70">
              <p><span className="font-semibold text-black">Rep:</span> I saw your team is hiring SDRs, so we can automate the first outreach layer.</p>
              <p><span className="font-semibold text-black">Prospect:</span> That’s exactly the bottleneck we want to solve before Q3 ramp.</p>
              <p><span className="font-semibold text-black">Rep:</span> We can book a 15-minute session this week and show the full workflow.</p>
            </div>
          </div>
        </div>
      </div>
    </PanelFrame>
  )
}

function AnalyticsPanel() {
  return (
    <PanelFrame title="Analytics" subtitle="Pipeline, revenue, and meeting impact in a premium executive dashboard.">
      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {analyticsMetrics.map((metric) => (
            <div key={metric.label} className="rounded-[24px] border border-black/8 bg-[#FCFCFD] p-5 shadow-[0_12px_36px_rgba(15,23,42,0.04)]">
              <p className="text-[12px] uppercase tracking-[0.18em] text-black/35">{metric.label}</p>
              <p className="mt-3 text-[30px] font-semibold tracking-[-0.06em] text-black">{metric.value}</p>
              <div className="mt-3 inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-semibold text-emerald-700">{metric.delta}</div>
            </div>
          ))}
        </div>

        <div className="rounded-[24px] border border-black/8 bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold tracking-[-0.02em] text-black">Conversion funnel</p>
            <div className="text-[12px] font-semibold text-black/45">Last 30 days</div>
          </div>
          <div className="mt-5 space-y-4">
            {[
              { label: 'Total Audience', value: 100 },
              { label: 'Engaged', value: 74 },
              { label: 'Contacted', value: 59 },
              { label: 'Replied', value: 33 },
              { label: 'Positive', value: 18 },
            ].map((step) => (
              <div key={step.label}>
                <div className="mb-2 flex items-center justify-between text-[13px] text-black/60">
                  <span>{step.label}</span>
                  <span>{step.value}%</span>
                </div>
                <div className="h-3 rounded-full bg-black/6">
                  <div className="h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500" style={{ width: `${step.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PanelFrame>
  )
}

export default function PlatformSandbox() {
  const [activeTab, setActiveTab] = useState<SandboxTabId>('visitor')
  const [liveIndex, setLiveIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveTab((current) => {
        const currentIndex = sandboxTabs.findIndex((tab) => tab.id === current)
        const nextIndex = (currentIndex + 1) % sandboxTabs.length
        return sandboxTabs[nextIndex].id
      })
    }, 5000)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLiveIndex((current) => (current + 1) % 4)
    }, 2400)

    return () => window.clearInterval(timer)
  }, [])

  const activeTabMeta = useMemo(
    () => sandboxTabs.find((tab) => tab.id === activeTab) ?? sandboxTabs[0],
    [activeTab],
  )

  const content = (() => {
    switch (activeTab) {
      case 'enrichment':
        return <EnrichmentPanel />
      case 'copilot':
        return <CopilotPanel />
      case 'signals':
        return <SignalsPanel />
      case 'workflows':
        return <WorkflowsPanel />
      case 'outbound':
        return <OutboundPanel />
      case 'voice':
        return <VoicePanel />
      case 'analytics':
        return <AnalyticsPanel />
      case 'visitor':
      default:
        return <VisitorPanel />
    }
  })()

  const liveNotes = [
    'OpenAI renewed pricing view',
    'Anthropic triggered SDR hiring signal',
    'Stripe account enriched with direct phone',
    'HubSpot moved to outbound queue',
  ]

  return (
    <section className="relative overflow-hidden bg-white py-20 text-black md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(15,23,42,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.035) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.72), rgba(0,0,0,0.12) 60%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.72), rgba(0,0,0,0.12) 60%, transparent 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(circle at 30% 10%, rgba(16,185,129,0.06), transparent 24%), radial-gradient(circle at 70% 0%, rgba(59,130,246,0.05), transparent 20%)',
        }}
      />

      <div className="relative mx-auto w-[90%] max-w-[1600px]">
        <div className="mx-auto flex max-w-[960px] flex-col items-center text-center">
          <SectionPill>Platform Experience</SectionPill>
          <h2 className="mt-7 font-display text-[clamp(3rem,7vw,6.8rem)] font-semibold leading-[0.9] tracking-[-0.08em] text-black">
            See Outmate In Action
            <br />
            <span className="text-black/42">Without Booking A Demo</span>
          </h2>
          <p className="mt-7 max-w-[1100px] text-[17px] leading-[1.75] text-black/58 md:text-[18px]">
            Explore every Outmate module inside a live interactive workspace. Identify visitors, enrich contacts, automate outreach, manage conversations, activate signals, and track revenue — all from one platform.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-12 w-[90%] max-w-[1600px]"
        >
          <div className="overflow-hidden rounded-[34px] border border-black/8 bg-white shadow-[0_40px_140px_rgba(15,23,42,0.12)]">
            <BrowserChrome />

            <div className="flex flex-col xl:flex-row">
              <Sidebar />

              <div className="flex-1 bg-[#F9FAFB]">
                <div className="flex flex-wrap items-center gap-2 border-b border-black/8 bg-white px-4 py-4 md:px-5">
                  {sandboxTabs.map((tab) => (
                    <TabButton key={tab.id} tab={tab} active={tab.id === activeTab} onClick={() => setActiveTab(tab.id)} />
                  ))}
                  <div className="ml-auto hidden items-center gap-2 rounded-full border border-black/8 bg-[#FCFCFD] px-3 py-2 text-[12px] font-semibold text-black/55 lg:flex">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    {liveNotes[liveIndex]}
                  </div>
                </div>

                <div className="p-4 md:p-5">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="mb-4 flex items-center justify-between gap-4 rounded-[24px] border border-black/8 bg-white px-4 py-3 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
                        <div>
                          <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.18em] text-black/35">
                            <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500" />
                            Live workspace
                          </div>
                          <p className="mt-1 text-[16px] font-semibold tracking-[-0.03em] text-black">{activeTabMeta.label}</p>
                        </div>
                        <div className="hidden items-center gap-2 rounded-full border border-black/8 bg-black px-3 py-2 text-[12px] font-semibold text-white md:inline-flex">
                          <Play className="h-3.5 w-3.5 fill-white" />
                          Auto-rotating every 5s
                        </div>
                      </div>

                      {content}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}