import { motion } from 'framer-motion'
import SectionReveal from '../../components/SectionReveal'
import { ArrowRight } from 'lucide-react'

export default function SignalEngineCTA() {
  return (
    <section className="bg-[#0F0F10] py-32 relative overflow-hidden flex items-center justify-center min-h-[70vh]">
      
      {/* Background glow and shapes */}
      <div className="absolute inset-0 flexItems-center justify-center pointer-events-none z-0">
         <motion.div 
           className="w-[800px] h-[500px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-[#6B46C1]/20 blur-[140px]"
           animate={{ 
             scale: [1, 1.1, 1],
             opacity: [0.5, 0.8, 0.5]
           }}
           transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
         />
      </div>

      <div className="container-limit mx-auto px-4 relative z-10">
        <SectionReveal>
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white tracking-tight mb-6">
              Build your signal engine today
            </h2>
            
            <p className="text-xl md:text-2xl text-[#B8B8B8] mb-12">
              Stop chasing leads. Let intent come to you.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
              <button className="h-14 px-8 rounded-full bg-white text-black font-semibold text-lg hover:bg-neutral-200 transition-colors flex items-center gap-2 group w-full sm:w-auto justify-center">
                Try free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="h-14 px-8 rounded-full bg-white/[0.03] border border-white/[0.08] text-white font-medium text-lg hover:bg-white/[0.08] transition-colors w-full sm:w-auto justify-center">
                View pricing
              </button>
            </div>
            
            <p className="mt-8 text-sm text-[#B8B8B8]/60">
              7 days unlimited leads, no credit card required
            </p>
            
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
