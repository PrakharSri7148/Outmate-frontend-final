import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import SectionReveal from '../../components/SectionReveal'

const accuracyMetrics = [
  { text: 'Person-level match', value: '40%+' },
  { text: 'Email accuracy', value: '98.7%' },
  { text: 'Mobile deliverable', value: '94.2%' },
  { text: 'LinkedIn found', value: '87.3%' },
  { text: 'Company size match', value: '99.1%' },
  { text: 'ICP score precision', value: '92.5%' },
]

export default function AccuracyMetrics() {
  return (
    <section className="py-32 bg-[#f5f5f3]">
      <div className="container-limit">
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
                ACCURACY METRICS (REAL DATA)...
              </motion.div>

              <div className="space-y-4">
                {accuracyMetrics.map((metric, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.15, duration: 0.4 }}
                    className="flex justify-between items-center text-white/90"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-purple" />
                      <span>{metric.text}</span>
                    </div>
                    <span className="text-white font-medium">{metric.value}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + accuracyMetrics.length * 0.15 + 0.3 }}
                className="mt-8 text-white/40 border-t border-white/10 pt-6"
              >
                Verified against live customer datasets.
              </motion.div>
            </div>
          </SectionReveal>

          {/* Right: Content */}
          <SectionReveal delay={0.3}>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-void tracking-tight leading-[1.1] mb-6">
              40%+ match rate means <br className="hidden lg:block" />
              <span className="text-purple">40 named leads per 100 visitors</span>
            </h2>
            <p className="text-lg text-void/70 mb-8 max-w-md leading-relaxed">
              Our data undergoes continuous validation. Every field is verified against multiple sources and updated monthly.
            </p>

            <ul className="space-y-4 mb-10">
              {[
                'Email verification via SMTP',
                'Phone validation in real time',
                'LinkedIn profile verification',
                'Company data cross-referenced',
                'Monthly data freshness refresh',
                'Automatic deduplication',
                'GDPR-compliant sourcing'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-void/80">
                  <ArrowRight className="w-5 h-5 text-purple shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <button className="bg-void text-white px-8 py-4 rounded-xl font-medium hover:bg-void/90 hover:scale-[1.02] shadow-xl transition-all duration-300 flex items-center gap-2 group">
              View accuracy report
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </SectionReveal>
        </div>
      </div>
    </section>
  )
}
