import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SectionReveal from '../components/SectionReveal'
import {
  Eye,
  Target,
  BarChart3,
  Send,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'

const workflowSteps = [
  {
    icon: Eye,
    title: 'Identify Visitors',
    description: 'See who visits your website in real-time — name, company, and role for every visitor.',
  },
  {
    icon: Target,
    title: 'Match Decision Makers',
    description: 'Find the right stakeholders at target accounts using our 200M+ contact database.',
  },
  {
    icon: BarChart3,
    title: 'Score Intent',
    description: 'AI ranks leads by purchase intent using behavioral signals and engagement patterns.',
  },
  {
    icon: Send,
    title: 'Trigger Outreach',
    description: 'Automatically engage high-intent leads across email, LinkedIn, voice, and social.',
  },
]

const salesJobs = [
  {
    title: 'Identify high-intent visitors',
    description: 'See exactly who is on your site, what pages they view, and how long they stay — all in real-time.',
  },
  {
    title: 'Enrich contact data',
    description: 'Automatically append verified emails, phone numbers, and firmographic data to every lead.',
  },
  {
    title: 'Prioritize leads',
    description: 'AI scores every lead by intent, ICP fit, and engagement so reps focus on the hottest opportunities.',
  },
  {
    title: 'Trigger outreach instantly',
    description: 'The moment intent is detected, Outmate drafts personalized outreach and routes it to the right channel.',
  },
]

export default function SalesTeam() {
  return (
    <div className="bg-void">
      {/* Hero */}
      <section className="min-h-[100dvh] flex items-center pt-20">
        <div className="container-limit">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary leading-[1.05] tracking-[-2px]">
                Turn anonymous traffic into{' '}
                <span className="text-purple">qualified pipeline</span>{' '}
                automatically
              </h1>
              <p className="mt-6 text-lg text-text-secondary max-w-lg">
                Your sales team focuses on closing. Outmate handles the rest.
              </p>
              <div className="mt-8">
                <Link to="/pricing" className="btn-primary">
                  Get Started Free
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-glow">
                <img
                  src="/images/sales-workflow.jpg"
                  alt="Sales workflow"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void/60 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Workflow Steps */}
      <section className="section-padding bg-surface">
        <div className="container-limit">
          <SectionReveal className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-text-primary tracking-tight">
              Your new sales workflow
            </h2>
          </SectionReveal>

          <div className="max-w-4xl mx-auto">
            {workflowSteps.map((step, i) => (
              <SectionReveal key={i} delay={i * 0.1}>
                <div className="flex gap-6 mb-8 last:mb-0">
                  {/* Connector line */}
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-purple/10 border border-purple/30 flex items-center justify-center flex-shrink-0">
                      <step.icon className="w-6 h-6 text-purple" />
                    </div>
                    {i < workflowSteps.length - 1 && (
                      <div className="w-px flex-1 bg-gradient-to-b from-purple/40 to-transparent my-2 min-h-[40px]" />
                    )}
                  </div>

                  <div className="pb-8">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono text-purple">Step {i + 1}</span>
                    </div>
                    <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed max-w-md">
                      {step.description}
                    </p>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* What Sales Reps Get */}
      <section className="section-padding bg-void">
        <div className="container-limit">
          <SectionReveal className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-text-primary tracking-tight">
              What your sales team gets
            </h2>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {salesJobs.map((job, i) => (
              <SectionReveal key={i} delay={i * 0.1}>
                <div className="glass-card p-7 h-full glass-card-hover">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-purple/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-purple" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-text-primary mb-2">
                        {job.title}
                      </h3>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {job.description}
                      </p>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>

          <SectionReveal delay={0.4} className="text-center mt-12">
            <Link to="/pricing" className="btn-primary inline-flex items-center gap-2">
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </Link>
          </SectionReveal>
        </div>
      </section>
    </div>
  )
}
