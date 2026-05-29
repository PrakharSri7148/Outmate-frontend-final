import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SectionReveal from '../components/SectionReveal'
import AIHumanoidPanel from '../components/AIHumanoidPanel'
import {
  Mail,
  Linkedin,
  Phone,
  Repeat2,
  FileText,
  ShieldAlert,
  Sparkles,
} from 'lucide-react'

const capabilities = [
  {
    icon: Mail,
    title: 'Cold Email Drafts',
    description: 'AI writes personalized emails using visitor context, company news, and intent signals',
    accent: '#7C3AED',
  },
  {
    icon: Linkedin,
    title: 'LinkedIn Messages',
    description: 'Craft connection requests and follow-ups that reference real visitor behavior',
    accent: '#22D3EE',
  },
  {
    icon: Phone,
    title: 'Call Talking Points',
    description: 'Generate call scripts with relevant context before you dial',
    accent: '#22C55E',
  },
  {
    icon: Repeat2,
    title: 'Follow-up Sequences',
    description: 'Multi-touch sequences that adapt based on prospect engagement',
    accent: '#F59E0B',
  },
  {
    icon: FileText,
    title: 'Account Briefs',
    description: 'One-page summaries of any account with key stakeholders and talking points',
    accent: '#EF4444',
  },
  {
    icon: ShieldAlert,
    title: 'Objection Handlers',
    description: 'AI-suggested responses to common objections based on industry patterns',
    accent: '#3B82F6',
  },
]

export default function CoPilot() {
  return (
    <div className="bg-void">
    {/* Hero */}
      <section className="min-h-[100dvh] flex items-center pt-20">
        <div className="container-limit w-full">
          <div className="grid lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-16 items-center">

            {/* ── LEFT: preserved exactly ── */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple/10 border border-purple/20 text-purple text-xs font-medium mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary leading-[1.05] tracking-[-2px]">
                Your AI GTM Co-Pilot.{' '}
                <span className="text-purple">Always on.</span>{' '}
                <span className="text-cyan">Always ready.</span>
              </h1>
              <p className="mt-6 text-lg text-text-secondary max-w-lg">
                Turns visitor signals, CRM history and buying context into outreach that converts.
              </p>
              <div className="mt-8">
                <Link to="/pricing" className="btn-primary">
                  Try Co-Pilot Free
                </Link>
              </div>
            </motion.div>

            {/* ── RIGHT: premium 3D AI humanoid panel ── */}
            <div className="relative w-full" style={{ height: 620 }}>
              <AIHumanoidPanel />
            </div>

          </div>
        </div>
      </section>


      {/* Capabilities Grid */}
      <section className="section-padding bg-surface">
        <div className="container-limit">
          <SectionReveal className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-text-primary tracking-tight">
              Outreach that writes itself
            </h2>
            <p className="mt-4 text-lg text-text-secondary max-w-xl mx-auto">
              Six AI-powered content engines working from real visitor context.
            </p>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {capabilities.map((cap, i) => (
              <SectionReveal key={i} delay={i * 0.1}>
                <div className="glass-card p-7 h-full glass-card-hover">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ backgroundColor: `${cap.accent}15`, color: cap.accent }}
                  >
                    <cap.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-text-primary mb-2">
                    {cap.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {cap.description}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CRM Preview */}
      <section className="py-20 bg-void">
        <div className="container-limit">
          <SectionReveal className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-text-primary tracking-tight">
              Every message, personalized from real data
            </h2>
          </SectionReveal>
          <SectionReveal delay={0.2}>
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-glow max-w-5xl mx-auto">
              <img
                src="/images/crm-pipeline.jpg"
                alt="CRM Pipeline"
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
