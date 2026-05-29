import { motion } from 'framer-motion'
import SectionReveal from '../components/SectionReveal'
import {
  Search,
  ListFilter,
  Signal,
  Sparkles,
  RefreshCw,
  Send,
  Users,
  DollarSign,
  Code2,
  TrendingUp,
  MessageSquare,
} from 'lucide-react'

const searchFilters = [
  { icon: Users, label: 'Role & Seniority' },
  { icon: TrendingUp, label: 'Funding Stage' },
  { icon: Code2, label: 'Tech Stack' },
  { icon: DollarSign, label: 'Revenue' },
  { icon: Signal, label: 'Live Signals' },
  { icon: Sparkles, label: 'Enrichment Fields' },
]

const modules = [
  { icon: Search, label: 'Search', description: 'Find prospects with natural language' },
  { icon: ListFilter, label: 'Saved Lists', description: 'Organize and segment your targets' },
  { icon: Signal, label: 'Signals', description: 'Real-time buying intent alerts' },
  { icon: Sparkles, label: 'Enrichment', description: 'Auto-append 50+ data points' },
  { icon: RefreshCw, label: 'CRM Sync', description: 'Push to HubSpot, Salesforce, Pipedrive' },
  { icon: Send, label: 'Sequences', description: 'Multi-touch outreach automation' },
]

export default function B2BDatabase() {
  return (
    <div className="bg-void">
      {/* Hero */}
      <section className="min-h-[80vh] flex items-center pt-28 pb-20">
        <div className="container-limit">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-text-primary leading-[1.05] tracking-[-2px]">
              <span className="text-purple">200M</span> verified contacts.{' '}
              <span className="text-cyan">Enriched</span>, signal-aware, and ready to reach
            </h1>
            <p className="mt-6 text-lg text-text-secondary max-w-xl">
              The most comprehensive B2B database with real-time intent signals and automatic enrichment.
            </p>
          </motion.div>

          {/* Search Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-12"
          >
            <p className="text-sm text-text-muted mb-4 font-mono uppercase tracking-wider">Search by</p>
            <div className="flex flex-wrap gap-3">
              {searchFilters.map((filter, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface border border-white/[0.08] text-sm text-text-secondary hover:border-purple/40 hover:text-text-primary transition-all cursor-pointer"
                >
                  <filter.icon className="w-4 h-4 text-purple" />
                  {filter.label}
                </div>
              ))}
            </div>
          </motion.div>

          {/* NLQ Example */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8"
          >
            <div className="glass-card p-5 max-w-2xl">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-purple" />
                <span className="text-text-muted text-sm">Try:</span>
                <span className="text-text-primary text-sm font-mono">
                  "Find VP Sales at Series B fintech companies in US using HubSpot"
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="section-padding bg-surface">
        <div className="container-limit">
          <SectionReveal className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-text-primary tracking-tight">
              One workspace for search, enrichment and action
            </h2>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {modules.map((mod, i) => (
              <SectionReveal key={i} delay={i * 0.08}>
                <div className="glass-card p-6 glass-card-hover">
                  <div className="w-11 h-11 rounded-xl bg-purple/10 flex items-center justify-center mb-4">
                    <mod.icon className="w-5 h-5 text-purple" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-text-primary mb-1">
                    {mod.label}
                  </h3>
                  <p className="text-sm text-text-secondary">{mod.description}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Database Visual */}
      <section className="py-20 bg-void">
        <div className="container-limit">
          <SectionReveal className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-text-primary tracking-tight">
              Enrichment that actually works
            </h2>
          </SectionReveal>
          <SectionReveal delay={0.2}>
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-glow max-w-5xl mx-auto">
              <img
                src="/images/enrichment-data.jpg"
                alt="Contact enrichment data"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void/40 to-transparent pointer-events-none" />
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  )
}
