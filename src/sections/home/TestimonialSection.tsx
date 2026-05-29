import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function TestimonialSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [50, -50])

  return (
    <section ref={ref} className="bg-[#0F0F10] py-32 relative overflow-hidden flex items-center justify-center min-h-[60vh]">
      
      {/* Ambient background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[600px] h-[600px] bg-[#6B46C1]/10 rounded-full blur-[150px]" />
      </div>

      <div className="container-limit mx-auto px-4 relative z-10">
        <motion.div 
          style={{ y }}
          className="max-w-4xl mx-auto flex flex-col items-center text-center gap-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-medium text-white leading-tight tracking-tight px-4 md:px-0" style={{ textWrap: 'balance' }}>
              “We use Outmate to identify our anonymous website visitors.<br className="hidden md:block"/> You can also see your web visitors 100% free.”
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-16 h-16 rounded-full border border-white/[0.12] shadow-2xl flex items-center justify-center font-bold text-white tracking-wider text-xl relative overflow-hidden" 
                 style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)' }}>
               NL
               <div className="absolute inset-0 bg-[#6B46C1]/10 pointer-events-none" />
            </div>
            <div>
              <div className="text-white font-semibold text-lg flex items-center gap-2">
                Nathan Latka
                <span className="w-1.5 h-1.5 rounded-full bg-[#6B46C1]" />
              </div>
              <div className="text-[#B8B8B8] text-sm">Founder, Founderpath.com</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

    </section>
  )
}
