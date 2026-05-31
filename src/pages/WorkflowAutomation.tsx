import { motion } from 'framer-motion'
import SectionReveal from '../components/SectionReveal'
import {
  Zap,
  Activity,
  Database,
  Mail,
  Phone,
  MessageSquare,
  Users,
  Calendar,
  ArrowRight,
  Play
} from 'lucide-react'

// Easing for cinematic animations
const smoothTransition = { duration: 1.2, ease: [0.22, 1, 0.36, 1] as const }

const workflowNodes = [
  { label: 'Visitor lands on pricing page', icon: Activity },
  { label: 'Identify person', icon: Users },
  { label: 'Enrich company', icon: Database },
  { label: 'Calculate ICP score', icon: Activity },
  { label: 'Trigger AI email', icon: Mail },
  { label: 'Notify Slack', icon: MessageSquare },
  { label: 'Assign CRM owner', icon: Users },
  { label: 'Launch voice agent', icon: Phone },
]

const modules = [
  { icon: Activity, label: 'Website visitor' },
  { icon: Database, label: 'CRM update' },
  { icon: Zap, label: 'AI enrichment' },
  { icon: Mail, label: 'Email agent' },
  { icon: Phone, label: 'Voice AI' },
  { icon: MessageSquare, label: 'Slack alert' },
  { icon: Activity, label: 'Signal intelligence' },
  { icon: Users, label: 'LinkedIn trigger' },
  { icon: Calendar, label: 'Calendar booking' },
]

const scenarios = [
  {
    trigger: 'High-intent buyer detected',
    steps: ['AI identifies VP Sales', 'Enriches company', 'Generates outbound email', 'Routes to AE', 'Books meeting']
  },
  {
    trigger: 'Competitor comparison visit',
    steps: ['Triggers battlecard', 'Alerts sales team', 'Launches personalized sequence']
  }
]

const integrations = [
  'HubSpot', 'Salesforce', 'Slack', 'Apollo', 'Gmail', 'LinkedIn', 'Clay', 'Notion', 'Zapier'
]

const features = [
  { title: 'Real-time orchestration', description: 'React to signals the moment they happen without any manual intervention.' },
  { title: 'AI-triggered workflows', description: 'Let intelligent agents determine the next best action for every prospect.' },
  { title: 'Autonomous outbound execution', description: 'Launch personalized engagement instantly based on deep context.' }
]

const metrics = [
  { label: 'Workflows Executed', value: '1.2M+' },
  { label: 'Meetings Booked', value: '14,500' },
  { label: 'AI Actions Triggered', value: '3.4M' },
  { label: 'Enrichment Speed', value: '0.4s' }
]

export default function WorkflowAutomation() {
  return (
    <div 
      className="min-h-screen font-sans"
      style={{
        background: 'linear-gradient(to bottom, #040404, #070707, #0a0a0a)'
      }}
    >
      {/* Ambient Fog Layers */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 60%)'
        }}
      />
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 50% 100%, rgba(255,255,255,0.03) 0%, transparent 50%)'
        }}
      />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 overflow-hidden z-10">
        <div className="container-limit w-full grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={smoothTransition}
            className="flex flex-col items-start"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl mb-8">
              <Zap className="w-4 h-4 text-white/70" />
              <span className="text-sm font-medium text-white/70 tracking-wide">AI Workflow Automation</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-[80px] font-semibold text-white/95 leading-[1.05] tracking-[-0.03em] mb-8">
              Your GTM team.<br />Automated.
            </h1>
            
            <p className="text-lg sm:text-xl text-white/55 max-w-xl leading-relaxed mb-12 font-light tracking-wide">
              Connect signals, trigger actions, enrich leads, route intent, and launch autonomous GTM workflows — instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 rounded-full bg-white text-black font-medium hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]">
                Build workflows
              </button>
              <button className="px-8 py-4 rounded-full bg-white/[0.03] border border-white/[0.08] text-white/95 font-medium backdrop-blur-xl hover:bg-white/[0.08] transition-all duration-300 flex items-center gap-2 group">
                <Play className="w-4 h-4 text-white/70 group-hover:text-white" />
                Watch demo
              </button>
            </div>
          </motion.div>

          {/* Right Side Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...smoothTransition, delay: 0.2 }}
            className="relative h-[600px] rounded-[32px] bg-white/[0.02] border border-white/[0.05] backdrop-blur-3xl shadow-[0_0_60px_-15px_rgba(255,255,255,0.05)] p-8 flex flex-col justify-center overflow-hidden"
          >
            {/* Soft background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-white/[0.02] blur-[100px] rounded-full" />
            
            <div className="relative z-10 flex flex-col gap-4 max-w-sm mx-auto w-full">
              {workflowNodes.map((node, i) => (
                <div key={i} className="relative flex items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...smoothTransition, delay: 0.4 + i * 0.1 }}
                    className="flex-1 flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl shadow-lg relative group overflow-hidden"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center border border-white/[0.1]">
                      <node.icon className="w-4 h-4 text-white/70" />
                    </div>
                    <span className="text-sm font-medium text-white/80">{node.label}</span>
                    <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </motion.div>
                  
                  {i < workflowNodes.length - 1 && (
                    <motion.div 
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 1, delay: 0.6 + i * 0.1, ease: "linear" }}
                      className="absolute left-8 top-full h-8 w-[1px] bg-gradient-to-b from-white/20 to-transparent origin-top -z-10"
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Build workflows visually */}
      <section className="relative py-32 z-10">
        <div className="container-limit">
          <SectionReveal className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-semibold text-white/95 tracking-tight mb-6">
              Build workflows visually.
            </h2>
          </SectionReveal>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {modules.map((mod, i) => (
                <SectionReveal key={i} delay={i * 0.1}>
                  <div className="group flex flex-col items-center justify-center p-8 rounded-[32px] bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl hover:bg-white/[0.05] hover:border-white/[0.15] transition-all duration-700 ease-out hover:-translate-y-2 relative">
                    <div className="absolute inset-0 bg-white/[0.02] blur-xl rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <mod.icon className="w-8 h-8 text-white/60 mb-4 group-hover:text-white transition-colors duration-500 relative z-10" />
                    <span className="text-sm font-medium text-white/80 relative z-10">{mod.label}</span>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Autonomous Execution */}
      <section className="relative py-32 z-10">
        <div className="container-limit">
          <SectionReveal className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-semibold text-white/95 tracking-tight mb-6">
              Autonomous execution.
            </h2>
          </SectionReveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {scenarios.map((scenario, i) => (
              <SectionReveal key={i} delay={i * 0.2}>
                <div className="p-10 rounded-[32px] bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl flex flex-col h-full hover:bg-white/[0.04] transition-all duration-700 hover:shadow-[0_20px_60px_-15px_rgba(255,255,255,0.05)]">
                  <div className="mb-8">
                    <div className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">Scenario {i + 1}</div>
                    <h3 className="text-2xl font-medium text-white/90">"{scenario.trigger}"</h3>
                  </div>
                  
                  <div className="flex-1 flex flex-col gap-6">
                    {scenario.steps.map((step, j) => (
                      <div key={j} className="flex items-start gap-4">
                        <div className="mt-1 flex flex-col items-center">
                          <div className="w-2 h-2 rounded-full bg-white/40" />
                          {j < scenario.steps.length - 1 && (
                            <div className="w-[1px] h-10 bg-white/10 mt-2" />
                          )}
                        </div>
                        <span className="text-lg text-white/70 font-light">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Integrations */}
      <section className="relative py-32 z-10">
        <div className="container-limit">
          <SectionReveal className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-semibold text-white/95 tracking-tight mb-6">
              Every tool. One orchestration layer.
            </h2>
          </SectionReveal>

          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
            {integrations.map((tool, i) => (
              <SectionReveal key={i} delay={i * 0.05}>
                <div className="px-8 py-4 rounded-[24px] bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl text-white/70 font-medium hover:bg-white/[0.05] hover:text-white transition-all duration-500 hover:-translate-y-1">
                  {tool}
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Features */}
      <section className="relative py-32 z-10">
        <div className="container-limit">
          <SectionReveal className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-semibold text-white/95 tracking-tight mb-6">
              Built for AI-native GTM teams.
            </h2>
          </SectionReveal>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, i) => (
              <SectionReveal key={i} delay={i * 0.1}>
                <div className="p-10 rounded-[32px] bg-gradient-to-b from-white/[0.05] to-transparent border border-white/[0.08] backdrop-blur-2xl hover:border-white/[0.15] transition-all duration-700 h-full flex flex-col justify-between group">
                  <div>
                    <h3 className="text-2xl font-semibold text-white/90 mb-4 tracking-tight group-hover:text-white transition-colors">{feature.title}</h3>
                    <p className="text-white/50 leading-relaxed font-light text-lg">
                      {feature.description}
                    </p>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/30 group-hover:text-white/90 group-hover:border-white/30 transition-all duration-500">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Analytics */}
      <section className="relative py-32 z-10">
        <div className="container-limit">
          <div className="max-w-6xl mx-auto bg-white/[0.02] border border-white/[0.05] rounded-[40px] p-12 backdrop-blur-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none" />
            
            <SectionReveal className="mb-16">
              <h2 className="text-3xl font-semibold text-white/90 tracking-tight">
                Live Workflow Analytics
              </h2>
            </SectionReveal>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {metrics.map((metric, i) => (
                <SectionReveal key={i} delay={i * 0.1}>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white/40 uppercase tracking-wider mb-2">{metric.label}</span>
                    <span className="text-4xl lg:text-5xl font-semibold text-white/95 tracking-tight">{metric.value}</span>
                  </div>
                </SectionReveal>
              ))}
            </div>
            
            {/* Minimal line trace representation instead of bright charts */}
            <SectionReveal delay={0.4}>
              <div className="mt-16 h-32 w-full border-b border-white/[0.05] relative flex items-end">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path 
                    d="M0,80 Q20,90 40,50 T80,30 T100,10" 
                    fill="none" 
                    stroke="rgba(255,255,255,0.15)" 
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                  <path 
                    d="M0,80 Q20,90 40,50 T80,30 T100,10 L100,100 L0,100 Z" 
                    fill="url(#fade)" 
                  />
                  <defs>
                    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.03)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-40 z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.05] blur-[150px] rounded-full pointer-events-none" />
        
        <div className="container-limit text-center relative z-10">
          <SectionReveal>
            <h2 className="text-5xl sm:text-7xl font-semibold text-white/95 tracking-tight mb-12">
              Let your GTM run itself.
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button className="px-10 py-5 rounded-full bg-white text-black font-semibold text-lg hover:scale-105 transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)]">
                Start building
              </button>
              <button className="px-10 py-5 rounded-full bg-white/[0.03] border border-white/[0.08] text-white/90 font-medium text-lg backdrop-blur-xl hover:bg-white/[0.08] transition-all duration-500">
                Book demo
              </button>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  )
}
