import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import SectionReveal from '../../components/SectionReveal'

const enrichmentSteps = [
  { text: 'Visitor detected', time: '0.0s', result: '' },
  { text: 'IP resolved', time: '0.1s', result: '→ Acme Corp' },
  { text: 'Identity matched', time: '0.4s', result: '→ Sarah Jenkins' },
  { text: 'Email verified', time: '0.6s', result: '→ sarah.j@acmecorp.com' },
  { text: 'Mobile appended', time: '0.8s', result: '→ +1 (415) 555-••••' },
  { text: 'LinkedIn found', time: '0.9s', result: '→ /in/sarah-j' },
  { text: 'Funding data', time: '1.0s', result: '→ Series B · $24M' },
  { text: 'ICP score calculated', time: '1.2s', result: '→ 94 / 100' },
]

export default function EnrichmentPipeline() {
  return (
    <section className="py-32 bg-white">
      <div className="container-limit">
        <SectionReveal className="mb-4">
          <p className="text-sm font-semibold tracking-widest text-purple uppercase mb-4">Enrichment Pipeline</p>
        </SectionReveal>
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Terminal Card */}
          <SectionReveal delay={0.2}>
            <div className="relative rounded-[24px] overflow-hidden bg-void border border-white/5 shadow-2xl p-8 font-mono text-sm">
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
                ENRICHING SARAH JENKINS...
              </motion.div>

              <div className="space-y-4">
                {enrichmentSteps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.15, duration: 0.4 }}
                    className="flex justify-between items-center text-white/90"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-purple/80" />
                      <span className="w-40">{step.text}</span>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <span className="text-white/40">{step.time}</span>
                      <span className="text-white font-medium min-w-[140px] text-left">{step.result}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </SectionReveal>

          {/* Right: Content */}
          <SectionReveal delay={0.3}>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-void tracking-tight leading-[1.1] mb-6">
              One visitor. Dozens of data points. Seconds.
            </h2>
            <p className="text-lg text-void/70 mb-8 max-w-md leading-relaxed">
              We run enrichment across 20+ data providers simultaneously — not sequentially. No waiting. No gaps.
            </p>

            <ul className="space-y-4 mb-10">
              {[
                '20+ data providers in parallel',
                'Verified email, not guessed',
                'Direct mobile, not switchboard',
                'Funding + headcount + tech stack',
                'ICP score auto-calculated',
                'CRM owner auto-matched',
                'All in under 2 seconds'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-void/80">
                  <ArrowRight className="w-5 h-5 text-purple shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <button className="bg-purple text-white px-8 py-4 rounded-xl font-medium hover:bg-purple/90 hover:scale-[1.02] shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all duration-300 flex items-center gap-2 group">
              Explore Database
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </SectionReveal>
        </div>
      </div>
    </section>
  )
}
