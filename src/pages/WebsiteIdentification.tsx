import { Link } from 'react-router-dom'
import CpuArchitecture from '../components/CpuArchitecture'
import { motion } from 'framer-motion'
import SectionReveal from '../components/SectionReveal'
import { ElegantShape } from '../components/ElegantShape'
import {
  Eye,
  Fingerprint,
  Globe,
  BrainCircuit,
  Mail,
  Building2,
  MousePointerClick,
} from 'lucide-react'
import RealTimeFlow from '../sections/website-identification/RealTimeFlow'
import EnrichmentPipeline from '../sections/website-identification/EnrichmentPipeline'
import AccuracyMetrics from '../sections/website-identification/AccuracyMetrics'
import RealScenarios from '../sections/website-identification/RealScenarios'
import ComparisonTable from '../sections/website-identification/ComparisonTable'
import RoiCalculator from '../sections/website-identification/RoiCalculator'
import BuyerSignalsHero from '../sections/website-identification/BuyerSignalsHero'

const identityLayers = [
  {
    icon: Fingerprint,
    title: 'IP Intelligence',
    description: 'Match anonymous sessions to known business networks across 173+ countries',
    accent: '#7C3AED',
  },
  {
    icon: Globe,
    title: 'Cookie + Device Graph',
    description: 'Cross-reference device fingerprints with our publisher data network',
    accent: '#22D3EE',
  },
  {
    icon: Eye,
    title: 'Publisher Network Match',
    description: '10,000+ website partnerships provide deterministic identity matches',
    accent: '#22C55E',
  },
  {
    icon: BrainCircuit,
    title: 'Behavioral Signal Enrichment',
    description: 'Intent signals from content consumption, visit patterns, and engagement depth',
    accent: '#F59E0B',
  },
]

const enrichmentCards = [
  {
    icon: Mail,
    title: 'Contact Intelligence',
    items: ['Verified email addresses', 'Direct phone numbers', 'LinkedIn profiles', 'Job titles & seniority'],
    accent: '#7C3AED',
  },
  {
    icon: Building2,
    title: 'Firmographic Data',
    items: ['Company size & revenue', 'Industry & sub-industry', 'Tech stack detection', 'Funding stage & investors'],
    accent: '#22D3EE',
  },
  {
    icon: MousePointerClick,
    title: 'Behavior Signals',
    items: ['Pages viewed & time on site', 'Content downloaded', 'Return visit frequency', 'Purchase intent scoring'],
    accent: '#22C55E',
  },
]

export default function WebsiteIdentification() {
  return (
    <div className="bg-void">
      {/* Sparkle Intro Transition Section */}
      <BuyerSignalsHero />

      {/* Hero */}
      <section className="min-h-[100dvh] flex items-center pt-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl pointer-events-none" />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <ElegantShape
            delay={0.3}
            width={600}
            height={140}
            rotate={12}
            isLarge={true}
            className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
          />
          <ElegantShape
            delay={0.5}
            width={500}
            height={120}
            rotate={-15}
            isLarge={true}
            className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
          />
          <ElegantShape
            delay={0.4}
            width={300}
            height={80}
            rotate={-8}
            floatDuration={14}
            opacity={0.4}
            blur={8}
            className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
          />
          <ElegantShape
            delay={0.6}
            width={200}
            height={60}
            rotate={20}
            floatDuration={10}
            opacity={0.7}
            blur={3}
            className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
          />
          <ElegantShape
            delay={0.7}
            width={150}
            height={40}
            rotate={-25}
            floatDuration={8}
            opacity={1}
            blur={0}
            className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
          />
        </div>

        <div className="container-limit relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-text-primary leading-[1.05] tracking-[-2px]">
                You're blind to{' '}
                <span className="text-purple">97%</span>{' '}
                of your buyers
              </h1>
              <p className="mt-6 text-lg text-text-secondary max-w-lg">
                Identify anonymous visitors and convert them into qualified pipeline automatically.
              </p>
              <p
                className="text-white/60 font-light"
                style={{
                  maxWidth: 620,
                  marginTop: 24,
                  lineHeight: 1.75,
                  fontWeight: 400,
                  letterSpacing: '0.01em',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 16,
                }}
              >
                Outmate identifies anonymous B2B visitors at the person level — name, email, role, company — the moment they hit your site. No forms. No guesswork.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link to="/pricing" className="btn-primary">
                  See it in action
                </Link>
                <Link to="/pricing" className="btn-secondary">
                  Start free — no card needed
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative flex items-center justify-center"
            >
              <CpuArchitecture />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Seamless Premium Apple-style Environment for Sections 1, 2, 3 */}
      <div 
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, #050505 0%, #070707 40%, #090909 100%)'
        }}
      >
        {/* Soft white ambient fog */}
        <div className="absolute inset-0 bg-white/5 blur-[140px] pointer-events-none" />
        {/* Floating light patches */}
        <div className="absolute top-[20%] left-[-10%] w-[40vw] h-[40vh] bg-white/[0.03] blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-[60%] right-[-10%] w-[50vw] h-[50vh] bg-white/[0.03] blur-[150px] rounded-full pointer-events-none" />

        {/* The Problem */}
        <section className="section-padding relative z-10">
          <div className="container-limit">
            <SectionReveal className="text-center mb-20">
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-white/95 tracking-tight leading-tight">
                Your best buyers are already on your site.<br />
                <span className="text-white/55">You just can't see them.</span>
              </h2>
            </SectionReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { value: '100%', label: 'All traffic', color: '#b6d0ff' },
                { value: '3%', label: 'Fill out forms', color: '#f5ebd6' },
                { value: '97%', label: 'Leave anonymously', color: '#ffdede', pulse: true },
              ].map((stat, i) => (
                <SectionReveal key={i} delay={i * 0.15}>
                  <div className="p-10 text-center rounded-[32px] border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl transition-all duration-500 ease-out hover:-translate-y-1 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04),transparent_50%)] animate-pulse-slow" />
                    <div
                      className="font-display text-5xl lg:text-6xl font-light tracking-tight relative z-10"
                      style={{
                        color: stat.color,
                        ...(stat.pulse ? { textShadow: `0 0 40px ${stat.color}40`, animation: 'pulse-slow 3s ease-in-out infinite' } : {}),
                      }}
                    >
                      {stat.value}
                    </div>
                    <div className="mt-4 font-display text-lg font-light text-white/55 relative z-10">
                      {stat.label}
                    </div>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="section-padding relative z-10">
          <div className="container-limit">
            <SectionReveal className="text-center mb-20">
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-white/95 tracking-tight leading-tight">
                Not IP lookup. Not LinkedIn scraping.<br />
                <span className="text-white/70">A proprietary identity graph.</span>
              </h2>
            </SectionReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {identityLayers.map((layer, i) => (
                <SectionReveal key={i} delay={i * 0.1}>
                  <div className="p-8 h-full rounded-[32px] border border-white/[0.05] bg-white/[0.025] backdrop-blur-xl transition-transform duration-500 ease-out hover:-translate-y-1 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full blur-2xl group-hover:bg-white/[0.04] transition-colors duration-700" />
                    <div
                      className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-6 bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] border border-white/[0.05]"
                    >
                      <layer.icon className="w-5 h-5 text-white/90" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-display text-xl font-medium text-white/95 mb-3 leading-tight">
                      {layer.title}
                    </h3>
                    <p className="text-[15px] text-white/55 leading-relaxed font-light">
                      {layer.description}
                    </p>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Enrichment Data */}
        <section className="section-padding relative z-10">
          <div className="container-limit">
            <SectionReveal className="text-center mb-20">
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-white/95 tracking-tight leading-tight">
                Every identified visitor comes<br />
                <span className="text-white/70">fully enriched.</span>
              </h2>
            </SectionReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {enrichmentCards.map((card, i) => (
                <SectionReveal key={i} delay={i * 0.15}>
                  <div className="p-8 h-full rounded-[32px] border border-white/[0.05] bg-white/[0.025] backdrop-blur-xl transition-transform duration-500 ease-out hover:-translate-y-1 relative overflow-hidden group">
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/[0.015] rounded-full blur-3xl group-hover:bg-white/[0.03] transition-colors duration-700" />
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-6 bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] border border-white/[0.05]"
                    >
                      <card.icon className="w-5 h-5 text-white/90" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-display text-xl font-medium text-white/95 mb-5 leading-tight">
                      {card.title}
                    </h3>
                    <ul className="space-y-3.5 relative z-10">
                      {card.items.map((item, j) => (
                        <li key={j} className="flex items-center gap-3 text-[15px] text-white/55 font-light">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Dashboard Preview */}
        <section className="py-24 relative z-10">
          <div className="container-limit">
            <SectionReveal className="text-center mb-16">
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-white/95 tracking-tight leading-tight">
                See every visitor.<br />
                <span className="text-white/70">Know everything.</span>
              </h2>
            </SectionReveal>

            <SectionReveal delay={0.2}>
              <div className="relative rounded-[3rem] p-8 md:p-12 overflow-hidden border border-white/[0.08] shadow-[0_0_80px_rgba(255,255,255,0.03)] bg-white/[0.02] backdrop-blur-3xl min-h-[500px] flex flex-col group">
                {/* Soft top-down lighting */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_70%)] pointer-events-none" />
                
                {/* Glass UI layout */}
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 h-full items-center">
                   {/* Left Panel: Graphs */}
                   <div className="space-y-6 flex flex-col justify-center">
                      <div className="h-32 rounded-3xl bg-white/[0.02] border border-white/[0.04] p-5 flex items-end gap-2.5 relative group-hover:bg-white/[0.035] transition-colors duration-700">
                         {[40, 70, 45, 90, 65, 80, 50].map((h, k) => (
                            <motion.div key={k} initial={{ height: 0 }} whileInView={{ height: `${h}%` }} transition={{ duration: 1.5, delay: k * 0.1, ease: [0.16,1,0.3,1] }} className="flex-1 bg-white/[0.15] rounded-sm" />
                         ))}
                      </div>
                      <div className="h-40 rounded-3xl bg-white/[0.02] border border-white/[0.04] p-5 flex flex-col justify-end gap-3 relative overflow-hidden group-hover:bg-white/[0.035] transition-colors duration-700">
                         <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                            <motion.path initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeInOut" }} d="M0,80 C20,60 40,90 60,40 C80,20 100,50 100,50" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                            <path d="M0,80 C20,60 40,90 60,40 C80,20 100,50 100,50 L100,100 L0,100 Z" fill="url(#grad)" opacity="0.1" />
                            <defs>
                              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
                                 <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                              </linearGradient>
                            </defs>
                         </svg>
                      </div>
                   </div>

                   {/* Center: Globe Visual */}
                   <div className="flex items-center justify-center relative h-full">
                      <motion.div 
                         animate={{ rotate: 360 }} 
                         transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                         className="relative w-72 h-72 rounded-full flex items-center justify-center overflow-hidden"
                      >
                         <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent_70%)] rounded-full blur-xl" />
                         <Globe className="w-full h-full text-white/[0.12]" strokeWidth={0.5} />
                         {/* Soft light trails */}
                         <div className="absolute top-[30%] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-200/40 to-transparent blur-[2px] rotate-12" />
                         <div className="absolute top-[60%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent blur-[1px] -rotate-[15deg]" />
                      </motion.div>
                   </div>

                   {/* Right Panel: Intelligence feed */}
                   <div className="space-y-4 flex flex-col justify-center">
                      {[1,2,3].map((item, i) => (
                         <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2, duration: 0.8 }} key={item} className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.04] flex items-center gap-5 group-hover:bg-white/[0.035] transition-colors duration-700">
                            <div className="w-12 h-12 rounded-[14px] bg-white/[0.04] border border-white/[0.05] flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                               <div className="w-2.5 h-2.5 rounded-full bg-white/70 animate-pulse" />
                            </div>
                            <div className="flex-1">
                               <div className="h-2 w-28 bg-white/[0.15] rounded-full mb-3" />
                               <div className="h-1.5 w-16 bg-white/[0.08] rounded-full" />
                            </div>
                         </motion.div>
                      ))}
                   </div>
                </div>
              </div>
            </SectionReveal>
          </div>
        </section>
      </div>

      {/* New Premium Sections */}
      <RealTimeFlow />
      <EnrichmentPipeline />
      <AccuracyMetrics />
      <RealScenarios />
      <ComparisonTable />
      <RoiCalculator />
    </div>
  )
}
