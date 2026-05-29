import { motion } from 'framer-motion'
import SectionReveal from '../../components/SectionReveal'
import { Check, Minus } from 'lucide-react'

const features = [
  { name: 'Person-level ID', outmate: true, rb2b: true, warmly: false, leadfeeder: false, clearbit: false },
  { name: 'Match rate', outmate: '60%+', rb2b: '40%+', warmly: '25%+', leadfeeder: '20%+', clearbit: '20%+' },
  { name: 'Auto enrichment', outmate: true, rb2b: false, warmly: true, leadfeeder: false, clearbit: true },
  { name: 'Agentic outreach', outmate: true, rb2b: false, warmly: false, leadfeeder: false, clearbit: false },
  { name: 'Workflow builder', outmate: true, rb2b: false, warmly: true, leadfeeder: false, clearbit: false },
  { name: 'CRM sync', outmate: true, rb2b: true, warmly: true, leadfeeder: true, clearbit: true },
  { name: 'Voice AI agent', outmate: true, rb2b: false, warmly: false, leadfeeder: false, clearbit: false },
  { name: 'Free trial', outmate: true, rb2b: true, warmly: false, leadfeeder: true, clearbit: false },
  { name: 'Pricing', outmate: 'Affordable', rb2b: 'Free/$', warmly: 'Premium', leadfeeder: 'Mid', clearbit: 'Premium' },
]

function renderValue(val: string | boolean) {
  if (typeof val === 'boolean') {
    return val 
      ? <Check className="w-5 h-5 mx-auto text-white" />
      : <Minus className="w-5 h-5 mx-auto text-[#B8B8B8]/30" />
  }
  return <span className={`text-sm font-medium ${val.includes('%') ? 'text-white' : 'text-[#B8B8B8]'}`}>{val}</span>
}

export default function ComparisonSection() {
  return (
    <section className="bg-[#0F0F10] py-24 relative overflow-hidden">
      <div className="container-limit mx-auto px-4 md:px-6 relative z-10">
        
        <SectionReveal>
          <div className="flex flex-col items-center text-center space-y-4 mb-16">
            <span className="text-[10px] sm:text-xs font-mono text-[#B8B8B8] tracking-widest uppercase px-3 py-1 bg-white/[0.03] border border-white/[0.08] rounded-full">
              HOW WE COMPARE
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-white tracking-tight">
              Why teams switch<br className="hidden md:block" /> to Outmate
            </h2>
            <p className="text-lg md:text-xl text-[#B8B8B8] max-w-2xl mt-4">
              Outmate identifies, enriches, and activates leads automatically.
            </p>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <div className="w-full max-w-[1100px] mx-auto overflow-x-auto pb-6 custom-scrollbar">
            <div className="min-w-[800px] grid grid-cols-6 text-center border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl relative"
                 style={{ background: 'rgba(255,255,255,0.02)' }}>
              
              {/* Highlight backdrop for Outmate column - Redesign: Glass highlight instead of Purple */}
              <div className="absolute top-0 bottom-0 left-[16.666%] w-[16.666%] bg-white/[0.035] border-l border-r border-white/[0.08] pointer-events-none z-0" />
              <div className="absolute top-0 bottom-0 left-[16.666%] w-[16.666%] shadow-[0_0_40px_rgba(255,255,255,0.02)] pointer-events-none z-0" />
              
              {/* Header Row */}
              <div className="contents relative z-10">
                <div className="p-6 text-left border-b border-white/[0.08] font-semibold text-[#B8B8B8]">Features</div>
                <div className="p-6 border-b border-white/[0.08] font-semibold text-white">Outmate</div>
                <div className="p-6 border-b border-white/[0.08] font-medium text-[#B8B8B8]">RB2B</div>
                <div className="p-6 border-b border-white/[0.08] font-medium text-[#B8B8B8]">Warmly</div>
                <div className="p-6 border-b border-white/[0.08] font-medium text-[#B8B8B8]">Leadfeeder</div>
                <div className="p-6 border-b border-white/[0.08] font-medium text-[#B8B8B8]">Clearbit</div>
              </div>

              {/* Data Rows */}
              {features.map((row, i) => (
                <motion.div 
                  key={row.name} 
                  className="contents group relative z-10"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.05 }}
                >
                  {/* Pseudo-row hover effect */}
                  <div className="col-span-6 h-px w-full absolute pointer-events-none bg-transparent group-hover:bg-white/[0.03] transition-colors" />

                  <div className={`p-5 text-left border-b border-white/[0.04] text-sm text-white/80 group-hover:text-white transition-colors flex items-center ${i === features.length - 1 ? 'border-b-0' : ''}`}>
                    {row.name}
                  </div>
                  <div className={`p-5 border-b border-white/[0.04] flex items-center justify-center ${i === features.length - 1 ? 'border-b-0' : ''}`}>
                    {renderValue(row.outmate)}
                  </div>
                  <div className={`p-5 border-b border-white/[0.04] flex items-center justify-center ${i === features.length - 1 ? 'border-b-0' : ''}`}>
                    {renderValue(row.rb2b)}
                  </div>
                  <div className={`p-5 border-b border-white/[0.04] flex items-center justify-center ${i === features.length - 1 ? 'border-b-0' : ''}`}>
                    {renderValue(row.warmly)}
                  </div>
                  <div className={`p-5 border-b border-white/[0.04] flex items-center justify-center ${i === features.length - 1 ? 'border-b-0' : ''}`}>
                    {renderValue(row.leadfeeder)}
                  </div>
                  <div className={`p-5 border-b border-white/[0.04] flex items-center justify-center ${i === features.length - 1 ? 'border-b-0' : ''}`}>
                    {renderValue(row.clearbit)}
                  </div>
                </motion.div>
              ))}

            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
