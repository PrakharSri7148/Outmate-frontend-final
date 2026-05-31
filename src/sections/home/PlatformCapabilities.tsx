import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Radar,
  Database,
  Sparkles,
  PhoneCall,
  AtSign,
  Workflow,
  Target,
  Network,
  Zap,
  Bot,
  Users,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

type Capability = {
  title: string
  href: string
  description: string
  icon: LucideIcon
}

const PRODUCTS: Capability[] = [
  {
    title: 'Website Identification',
    href: '/product/website-identification',
    description: 'Identify anonymous B2B visitors in real-time',
    icon: Radar,
  },
  {
    title: 'B2B Database',
    href: '/product/b2b-database',
    description: '200M verified contacts, enriched & signal-ready',
    icon: Database,
  },
  {
    title: 'Co-Pilot',
    href: '/product/co-pilot',
    description: 'AI GTM co-pilot that writes outreach automatically',
    icon: Sparkles,
  },
  {
    title: 'Voice AI Agent',
    href: '/product/voice-ai-agent',
    description: 'Autonomous outbound calling, signal-triggered',
    icon: PhoneCall,
  },
  {
    title: 'Social Agent',
    href: '/product/social-agent',
    description: 'Turn social signals into pipeline automatically',
    icon: AtSign,
  },
  {
    title: 'Workflow Automation',
    href: '/product/workflow-automation',
    description:
      'Route high-intent visitors into alerts, sequences, and next best actions without manual handoff.',
    icon: Workflow,
  },
]

const USE_CASES: Capability[] = [
  {
    title: 'Identify High-Intent Visitors',
    href: '/use-cases/identify-visitors',
    description: "Know who's on your site before they call you",
    icon: Target,
  },
  {
    title: 'Enrich & Route Leads',
    href: '/use-cases/enrich-route-leads',
    description: 'Instant context for every inbound prospect',
    icon: Network,
  },
  {
    title: 'Automate GTM Workflows',
    href: '/use-cases/automate-workflows',
    description: 'Signal-triggered actions across your entire stack',
    icon: Zap,
  },
  {
    title: 'Run AI-Powered Outbound',
    href: '/use-cases/ai-outbound',
    description: 'Autonomous calling and email at scale',
    icon: Bot,
  },
  {
    title: 'Sales Teams',
    href: '/use-cases/sales-team',
    description: 'Arm your sales team with AI-driven pipeline',
    icon: Users,
  },
]

function CapabilityCard({ item, index }: { item: Capability; index: number }) {
  const reduceMotion = useReducedMotion()
  const Icon = item.icon
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease, delay: reduceMotion ? 0 : (index % 6) * 0.06 }}
    >
      <Link
        to={item.href}
        className="group relative flex h-full flex-col overflow-hidden rounded-[24px] bg-[#EAEAE7] p-6 shadow-[0_2px_10px_rgba(15,23,42,0.05)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_20px_50px_-24px_rgba(15,23,42,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6F6F4] md:p-7"
      >
        {/* lavender diagonal stripe corner (decorative) */}
        <span
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 z-0 h-[62%] w-[62%]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, rgba(154,120,214,0.55) 0px, rgba(154,120,214,0.55) 5px, transparent 5px, transparent 14px)',
            maskImage: 'linear-gradient(to bottom left, black 0%, transparent 68%)',
            WebkitMaskImage: 'linear-gradient(to bottom left, black 0%, transparent 68%)',
          }}
        />

        <div className="relative z-10 flex h-full flex-col">
          {/* icon tile */}
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-black/[0.06] bg-white/70 text-slate-700 transition-colors duration-500 group-hover:bg-white group-hover:text-blue-600">
            <Icon className="h-[19px] w-[19px]" strokeWidth={1.8} />
          </span>

          <h4 className="mt-5 font-display text-[17px] font-semibold tracking-[-0.02em] text-black">
            {item.title}
          </h4>
          <p className="mt-2 flex-1 text-[13px] leading-[1.6] text-slate-600 md:text-[14px]">
            {item.description}
          </p>

          <span className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-500 transition-colors duration-300 group-hover:text-blue-600">
            Learn more
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

function GroupLabel({ children }: { children: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.6, ease }}
      className="mb-6 flex items-center gap-4"
    >
      <span className="font-mono text-[11px] font-medium uppercase tracking-[0.26em] text-slate-500">
        {children}
      </span>
      <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-slate-300/70 to-transparent" />
    </motion.div>
  )
}

export default function PlatformCapabilities() {
  return (
    <section
      id="platform"
      className="relative overflow-hidden py-28 md:py-36"
      style={{ background: '#F6F6F4' }}
    >
      {/* Editorial grid overlay (matches FeatureShowcase) */}
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

      {/* Subtle bottom ambient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(124,58,237,0.025) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1280px] px-5 md:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease }}
          className="mb-16 max-w-[820px] md:mb-20"
        >
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.4em] text-blue-600">
            Platform
          </span>
          <h2
            className="mt-5 font-display font-extrabold leading-[1.04] tracking-[-0.04em] text-black"
            style={{ fontSize: 'clamp(34px, 5vw, 60px)' }}
          >
            Everything you need to turn traffic into pipeline
          </h2>
          <p className="mt-6 max-w-[58ch] text-[16px] leading-relaxed text-slate-600 md:text-[17px]">
            Six products and the use cases they power — one platform that identifies your visitors,
            enriches them, and acts on intent automatically.
          </p>
        </motion.div>

        {/* Products */}
        <GroupLabel>Products</GroupLabel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((item, i) => (
            <CapabilityCard key={item.href} item={item} index={i} />
          ))}
        </div>

        {/* Use cases */}
        <div className="mt-16 md:mt-20">
          <GroupLabel>Use cases</GroupLabel>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {USE_CASES.map((item, i) => (
              <CapabilityCard key={item.href} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
