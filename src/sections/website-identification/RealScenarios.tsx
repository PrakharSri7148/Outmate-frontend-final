import { AlertCircle, CheckCircle2 } from 'lucide-react'
import SectionReveal from '../../components/SectionReveal'

const scenarios = [
  {
    title: 'HIGH INTENT',
    without: 'A Series B VP of Sales visits your /pricing page 3 times across 2 days. They leave. You never know they were there. They sign a contract with your competitor next week.',
    with: 'Day 1, 9:14am — Outmate identifies Sarah Jenkins, VP Sales, Acme Corp (Series B, $24M).',
    pulseColor: 'bg-red-500'
  },
  {
    title: 'COMPETITIVE',
    without: 'Someone Googles “[your brand] vs [competitor]” and lands on your comparison page. You never know who compared you.',
    with: 'Marcus Chen, CTO at TechFlow Inc, visits /compare-outmate-vs-rb2b.',
    pulseColor: 'bg-yellow-500'
  },
  {
    title: 'ABM',
    without: 'Stripe has been on your target account list for 6 months. No inbound. No response to outbound. Cold account.',
    with: 'Outmate identifies 4 buying committee members researching your docs in the same week.',
    pulseColor: 'bg-purple'
  }
]

export default function RealScenarios() {
  return (
    <section className="py-32 bg-white">
      <div className="container-limit max-w-5xl">
        <SectionReveal className="text-center mb-16">
          <p className="text-sm font-semibold tracking-widest text-purple uppercase mb-4">Real Scenarios</p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-void tracking-tight leading-[1.1] max-w-3xl mx-auto">
            Three moments where Outmate changes the outcome
          </h2>
        </SectionReveal>

        <div className="space-y-6">
          {scenarios.map((scenario, i) => (
            <SectionReveal key={i} delay={i * 0.15}>
              <div className="relative rounded-[24px] overflow-hidden bg-white border border-void/5 shadow-[0_4px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_50px_rgba(124,58,237,0.08)] transition-all duration-500 group">
                {/* Left Accent Border */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-purple/40 to-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="p-8 md:p-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="relative flex items-center justify-center w-2 h-2">
                      <span className={`absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping ${scenario.pulseColor}`} />
                      <span className={`relative inline-flex rounded-full w-2 h-2 ${scenario.pulseColor}`} />
                    </div>
                    <h3 className="font-mono text-sm font-bold text-void/60 tracking-wider">
                      {scenario.title}
                    </h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                    {/* Without Outmate */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-void/40 uppercase tracking-widest mb-2">
                        <AlertCircle className="w-4 h-4" />
                        Without Outmate
                      </div>
                      <p className="text-void/60 leading-relaxed text-lg">
                        {scenario.without}
                      </p>
                    </div>

                    {/* With Outmate */}
                    <div className="space-y-3 relative before:absolute before:left-[-24px] md:before:left-[-24px] before:top-0 before:bottom-0 before:w-px before:bg-void/5 hidden md:block">
                      <div className="flex items-center gap-2 text-sm font-semibold text-purple uppercase tracking-widest mb-2">
                        <CheckCircle2 className="w-4 h-4" />
                        With Outmate
                      </div>
                      <p className="text-void leading-relaxed text-lg font-medium">
                        {scenario.with}
                      </p>
                    </div>

                    {/* Mobile Only With Outmate */}
                    <div className="space-y-3 md:hidden pt-6 border-t border-void/5">
                      <div className="flex items-center gap-2 text-sm font-semibold text-purple uppercase tracking-widest mb-2">
                        <CheckCircle2 className="w-4 h-4" />
                        With Outmate
                      </div>
                      <p className="text-void leading-relaxed text-lg font-medium">
                        {scenario.with}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
