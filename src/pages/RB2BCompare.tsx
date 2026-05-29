import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SectionReveal from '../components/SectionReveal'
import { Check, X, ArrowRight, Zap, TrendingUp, Clock, DollarSign, Mail, Phone, Bot } from 'lucide-react'

const rb2bGaps = [
  {
    icon: Zap,
    title: 'No AI enrichment',
    description: 'RB2B gives you a name and email. Outmate appends 50+ verified data points automatically.',
  },
  {
    icon: TrendingUp,
    title: 'No intent scoring',
    description: 'RB2B shows who visited. Outmate scores every visitor by purchase intent and ICP fit.',
  },
  {
    icon: Clock,
    title: 'No real-time outreach',
    description: 'RB2B sends a daily digest. Outmate triggers outreach the moment intent is detected.',
  },
  {
    icon: DollarSign,
    title: 'No CRM automation',
    description: 'RB2B requires manual CRM entry. Outmate syncs enriched leads to HubSpot, Salesforce, and Pipedrive instantly.',
  },
  {
    icon: Mail,
    title: 'No email drafting',
    description: 'RB2B leaves messaging to you. Outmate\'s Co-Pilot drafts personalized emails from visitor context.',
  },
  {
    icon: Phone,
    title: 'No voice calling',
    description: 'RB2B has no calling capability. Outmate\'s Voice AI Agent calls hot leads within minutes.',
  },
  {
    icon: Bot,
    title: 'No social signals',
    description: 'RB2B ignores social intent. Outmate\'s Social Agent monitors LinkedIn, Reddit, X, and YouTube.',
  },
  {
    icon: Check,
    title: 'No workflow engine',
    description: 'RB2B is a data feed. Outmate is a complete GTM operating system with automation at every step.',
  },
]

const comparisonMatrix = [
  { feature: 'Anonymous visitor identification', outmate: true, rb2b: true },
  { feature: 'Person-level identification', outmate: true, rb2b: true },
  { feature: 'Real-time identification', outmate: true, rb2b: true },
  { feature: 'Contact enrichment (50+ fields)', outmate: true, rb2b: false },
  { feature: 'Verified email addresses', outmate: true, rb2b: false },
  { feature: 'Direct phone numbers', outmate: true, rb2b: false },
  { feature: 'Firmographic data', outmate: true, rb2b: false },
  { feature: 'Intent scoring', outmate: true, rb2b: false },
  { feature: 'AI lead scoring', outmate: true, rb2b: false },
  { feature: 'CRM auto-sync', outmate: true, rb2b: false },
  { feature: 'AI email drafting', outmate: true, rb2b: false },
  { feature: 'LinkedIn automation', outmate: true, rb2b: false },
  { feature: 'Voice AI calling', outmate: true, rb2b: false },
  { feature: 'Social signal monitoring', outmate: true, rb2b: false },
  { feature: 'Workflow automation', outmate: true, rb2b: false },
  { feature: 'Multi-channel sequences', outmate: true, rb2b: false },
  { feature: '24/7 support', outmate: true, rb2b: false },
  { feature: 'Free tier', outmate: true, rb2b: true },
]

export default function RB2BCompare() {
  return (
    <div className="bg-void">
      {/* Hero */}
      <section className="pt-32 pb-20">
        <div className="container-limit">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary leading-[1.05] tracking-[-2px]">
              Identification is step one.{' '}
              <span className="text-purple">Conversion</span> is what matters
            </h1>
            <p className="mt-6 text-lg text-text-secondary max-w-xl">
              RB2B shows who visited. Outmate turns them into pipeline automatically.
            </p>
            <div className="mt-8">
              <Link to="/pricing" className="btn-primary inline-flex items-center gap-2">
                See the Difference
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 8 Things RB2B Leaves on the Table */}
      <section className="section-padding bg-surface">
        <div className="container-limit">
          <SectionReveal className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-text-primary tracking-tight">
              Eight things RB2B leaves on the table
            </h2>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {rb2bGaps.map((gap, i) => (
              <SectionReveal key={i} delay={i * 0.06}>
                <div className="glass-card p-6 h-full glass-card-hover">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-purple/10 flex items-center justify-center flex-shrink-0">
                      <gap.icon className="w-5 h-5 text-purple" />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-semibold text-text-primary mb-1">
                        {gap.title}
                      </h3>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {gap.description}
                      </p>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Core Difference */}
      <section className="section-padding bg-void">
        <div className="container-limit">
          <SectionReveal className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-text-primary tracking-tight">
              The core difference
            </h2>
          </SectionReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <SectionReveal>
              <div className="glass-card p-8 border-red/20">
                <div className="text-sm font-mono text-red mb-4 uppercase tracking-wider">RB2B</div>
                <h3 className="font-display text-2xl font-semibold text-text-primary mb-4">
                  A daily email digest
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  You get a list of companies that visited your site. It's up to you to figure out 
                  who to contact, what to say, and how to follow up. The data is raw and unactionable.
                </p>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.15}>
              <div className="glass-card p-8 border-purple/40 glow-purple">
                <div className="text-sm font-mono text-purple mb-4 uppercase tracking-wider">Outmate</div>
                <h3 className="font-display text-2xl font-semibold text-text-primary mb-4">
                  A complete GTM system
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  Identify, enrich, score, and engage — all automatically. Every signal triggers 
                  the right action across every channel. Your pipeline builds itself.
                </p>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* How Outmate Works */}
      <section className="section-padding bg-surface">
        <div className="container-limit">
          <SectionReveal className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-text-primary tracking-tight">
              How Outmate works
            </h2>
          </SectionReveal>

          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {['Install pixel (1 line)', 'Identify visitors', 'Auto-enrich data', 'Score intent', 'Trigger outreach', 'Sync to CRM'].map((step, i) => (
              <SectionReveal key={i} delay={i * 0.06}>
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2.5 rounded-lg bg-purple/10 border border-purple/20 text-sm font-medium text-purple">
                    {step}
                  </div>
                  {i < 5 && <ArrowRight className="w-4 h-4 text-text-muted hidden sm:block" />}
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Full Comparison Matrix */}
      <section className="section-padding bg-void">
        <div className="container-limit max-w-3xl mx-auto">
          <SectionReveal className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-text-primary tracking-tight">
              Full comparison
            </h2>
          </SectionReveal>

          <SectionReveal>
            <div className="glass-card overflow-hidden">
              <div className="grid grid-cols-[1fr_100px_100px] gap-4 px-6 py-4 border-b border-white/[0.08] bg-purple/5">
                <div className="text-sm font-medium text-text-muted">Feature</div>
                <div className="text-sm font-semibold text-purple text-center">Outmate</div>
                <div className="text-sm font-semibold text-text-muted text-center">RB2B</div>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {comparisonMatrix.map((row, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[1fr_100px_100px] gap-4 px-6 py-3 items-center hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="text-sm text-text-secondary">{row.feature}</div>
                    <div className="flex justify-center">
                      {row.outmate ? (
                        <Check className="w-4 h-4 text-green" />
                      ) : (
                        <X className="w-4 h-4 text-red" />
                      )}
                    </div>
                    <div className="flex justify-center">
                      {row.rb2b ? (
                        <Check className="w-4 h-4 text-green" />
                      ) : (
                        <X className="w-4 h-4 text-red" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Proof Metrics */}
      <section className="section-padding bg-surface">
        <div className="container-limit">
          <SectionReveal className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-text-primary tracking-tight">
              The numbers don't lie
            </h2>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { value: '10x', label: 'More enrichment fields', sub: '50+ vs 5 data points per contact' },
              { value: '<1m', label: 'Response time', sub: 'vs 24-hour digest emails' },
              { value: '6x', label: 'More channels', sub: 'Email, voice, social, LinkedIn vs email only' },
            ].map((stat, i) => (
              <SectionReveal key={i} delay={i * 0.1}>
                <div className="glass-card p-8 text-center glass-card-hover">
                  <div className="font-display text-5xl font-bold text-purple tracking-tight">
                    {stat.value}
                  </div>
                  <div className="mt-2 font-display text-lg font-semibold text-text-primary">
                    {stat.label}
                  </div>
                  <p className="mt-1 text-sm text-text-muted">{stat.sub}</p>
                </div>
              </SectionReveal>
            ))}
          </div>

          <SectionReveal delay={0.3} className="text-center mt-12">
            <Link to="/pricing" className="btn-primary inline-flex items-center gap-2">
              Switch to Outmate
              <ArrowRight className="w-4 h-4" />
            </Link>
          </SectionReveal>
        </div>
      </section>
    </div>
  )
}
