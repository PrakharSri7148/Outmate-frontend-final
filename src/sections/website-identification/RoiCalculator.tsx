import { useState, useEffect } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import SectionReveal from '../../components/SectionReveal'

// Animated number component
function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number, prefix?: string, suffix?: string }) {
  const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 })
  const display = useTransform(spring, (current) => 
    `${prefix}${Math.round(current).toLocaleString()}${suffix}`
  )

  useEffect(() => {
    spring.set(value)
  }, [value, spring])

  return <motion.span>{display}</motion.span>
}

export default function RoiCalculator() {
  const [visitors, setVisitors] = useState(10000)
  const [dealSize, setDealSize] = useState(5000)
  const [closeRate, setCloseRate] = useState(2.5)

  // Standard identification rate without Outmate is ~3%
  const baseIdRate = 0.03
  // Outmate identification rate is 40%
  const outmateIdRate = 0.40

  const baseIdentified = visitors * baseIdRate
  const outmateIdentified = visitors * outmateIdRate

  const basePipeline = baseIdentified * (closeRate / 100) * dealSize
  const outmatePipeline = outmateIdentified * (closeRate / 100) * dealSize
  const additionalPipeline = outmatePipeline - basePipeline

  return (
    <section className="py-32 bg-[#f5f5f3]">
      <div className="container-limit max-w-6xl">
        <SectionReveal className="text-center mb-16">
          <p className="text-sm font-semibold tracking-widest text-purple uppercase mb-4">ROI Calculator</p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-void tracking-tight leading-[1.1] max-w-3xl mx-auto">
            What would 40% more identified visitors be worth?
          </h2>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <div className="bg-white rounded-[32px] shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-void/5 overflow-hidden">
            <div className="grid lg:grid-cols-2">
              
              {/* Left: Sliders */}
              <div className="p-10 md:p-14 border-b lg:border-b-0 lg:border-r border-void/5 space-y-12">
                
                <div>
                  <div className="flex justify-between mb-4">
                    <label className="font-semibold text-void/80">Monthly website visitors</label>
                    <span className="font-mono font-medium text-void bg-[#f5f5f3] px-3 py-1 rounded-lg">{visitors.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="1000" 
                    max="100000" 
                    step="1000"
                    value={visitors} 
                    onChange={(e) => setVisitors(Number(e.target.value))}
                    className="w-full h-2 bg-[#f5f5f3] rounded-lg appearance-none cursor-pointer accent-purple"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-4">
                    <label className="font-semibold text-void/80">Average deal size ($)</label>
                    <span className="font-mono font-medium text-void bg-[#f5f5f3] px-3 py-1 rounded-lg">${dealSize.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="500" 
                    max="50000" 
                    step="500"
                    value={dealSize} 
                    onChange={(e) => setDealSize(Number(e.target.value))}
                    className="w-full h-2 bg-[#f5f5f3] rounded-lg appearance-none cursor-pointer accent-purple"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-4">
                    <label className="font-semibold text-void/80">Current close rate (%)</label>
                    <span className="font-mono font-medium text-void bg-[#f5f5f3] px-3 py-1 rounded-lg">{closeRate}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="15" 
                    step="0.5"
                    value={closeRate} 
                    onChange={(e) => setCloseRate(Number(e.target.value))}
                    className="w-full h-2 bg-[#f5f5f3] rounded-lg appearance-none cursor-pointer accent-purple"
                  />
                </div>

              </div>

              {/* Right: Results */}
              <div className="p-10 md:p-14 bg-void text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple/10 blur-[100px] rounded-full pointer-events-none" />
                
                <div className="relative z-10 space-y-12">
                  
                  {/* Without Outmate */}
                  <div>
                    <h3 className="font-mono text-sm tracking-widest text-white/50 uppercase mb-6">Without Outmate (3% Match)</h3>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-white/60 text-sm mb-2">Identified / month</p>
                        <p className="text-3xl font-bold font-display"><AnimatedNumber value={baseIdentified} /></p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm mb-2">Potential Pipeline</p>
                        <p className="text-3xl font-bold font-display"><AnimatedNumber value={basePipeline} prefix="$" /></p>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-white/10 w-full" />

                  {/* With Outmate */}
                  <div>
                    <h3 className="font-mono text-sm tracking-widest text-purple uppercase mb-6">With Outmate (40% Match)</h3>
                    <div className="grid grid-cols-2 gap-8 mb-8">
                      <div>
                        <p className="text-white/60 text-sm mb-2">Identified / month</p>
                        <p className="text-3xl font-bold font-display text-white"><AnimatedNumber value={outmateIdentified} /></p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm mb-2">Potential Pipeline</p>
                        <p className="text-3xl font-bold font-display text-white"><AnimatedNumber value={outmatePipeline} prefix="$" /></p>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                      <p className="text-white/60 text-sm mb-2">Additional Pipeline Generated</p>
                      <p className="text-4xl md:text-5xl font-bold font-display text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.3)]">
                        <AnimatedNumber value={additionalPipeline} prefix="+$" />
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="bg-white border-t border-void/5 p-6 md:p-8 flex justify-center">
              <button className="bg-purple text-white px-8 py-4 rounded-xl font-medium hover:bg-purple/90 hover:scale-[1.02] shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all duration-300 flex items-center gap-2 group">
                Start your free trial — see your numbers
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
