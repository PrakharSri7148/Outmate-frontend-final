import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SectionReveal from '../components/SectionReveal'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'

const comparisonFeatures = [
  { feature: 'Per lead identified', outmate: '$0.08', traditional: '$2.50' },
  { feature: 'Monthly platform fee', outmate: 'From $0', traditional: 'From $500' },
  { feature: 'CRM enrichment', outmate: 'Included', traditional: '$200+/mo add-on' },
  { feature: 'Email verification', outmate: 'Included', traditional: '$100+/mo add-on' },
  { feature: 'Intent scoring', outmate: 'AI-powered', traditional: 'Manual + $300/mo' },
  { feature: 'Multi-channel outreach', outmate: 'Included', traditional: '3+ separate tools' },
  { feature: 'Setup time', outmate: '5 minutes', traditional: '2-4 weeks' },
  { feature: 'Support', outmate: '24/7 live', traditional: 'Business hours only' },
]

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/mo',
    description: 'For solo founders testing the waters',
    features: [
      '100 identified visitors/mo',
      'Basic enrichment',
      'Email support',
    ],
    cta: 'Start Free',
    featured: false,
  },
  {
    name: 'Starter',
    price: '$49',
    period: '/mo',
    description: 'For small teams building pipeline',
    features: [
      '1,000 identified visitors/mo',
      'Full enrichment',
      'Co-Pilot access',
      'Priority support',
    ],
    cta: 'Start Trial',
    featured: false,
  },
  {
    name: 'Business',
    price: '$149',
    period: '/mo',
    description: 'For teams serious about revenue',
    features: [
      '5,000 identified visitors/mo',
      'Voice AI Agent',
      'Social Agent',
      'Advanced workflows',
    ],
    cta: 'Start Trial',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For organizations at scale',
    features: [
      'Unlimited visitors',
      'Custom integrations',
      'Dedicated success manager',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
    featured: false,
  },
]

const faqs = [
  {
    q: 'How does the free trial work?',
    a: 'You get full access to the Outmate platform for 30 days. No credit card required. At the end of the trial, choose a plan or continue with our free tier.',
  },
  {
    q: 'Can I change plans later?',
    a: 'Absolutely. Upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.',
  },
  {
    q: 'What counts as an identified visitor?',
    a: 'An identified visitor is a unique individual we match to a real person with name, company, and contact information. Anonymous visitors don\'t count toward your limit.',
  },
  {
    q: 'Is there a limit on CRM contacts?',
    a: 'No. We sync unlimited enriched contacts to your CRM regardless of your plan. Visitor identification limits apply only to website traffic.',
  },
  {
    q: 'What integrations are supported?',
    a: 'HubSpot, Salesforce, Pipedrive, Slack, Zapier, and 50+ more via our API and webhook system.',
  },
]

function DraggableComparison() {
  const [revealed, setRevealed] = useState(false)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-8">
          <span className="font-display text-lg font-semibold text-purple">Outmate</span>
          <span className="font-display text-lg font-semibold text-text-muted">Traditional Tools</span>
        </div>
        <button
          onClick={() => setRevealed(!revealed)}
          className="text-sm text-purple hover:text-purple-bright transition-colors underline"
        >
          {revealed ? 'Hide comparison' : 'Slide to reveal'}
        </button>
      </div>

      <div className="space-y-0 border border-white/[0.08] rounded-2xl overflow-hidden bg-surface">
        {comparisonFeatures.map((row, i) => (
          <div
            key={i}
            className={`grid grid-cols-3 gap-4 px-6 py-4 ${
              i < comparisonFeatures.length - 1 ? 'border-b border-white/[0.04]' : ''
            }`}
          >
            <div className="text-sm text-text-secondary">{row.feature}</div>
            <div className="text-sm font-semibold text-purple">{row.outmate}</div>
            <div
              className={`text-sm text-text-muted transition-all duration-500 ${
                revealed ? 'line-through opacity-60' : 'bg-surface-light rounded px-3 py-1 -my-1'
              }`}
            >
              {row.traditional}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <SectionReveal delay={index * 0.05}>
      <div className="border-b border-white/[0.08]">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between py-5 text-left"
        >
          <span className="font-display text-base font-semibold text-text-primary pr-4">
            {faq.q}
          </span>
          {open ? (
            <ChevronUp className="w-5 h-5 text-text-muted flex-shrink-0" />
          ) : (
            <ChevronDown className="w-5 h-5 text-text-muted flex-shrink-0" />
          )}
        </button>
        <motion.div
          initial={false}
          animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <p className="pb-5 text-sm text-text-secondary leading-relaxed">{faq.a}</p>
        </motion.div>
      </div>
    </SectionReveal>
  )
}

export default function Pricing() {
  return (
    <div className="bg-void">
      {/* Hero */}
      <section className="pt-32 pb-20">
        <div className="container-limit text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary tracking-[-2px]">
              Pricing built for modern GTM teams
            </h1>
            <p className="mt-4 text-lg text-text-secondary">
              Start free. Scale as your pipeline grows.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Draggable Comparison */}
      <section className="pb-20">
        <div className="container-limit">
          <SectionReveal>
            <DraggableComparison />
          </SectionReveal>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="section-padding bg-surface">
        <div className="container-limit">
          <SectionReveal className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-text-primary tracking-tight">
              Choose your plan
            </h2>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {plans.map((plan, i) => (
              <SectionReveal key={i} delay={i * 0.08}>
                <div
                  className={`glass-card p-7 h-full flex flex-col ${
                    plan.featured
                      ? 'border-purple shadow-glow relative'
                      : ''
                  } glass-card-hover`}
                >
                  {plan.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple text-white text-xs font-medium rounded-full">
                      Most Popular
                    </div>
                  )}
                  <h3 className="font-display text-lg font-semibold text-text-primary">
                    {plan.name}
                  </h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="font-display text-3xl font-bold text-text-primary">
                      {plan.price}
                    </span>
                    <span className="text-sm text-text-muted">{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-text-muted">{plan.description}</p>

                  <ul className="mt-6 space-y-3 flex-1">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm text-text-secondary">
                        <Check className="w-4 h-4 text-green flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/pricing"
                    className={`mt-6 block text-center py-2.5 rounded-lg text-sm font-medium transition-all ${
                      plan.featured
                        ? 'bg-purple text-white hover:bg-purple-bright'
                        : 'bg-white/5 text-text-primary hover:bg-white/10 border border-white/[0.08]'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-void">
        <div className="container-limit max-w-2xl mx-auto">
          <SectionReveal className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-text-primary tracking-tight">
              Common questions
            </h2>
          </SectionReveal>

          <div>
            {faqs.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
