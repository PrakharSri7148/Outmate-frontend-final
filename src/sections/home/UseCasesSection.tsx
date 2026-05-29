import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionReveal from '../../components/SectionReveal'
import { Bell, Activity, Users, FileText, CheckCircle } from 'lucide-react'

const useCases = [
  {
    id: 'founder',
    label: 'Founder / Solopreneur',
    title: 'Automate your entire pipeline.',
    description: 'Stop spending hours on manual outreach. Outmate identifies visitors, finds their verified contact details, and automates personalized outreach so you can focus on building.',
    icons: [Activity, Users, Bell]
  },
  {
    id: 'sales',
    label: 'GTM & Sales Teams',
    title: 'Close more accounts, faster.',
    description: 'Arm your sales team with real-time intent data. Know exactly who visited your site, what they looked at, and trigger high-converting sequences instantly.',
    icons: [Users, FileText, Activity]
  },
  {
    id: 'revops',
    label: 'RevOps & Operations',
    title: 'Seamless CRM syncing.',
    description: 'Keep your data clean and actionable. Outmate enriches leads and syncs directly with Salesforce, HubSpot, and your existing tech stack without complex integrations.',
    icons: [Activity, Bell, CheckCircle]
  },
  {
    id: 'marketing',
    label: 'Marketing Teams',
    title: 'Convert anonymous traffic.',
    description: 'Turn your website into your best performing channel. Understand which campaigns drive ICP traffic and capture lost leads before they bounce.',
    icons: [FileText, Users, Bell]
  },
  {
    id: 'agencies',
    label: 'Agencies',
    title: 'Scale client results.',
    description: 'Deliver undeniable ROI to your clients by capturing intent signals and filling their pipeline automatically. White-label reports and seamless integration.',
    icons: [Users, CheckCircle, Activity]
  }
]

export default function UseCasesSection() {
  const [activeId, setActiveId] = useState(useCases[0].id)
  
  const activeCase = useCases.find(uc => uc.id === activeId) || useCases[0]

  return (
    <section className="bg-[#0F0F10] py-24 relative overflow-hidden">
      <div className="container-limit mx-auto px-4 md:px-6 z-10 relative">
        <SectionReveal>
          <div className="flex flex-col items-center text-center space-y-4 mb-16">
            <span className="text-[10px] sm:text-xs font-mono text-[#B8B8B8] tracking-widest uppercase px-3 py-1 bg-white/[0.03] border border-white/[0.08] rounded-full">
              USE CASES
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-white tracking-tight">
              Built for every team<br className="hidden md:block" /> running outbound
            </h2>
            <p className="text-lg md:text-xl text-[#B8B8B8] max-w-2xl mt-4">
              Whether you're a founder, GTM lead, or RevOps team — Outmate runs the play.
            </p>
          </div>
        </SectionReveal>

        {/* Tabs */}
        <SectionReveal delay={0.1}>
          <div className="flex flex-wrap justify-center gap-2 mb-16 w-full max-w-4xl mx-auto">
            {useCases.map((uc) => (
              <button
                key={uc.id}
                onClick={() => setActiveId(uc.id)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 border ${
                  activeId === uc.id
                    ? 'bg-[#6B46C1]/20 border-[#6B46C1]/50 text-white'
                    : 'bg-white/[0.03] border-white/[0.08] text-[#B8B8B8] hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {uc.label}
              </button>
            ))}
          </div>
        </SectionReveal>

        {/* Content Panel */}
        <SectionReveal delay={0.2} className="w-full">
          <div className="w-full max-w-[1200px] mx-auto rounded-[32px] overflow-hidden grid grid-cols-1 lg:grid-cols-2 relative shadow-2xl border border-white/[0.08]"
               style={{ background: 'rgba(255,255,255,0.02)' }}>
            
            {/* Left Content */}
            <div className="p-10 lg:p-16 flex flex-col justify-center relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCase.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col gap-6"
                >
                  <h3 className="text-3xl lg:text-4xl font-display font-semibold text-white leading-tight">
                    {activeCase.title}
                  </h3>
                  <p className="text-lg text-[#B8B8B8] leading-relaxed">
                    {activeCase.description}
                  </p>
                  
                  <button className="mt-4 px-6 py-3 w-fit rounded-lg bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-colors">
                    Explore use case
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Product Sim */}
            <div className="p-8 lg:p-16 flex items-center justify-center border-t lg:border-t-0 lg:border-l border-white/[0.08] relative min-h-[400px] overflow-hidden" 
                 style={{ background: 'rgba(255,255,255,0.01)' }}>
              {/* Glass subtle gradient */}
              <div className="absolute inset-0 opacity-20 pointer-events-none"
                   style={{ background: 'radial-gradient(circle at center, rgba(107, 70, 193, 0.2) 0%, transparent 70%)' }} />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCase.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full max-w-[360px] flex flex-col gap-4 relative z-10"
                >
                  <div className="flex gap-4">
                    {activeCase.icons.map((Icon, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + (i * 0.1) }}
                        className="flex-1 aspect-square rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center backdrop-blur-md shadow-lg"
                      >
                        <Icon className="w-8 h-8 text-white/70" />
                      </motion.div>
                    ))}
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="w-full rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 shadow-lg backdrop-blur-md"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-[#6B46C1]/30 flex items-center justify-center shrink-0">
                        <div className="w-3 h-3 rounded-full bg-[#6B46C1] animate-pulse" />
                      </div>
                      <div>
                         <div className="text-sm font-semibold text-white/90">Signal Detected</div>
                         <div className="text-xs text-white/50">{activeCase.label} Setup</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                       <div className="h-2 w-full bg-white/[0.06] rounded-full" />
                       <div className="h-2 w-3/4 bg-white/[0.06] rounded-full" />
                       <div className="h-2 w-5/6 bg-white/[0.06] rounded-full" />
                    </div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
            
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
