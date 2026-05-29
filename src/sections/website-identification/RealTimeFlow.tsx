import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import SectionReveal from '../../components/SectionReveal'

const processingSteps = [
  { text: 'Page event captured', time: '+0ms' },
  { text: 'Company ID resolved', time: '+80ms' },
  { text: 'Person identified', time: '+350ms' },
  { text: 'Intent score updated', time: '+1200ms' },
  { text: 'CRM record pushed', time: '+1450ms' },
  { text: 'Slack alert sent', time: '+1600ms' },
]

export default function RealTimeFlow() {
  return (
    <section className="py-32 bg-[#f5f5f3]">
      <div className="container-limit">
        <SectionReveal className="mb-4">
          <p className="text-sm font-semibold tracking-widest text-purple uppercase mb-4">Real-Time Flow</p>
        </SectionReveal>
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Terminal Card */}
          <SectionReveal delay={0.2}>
            <div className="relative rounded-[24px] overflow-hidden bg-void border border-purple/20 shadow-[0_0_40px_rgba(124,58,237,0.15)] p-8 font-mono text-sm">
              <div className="flex items-center gap-2 mb-6 opacity-50">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-white/60 mb-6"
              >
                PROCESSING VISITOR EVENT...
              </motion.div>

              <div className="space-y-4">
                {processingSteps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.2, duration: 0.4 }}
                    className="flex justify-between items-center text-white/90"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span>{step.text}</span>
                    </div>
                    <span className="text-purple/80">{step.time}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + processingSteps.length * 0.2 + 0.3 }}
                className="mt-8 text-green-400 font-semibold border-t border-white/10 pt-6"
              >
                ✓ COMPLETE — 1.6 seconds
              </motion.div>
            </div>
          </SectionReveal>

          {/* Right: Content */}
          <SectionReveal delay={0.3}>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-void tracking-tight leading-[1.1] mb-6">
              From click to CRM sync in under 2 seconds
            </h2>
            <p className="text-lg text-void/70 mb-8 max-w-md leading-relaxed">
              Every visitor action triggers a real-time processing pipeline. No batch jobs. No delays.
            </p>

            <ul className="space-y-4 mb-10">
              {[
                'Sub-second company resolution',
                'Person-level matching in parallel',
                'Intent recalculation on every page',
                'Instant CRM sync (HubSpot, Salesforce)',
                'Slack + Webhook notifications',
                'No data loss or queuing',
                '99.9% uptime SLA'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-void/80">
                  <ArrowRight className="w-5 h-5 text-purple shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <button className="bg-void text-white px-8 py-4 rounded-xl font-medium hover:bg-void/90 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 flex items-center gap-2 group">
              See integrations
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </SectionReveal>
        </div>
      </div>
    </section>
  )
}
