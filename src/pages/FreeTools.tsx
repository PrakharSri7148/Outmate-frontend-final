import { motion } from 'framer-motion'
import SectionReveal from '../components/SectionReveal'
import { Check, X, Minus } from 'lucide-react'

const categories = [
  {
    name: 'Identification',
    features: [
      { name: 'Anonymous visitor ID', outmate: true, rb2b: true, sixsense: true, clearbit: true, zoominfo: true },
      { name: 'Person-level (not just company)', outmate: true, rb2b: true, sixsense: false, clearbit: true, zoominfo: true },
      { name: 'Real-time identification', outmate: true, rb2b: true, sixsense: false, clearbit: false, zoominfo: false },
      { name: '173+ country coverage', outmate: true, rb2b: false, sixsense: true, clearbit: true, zoominfo: true },
      { name: 'Proprietary identity graph', outmate: true, rb2b: false, sixsense: false, clearbit: false, zoominfo: false },
    ],
  },
  {
    name: 'Data & Enrichment',
    features: [
      { name: 'Verified email addresses', outmate: true, rb2b: false, sixsense: true, clearbit: true, zoominfo: true },
      { name: 'Direct phone numbers', outmate: true, rb2b: false, sixsense: false, clearbit: false, zoominfo: true },
      { name: '50+ enrichment fields', outmate: true, rb2b: false, sixsense: false, clearbit: false, zoominfo: true },
      { name: 'Real-time CRM sync', outmate: true, rb2b: true, sixsense: true, clearbit: true, zoominfo: true },
      { name: 'Intent signal scoring', outmate: true, rb2b: false, sixsense: true, clearbit: false, zoominfo: false },
    ],
  },
  {
    name: 'Scoring & Signals',
    features: [
      { name: 'AI-powered lead scoring', outmate: true, rb2b: false, sixsense: true, clearbit: false, zoominfo: false },
      { name: 'Behavioral intent signals', outmate: true, rb2b: false, sixsense: true, clearbit: false, zoominfo: false },
      { name: 'ICP matching', outmate: true, rb2b: false, sixsense: true, clearbit: false, zoominfo: true },
      { name: 'Purchase intent prediction', outmate: true, rb2b: false, sixsense: true, clearbit: false, zoominfo: false },
    ],
  },
  {
    name: 'Outreach',
    features: [
      { name: 'AI email drafting', outmate: true, rb2b: false, sixsense: false, clearbit: false, zoominfo: false },
      { name: 'LinkedIn message automation', outmate: true, rb2b: false, sixsense: false, clearbit: false, zoominfo: false },
      { name: 'Voice AI calling', outmate: true, rb2b: false, sixsense: false, clearbit: false, zoominfo: false },
      { name: 'Social signal outreach', outmate: true, rb2b: false, sixsense: false, clearbit: false, zoominfo: false },
      { name: 'Multi-channel sequences', outmate: true, rb2b: false, sixsense: false, clearbit: false, zoominfo: false },
    ],
  },
  {
    name: 'Workflow & CRM',
    features: [
      { name: 'HubSpot integration', outmate: true, rb2b: true, sixsense: true, clearbit: true, zoominfo: true },
      { name: 'Salesforce integration', outmate: true, rb2b: true, sixsense: true, clearbit: true, zoominfo: true },
      { name: 'Pipedrive integration', outmate: true, rb2b: true, sixsense: false, clearbit: true, zoominfo: false },
      { name: 'Workflow automation', outmate: true, rb2b: false, sixsense: true, clearbit: false, zoominfo: false },
      { name: 'Slack notifications', outmate: true, rb2b: true, sixsense: true, clearbit: true, zoominfo: true },
    ],
  },
  {
    name: 'Pricing & Trial',
    features: [
      { name: 'Free tier available', outmate: true, rb2b: true, sixsense: false, clearbit: false, zoominfo: false },
      { name: '30-day free trial', outmate: true, rb2b: true, sixsense: false, clearbit: true, zoominfo: false },
      { name: 'No credit card required', outmate: true, rb2b: true, sixsense: false, clearbit: false, zoominfo: false },
      { name: 'Transparent pricing', outmate: true, rb2b: true, sixsense: false, clearbit: true, zoominfo: false },
    ],
  },
  {
    name: 'Support & Setup',
    features: [
      { name: '5-minute setup', outmate: true, rb2b: true, sixsense: false, clearbit: true, zoominfo: false },
      { name: '24/7 live support', outmate: true, rb2b: false, sixsense: false, clearbit: false, zoominfo: false },
      { name: 'Dedicated success manager', outmate: true, rb2b: false, sixsense: true, clearbit: false, zoominfo: true },
      { name: 'Self-service onboarding', outmate: true, rb2b: true, sixsense: false, clearbit: true, zoominfo: false },
    ],
  },
]

const competitors = ['Outmate', 'RB2B', '6sense', 'Clearbit', 'ZoomInfo']

function StatusIcon({ status }: { status: boolean | null }) {
  if (status === true) return <Check className="w-4 h-4 text-green" />
  if (status === false) return <X className="w-4 h-4 text-red" />
  return <Minus className="w-4 h-4 text-text-muted" />
}

export default function Compare() {
  return (
    <div className="bg-void">
      {/* Hero */}
      <section className="pt-32 pb-16">
        <div className="container-limit text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary tracking-[-2px]">
              Outmate vs everyone in pipeline automation
            </h1>
            <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
              See how we stack against the tools you're already evaluating.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Comparison Matrix */}
      <section className="pb-32">
        <div className="container-limit max-w-6xl">
          {/* Header */}
          <SectionReveal>
            <div className="glass-card p-6 mb-6 overflow-x-auto">
              <div className="grid grid-cols-[1.5fr_repeat(5,1fr)] gap-4 min-w-[600px]">
                <div className="text-sm font-medium text-text-muted">Feature</div>
                {competitors.map((comp) => (
                  <div
                    key={comp}
                    className={`text-sm font-semibold text-center ${
                      comp === 'Outmate' ? 'text-purple' : 'text-text-primary'
                    }`}
                  >
                    {comp}
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>

          {/* Categories */}
          <div className="space-y-6">
            {categories.map((category, ci) => (
              <SectionReveal key={ci} delay={ci * 0.05}>
                <div className="glass-card overflow-hidden">
                  <div className="px-6 py-4 bg-purple/5 border-b border-white/[0.04]">
                    <h3 className="font-display text-lg font-semibold text-text-primary">
                      {category.name}
                    </h3>
                  </div>
                  <div className="divide-y divide-white/[0.04]">
                    {category.features.map((feature, fi) => (
                      <div
                        key={fi}
                        className="grid grid-cols-[1.5fr_repeat(5,1fr)] gap-4 px-6 py-3.5 items-center hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="text-sm text-text-secondary">{feature.name}</div>
                        <div className="flex justify-center">
                          <StatusIcon status={feature.outmate} />
                        </div>
                        <div className="flex justify-center">
                          <StatusIcon status={feature.rb2b} />
                        </div>
                        <div className="flex justify-center">
                          <StatusIcon status={feature.sixsense} />
                        </div>
                        <div className="flex justify-center">
                          <StatusIcon status={feature.clearbit} />
                        </div>
                        <div className="flex justify-center">
                          <StatusIcon status={feature.zoominfo} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
