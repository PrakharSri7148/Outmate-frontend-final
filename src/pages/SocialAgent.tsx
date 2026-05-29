import { motion } from 'framer-motion'
import SectionReveal from '../components/SectionReveal'
import {
  Linkedin,
  MessageCircle,
  Twitter,
  Youtube,
  ShoppingCart,
  AlertTriangle,
  Briefcase,
  ThumbsUp,
  TrendingUp,
  Heart,
  Radio,
  Brain,
  Users,
  Bot,
  Globe,
  Bell,
  Send,
  BarChart3,
} from 'lucide-react'

const platforms = [
  { icon: Linkedin, name: 'LinkedIn', color: '#0A66C2' },
  { icon: MessageCircle, name: 'Reddit', color: '#FF4500' },
  { icon: Twitter, name: 'X', color: '#F7F7F7' },
  { icon: Youtube, name: 'YouTube', color: '#FF0000' },
]

const signalCards = [
  { icon: ShoppingCart, label: 'Buying Intent', color: '#7C3AED' },
  { icon: AlertTriangle, label: 'Competitor Mentions', color: '#EF4444' },
  { icon: Briefcase, label: 'Job Changes', color: '#22D3EE' },
  { icon: ThumbsUp, label: 'Product Feedback', color: '#22C55E' },
  { icon: TrendingUp, label: 'Sentiment Spikes', color: '#F59E0B' },
  { icon: Heart, label: 'Engagement Signals', color: '#EC4899' },
]

const features = [
  { icon: Radio, title: 'Social Listening Engine', description: 'Monitor conversations across LinkedIn, Reddit, X, and YouTube in real-time.' },
  { icon: Brain, title: 'Signal Intelligence Layer', description: 'AI identifies buying signals, complaints, and opportunities from social noise.' },
  { icon: Users, title: 'ICP Matching', description: 'Automatically match social profiles to your ideal customer profile.' },
  { icon: Bot, title: 'AI Agent Workflows', description: 'Trigger outreach, alerts, and CRM actions based on social signals.' },
  { icon: Globe, title: 'Multi-platform Tracking', description: 'Unified dashboard for all social platforms in one view.' },
  { icon: Bell, title: 'Real-time Alerts', description: 'Get notified the moment a relevant signal appears.' },
  { icon: Send, title: 'Outreach Automation', description: 'Auto-generate personalized outreach from social context.' },
  { icon: BarChart3, title: 'Pipeline Tracking', description: 'Track social-sourced leads through your entire funnel.' },
]

export default function SocialAgent() {
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
              Turn social signals into{' '}
              <span className="text-purple">pipeline</span>{' '}
              automatically
            </h1>
            <p className="mt-6 text-lg text-text-secondary max-w-xl">
              Monitor, identify, and engage prospects across every social platform — without manual work.
            </p>
          </motion.div>

          {/* Platform Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            {platforms.map((platform, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-surface border border-white/[0.08]"
              >
                <platform.icon className="w-5 h-5" style={{ color: platform.color }} />
                <span className="text-sm font-medium text-text-primary">{platform.name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Signal Cards */}
      <section className="section-padding bg-surface">
        <div className="container-limit">
          <SectionReveal className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-text-primary tracking-tight">
              Every signal. Every platform. One agent.
            </h2>
          </SectionReveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
            {signalCards.map((card, i) => (
              <SectionReveal key={i} delay={i * 0.06}>
                <div className="glass-card p-5 text-center glass-card-hover">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3"
                    style={{ backgroundColor: `${card.color}15`, color: card.color }}
                  >
                    <card.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-text-primary">{card.label}</span>
                </div>
              </SectionReveal>
            ))}
          </div>

          {/* Social Dashboard Image */}
          <SectionReveal delay={0.2}>
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-glow max-w-5xl mx-auto">
              <img
                src="/images/social-signals.jpg"
                alt="Social signals dashboard"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void/40 to-transparent pointer-events-none" />
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section-padding bg-void">
        <div className="container-limit">
          <SectionReveal className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-text-primary tracking-tight">
              Full social intelligence stack
            </h2>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {features.map((feature, i) => (
              <SectionReveal key={i} delay={i * 0.06}>
                <div className="glass-card p-6 h-full glass-card-hover">
                  <div className="w-10 h-10 rounded-lg bg-purple/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-5 h-5 text-purple" />
                  </div>
                  <h3 className="font-display text-base font-semibold text-text-primary mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
